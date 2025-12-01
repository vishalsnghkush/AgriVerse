import React from 'react';
import { ShieldCheck, Sprout, Tractor, Droplet, Leaf, Coins } from 'lucide-react';

const Schemes = () => {
    const schemes = [
        {
            title: "PM-KISAN Direct Benefit Transfer",
            desc: "Direct income support of ₹6,000 per year to all farmer families having cultivable land holding.",
            amount: "₹6,000/year",
            tag: "Income Support",
            icon: Coins,
            color: "green"
        },
        {
            title: "Pradhan Mantri Fasal Bima Yojana",
            desc: "Comprehensive crop insurance scheme protecting farmers against crop losses due to natural calamities.",
            amount: "Up to ₹2 lakh coverage",
            tag: "Insurance",
            icon: ShieldCheck,
            color: "blue"
        },
        {
            title: "Sub-Mission on Agricultural Mechanization",
            desc: "Financial assistance for purchasing agricultural machinery and equipment to enhance farm productivity.",
            amount: "40-50% subsidy",
            tag: "Equipment",
            icon: Tractor,
            color: "orange"
        },
        {
            title: "Micro Irrigation Fund",
            desc: "Support for drip and sprinkler irrigation systems to achieve 'per drop more crop' objective.",
            amount: "Up to 90% subsidy",
            tag: "Water Management",
            icon: Droplet,
            color: "cyan"
        },
        {
            title: "Paramparagat Krishi Vikas Yojana",
            desc: "Promotion of organic farming through cluster approach and certification of organic products.",
            amount: "₹50,000/hectare",
            tag: "Organic Farming",
            icon: Leaf,
            color: "emerald"
        }
    ];

    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <span className="bg-green-500/10 text-green-500 px-4 py-1 rounded-full text-sm font-medium border border-green-500/20">
                    Government Support
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">
                    Government Schemes
                </h2>
                <p className="text-text-secondary max-w-2xl mx-auto">
                    Discover comprehensive government support programs designed to empower farmers with financial assistance, insurance coverage, and modern equipment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schemes.map((scheme, idx) => (
                    <SchemeCard key={idx} {...scheme} />
                ))}
            </div>
        </div>
    );
};

const SchemeCard = ({ title, desc, amount, tag, icon: Icon, color }) => {
    const colorClasses = {
        green: "bg-green-500",
        blue: "bg-blue-500",
        orange: "bg-orange-500",
        cyan: "bg-cyan-500",
        emerald: "bg-emerald-500"
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all hover:-translate-y-1 group">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${colorClasses[color]}/10`}>
                    <Icon className={`w-6 h-6 text-${color}-500`} />
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                    {tag}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                {title}
            </h3>
            <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                {desc}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                <div>
                    <p className={`text-lg font-bold text-${color}-500`}>{amount}</p>
                    <p className="text-xs text-gray-500">Benefit Amount</p>
                </div>
                <button className={`text-${color}-500 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors`}>
                    Learn More →
                </button>
            </div>
        </div>
    );
};

export default Schemes;
