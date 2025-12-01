import React, { useState } from 'react';
import { getYieldPrediction } from '../api';
import { TrendingUp, Calendar, Target } from 'lucide-react';

const YieldPrediction = () => {
    const [crop, setCrop] = useState('Wheat');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        const data = await getYieldPrediction(crop);
        setResult(data);
        setLoading(false);
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Yield Prediction</h3>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-text-secondary mb-2">Select Crop Type</label>
                <select
                    className="w-full bg-background border border-gray-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                >
                    <option>Wheat</option>
                    <option>Rice</option>
                    <option>Corn</option>
                    <option>Tomato</option>
                </select>
            </div>

            {result ? (
                <div className="animate-in fade-in">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-background/50 p-4 rounded-xl text-center border border-gray-800">
                            <Target className="w-5 h-5 text-orange-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{result.predicted_yield}</p>
                            <p className="text-xs text-text-secondary">Predicted Yield</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl text-center border border-gray-800">
                            <TrendingUp className="w-5 h-5 text-green-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{result.confidence}</p>
                            <p className="text-xs text-text-secondary">Confidence</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-background/50 p-4 rounded-xl text-center border border-gray-800">
                            <Calendar className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">{result.planting_window}</p>
                            <p className="text-xs text-text-secondary">Best Planting</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl text-center border border-gray-800">
                            <Calendar className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                            <p className="text-lg font-bold text-white">{result.harvest_window}</p>
                            <p className="text-xs text-text-secondary">Harvest Time</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-background/50 p-8 rounded-xl text-center mb-6 border border-gray-800 border-dashed">
                    <p className="text-text-secondary">Select a crop to predict yield</p>
                </div>
            )}

            <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
                {loading ? "Analyzing..." : "Predict Crop Yield"}
            </button>
        </div>
    );
};

export default YieldPrediction;
