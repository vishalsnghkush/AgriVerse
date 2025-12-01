import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, CheckCircle, Clock, Server } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
                {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
            </div>
            <div className={clsx("p-3 rounded-xl", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchMetrics();
            setMetrics(data);
            setLoading(false);
        };
        loadData();
        const interval = setInterval(loadData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading && !metrics) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Process data for charts
    const datasetTypes = metrics ? Object.keys(metrics) : [];
    let chartData = [];

    if (metrics) {
        // Combine metrics from all datasets into a single array for the chart
        // We assume rounds are synchronized or we just plot points
        // For simplicity, let's just take the 'color' dataset metrics if available, or merge
        // Actually, let's create a flat list for the chart: { round, accuracy, dataset }

        datasetTypes.forEach(ds => {
            const dsMetrics = metrics[ds]?.metrics || [];
            dsMetrics.forEach(m => {
                chartData.push({
                    round: m.round,
                    accuracy: m.accuracy,
                    dataset: ds,
                    key: `${ds}-${m.round}` // unique key
                });
            });
        });

        // Sort by round
        chartData.sort((a, b) => a.round - b.round);
    }

    // Get latest stats
    const latestStats = {};
    datasetTypes.forEach(ds => {
        const m = metrics[ds]?.metrics || [];
        if (m.length > 0) {
            latestStats[ds] = m[m.length - 1];
        }
    });

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <p className="text-gray-500">Real-time federated learning metrics.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Server Status"
                    value="Online"
                    subtext="Heartbeat active"
                    icon={Server}
                    color="bg-emerald-500"
                />
                {datasetTypes.map(ds => (
                    latestStats[ds] && (
                        <StatCard
                            key={ds}
                            title={`${ds.charAt(0).toUpperCase() + ds.slice(1)} Accuracy`}
                            value={`${latestStats[ds].accuracy.toFixed(2)}%`}
                            subtext={`Round ${latestStats[ds].round}`}
                            icon={Activity}
                            color={ds === 'color' ? 'bg-blue-500' : 'bg-purple-500'}
                        />
                    )
                ))}
            </div>

            {/* Charts */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Training Accuracy History</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="round"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8' }}
                                label={{ value: 'Round', position: 'insideBottomRight', offset: -5 }}
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                allowDuplicatedCategory={false}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8' }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            {datasetTypes.map((ds, idx) => (
                                <Line
                                    key={ds}
                                    dataKey="accuracy"
                                    data={chartData.filter(d => d.dataset === ds)}
                                    name={ds}
                                    type="monotone"
                                    stroke={idx === 0 ? "#2ecc71" : "#3498db"}
                                    strokeWidth={3}
                                    dot={{ strokeWidth: 2, r: 4, fill: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
