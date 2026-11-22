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
            setError('Clipboard permission blocked. Paste manually.');
        }
    };

    const handleDownload = async () => {
        const trimmedUrl = url.trim();
        if (!trimmedUrl) {
            setError('Please enter or paste a TikTok URL');
            return;
        }
        if (!/^https?:\/\/(?:www\.)?(?:tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)\//i.test(trimmedUrl)) {
            setError('Invalid TikTok URL format detected');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await downloadTikTokVideo(trimmedUrl);
            console.log('Video data received:', data);

            if (data.success) {
                navigate('/preview', {
                    state: {
                        videoData: data.data,
                        url: trimmedUrl
                    }
                });
            } else {
                setError(data.message || 'TikWM pipeline returned error');
            }
        } catch (err) {
            console.error('Download error:', err);
            setError(err.message || 'Stream fetch failure. Check URL and try again.');
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
        <div className="min-h-screen flex flex-col bg-black text-white selection:bg-cyan-400 selection:text-black">
            <Header />

            <main className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-6 py-12">
                {/* Status Bar Tag */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="bg-zinc-900 border border-zinc-800 text-[11px] font-mono px-3 py-1 text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                        TIKWM_API_v2 // RAW_HD
                    </span>
                    <span className="text-[11px] font-mono text-zinc-600">// NO_WATERMARK</span>
                </div>

                {/* Hero Title */}
                <div className="mb-10 space-y-3">
                    <h1 className="text-4xl sm:text-5xl font-black font-mono tracking-tight uppercase leading-none">
                        STREAM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">RIPPER</span>
                    </h1>
                    <p className="text-zinc-400 font-mono text-xs sm:text-sm max-w-md">
                        Direct video stream extractor for TikTok. Extracts 1080p MP4 and raw audio bitstream without watermark.
                    </p>
                </div>

                {/* Terminal Input Box */}
                <div className="space-y-4">
                    <div className="bg-zinc-950 border-2 border-zinc-800 focus-within:border-cyan-400 p-2 shadow-[4px_4px_0px_#27272a] focus-within:shadow-[4px_4px_0px_#00f2fe] transition-all">
                        <div className="flex items-center justify-between px-2 pb-2 text-[10px] font-mono text-zinc-500 border-b border-zinc-900">
                            <span>TARGET_URL_INPUT</span>
                            <span>[UTF-8]</span>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <span className="text-cyan-400 font-mono pl-2 text-sm">&gt;</span>
                            <input
                                className="w-full bg-transparent border-none text-white font-mono text-sm placeholder:text-zinc-700 focus:outline-none focus:ring-0 py-2"
                                placeholder="https://www.tiktok.com/@user/video/..."
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
                                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1.5 text-xs font-mono transition-colors uppercase disabled:opacity-50"
                            >
                                Paste
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-950/40 border-2 border-red-500/50 text-red-400 px-4 py-2 text-xs font-mono flex items-center gap-2 shadow-[2px_2px_0px_#ef4444]">
                            <span className="material-symbols-outlined text-sm">terminal</span>
                            <span>ERR: {error}</span>
                        </div>
                    )}

                    {/* Submit Action Button */}
                    <button
                        className="w-full bg-cyan-400 hover:bg-cyan-300 text-black font-black font-mono text-base py-4 border-2 border-cyan-300 shadow-[4px_4px_0px_#fe0979] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleDownload}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                                PARSING_TIKWM_STREAM...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">bolt</span>
                                EXECUTE_EXTRACT
                            </>
                        )}
                    </button>
                </div>

                {/* Specs footer info */}
                <div className="mt-12 grid grid-cols-3 gap-2 border-t-2 border-zinc-900 pt-6 text-[10px] font-mono text-zinc-500">
                    <div>
                        <span className="block text-zinc-400 font-bold">SOURCE</span>
                        TikWM Public API
                    </div>
                    <div>
                        <span className="block text-zinc-400 font-bold">FORMAT</span>
                        MP4 (Original HD)
                    </div>
                    <div>
                        <span className="block text-zinc-400 font-bold">AUDIO</span>
                        Direct MP3 Stream
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
