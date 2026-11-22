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
        <div className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black flex flex-col font-mono">
            <Header showBack={false} />

            <main className="flex-1 px-4 sm:px-6 py-8 pb-24 max-w-3xl mx-auto w-full">
                {/* Header Title Bar */}
                <div className="flex items-center justify-between border-b-2 border-zinc-800 pb-4 mb-6">
                    <div>
                        <div className="text-[11px] text-cyan-400 uppercase tracking-widest">// LOCAL_STORAGE_DB</div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">LOG_HISTORY</h1>
                    </div>
                    {history.length > 0 && (
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="px-3 py-1.5 border border-red-500/60 bg-red-950/20 text-red-400 hover:bg-red-900/40 text-xs font-bold transition-colors uppercase shadow-[2px_2px_0px_#ef4444]"
                        >
                            [PURGE_ALL]
                        </button>
                    )}
                </div>

                {/* Confirmation Modal */}
                {showClearConfirm && (
                    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 px-4">
                        <div className="bg-zinc-950 border-2 border-red-500 p-6 max-w-sm w-full shadow-[6px_6px_0px_#ef4444]">
                            <h3 className="text-base font-bold text-red-400 mb-2 uppercase">[CONFIRM_PURGE]</h3>
                            <p className="text-zinc-400 text-xs mb-6 font-sans">
                                Permanent deletion of {history.length} items from browser local cache.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowClearConfirm(false)}
                                    className="flex-1 py-2 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs uppercase border border-zinc-700"
                                >
                                    ABORT
                                </button>
                                <button
                                    onClick={handleClearAll}
                                    className="flex-1 py-2 bg-red-500 text-black font-black text-xs uppercase hover:bg-red-400"
                                >
                                    CONFIRM
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {history.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-zinc-800 p-8">
                        <span className="material-symbols-outlined text-4xl text-zinc-700 mb-2">code_off</span>
                        <h3 className="text-base font-bold text-zinc-400 mb-1 uppercase">BUFFER_EMPTY</h3>
                        <p className="text-zinc-600 text-xs mb-6">No historical downloads stored.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-cyan-400 text-black font-black text-xs uppercase shadow-[2px_2px_0px_#fe0979]"
                        >
                            INITIATE_DOWNLOAD
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <article
                                key={item.id}
                                className="border-2 border-zinc-800 bg-zinc-950 p-3 hover:border-cyan-400 shadow-[3px_3px_0px_#18181b] transition-all"
                            >
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-24 flex-shrink-0 border border-zinc-800 overflow-hidden bg-black">
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                <span className="material-symbols-outlined text-xl">smart_display</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 text-[10px] text-zinc-500 mb-1">
                                                <span className="text-cyan-400 font-bold truncate">@{item.author?.username || 'user'}</span>
                                                <span>{formatDate(item.timestamp)}</span>
                                            </div>
                                            <p className="text-zinc-200 text-xs font-sans line-clamp-2 leading-snug">
                                                {item.description || 'TikTok stream'}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-900 mt-2">
                                            <div className="flex items-center gap-3">
                                                <span>PLAY: {formatNumber(item.stats?.plays)}</span>
                                                <span>LIKE: {formatNumber(item.stats?.likes)}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-zinc-600 hover:text-red-400 text-xs uppercase transition-colors"
                                            >
                                                [DROP]
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
}
