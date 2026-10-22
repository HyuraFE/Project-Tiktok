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

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
            setError('');
        } catch {
            setError('Clipboard access blocked. Paste link manually.');
        }
    };

    const handleDownload = async () => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            setError('Paste a TikTok URL first');
            return;
        }
        if (!/^https?:\/\/(?:www\.)?(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\//i.test(trimmedUrl)) {
            setError('Enter a valid TikTok URL');
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

            <main className="flex-1 flex flex-col px-6 justify-center max-w-md mx-auto w-full -mt-12">
                {/* Hero Section */}
                <div className="text-center space-y-4 mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-neutral-300 text-xs font-semibold mb-2">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        NO WATERMARK • HD QUALITY
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight font-display text-white">
                        Download TikTok <br />
                        <span className="font-normal">Videos Instantly</span>
                    </h1>
                    <p className="text-neutral-500 text-sm px-4 max-w-xs mx-auto">
                        Save TikTok videos in original HD quality without watermarks.
                    </p>
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-600 group-focus-within:text-white transition-colors">
                            <span className="material-symbols-outlined">link</span>
                        </div>
                        <input
                            className="w-full h-16 pl-12 pr-16 bg-surface border border-border rounded-2xl focus:ring-2 focus:ring-white focus:border-transparent text-base placeholder:text-neutral-500 transition-all"
                            placeholder="Paste TikTok link here..."
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={handlePaste}
                            disabled={loading}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Paste from clipboard"
                        >
                            <span className="material-symbols-outlined text-lg">content_paste</span>
                        </button>
                    </div>

                    {error && (
                        <div className="text-neutral-400 text-sm text-center bg-neutral-900/50 border border-border py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-base">error_outline</span>
                            {error}
                        </div>
                    )}

                    <button
                        className="w-full h-16 bg-white text-black font-bold text-lg rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            </main>

            <BottomNav />
        </div>
    );
}
