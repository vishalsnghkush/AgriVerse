import React, { useState } from 'react';
import { auth } from '../api';
import { Sprout, User, Lock, MapPin, ArrowRight } from 'lucide-react';

const AuthPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        location: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await auth.login(formData.username, formData.password);
                onLogin();
            } else {
                await auth.register(formData.username, formData.password, formData.fullName, formData.location);
                setIsLogin(true); // Switch to login after register
                alert("Registration successful! Please login.");
            }
        } catch (err) {
            setError(err.response?.data?.error || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-surface border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Sprout className="w-10 h-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">AgriVerse</h1>
                    <p className="text-text-secondary">
                        {isLogin ? "Welcome back, Farmer!" : "Join the Smart Farming Revolution"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text-secondary">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-background border border-gray-700 rounded-xl py-2.5 pl-10 text-white focus:border-primary outline-none transition-colors"
                                        placeholder="John Doe"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-text-secondary">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-background border border-gray-700 rounded-xl py-2.5 pl-10 text-white focus:border-primary outline-none transition-colors"
                                        placeholder="Punjab, India"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                required
                                className="w-full bg-background border border-gray-700 rounded-xl py-2.5 pl-10 text-white focus:border-primary outline-none transition-colors"
                                placeholder="farmer123"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                            <input
                                type="password"
                                required
                                className="w-full bg-background border border-gray-700 rounded-xl py-2.5 pl-10 text-white focus:border-primary outline-none transition-colors"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-text-secondary text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-primary font-bold hover:underline"
                        >
                            {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
