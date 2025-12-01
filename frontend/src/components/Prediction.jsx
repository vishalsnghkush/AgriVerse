import React, { useState } from 'react';
import { predictDisease } from '../api';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

const Prediction = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setResult(null);
            setError(null);
        }
    };

    const handlePredict = async () => {
        if (!file) return;

        setLoading(true);
        setError(null);

        try {
            const data = await predictDisease(file);
            if (data) {
                setResult(data);
            } else {
                setError("Failed to get prediction from server.");
            }
        } catch (err) {
            setError("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Disease Prediction</h2>
                <p className="text-gray-500">Upload a leaf image to detect diseases.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div
                        className={clsx(
                            "border-2 border-dashed rounded-2xl p-8 text-center transition-colors h-80 flex flex-col items-center justify-center",
                            preview ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50"
                        )}
                    >
                        {preview ? (
                            <div className="relative w-full h-full">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                <button
                                    onClick={clearFile}
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                <div className="p-4 bg-primary/10 rounded-full mb-4">
                                    <Upload className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
                                <p className="text-sm text-gray-500 mt-2">JPG or PNG, max 5MB</p>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={!file || loading}
                        className={clsx(
                            "w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95",
                            !file || loading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:-translate-y-1"
                        )}
                    >
                        {loading ? "Analyzing..." : "Run Prediction"}
                    </button>
                </div>

                {/* Results Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    {!result && !error && (
                        <div className="text-center text-gray-400">
                            <ScanPlaceholder />
                            <p className="mt-4">Results will appear here</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl">
                            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                            <p>{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{result.class_name}</h3>
                                <p className="text-gray-500 mt-1">Model: {result.dataset}</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-600">Confidence Score</span>
                                    <span className="text-primary">{(result.confidence * 100).toFixed(2)}%</span>
                                </div>
                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                                        style={{ width: `${result.confidence * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
                                <p><strong>Tip:</strong> Ensure the image is clear and focused on the leaf for best results.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ScanPlaceholder = () => (
    <svg className="w-32 h-32 mx-auto text-gray-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
);

export default Prediction;
