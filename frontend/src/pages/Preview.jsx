import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { historyStorage } from '../utils/historyStorage';
import BottomNav from '../components/BottomNav';

export default function Preview() {
    const location = useLocation();
    const navigate = useNavigate();
    const videoData = location.state?.videoData;
    const videoUrl = location.state?.url;
    const [downloading, setDownloading] = useState(null);
    const [downloadStatus, setDownloadStatus] = useState(null);
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef(null);

    // Save to history when component mounts
    useEffect(() => {
        if (videoData && videoUrl) {
            historyStorage.addToHistory({
                url: videoUrl,
                data: videoData
            });
        }
    }, [videoData, videoUrl]);

    const clearStatus = () => setDownloadStatus(null);

    const handleDownload = async (url, filename) => {
        if (!url) {
            setDownloadStatus({ type: 'error', message: 'Download URL not available' });
            return;
        }

        setDownloading(filename);
        setDownloadStatus(null);
        try {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'tiktok-video.mp4';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloadStatus({ type: 'success', message: 'Download started' });
        } catch (error) {
            console.error('Download error:', error);
            setDownloadStatus({ type: 'error', message: 'Failed to download. Try right-click → Save video.' });
        } finally {
            setDownloading(null);
        }
    };

    const handleVideoPlay = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                setPlaying(false);
            });
            setPlaying(true);
        }
    };

    const handleVideoEnded = () => {
        setPlaying(false);
    };

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

    const hdUrl = videoData.video?.noWatermark;
    const watermarkUrl = videoData.video?.watermark;
    const audioUrl = videoData.music;
    const thumbnail = videoData.video?.thumbnail || 'https://via.placeholder.com/400x700';

    return (
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors"
                    aria-label="Back"
                >
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </button>
                <h1 className="text-lg font-bold tracking-tight">Video Preview</h1>
                <button className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors" aria-label="More options">
                    <span className="material-symbols-outlined text-2xl">more_horiz</span>
                </button>
            </header>

            <main className="flex-1 px-6 pb-24 overflow-y-auto">
                <div className="max-w-4xl mx-auto w-full lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start lg:mt-8">
                    {/* Video Preview Container */}
                    <div className="mt-4 lg:mt-0">
                        <div className="relative aspect-[9/16] max-h-[500px] w-full mx-auto overflow-hidden rounded-2xl shadow-2xl shadow-primary/10 bg-black">
                            {/* Video Player - plays inline */}
                            {hdUrl && (
                                <video
                                    ref={videoRef}
                                    className="w-full h-full object-cover"
                                    poster={thumbnail}
                                    playsInline
                                    controls={playing}
                                    onPlay={() => setPlaying(true)}
                                    onPause={() => setPlaying(false)}
                                    onEnded={handleVideoEnded}
                                    onError={() => setPlaying(false)}
                                >
                                    <source src={hdUrl} type="video/mp4" />
                                </video>
                            )}

                            {/* Thumbnail fallback / poster */}
                            {(!playing || !hdUrl) && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${thumbnail}')` }}
                                />
                            )}

                            {/* Overlay Gradient (when not playing) */}
                            {!playing && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            )}

                            {/* Play/Pause Overlay */}
                            {!playing && hdUrl && (
                                <button
                                    onClick={handleVideoPlay}
                                    className="absolute inset-0 flex items-center justify-center focus:outline-none"
                                    aria-label="Play video"
                                >
                                    <div className="size-20 bg-primary/90 hover:bg-primary text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95">
                                        <span className="material-symbols-outlined text-5xl fill-1">play_arrow</span>
                                    </div>
                                </button>
                            )}

                            {!hdUrl && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/10 backdrop-blur-sm text-white rounded-full px-5 py-2.5 text-center text-xs font-medium border border-white/20">
                                        <span className="material-symbols-outlined align-middle mr-1.5 text-base">image</span>
                                        Static poster preview
                                    </div>
                                </div>
                            )}

                            {/* Video Metadata (Bottom Overlay) */}
                            {!playing && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 pointer-events-none">
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
                                        <div className="flex flex-col pointer-events-auto">
                                            <span className="font-bold text-white text-base">@{videoData.author.username}</span>
                                            <span className="text-white/70 text-xs">{videoData.author.nickname}</span>
                                        </div>
                                    </div>
                                    <p className="text-white text-sm line-clamp-2 leading-relaxed mt-1">
                                        {videoData.description || 'No description available'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="mt-8 lg:mt-0 space-y-4 max-w-md mx-auto lg:max-w-none w-full">
                        {/* Inline Download Status */}
                        {downloadStatus && (
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                                    downloadStatus.type === 'success'
                                        ? 'bg-green-500/10 border-green-500/30 text-green-400 dark:text-green-300'
                                        : 'bg-red-500/10 border-red-500/30 text-red-400 dark:text-red-300'
                                }`}
                                role="alert"
                            >
                                <span className="material-symbols-outlined flex-shrink-0">
                                    {downloadStatus.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                <span className="text-sm font-medium flex-1">{downloadStatus.message}</span>
                                <button
                                    onClick={clearStatus}
                                    className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
                                    aria-label="Dismiss"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1 ml-1">Download Options</p>

                            {/* Primary Action - HD Download */}
                            <button
                                onClick={() => hdUrl && handleDownload(hdUrl, 'tiktok-hd.mp4')}
                                disabled={!hdUrl || !!downloading}
                                className="group relative flex items-center justify-between w-full h-16 px-6 bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined">hd</span>
                                    <span>{downloading === 'tiktok-hd.mp4' ? 'Downloading…' : 'Download MP4 (HD)'}</span>
                                </div>
                                {downloading === 'tiktok-hd.mp4' ? (
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">download</span>
                                )}
                            </button>

                            {/* Secondary Actions */}
                            <div className="grid grid-cols-1 gap-3 pt-2">
                                <button
                                    onClick={() => watermarkUrl && handleDownload(watermarkUrl, 'tiktok-watermark.mp4')}
                                    disabled={!watermarkUrl || !!downloading}
                                    className="flex items-center justify-between w-full h-14 px-6 bg-primary/10 dark:bg-primary/20 text-primary rounded-full font-semibold border border-primary/20 hover:bg-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined">branding_watermark</span>
                                        <span>{downloading === 'tiktok-watermark.mp4' ? 'Downloading…' : 'With Watermark'}</span>
                                    </div>
                                    {downloading === 'tiktok-watermark.mp4' ? (
                                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">download</span>
                                    )}
                                </button>

                                <button
                                    onClick={() => audioUrl && handleDownload(audioUrl, 'tiktok-audio.mp3')}
                                    disabled={!audioUrl || !!downloading}
                                    className="flex items-center justify-between w-full h-14 px-6 bg-slate-200/50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-full font-semibold hover:bg-slate-200 dark:hover:bg-white/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined">audiotrack</span>
                                        <span>{downloading === 'tiktok-audio.mp3' ? 'Downloading…' : 'Extract Audio (MP3)'}</span>
                                    </div>
                                    {downloading === 'tiktok-audio.mp3' ? (
                                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">download</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Footer Quick Actions */}
                        <div className="flex items-center justify-center gap-6 pt-6 text-slate-500 dark:text-slate-400">
                            <button className="flex items-center gap-2 hover:text-primary transition-colors" aria-label="Share">
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
                </div>
            </main>

            <BottomNav />
        </div>
    );
}