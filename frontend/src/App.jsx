import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import WeatherCard from './components/WeatherCard';
import SoilHealthCard from './components/SoilHealthCard';
import YieldPrediction from './components/YieldPrediction';
import IrrigationCard from './components/IrrigationCard';
import MarketPrices from './components/MarketPrices';
import Schemes from './components/Schemes';
import PestDetection from './components/PestDetection';
import AuthPage from './components/AuthPage';
import AdminPanel from './components/AdminPanel';
import { auth } from './api';

function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const u = auth.getUser();
        if (u) setUser(u);
    }, []);

    if (!user) {
        return <AuthPage onLogin={() => setUser(auth.getUser())} />;
    }

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={() => {
            auth.logout();
            setUser(null);
        }}>
            {activeTab === 'dashboard' && (
                <>
                    <Hero onStart={() => document.getElementById('weather-grid').scrollIntoView({ behavior: 'smooth' })} />

                    <div id="weather-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
                        {/* Dashboard only shows Weather & Soil now */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <WeatherCard />
                            <SoilHealthCard />
                        </div>

                        <div className="text-center">
                            <p className="text-text-secondary">
                                Explore <span className="text-primary font-bold cursor-pointer" onClick={() => setActiveTab('pest-detection')}>Pest Detection</span> or <span className="text-primary font-bold cursor-pointer" onClick={() => setActiveTab('features')}>Features</span> for advanced tools.
                            </p>
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'pest-detection' && (
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <PestDetection />
                </div>
            )}

            {activeTab === 'features' && (
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-white mb-8">Advanced Farming Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <YieldPrediction />
                        <IrrigationCard />
                    </div>
                </div>
            )}

            {activeTab === 'schemes' && (
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-white mb-8">Government Schemes</h2>
                    <Schemes />
                </div>
            )}

            {activeTab === 'marketplace' && (
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <h2 className="text-3xl font-bold text-white mb-8">Marketplace & Trading</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <MarketPrices />
                        {/* Placeholder for future trading components */}
                        <div className="bg-surface rounded-2xl p-8 border border-gray-800 flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white mb-2">Trading Platform</h3>
                                <p className="text-text-secondary">Connect directly with buyers. Coming Soon.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'admin' && user?.is_admin && (
                <AdminPanel />
            )}
        </Layout>
    );
}

export default App;
