import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import { downloadTikTokVideo } from '../services/api';

export default function Home() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDownload = async () => {
        if (!url.trim()) {
            setError('Please paste a TikTok URL');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await downloadTikTokVideo(url);
            console.log('Video data received:', data);

            if (data.success) {
                // Navigate to preview with video data and URL
                navigate('/preview', {
                    state: {
                        videoData: data.data,
                        url: url
                    }
                });
            } else {
                setError(data.message || 'Failed to fetch video data');
            }
        } catch (err) {
            console.error('Download error:', err);
            setError(err.message || 'Failed to download video. Please check the URL and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleDownload();
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 flex flex-col px-6 justify-center max-w-md mx-auto w-full -mt-16">
                {/* Hero Section */}
                <div className="text-center space-y-4 mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        NO WATERMARK • HD QUALITY
                    </div>
                    <h1 className="text-4xl font-bold leading-tight tracking-tight">
                        Download TikTok <br />
                        <span className="text-primary">Videos Instantly</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm px-4">
                        Paste your favorite TikTok link below and save high-quality videos without the watermark.
                    </p>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined">link</span>
                        </div>
                        <input
                            className="w-full h-16 pl-12 pr-4 bg-slate-100 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-primary text-base placeholder:text-slate-500 dark:placeholder:text-slate-500 transition-all shadow-inner"
                            placeholder="Paste TikTok link here..."
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-4 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDownload}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                Processing...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">download</span>
                                Download Now
                            </>
                        )}
                    </button>
                </div>

                {/* Quick Stats / Features */}
                <div className="grid grid-cols-3 gap-4 mt-12">
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-primary">bolt</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Fast</span>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-primary">high_quality</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">HD Only</span>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <span className="material-symbols-outlined text-primary">lock</span>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Secure</span>
                    </div>
                </div>
            </main>

            {/* Ad/Promo Card */}
            <div className="px-6 mb-8">
                <div className="w-full p-4 rounded-2xl bg-gradient-to-r from-primary/20 to-transparent border border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">stars</span>
                        <div>
                            <p className="text-sm font-bold">Go Premium</p>
                            <p className="text-xs text-slate-400">Unlimited batch downloads</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
