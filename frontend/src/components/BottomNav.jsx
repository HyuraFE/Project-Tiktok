import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 pb-4 pt-2 border-t-2 border-zinc-800 bg-black/95 backdrop-blur-xl font-mono">
            <div className="flex justify-around items-center max-w-lg mx-auto px-4">
                <Link
                    to="/"
                    className={`flex items-center gap-2 px-4 py-1.5 border transition-all ${
                        isActive('/')
                            ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[2px_2px_0px_#00f2fe]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span className="text-xs font-bold uppercase tracking-wider">[EXTRACTOR]</span>
                </Link>

                <Link
                    to="/history"
                    className={`flex items-center gap-2 px-4 py-1.5 border transition-all ${
                        isActive('/history')
                            ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[2px_2px_0px_#00f2fe]'
                            : 'border-transparent text-zinc-500 hover:text-zinc-300'
                    }`}
                >
                    <span className="material-symbols-outlined text-lg">terminal</span>
                    <span className="text-xs font-bold uppercase tracking-wider">[LOG_HISTORY]</span>
                </Link>
            </div>
        </nav>
    );
}
