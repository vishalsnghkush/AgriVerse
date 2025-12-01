import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

const crops = [
    {
        name: "Tomato",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=1000",
        description: "Tomatoes are the major dietary source of the antioxidant lycopene, which has been linked to many health benefits.",
        diseases: ["Early Blight", "Late Blight", "Leaf Mold", "Septoria Leaf Spot"],
        care: "Requires full sun and well-drained soil. Water regularly but avoid wetting leaves."
    },
    {
        name: "Potato",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=1000",
        description: "Potatoes are underground tubers that grow on the roots of the Solanum tuberosum plant.",
        diseases: ["Early Blight", "Late Blight"],
        care: "Plant in cool weather. Hill soil around stems as they grow to protect tubers."
    },
    {
        name: "Pepper (Bell)",
        image: "https://images.unsplash.com/photo-1563565375-f3fdf5ec2e97?auto=format&fit=crop&q=80&w=1000",
        description: "Bell peppers are fruits in the nightshade family. They are low in calories and rich in vitamin C and other antioxidants.",
        diseases: ["Bacterial Spot"],
        care: "Needs warm soil and full sun. Keep soil consistently moist."
    },
    {
        name: "Apple",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=1000",
        description: "Apples are an incredibly nutritious fruit that offers multiple health benefits. They're rich in fiber and antioxidants.",
        diseases: ["Apple Scab", "Black Rot", "Cedar Apple Rust"],
        care: "Prune annually. Ensure good air circulation to prevent fungal diseases."
    },
    {
        name: "Grape",
        image: "https://images.unsplash.com/photo-1537640538965-1756fb179c26?auto=format&fit=crop&q=80&w=1000",
        description: "Grapes are berries that grow on woody vines. They are packed with nutrients and antioxidants.",
        diseases: ["Black Rot", "Esca (Black Measles)", "Leaf Blight"],
        care: "Requires support (trellis). Prune heavily in winter."
    },
    {
        name: "Corn (Maize)",
        image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=1000",
        description: "Corn is a starchy vegetable and cereal grain that has been eaten all over the world for centuries.",
        diseases: ["Common Rust", "Northern Leaf Blight", "Cercospora Leaf Spot"],
        care: "Heavy feeder, requires nitrogen-rich soil. Water deeply during tasseling."
    }
];

const CropInfo = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Crop Information</h2>
                <p className="text-gray-500">Learn about common crops and their care.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crops.map((crop, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={crop.image}
                                alt={crop.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                <span className="text-white font-medium flex items-center gap-2">
                                    <Info className="w-4 h-4" /> Learn More
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{crop.name}</h3>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{crop.description}</p>

                            <div className="space-y-3">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Common Diseases</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {crop.diseases.map((d, i) => (
                                            <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md font-medium">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Care Tips</h4>
                                    <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-100">
                                        {crop.care}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CropInfo;
