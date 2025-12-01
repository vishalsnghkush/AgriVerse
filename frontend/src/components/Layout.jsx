import React from 'react';
import { Sprout, Menu, X, Globe, LogOut } from 'lucide-react';
import clsx from 'clsx';

const Layout = ({ children, activeTab, setActiveTab, user, onLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'pest-detection', label: 'Pest Detection' }, // Promoted feature
        { id: 'features', label: 'More Tools' },
        { id: 'schemes', label: 'Schemes' },
        { id: 'marketplace', label: 'Marketplace' },
    ];

    if (user?.is_admin) {
        navItems.push({ id: 'admin', label: 'Admin Panel' });
    }

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col">
            {/* Navigation Bar */}
            <nav className="border-b border-gray-800 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                            <Sprout className="w-8 h-8 text-primary" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                AgriVerse
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={clsx(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        activeTab === item.id ? "text-primary" : "text-text-secondary"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            <span className="text-sm text-text-secondary">
                                Welcome, <span className="text-white font-bold">{user?.full_name || user?.username}</span>
                            </span>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-text-secondary hover:text-white"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-surface border-t border-gray-800">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={clsx(
                                        "block w-full text-left px-3 py-2 rounded-md text-base font-medium",
                                        activeTab === item.id
                                            ? "bg-primary/10 text-primary"
                                            : "text-text-secondary hover:bg-gray-800 hover:text-white"
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="border-t border-gray-800 mt-2 pt-2">
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left px-3 py-2 text-red-400 font-medium"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-surface border-t border-gray-800 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center text-text-secondary">
                    <p>&copy; 2025 AgriVerse. Empowering Farmers with AI.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
