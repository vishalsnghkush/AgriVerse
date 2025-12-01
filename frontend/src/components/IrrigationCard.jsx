import React, { useState } from 'react';
import { getIrrigationRecommendation } from '../api';
import { Droplet, Clock, BarChart3, CloudRain } from 'lucide-react';

const IrrigationCard = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [inputs, setInputs] = useState({
        crop: 'wheat',
        moisture: 35,
        rainfall: 0
    });

    const handleAnalyze = async () => {
        setLoading(true);
        const data = await getIrrigationRecommendation(inputs.crop, inputs.moisture, inputs.rainfall);
        setResult(data);
        setLoading(false);
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Droplet className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Smart Irrigation</h3>
                </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="text-xs text-text-secondary block mb-1">Crop</label>
                    <select
                        className="w-full bg-background border border-gray-700 rounded-lg px-2 py-2 text-white text-sm"
                        value={inputs.crop}
                        onChange={(e) => setInputs({ ...inputs, crop: e.target.value })}
                    >
                        <option value="wheat">Wheat</option>
                        <option value="rice">Rice</option>
                        <option value="corn">Corn</option>
                        <option value="tomato">Tomato</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-text-secondary block mb-1">Moisture (%)</label>
                    <input
                        type="number"
                        className="w-full bg-background border border-gray-700 rounded-lg px-2 py-2 text-white text-sm"
                        value={inputs.moisture}
                        onChange={(e) => setInputs({ ...inputs, moisture: Number(e.target.value) })}
                    />
                </div>
                <div>
                    <label className="text-xs text-text-secondary block mb-1">Rain (mm)</label>
                    <input
                        type="number"
                        className="w-full bg-background border border-gray-700 rounded-lg px-2 py-2 text-white text-sm"
                        value={inputs.rainfall}
                        onChange={(e) => setInputs({ ...inputs, rainfall: Number(e.target.value) })}
                    />
                </div>
            </div>

            {result ? (
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl mb-6 animate-in fade-in">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-blue-400 font-bold">{result.recommendation}</h4>
                        <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                            {result.amount_liters} L/m²
                        </span>
                    </div>
                    <p className="text-sm text-blue-200/80 mb-3">{result.reason}</p>
                    <div className="flex items-center gap-2 text-xs text-blue-300">
                        <Clock className="w-3 h-3" />
                        Next: {result.next_schedule}
                    </div>
                </div>
            ) : (
                <div className="bg-background/50 p-4 rounded-xl text-center mb-6 border border-gray-800 border-dashed">
                    <p className="text-sm text-text-secondary">Enter data and click analyze</p>
                </div>
            )}

            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors"
            >
                {loading ? "Calculating..." : "Get Recommendation"}
            </button>
        </div>
    );
};

export default IrrigationCard;
