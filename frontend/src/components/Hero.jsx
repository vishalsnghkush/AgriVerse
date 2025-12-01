import React from 'react';
import { ArrowRight, Play } from 'lucide-react';

const Hero = ({ onStart }) => {
    return (
        <div className="relative overflow-hidden bg-background py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-8">
                        <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
                            AI-Powered Crop <br />
                            <span className="text-primary">Yield Prediction</span> for <br />
                            Smart Farming
                        </h1>

                        <p className="text-lg text-text-secondary max-w-xl">
                            Develop an AI-based platform to predict crop yields using historical agricultural data, weather patterns, and soil health metrics. The system provides actionable recommendations for farmers to optimize irrigation, fertilization, and pest control.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={onStart}
                                className="bg-primary hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-primary/25"
                            >
                                Start Predicting Yields
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button className="border border-gray-700 hover:border-primary text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all hover:bg-surface">
                                <Play className="w-5 h-5 fill-current" />
                                Watch Demo
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
                            <div>
                                <p className="text-3xl font-bold text-secondary">10%+</p>
                                <p className="text-sm text-text-secondary mt-1">Productivity Increase</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-primary">50+</p>
                                <p className="text-sm text-text-secondary mt-1">Regional Languages</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-accent">10k+</p>
                                <p className="text-sm text-text-secondary mt-1">Farmers Helpled</p>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-800 group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50 group-hover:opacity-75 transition-opacity" />
                        <img
                            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop"
                            alt="Smart Farming"
                            className="w-full h-full object-cover min-h-[500px]"
                        />

                        {/* Floating Badge */}
                        <div className="absolute bottom-8 left-8 bg-surface/90 backdrop-blur-md border border-gray-700 p-4 rounded-xl flex items-center gap-3 shadow-xl">
                            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                            <span className="text-white font-medium">AI Analysis Active</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
};

export default Hero;
