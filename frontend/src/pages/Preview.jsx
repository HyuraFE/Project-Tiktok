import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { historyStorage } from '../utils/historyStorage';

export default function Preview() {
    const location = useLocation();
    const navigate = useNavigate();
    const videoData = location.state?.videoData;
    const videoUrl = location.state?.url;
    const [downloading, setDownloading] = useState(false);

    // Save to history when component mounts
    useEffect(() => {
        if (videoData && videoUrl) {
            historyStorage.addToHistory({
                url: videoUrl,
                data: videoData
            });
        }
    }, [videoData, videoUrl]);

    if (!videoData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6">
                <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">error</span>
                <h2 className="text-2xl font-bold mb-2">No Video Data</h2>
                <p className="text-slate-500 mb-6 text-center">Please go back and enter a TikTok URL</p>
                <Link to="/" className="px-6 py-3 bg-primary text-white rounded-full font-semibold">
                    Go to Home
                </Link>
            </div>
        );
    }

    const handleDownload = async (url, filename) => {
        if (!url) {
            alert('Download URL not available');
            return;
        }

        setDownloading(true);
        try {
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'tiktok-video.mp4';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </button>
                <h1 className="text-lg font-bold tracking-tight">Video Preview</h1>
                <button className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">more_horiz</span>
                </button>
            </header>

            <main className="flex-1 px-6 pb-24 overflow-y-auto">
                {/* Video Preview Container */}
                <div className="mt-4">
                    <div className="relative group aspect-[9/16] max-h-[500px] w-full mx-auto overflow-hidden rounded-xl shadow-2xl shadow-primary/10">
                        {/* Thumbnail Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url('${videoData.video.thumbnail || 'https://via.placeholder.com/400x700'}')` }}
                        />

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="size-20 bg-primary/90 text-white rounded-full flex items-center justify-center shadow-lg transform transition group-active:scale-95">
                                <span className="material-symbols-outlined text-5xl fill-1">play_arrow</span>
                            </div>
                        </div>

                        {/* Video Metadata (Bottom Overlay) */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full border-2 border-primary overflow-hidden bg-slate-700">
                                    {videoData.author.avatar ? (
                                        <img
                                            alt="Creator profile"
                                            className="w-full h-full object-cover"
                                            src={videoData.author.avatar}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white">person</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-white text-base">@{videoData.author.username}</span>
                                    <span className="text-white/70 text-xs">{videoData.author.nickname}</span>
                                </div>
                            </div>
                            <p className="text-white text-sm line-clamp-2 leading-relaxed mt-1">
                                {videoData.description || 'No description available'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="mt-8 space-y-4 max-w-md mx-auto">
                    <div className="flex flex-col gap-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1 ml-1">High Quality</p>

                        {/* Primary Action - HD Download */}
                        <button
                            onClick={() => handleDownload(videoData.video.noWatermark, 'tiktok-hd.mp4')}
                            disabled={!videoData.video.noWatermark || downloading}
                            className="group relative flex items-center justify-between w-full h-16 px-6 bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined">hd</span>
                                <span>Download MP4 (HD)</span>
                            </div>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">download</span>
                        </button>

                        {/* Secondary Actions */}
                        <div className="grid grid-cols-1 gap-3 pt-2">
                            <button
                                onClick={() => handleDownload(videoData.video.watermark, 'tiktok-watermark.mp4')}
                                disabled={!videoData.video.watermark || downloading}
                                className="flex items-center justify-between w-full h-14 px-6 bg-primary/10 dark:bg-primary/20 text-primary rounded-full font-semibold border border-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined">branding_watermark</span>
                                    <span>With Watermark</span>
                                </div>
                                <span className="material-symbols-outlined text-sm">download</span>
                            </button>

                            <button
                                onClick={() => handleDownload(videoData.music, 'tiktok-audio.mp3')}
                                disabled={!videoData.music || downloading}
                                className="flex items-center justify-between w-full h-14 px-6 bg-slate-200/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-full font-semibold active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined">audiotrack</span>
                                    <span>Extract Audio (MP3)</span>
                                </div>
                                <span className="material-symbols-outlined text-sm">download</span>
                            </button>
                        </div>
                    </div>

                    {/* Footer Quick Actions */}
                    <div className="flex items-center justify-center gap-6 pt-6 text-slate-500 dark:text-slate-400">
                        <button className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">share</span>
                            <span className="text-sm font-medium">Share</span>
                        </button>
                        <div className="w-px h-4 bg-slate-300 dark:bg-white/10" />
                        <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-xl">add_link</span>
                            <span className="text-sm font-medium">New Link</span>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Navigation/Status Bar (Bottom) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 px-8 pb-6 pt-3 z-50">
                <div className="flex justify-around items-center max-w-md mx-auto">
                    <Link to="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">home</span>
                        <span className="text-[10px] font-bold">HOME</span>
                    </Link>
                    <a href="#" className="flex flex-col items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-2xl fill-1">play_circle</span>
                        <span className="text-[10px] font-bold">PREVIEW</span>
                    </a>
                    <a href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">history</span>
                        <span className="text-[10px] font-bold">HISTORY</span>
                    </a>
                    <a href="#" className="flex flex-col items-center gap-1 text-slate-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-2xl">settings</span>
                        <span className="text-[10px] font-bold">SETTINGS</span>
                    </a>
                </div>
            </nav>
        </div>
    );
}
