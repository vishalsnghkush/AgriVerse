import React, { useEffect, useState } from 'react';
import { fetchMarketPrices } from '../api';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const MarketPrices = () => {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPrices = async () => {
            const data = await fetchMarketPrices();
            setPrices(data);
            setLoading(false);
        };
        loadPrices();
        const interval = setInterval(loadPrices, 10000); // Live update every 10s
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="bg-surface rounded-2xl p-6 border border-gray-800 animate-pulse h-96"></div>;

    return (
        <div className="bg-surface rounded-2xl p-6 border border-gray-800 h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <DollarSign className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Live Market Prices</h3>
                </div>
                <span className="text-xs text-green-500 animate-pulse">● Live Updates</span>
            </div>

            <div className="space-y-4 mb-8">
                <p className="text-sm text-text-secondary">Current Market Prices (₹/quintal):</p>

                {prices.map((p, idx) => (
                    <PriceRow
                        key={idx}
                        crop={p.crop}
                        location={p.location}
                        price={p.price}
                        change={p.change}
                        isUp={p.isUp}
                    />
                ))}
            </div>

            <div>
                <h4 className="text-sm font-bold text-white mb-4">AI Trading Recommendations:</h4>
                <div className="space-y-3">
                    {prices.slice(0, 3).map((p, idx) => (
                        <RecommendationCard
                            key={idx}
                            crop={p.crop}
                            action={p.recommendation.action}
                            desc={p.recommendation.desc}
                            color={p.recommendation.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const PriceRow = ({ crop, location, price, change, isUp }) => (
    <div className="flex items-center justify-between p-3 bg-background/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
        <div>
            <p className="font-bold text-white">{crop}</p>
            <p className="text-xs text-text-secondary">{location}</p>
        </div>
        <div className="text-right">
            <p className="font-bold text-white">₹{price}</p>
            <div className={`flex items-center justify-end gap-1 text-xs ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change}
            </div>
        </div>
    </div>
);

const RecommendationCard = ({ crop, action, desc, color }) => {
    const colors = {
        green: "bg-green-500/10 text-green-500 border-green-500/20",
        yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        red: "bg-red-500/10 text-red-500 border-red-500/20",
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    };

    return (
        <div className="bg-background/30 p-4 rounded-xl border border-gray-800">
            <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-white">{crop}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-md border ${colors[color] || colors.blue}`}>
                    {action}
                </span>
            </div>
            <p className="text-xs text-text-secondary">{desc}</p>
        </div>
    );
};

export default MarketPrices;
