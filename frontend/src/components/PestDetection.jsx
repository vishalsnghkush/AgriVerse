import React, { useState, useRef } from 'react';
import { Upload, X, Scan, AlertTriangle, CheckCircle, Info, Shield, Sprout, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { predictDisease } from '../api';

// Disease Info Dictionary (Same as before)
const DISEASE_INFO = {
    "Apple___Apple_scab": {
        treatment: "Apply fungicides like Captan or Myclobutanil. Remove infected leaves.",
        prevention: "Prune trees to improve air circulation. Plant resistant varieties."
    },
    "Apple___Black_rot": {
        treatment: "Remove mummified fruit and dead wood. Apply fungicides.",
        prevention: "Keep trees healthy and wound-free. Clean up fallen debris."
    },
    "Apple___Cedar_apple_rust": {
        treatment: "Apply fungicides at pink bud stage. Remove nearby juniper hosts.",
        prevention: "Plant resistant varieties. Remove galls from junipers."
    },
    "Corn_(maize)___Common_rust_": {
        treatment: "Apply fungicides if infection is severe early in season.",
        prevention: "Plant resistant hybrids. Rotate crops."
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        treatment: "Fungicides may be needed for susceptible hybrids.",
        prevention: "Crop rotation. Tillage to bury residue. Resistant hybrids."
    },
    "Grape___Black_rot": {
        treatment: "Fungicide sprays from bud break to 4 weeks post-bloom.",
        prevention: "Remove mummified berries. Prune for air flow."
    },
    "Potato___Early_blight": {
        treatment: "Apply fungicides (chlorothalonil, mancozeb).",
        prevention: "Crop rotation. Maintain plant vigor. Drip irrigation."
    },
    "Potato___Late_blight": {
        treatment: "Aggressive fungicide program. Destroy infected plants immediately.",
        prevention: "Use certified seed. Avoid overhead irrigation. Monitor weather."
    },
    "Tomato___Bacterial_spot": {
        treatment: "Copper sprays + mancozeb. No cure once infected.",
        prevention: "Use disease-free seed. Avoid working when wet. Rotate crops."
    },
    "Tomato___Early_blight": {
        treatment: "Fungicides. Remove lower leaves.",
        prevention: "Mulch to prevent soil splash. Stake plants. Rotate crops."
    },
    "Tomato___Late_blight": {
        treatment: "Preventative fungicides. Remove infected plants.",
        prevention: "Avoid overhead watering. Good air circulation."
    },
    "Tomato___Leaf_Mold": {
        treatment: "Fungicides. Improve ventilation.",
        prevention: "Reduce humidity. Use resistant varieties."
    },
    "Tomato___Septoria_leaf_spot": {
        treatment: "Fungicides (chlorothalonil). Remove infected leaves.",
        prevention: "Mulch. Water at base. Clean up crop debris."
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        treatment: "Insecticidal soap, neem oil, or miticides.",
        prevention: "Avoid dust. Encourage natural predators."
    },
    "Tomato___Target_Spot": {
        treatment: "Fungicides. Improve air flow.",
        prevention: "Remove crop residue. Avoid overhead irrigation."
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        treatment: "None. Remove infected plants. Control whiteflies.",
        prevention: "Use resistant varieties. Reflective mulches."
    },
    "Tomato___Tomato_mosaic_virus": {
        treatment: "None. Remove infected plants.",
        prevention: "Wash hands (tobacco users). Disinfect tools."
    },
    "healthy": {
        treatment: "Keep up the good work!",
        prevention: "Continue regular monitoring and good cultural practices."
    }
};

const PestDetection = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError(null);
        }
    };

    const handlePredict = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        // Simulate scanning time for effect
        setTimeout(async () => {
            try {
                const data = await predictDisease(file);
                setResult(data);
            } catch (err) {
                setError("Failed to analyze image. Please try again.");
            } finally {
                setLoading(false);
            }
        }, 2500);
    };

    const clearImage = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getInfo = (className) => {
        const key = Object.keys(DISEASE_INFO).find(k => className.includes(k));
        return DISEASE_INFO[key] || {
            treatment: "Consult a local agricultural expert for specific advice.",
            prevention: "Maintain good field hygiene and monitor regularly."
        };
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-4"
                >
                    <Scan className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">AI Diagnostic Tool</span>
                </motion.div>
                <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
                    Pest & Disease <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Scanner</span>
                </h2>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                    Advanced computer vision instantly analyzes your crops to detect diseases and recommend treatments.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Scanner Interface */}
                <div className="lg:col-span-5 space-y-6">
                    <div
                        className={`relative group rounded-3xl p-1 transition-all duration-500
              ${preview ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-gray-800'}`}
                    >
                        <div
                            className="relative bg-black rounded-[22px] overflow-hidden h-[500px] flex flex-col items-center justify-center border border-gray-700"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            {/* Corner Accents */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
                            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
                            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
                            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />

                            {preview ? (
                                <>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                                    {/* Scanning Animation */}
                                    {loading && (
                                        <div className="absolute inset-0 z-20">
                                            <motion.div
                                                initial={{ top: "0%" }}
                                                animate={{ top: "100%" }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_50px_rgba(34,197,94,1)]"
                                            />
                                            <div className="absolute inset-0 bg-primary/10 animate-pulse" />

                                            {/* Scanning Grid */}
                                            <div className="absolute inset-0"
                                                style={{
                                                    backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .1) 25%, rgba(34, 197, 94, .1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .1) 75%, rgba(34, 197, 94, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .1) 25%, rgba(34, 197, 94, .1) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .1) 75%, rgba(34, 197, 94, .1) 76%, transparent 77%, transparent)',
                                                    backgroundSize: '50px 50px'
                                                }}
                                            />
                                        </div>
                                    )}

                                    <button
                                        onClick={clearImage}
                                        className="absolute top-4 right-4 z-30 p-2 bg-black/60 hover:bg-red-500 rounded-full text-white transition-all backdrop-blur-md"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center space-y-6 p-8">
                                    <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto border border-gray-700 group-hover:border-primary/50 transition-colors">
                                        <Upload className="w-10 h-10 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">Upload Image</h3>
                                        <p className="text-gray-400 text-sm">Drag & drop or click to browse</p>
                                    </div>
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Select File
                                    </button>
                                </div>
                            )}

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={!file || loading}
                        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg
              ${!file || loading
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-primary text-black hover:bg-green-400 hover:shadow-primary/30 hover:scale-[1.02]'}`}
                    >
                        {loading ? (
                            <>
                                <Scan className="w-6 h-6 animate-spin" />
                                Scanning...
                            </>
                        ) : (
                            <>
                                <Scan className="w-6 h-6" />
                                Start Analysis
                            </>
                        )}
                    </button>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                {/* Main Result Card */}
                                <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Activity className="w-4 h-4 text-primary" />
                                                    <span className="text-primary font-bold text-sm tracking-wider uppercase">Analysis Complete</span>
                                                </div>
                                                <h3 className="text-4xl font-bold text-white leading-tight mb-2">
                                                    {result.class_name}
                                                </h3>
                                                <p className="text-gray-400">Detected in uploaded sample</p>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-white mb-1">
                                                    {(result.confidence * 100).toFixed(1)}%
                                                </div>
                                                <div className="text-sm text-gray-400">Confidence</div>
                                            </div>
                                        </div>

                                        {/* Confidence Bar */}
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-8">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${result.confidence * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`h-full rounded-full ${result.class_name.toLowerCase().includes('healthy') ? 'bg-green-500' : 'bg-red-500'
                                                    }`}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Treatment Card */}
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 hover:bg-blue-500/20 transition-colors">
                                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-400">
                                                    <Shield className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-2">Treatment</h4>
                                                <p className="text-blue-200/80 text-sm leading-relaxed">
                                                    {getInfo(result.class_name).treatment}
                                                </p>
                                            </div>

                                            {/* Prevention Card */}
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 hover:bg-green-500/20 transition-colors">
                                                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 text-green-400">
                                                    <Sprout className="w-6 h-6" />
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-2">Prevention</h4>
                                                <p className="text-green-200/80 text-sm leading-relaxed">
                                                    {getInfo(result.class_name).prevention}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Info / Disclaimer */}
                                <div className="bg-gray-800/50 rounded-xl p-4 flex items-start gap-3 border border-gray-700">
                                    <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-gray-400">
                                        AI predictions are for reference only. Always consult with a local agricultural expert before applying chemical treatments.
                                    </p>
                                </div>

                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] bg-surface/30 backdrop-blur-sm border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center border-dashed border-gray-700">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <Scan className="w-10 h-10 text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Ready to Scan</h3>
                                <p className="text-gray-400 max-w-md">
                                    Upload an image to the left to begin the analysis. Results will appear here instantly.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PestDetection;
