import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { historyStorage } from '../utils/historyStorage';

export default function History() {
    const [history, setHistory] = useState([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        const items = historyStorage.getHistory();
        setHistory(items);
    };

    const handleDelete = (id) => {
        historyStorage.removeFromHistory(id);
        loadHistory();
    };

    const handleClearAll = () => {
        historyStorage.clearHistory();
        setHistory([]);
        setShowClearConfirm(false);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num?.toString() || '0';
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
            <Header showBack={false} />

            <main className="flex-1 px-4 py-6 pb-24">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">Download History</h1>
                            <p className="text-gray-400 text-sm">{history.length} videos</p>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="px-4 py-2 bg-dark-lighter rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Clear Confirmation Modal */}
                    {showClearConfirm && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                            <div className="bg-dark-lighter rounded-2xl p-6 max-w-sm w-full border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-2">Clear History?</h3>
                                <p className="text-gray-400 mb-6">This will permanently delete all {history.length} items from your history.</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowClearConfirm(false)}
                                        className="flex-1 px-4 py-3 bg-dark rounded-xl text-white hover:bg-dark/80 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="flex-1 px-4 py-3 bg-red-500 rounded-xl text-white hover:bg-red-600 transition-colors font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History List */}
                    {history.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-dark-lighter rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-rounded text-4xl text-gray-600">history</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
                            <p className="text-gray-400 mb-6">Your download history will appear here</p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-primary rounded-xl text-white font-medium hover:bg-primary/90 transition-colors"
                            >
                                Download Your First Video
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-dark-lighter rounded-2xl p-4 border border-white/5 hover:border-primary/30 transition-all group"
                                >
                                    <div className="flex gap-4">
                                        {/* Thumbnail */}
                                        <div className="relative w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-dark">
                                            {item.thumbnail ? (
                                                <img
                                                    src={item.thumbnail}
                                                    alt="Video thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-rounded text-gray-600 text-3xl">video_library</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium mb-2 line-clamp-2">{item.description}</p>

                                            <div className="flex items-center gap-2 mb-3">
                                                {item.author.avatar && (
                                                    <img
                                                        src={item.author.avatar}
                                                        alt={item.author.username}
                                                        className="w-5 h-5 rounded-full"
                                                    />
                                                )}
                                                <span className="text-gray-400 text-sm">@{item.author.username}</span>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-rounded text-sm">visibility</span>
                                                    {formatNumber(item.stats.plays)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-rounded text-sm">favorite</span>
                                                    {formatNumber(item.stats.likes)}
                                                </span>
                                                <span>{formatDate(item.timestamp)}</span>
                                            </div>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <span className="material-symbols-rounded text-sm">delete</span>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
