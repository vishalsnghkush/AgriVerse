import React, { useEffect, useState } from 'react';
import { fetchSoil, searchCity } from '../api';
import { Layers, Activity, Zap, Sprout, Search, MapPin, Navigation, RefreshCw } from 'lucide-react';

const SoilHealthCard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState('');
    const [locationName, setLocationName] = useState('Punjab');

    const loadSoil = async (lat, lon, name) => {
        setLoading(true);
        const soil = await fetchSoil(lat, lon);
        if (soil) {
            setData(soil);
            setLocationName(name);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadSoil(30.9010, 75.8573, 'Punjab');
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!city.trim()) return;
        setLoading(true);
        const result = await searchCity(city);
        if (result) {
            loadSoil(result.lat, result.lon, result.name);
            setCity('');
        } else {
            alert("City not found!");
            setLoading(false);
        }
    };

    const handleAutoDetect = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    loadSoil(position.coords.latitude, position.coords.longitude, 'My Location');
                },
                (error) => {
                    alert("Location access denied.");
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation not supported.");
        }
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <Layers className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Soil Health</h3>
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {locationName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search location..."
                        className="w-full bg-background border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-green-500 outline-none"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAutoDetect}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-green-400 transition-colors"
                    title="Use My Location"
                >
                    <Navigation className="w-5 h-5" />
                </button>
            </form>

            {loading ? (
                <div className="animate-pulse h-64 bg-gray-800/50 rounded-xl mb-6"></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-green-500/10 p-4 rounded-xl text-center border border-green-500/20">
                            <Activity className="w-5 h-5 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-400">{data?.ph}</p>
                            <p className="text-xs text-green-200/70">pH Level</p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-xl text-center border border-green-500/20">
                            <Zap className="w-5 h-5 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-400">{data?.nitrogen}</p>
                            <p className="text-xs text-green-200/70">Nitrogen</p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-xl text-center border border-green-500/20">
                            <Sprout className="w-5 h-5 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-400">{data?.phosphorus}</p>
                            <p className="text-xs text-green-200/70">Phosphorus</p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-xl text-center border border-green-500/20">
                            <Layers className="w-5 h-5 text-green-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-green-400">{data?.potassium}</p>
                            <p className="text-xs text-green-200/70">Potassium</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-background/50 p-4 rounded-xl text-center">
                            <p className="text-xl font-bold text-white">{data?.moisture}%</p>
                            <p className="text-xs text-text-secondary">Moisture</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl text-center">
                            <p className="text-xl font-bold text-white">{data?.temperature}°C</p>
                            <p className="text-xs text-text-secondary">Soil Temp</p>
                        </div>
                    </div>
                </>
            )}

            <button
                onClick={() => loadSoil(30.9010, 75.8573, 'Punjab')}
                className="w-full bg-primary hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
                <RefreshCw className="w-4 h-4" />
                Reset to Default
            </button>
        </div>
    );
};

export default SoilHealthCard;
