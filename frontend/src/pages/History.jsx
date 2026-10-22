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

    const loadHistory = () => setHistory(historyStorage.getHistory());

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
        const diff = new Date() - date;
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
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num?.toString() || '0';
    };

    return (
        <div className="min-h-screen bg-background text-neutral-100 flex flex-col">
            <Header showBack={false} />

            <main className="flex-1 px-6 py-8 pb-24">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-white">Download History</h1>
                            <p className="text-neutral-500 text-sm mt-1">{history.length} {history.length === 1 ? 'video' : 'videos'}</p>
                        </div>
                        {history.length > 0 && (
                            <button
                                onClick={() => setShowClearConfirm(true)}
                                className="px-3 py-2 border border-border rounded-lg text-neutral-400 hover:text-white hover:bg-surface transition-colors text-xs font-medium"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {showClearConfirm && (
                        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6" role="dialog" aria-modal="true" aria-labelledby="clear-history-title">
                            <div className="bg-surface rounded-2xl p-6 max-w-sm w-full border border-border shadow-2xl">
                                <h3 id="clear-history-title" className="text-xl font-bold text-white mb-2">Clear history?</h3>
                                <p className="text-neutral-400 text-sm mb-6">This permanently deletes all {history.length} saved items from this device.</p>
                                <div className="flex gap-3">
                                    <button onClick={() => setShowClearConfirm(false)} className="flex-1 px-4 py-3 bg-neutral-800 rounded-xl text-white hover:bg-neutral-700 transition-colors font-medium">
                                        Cancel
                                    </button>
                                    <button onClick={handleClearAll} className="flex-1 px-4 py-3 bg-white rounded-xl text-black hover:bg-neutral-200 transition-colors font-medium">
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {history.length === 0 ? (
                        <div className="text-center py-20 border-y border-border-subtle">
                            <div className="w-14 h-14 bg-surface border border-border rounded-full flex items-center justify-center mx-auto mb-5">
                                <span className="material-symbols-outlined text-2xl text-neutral-500">history</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No downloads yet</h3>
                            <p className="text-neutral-500 text-sm mb-6">Downloaded videos appear here.</p>
                            <button onClick={() => navigate('/')} className="px-5 py-3 bg-white rounded-xl text-black text-sm font-semibold hover:bg-neutral-200 transition-colors">
                                Download video
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {history.map((item) => (
                                <article key={item.id} className="py-4 first:pt-0 group">
                                    <div className="flex gap-4">
                                        <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-surface border border-border">
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-neutral-600 text-2xl">video_library</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 py-0.5">
                                            <p className="text-white font-medium text-sm leading-relaxed line-clamp-2">{item.description || 'TikTok video'}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                {item.author?.avatar && <img src={item.author.avatar} alt="" className="w-4 h-4 rounded-full grayscale" />}
                                                <span className="text-neutral-500 text-xs">@{item.author?.username || 'creator'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-neutral-500 mt-3">
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">visibility</span>{formatNumber(item.stats?.plays)}</span>
                                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">favorite</span>{formatNumber(item.stats?.likes)}</span>
                                                <span>{formatDate(item.timestamp)}</span>
                                            </div>
                                            <button onClick={() => handleDelete(item.id)} className="mt-3 text-neutral-500 hover:text-white text-xs font-medium flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
