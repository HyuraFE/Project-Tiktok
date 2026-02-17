import { Link } from 'react-router-dom';

export default function Header({ showBack = false }) {
    return (
        <header className="flex items-center justify-between px-6 pt-12 pb-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-50">
            {showBack ? (
                <Link to="/" className="flex items-center justify-center size-10 rounded-full hover:bg-primary/10 transition-colors">
                    <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
                </Link>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">movie</span>
                    </div>
                    <span className="font-bold text-lg tracking-tight">TikSave</span>
                </div>
            )}

            {!showBack && (
                <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">person</span>
                </button>
            )}
        </header>
    );
}
