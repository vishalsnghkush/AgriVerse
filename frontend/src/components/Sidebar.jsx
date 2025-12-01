import React from 'react';
import { LayoutDashboard, Scan, Sprout, Menu } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'prediction', label: 'Prediction', icon: Scan },
        { id: 'crop-info', label: 'Crop Info', icon: Sprout },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={clsx(
                    "fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <div
                className={clsx(
                    "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-center h-20 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <Sprout className="w-8 h-8" />
                        <span>AgriFL</span>
                    </h1>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                                    activeTab === item.id
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
                    <div className="bg-gradient-to-br from-primary to-secondary p-4 rounded-xl text-white">
                        <p className="text-xs font-medium opacity-80">System Status</p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            <span className="text-sm font-bold">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
