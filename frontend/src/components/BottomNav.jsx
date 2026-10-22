import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 pb-6 pt-3 border-t border-slate-200 dark:border-white/5 bg-background-light/90 dark:bg-background-dark/95 backdrop-blur-xl">
            <div className="flex justify-around items-center max-w-md mx-auto px-4">
                <Link
                    to="/"
                    className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-slate-500 hover:text-primary'} transition-colors`}
                >
                    <span className={`material-symbols-outlined text-2xl ${isActive('/') ? 'fill-1' : ''}`}>home</span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase">Home</span>
                </Link>

                <Link
                    to="/history"
                    className={`flex flex-col items-center gap-1 ${isActive('/history') ? 'text-primary' : 'text-slate-500 hover:text-primary'} transition-colors`}
                >
                    <span className={`material-symbols-outlined text-2xl ${isActive('/history') ? 'fill-1' : ''}`}>history</span>
                    <span className="text-[10px] font-semibold tracking-wider uppercase">History</span>
                </Link>
            </div>
        </nav>
    );
}
