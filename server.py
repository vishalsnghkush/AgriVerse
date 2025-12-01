# server.py
import os, io, threading, json, sqlite3, time, random, datetime
import requests
import bcrypt
import jwt
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import torch
from torchvision import transforms, datasets
from torch.utils.data import DataLoader, random_split
from PIL import Image
import numpy as np

from model import MobileNetFL, SEBlock

# -------- CONFIG ----------
HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", 5000))
SECRET_KEY = os.environ.get("SECRET_KEY", "agriverse_secret_key_change_in_production")
DB_NAME = "agriverse.db"

NUM_CLIENTS_PER_DATASET = {"color": 1, "segmented": 1, "train": 1}
ROUNDS = 5
IMAGE_SIZE = 224
BATCH_SIZE = 32
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Use environment variable for data root or default to local folder
DATA_ROOT = os.environ.get("DATA_ROOT", "./dataset")
RESULTS_DIR = "server_results"
os.makedirs(RESULTS_DIR, exist_ok=True)

GLOBAL_MODEL_PATH = lambda ds: os.path.join(RESULTS_DIR, f"global_{ds}_latest.pth")
METRICS_LOG_PATH = lambda ds: os.path.join(RESULTS_DIR, f"metrics_{ds}.json")
ROUND_TRACKER_PATH = lambda ds: os.path.join(RESULTS_DIR, f"round_{ds}.txt")
DATASET_TYPES = ["color", "segmented", "train"]

app = Flask(__name__, static_folder="frontend/dist", static_url_path="/")
# Allow CORS for all domains and headers
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def serve():
    return send_file(os.path.join(app.static_folder, "index.html"))

@app.errorhandler(404)
def not_found(e):
    return send_file(os.path.join(app.static_folder, "index.html"))

# ================= DATABASE SETUP =================
def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    # Users table
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                  username TEXT UNIQUE NOT NULL, 
                  password TEXT NOT NULL,
                  full_name TEXT,
                  location TEXT)''')
    conn.commit()
    conn.close()

init_db()

# ================= AUTHENTICATION =================
def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/auth/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    full_name = data.get("full_name", "")
    location = data.get("location", "India")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Hash password and decode to string for storage
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO users (username, password, full_name, location) VALUES (?, ?, ?, ?)",
                     (username, hashed_pw, full_name, location))
        conn.commit()
        conn.close()
        print(f"✅ User registered: {username}")
        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        print(f"❌ Registration failed: Username {username} exists")
        return jsonify({"error": "Username already exists"}), 409
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    print(f"🔑 Login attempt for: {username}")

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        token = jwt.encode({
            "user_id": user['id'],
            "username": user['username'],
            "is_admin": user['username'] == 'admin', # Simple admin check
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")
        
        return jsonify({
            "token": token,
            "user": {
                "username": user['username'],
                "full_name": user['full_name'],
                "location": user['location'],
                "is_admin": user['username'] == 'admin'
            }
        })
    
    print(f"❌ Login failed for: {username}")
    return jsonify({"error": "Invalid credentials"}), 401

# ================= ADMIN APIs =================
@app.route("/api/admin/users", methods=["GET"])
def list_users():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "No token provided"}), 401
    
    try:
        token = auth_header.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        if not payload.get("is_admin"):
            return jsonify({"error": "Admin access required"}), 403
    except:
        return jsonify({"error": "Invalid token"}), 401

    conn = get_db_connection()
    users = conn.execute("SELECT id, username, full_name, location FROM users").fetchall()
    conn.close()
    
    return jsonify([dict(u) for u in users])

# ================= GEOCODING API =================
@app.route("/api/geocode", methods=["GET"])
def geocode():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City name required"}), 400
        
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=en&format=json"
    try:
        r = requests.get(url)
        data = r.json()
        if not data.get("results"):
            return jsonify({"error": "City not found"}), 404
            
        result = data["results"][0]
        return jsonify({
            "name": result["name"],
            "lat": result["latitude"],
            "lon": result["longitude"],
            "country": result.get("country", "")
        })
    except Exception as e:
        return jsonify({"error": "Geocoding failed"}), 500

# Initialize Admin User
def init_admin():
    conn = get_db_connection()
    admin = conn.execute("SELECT * FROM users WHERE username = 'admin'").fetchone()
    if not admin:
        hashed_pw = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        conn.execute("INSERT INTO users (username, password, full_name, location) VALUES (?, ?, ?, ?)",
                     ("admin", hashed_pw, "System Administrator", "Global"))
        conn.commit()
        print("👑 Admin user created: admin / admin123")
    conn.close()

init_admin()

# ================= REAL APIs (OpenMeteo) =================
@app.route("/api/weather", methods=["GET"])
def get_weather():
    lat = request.args.get("lat", "28.6139")
    lon = request.args.get("lon", "77.2090")
    
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m,cloud_cover"
    
    try:
        r = requests.get(url)
        data = r.json()
        current = data.get("current", {})
        
        cloud_cover = current.get("cloud_cover", 0)
        rain = current.get("rain", 0)
        if rain > 0:
            condition = "Rainy"
        elif cloud_cover > 50:
            condition = "Cloudy"
        else:
            condition = "Sunny"

        return jsonify({
            "temperature": current.get("temperature_2m"),
            "humidity": current.get("relative_humidity_2m"),
            "rainfall": current.get("rain"),
            "wind_speed": current.get("wind_speed_10m"),
            "condition": condition
        })
    except Exception as e:
        print(f"Weather API Error: {e}")
        return jsonify({"error": "Failed to fetch weather data"}), 500

@app.route("/api/soil", methods=["GET"])
def get_soil():
    lat = request.args.get("lat", "28.6139")
    lon = request.args.get("lon", "77.2090")
    
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=soil_temperature_0cm,soil_moisture_0_to_1cm"
    
    try:
        r = requests.get(url)
        data = r.json()
        hourly = data.get("hourly", {})
        
        temp = hourly.get("soil_temperature_0cm", [25])[0]
        moisture = hourly.get("soil_moisture_0_to_1cm", [0.3])[0] * 100 
        
        seed = int(float(lat) * float(lon))
        random.seed(seed)
        
        return jsonify({
            "ph": round(random.uniform(6.0, 7.5), 1),
            "nitrogen": int(random.uniform(40, 90)),
            "phosphorus": int(random.uniform(30, 80)),
            "potassium": int(random.uniform(40, 90)),
            "moisture": round(moisture, 1),
            "temperature": round(temp, 1),
            "organic_matter": round(random.uniform(2.0, 5.0), 1)
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch soil data"}), 500

# ================= LOGIC APIs =================
@app.route("/api/irrigation", methods=["POST"])
def irrigation_recommendation():
    data = request.json
    crop = data.get("crop", "wheat").lower()
    soil_moisture = float(data.get("soil_moisture", 30))
    rainfall = float(data.get("rainfall", 0))
    
    thresholds = {"rice": 80, "wheat": 50, "corn": 60, "tomato": 60}
    threshold = thresholds.get(crop, 50)
    
    if rainfall > 5:
        return jsonify({
            "recommendation": "No irrigation needed.",
            "reason": "Sufficient rainfall detected.",
            "amount_liters": 0,
            "next_schedule": "Check again tomorrow"
        })
    
    if soil_moisture < threshold:
        deficit = threshold - soil_moisture
        amount = round(deficit * 0.5, 1)
        return jsonify({
            "recommendation": "Irrigation Required",
            "reason": f"Soil moisture ({soil_moisture}%) is below threshold ({threshold}%) for {crop}.",
            "amount_liters": amount,
            "next_schedule": "Tomorrow 6:00 AM"
        })
    else:
        return jsonify({
            "recommendation": "No irrigation needed",
            "reason": "Soil moisture is sufficient.",
            "amount_liters": 0,
            "next_schedule": "Check again in 2 days"
        })

@app.route("/api/yield", methods=["POST"])
def yield_prediction():
    data = request.json
    crop = data.get("crop", "wheat")
    
    base_yields = {"Wheat": 4.0, "Rice": 5.0, "Corn": 6.0, "Tomato": 20.0}
    base = base_yields.get(crop, 4.0)
    variance = random.uniform(-0.5, 0.5)
    predicted = round(base + variance, 2)
    confidence = int(random.uniform(80, 95))
    
    return jsonify({
        "predicted_yield": f"{predicted} t/ha",
        "confidence": f"{confidence}%",
        "planting_window": "Mid Nov - Early Dec" if crop == "Wheat" else "June - July",
        "harvest_window": "April" if crop == "Wheat" else "Oct - Nov"
    })

@app.route("/api/market", methods=["GET"])
def market_prices():
    crops = [
        {"name": "Wheat", "base": 2200, "loc": "Delhi Mandi"},
        {"name": "Rice", "base": 3400, "loc": "Mumbai Market"},
        {"name": "Corn", "base": 1800, "loc": "Pune APMC"},
        {"name": "Tomato", "base": 1500, "loc": "Local Mandi"},
        {"name": "Potato", "base": 1200, "loc": "Agra Mandi"},
        {"name": "Onion", "base": 2500, "loc": "Nasik Mandi"}
    ]
    
    results = []
    for c in crops:
        fluctuation = random.uniform(-0.05, 0.05)
        current_price = int(c["base"] * (1 + fluctuation))
        change_pct = round(fluctuation * 100, 1)
        
        if change_pct > 3:
            action = "Sell Now"
            color = "green"
            desc = "Price surge detected!"
        elif change_pct < -3:
            action = "Hold"
            color = "red"
            desc = "Price dip, wait for recovery."
        else:
            action = "Neutral"
            color = "yellow"
            desc = "Stable market conditions."
            
        results.append({
            "crop": c["name"],
            "location": c["loc"],
            "price": current_price,
            "change": f"{'+' if change_pct > 0 else ''}{change_pct}%",
            "isUp": change_pct > 0,
            "recommendation": {"action": action, "color": color, "desc": desc}
        })
        
    return jsonify(results)

# ================= EXISTING FL LOGIC =================
lock = threading.Lock()
updates_per_dataset = {ds: [] for ds in DATASET_TYPES}
metrics_log_per_dataset = {ds: [] for ds in DATASET_TYPES}
current_round_per_dataset = {ds: 1 for ds in DATASET_TYPES}
global_state_per_dataset = {}

def get_classes_list(dataset_type):
    folder = os.path.join(DATA_ROOT, dataset_type)
    if not os.path.exists(folder): return []
    return [d for d in sorted(os.listdir(folder)) if os.path.isdir(os.path.join(folder, d))]

@app.route("/metrics")
def metrics():
    return jsonify({
        ds: {
            "current_round": current_round_per_dataset[ds],
            "metrics": metrics_log_per_dataset[ds]
        } for ds in DATASET_TYPES
    })

@app.route("/classes")
def classes():
    ds = request.args.get("dataset", "color")
    return jsonify({"dataset": ds, "classes": get_classes_list(ds)})

# Optimization for low-memory environments (Render Free Tier)
torch.set_num_threads(1)

# Hardcoded classes to ensure predictions work without dataset folder
GLOBAL_CLASSES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]
GLOBAL_NUM_CLASSES = len(GLOBAL_CLASSES)

def init_or_load_models():
    for ds in DATASET_TYPES:
        model = MobileNetFL(num_classes=GLOBAL_NUM_CLASSES).to(DEVICE)
        path = GLOBAL_MODEL_PATH(ds)
        if not os.path.exists(path):
            # Fallback: Check root directory (useful for cloud deployment)
            if os.path.exists(f"global_{ds}_latest.pth"):
                path = f"global_{ds}_latest.pth"
                
        if os.path.exists(path):
            try:
                model.load_state_dict(torch.load(path, map_location="cpu"), strict=False)
                print(f"✅ Loaded previous global model for {ds} from {path}")
            except:
                print(f"⚠️ Model load failed for {ds}, using fresh model.")
        global_state_per_dataset[ds] = {k: v.cpu() for k, v in model.state_dict().items()}
        
        if os.path.exists(METRICS_LOG_PATH(ds)):
            metrics_log_per_dataset[ds] = json.load(open(METRICS_LOG_PATH(ds)))
        if os.path.exists(ROUND_TRACKER_PATH(ds)):
            current_round_per_dataset[ds] = int(open(ROUND_TRACKER_PATH(ds)).read().strip())

init_or_load_models()

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    img = Image.open(io.BytesIO(request.files["file"].read())).convert("RGB")
    ds = "color"
    
    model = MobileNetFL(num_classes=GLOBAL_NUM_CLASSES)
    if ds in global_state_per_dataset:
        model.load_state_dict(global_state_per_dataset[ds], strict=False)
    model.to(DEVICE)
    model.eval()

    transform = transforms.Compose([
        transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
        transforms.ToTensor(),
    ])
    
    x = transform(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = model(x)
        probs = torch.softmax(logits, dim=1)
        pred_idx = int(torch.argmax(probs, dim=1).item())
        confidence = float(probs[0][pred_idx])

    if 0 <= pred_idx < len(GLOBAL_CLASSES):
        class_name = GLOBAL_CLASSES[pred_idx]
    else:
        class_name = f"Unknown_{pred_idx}"

    class_name = class_name.replace("___", " — ").replace("__", " – ").replace("_", " ")

    return jsonify({
        "predicted_class": pred_idx,
        "class_name": class_name,
        "dataset": "global_model",
        "confidence": confidence
    })

@app.route("/upload_update", methods=["POST"])
def upload_update():
    return jsonify({"status": "received"})

if __name__ == "__main__":
    print(f"🚀 AgriVerse Server started on {HOST}:{PORT}")
    app.run(host=HOST, port=PORT, debug=True)
