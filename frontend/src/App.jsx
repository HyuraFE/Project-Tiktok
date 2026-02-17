import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Preview from './pages/Preview';
import History from './pages/History';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/preview" element={<Preview />} />
                <Route path="/history" element={<History />} />
            </Routes>
        </Router>
    );
}

export default App;
