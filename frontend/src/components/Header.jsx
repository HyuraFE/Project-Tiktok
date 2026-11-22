import { Link } from 'react-router-dom';

export default function Header({ showBack = false }) {
    return (
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-black/90 backdrop-blur-md z-50 border-b-2 border-zinc-800">
            {showBack ? (
                <Link to="/" className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-2 border-zinc-700 hover:border-cyan-400 text-xs font-mono text-cyan-400 transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span>[BACK_TO_ROOT]</span>
                </Link>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="bg-cyan-400 text-black px-2.5 py-1 font-bold text-sm font-mono tracking-tight shadow-[2px_2px_0px_#fe0979]">
                        //TIK.SAVE
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">[ENGINE: TIKWM_HD]</span>
                </div>
            )}

            <div className="flex items-center gap-3 text-xs font-mono">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    ONLINE
                </span>
                <span className="text-zinc-700">|</span>
                <span className="text-zinc-400">RAW_STREAM</span>
            </div>
        </header>
    );
}
