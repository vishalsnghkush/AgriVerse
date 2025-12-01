import React, { useEffect, useState } from 'react';
import { fetchWeather, searchCity } from '../api';
import { CloudRain, Thermometer, Wind, Droplets, RefreshCw, Search, MapPin, Navigation } from 'lucide-react';

const WeatherCard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState('');
    const [locationName, setLocationName] = useState('Punjab');

    const loadWeather = async (lat, lon, name) => {
        setLoading(true);
        const weather = await fetchWeather(lat, lon);
        if (weather) {
            setData(weather);
            setLocationName(name);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Default load
        loadWeather(30.9010, 75.8573, 'Punjab');
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!city.trim()) return;
        setLoading(true);
        const result = await searchCity(city);
        if (result) {
            loadWeather(result.lat, result.lon, result.name);
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
                    loadWeather(position.coords.latitude, position.coords.longitude, 'My Location');
                },
                (error) => {
                    alert("Location access denied. Using default.");
                    setLoading(false);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="bg-surface rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <CloudRain className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Weather</h3>
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
                        placeholder="Search city..."
                        className="w-full bg-background border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500 outline-none"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    onClick={handleAutoDetect}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-blue-400 transition-colors"
                    title="Use My Location"
                >
                    <Navigation className="w-5 h-5" />
                </button>
            </form>

            {loading ? (
                <div className="animate-pulse h-48 bg-gray-800/50 rounded-xl mb-6"></div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-background/50 p-4 rounded-xl text-center">
                            <Thermometer className="w-5 h-5 text-red-500 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{data?.temperature}°C</p>
                            <p className="text-xs text-text-secondary">Temperature</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl text-center">
                            <Droplets className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{data?.humidity}%</p>
                            <p className="text-xs text-text-secondary">Humidity</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl text-center">
                            <CloudRain className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{data?.rainfall}mm</p>
                            <p className="text-xs text-text-secondary">Rainfall</p>
                        </div>
                        <div className="bg-background/50 p-4 rounded-xl text-center">
                            <Wind className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-white">{data?.wind_speed} km/h</p>
                            <p className="text-xs text-text-secondary">Wind Speed</p>
                        </div>
                    </div>

                    <div className="bg-background/50 p-4 rounded-xl flex items-center justify-center gap-3 mb-6">
                        <span className="text-yellow-500 text-2xl">
                            {data?.condition === 'Sunny' ? '☀️' : data?.condition === 'Rainy' ? '🌧️' : '☁️'}
                        </span>
                        <span className="text-white font-medium">{data?.condition}</span>
                    </div>
                </>
            )}

            <button
                onClick={() => loadWeather(30.9010, 75.8573, 'Punjab')}
                className="w-full bg-secondary hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
                <RefreshCw className="w-4 h-4" />
                Reset to Default
            </button>
        </div>
    );
};

export default WeatherCard;
