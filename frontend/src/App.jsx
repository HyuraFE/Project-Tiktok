import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Preview from './pages/Preview';
import History from './pages/History';

function App() {
    return (
        <Router>
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen flex flex-col items-center">
                <div className="w-full max-w-5xl flex-1 flex flex-col">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/preview" element={<Preview />} />
                        <Route path="/history" element={<History />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
