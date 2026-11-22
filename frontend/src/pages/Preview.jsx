import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { historyStorage } from '../utils/historyStorage';
import Header from '../components/Header';
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
            setDownloadStatus({ type: 'error', message: 'Download URL is null/invalid' });
            return;
        }

        setDownloading(filename);
        setDownloadStatus({ type: 'success', message: `DOWNLOADING: ${filename}...` });
        try {
            // Use backend proxy endpoint with Content-Disposition attachment to trigger real browser file download
            const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
            const link = document.createElement('a');
            link.href = proxyUrl;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloadStatus({ type: 'success', message: `DOWNLOAD_INITIATED: ${filename}` });
        } catch (error) {
            console.error('Download error:', error);
            // Fallback direct url
            window.open(url, '_blank');
            setDownloadStatus({ type: 'error', message: 'Direct stream opened in new tab.' });
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
            <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-black text-white font-mono">
                <div className="p-6 border-2 border-zinc-800 bg-zinc-950 shadow-[4px_4px_0px_#ef4444] text-center max-w-sm">
                    <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-2">NO_STREAM_DATA</h2>
                    <p className="text-zinc-500 text-xs mb-6">No active video stream payload in session memory.</p>
                    <Link to="/" className="inline-block px-4 py-2 bg-cyan-400 text-black font-bold text-xs uppercase shadow-[2px_2px_0px_#ffffff]">
                        RETURN_TO_EXTRACTOR
                    </Link>
                </div>
            </div>
        );
    }

    const hdUrl = videoData.video?.noWatermark;
    const watermarkUrl = videoData.video?.watermark;
    const audioUrl = videoData.music;
    const thumbnail = videoData.video?.thumbnail || '';

    return (
        <div className="min-h-screen flex flex-col bg-black text-white selection:bg-cyan-400 selection:text-black">
            <Header showBack={true} />

            <main className="flex-1 px-4 sm:px-6 py-6 pb-24 overflow-y-auto max-w-4xl mx-auto w-full">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-zinc-800 pb-3 mb-6 font-mono text-xs">
                    <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold">[TARGET_RESOLVED]</span>
                        <span className="text-zinc-500">@{videoData.author?.username}</span>
                    </div>
                    <span className="text-[11px] text-zinc-600 bg-zinc-900 px-2 py-0.5 border border-zinc-800">
                        TIKWM_DIRECT_HD
                    </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Video Player Display Container */}
                    <div className="lg:col-span-5">
                        <div className="relative aspect-[9/16] max-h-[520px] w-full mx-auto overflow-hidden border-2 border-zinc-800 bg-zinc-950 shadow-[6px_6px_0px_#27272a]">
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

                            {(!playing || !hdUrl) && thumbnail && (
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${thumbnail}')` }}
                                />
                            )}

                            {!playing && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                            )}

                            {!playing && hdUrl && (
                                <button
                                    onClick={handleVideoPlay}
                                    className="absolute inset-0 flex items-center justify-center focus:outline-none"
                                    aria-label="Play video"
                                >
                                    <div className="size-16 bg-cyan-400 hover:bg-cyan-300 text-black flex items-center justify-center shadow-[4px_4px_0px_#fe0979] border-2 border-black transition-transform active:scale-95">
                                        <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
                                    </div>
                                </button>
                            )}

                            {/* Author Overlay */}
                            {!playing && (
                                <div className="absolute bottom-0 left-0 right-0 p-4 font-mono pointer-events-none">
                                    <div className="flex items-center gap-2 mb-2">
                                        {videoData.author?.avatar && (
                                            <img
                                                alt="Avatar"
                                                className="w-7 h-7 border border-zinc-700 object-cover"
                                                src={videoData.author.avatar}
                                            />
                                        )}
                                        <span className="text-xs font-bold text-cyan-400">@{videoData.author?.username}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed font-sans">
                                        {videoData.description || 'No caption payload provided.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls & Download Actions */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Status notification */}
                        {downloadStatus && (
                            <div
                                className={`flex items-center justify-between p-3 border-2 font-mono text-xs ${
                                    downloadStatus.type === 'success'
                                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[2px_2px_0px_#10b981]'
                                        : 'bg-red-950/40 border-red-500 text-red-400 shadow-[2px_2px_0px_#ef4444]'
                                }`}
                            >
                                <span>{downloadStatus.message}</span>
                                <button onClick={clearStatus} className="text-zinc-400 hover:text-white">
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}

                        {/* Telemetry metadata box */}
                        <div className="border-2 border-zinc-800 bg-zinc-950 p-4 font-mono text-xs shadow-[4px_4px_0px_#27272a] space-y-2">
                            <div className="flex items-center justify-between text-zinc-500 border-b border-zinc-900 pb-2">
                                <span>STREAM_TELEMETRY</span>
                                <span className="text-cyan-400">ONLINE</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                                <div>
                                    <span className="text-zinc-500 block">CREATOR:</span>
                                    <span className="text-zinc-200">{videoData.author?.nickname || videoData.author?.username}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 block">AUDIO_TRACK:</span>
                                    <span className="text-zinc-200 truncate block">{videoData.music_info?.title || 'Original Stream'}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 block">PLAYS:</span>
                                    <span className="text-zinc-200">{videoData.stats?.plays?.toLocaleString() || 0}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-500 block">LIKES:</span>
                                    <span className="text-zinc-200">{videoData.stats?.likes?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 font-mono">
                            <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                                // EXPORT_DISPATCH_PIPELINE
                            </div>

                            {/* HD Direct */}
                            <button
                                onClick={() => hdUrl && handleDownload(hdUrl, `tiktok-hd-${videoData.author?.username || 'stream'}.mp4`)}
                                disabled={!hdUrl || !!downloading}
                                className="w-full flex items-center justify-between p-4 bg-cyan-400 hover:bg-cyan-300 text-black font-black border-2 border-cyan-300 shadow-[4px_4px_0px_#fe0979] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-xl">hd</span>
                                    <span className="text-sm">DOWNLOAD MP4 (ORIGINAL HD)</span>
                                </div>
                                <span className="text-xs uppercase bg-black text-cyan-400 px-2 py-0.5 border border-cyan-400">
                                    NO WATERMARK
                                </span>
                            </button>

                            {/* Watermark version */}
                            <button
                                onClick={() => watermarkUrl && handleDownload(watermarkUrl, `tiktok-wm-${videoData.author?.username || 'stream'}.mp4`)}
                                disabled={!watermarkUrl || !!downloading}
                                className="w-full flex items-center justify-between p-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold border-2 border-zinc-700 shadow-[4px_4px_0px_#27272a] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-zinc-400 text-lg">branding_watermark</span>
                                    <span className="text-xs">DOWNLOAD MP4 (WITH WATERMARK)</span>
                                </div>
                                <span className="material-symbols-outlined text-sm text-zinc-500">download</span>
                            </button>

                            {/* Audio Stream */}
                            <button
                                onClick={() => audioUrl && handleDownload(audioUrl, `tiktok-audio-${videoData.author?.username || 'stream'}.mp3`)}
                                disabled={!audioUrl || !!downloading}
                                className="w-full flex items-center justify-between p-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold border-2 border-zinc-700 shadow-[4px_4px_0px_#27272a] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-pink-400 text-lg">audiotrack</span>
                                    <span className="text-xs">EXTRACT AUDIO STREAM (MP3)</span>
                                </div>
                                <span className="text-xs text-pink-400">[AUDIO_RAW]</span>
                            </button>
                        </div>

                        {/* Extra Utilities */}
                        <div className="flex items-center gap-4 pt-4 border-t border-zinc-900 font-mono text-xs">
                            <button
                                onClick={() => {
                                    if (videoUrl) {
                                        navigator.clipboard.writeText(videoUrl);
                                        setDownloadStatus({ type: 'success', message: 'CLIPBOARD: Copied source URL' });
                                    }
                                }}
                                className="flex items-center gap-1.5 text-zinc-400 hover:text-cyan-400 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                <span>COPY_URL</span>
                            </button>
                            <span className="text-zinc-800">/</span>
                            <Link to="/" className="flex items-center gap-1.5 text-zinc-400 hover:text-cyan-400 transition-colors">
                                <span className="material-symbols-outlined text-sm">add</span>
                                <span>NEW_STREAM</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
