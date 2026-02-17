import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="pb-10 pt-3 border-t border-slate-200 dark:border-white/5 bg-background-light dark:bg-[#1c1022]">
            <div className="flex justify-around items-center px-4">
                <Link
                    to="/"
                    className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-primary' : 'text-slate-500 hover:text-primary'} transition-colors`}
                >
                    <span className={`material-symbols-outlined ${isActive('/') ? 'fill-1' : ''}`}>home</span>
                    <span className="text-[10px] font-semibold">Home</span>
                </Link>

                <Link
                    to="/history"
                    className={`flex flex-col items-center gap-1 ${isActive('/history') ? 'text-primary' : 'text-slate-500 hover:text-primary'} transition-colors`}
                >
                    <span className="material-symbols-outlined">history</span>
                    <span className="text-[10px] font-semibold">History</span>
                </Link>

                <Link
                    to="/saved"
                    className={`flex flex-col items-center gap-1 ${isActive('/saved') ? 'text-primary' : 'text-slate-500 hover:text-primary'} transition-colors`}
                >
                    <span className="material-symbols-outlined">bookmark</span>
                    <span className="text-[10px] font-semibold">Saved</span>
                </Link>

                <Link
                    to="/settings"
                    className={`flex flex-col items-center gap-1 ${isActive('/settings') ? 'text-primary' : 'text-slate-500 hover:text-primary'} transition-colors`}
                >
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-[10px] font-semibold">Settings</span>
                </Link>
            </div>
        </nav>
    );
}
