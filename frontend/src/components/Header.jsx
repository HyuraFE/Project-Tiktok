import { Link } from 'react-router-dom';

export default function Header({ showBack = false }) {
    return (
        <header className="flex items-center justify-between px-6 pt-8 pb-4 sticky top-0 bg-background/90 backdrop-blur-md z-50 border-b border-border-subtle">
            {showBack ? (
                <Link to="/" className="flex items-center justify-center size-10 rounded-full hover:bg-surface border border-border transition-colors">
                    <span className="material-symbols-outlined text-xl text-neutral-300">arrow_back_ios_new</span>
                </Link>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="bg-white text-black p-1.5 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">movie</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">TikSave</span>
                </div>
            )}

            {!showBack && (
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border hover:bg-surface-hover transition-colors">
                    <span className="material-symbols-outlined text-neutral-400">person</span>
                </button>
            )}
        </header>
    );
}
