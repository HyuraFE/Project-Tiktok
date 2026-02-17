import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Preview from './pages/Preview';
import History from './pages/History';

function App() {
    return (
        <Router>
            <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white min-h-screen">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/preview" element={<Preview />} />
                    <Route path="/history" element={<History />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
