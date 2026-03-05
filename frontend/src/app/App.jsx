import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router>
            <Toaster position="top-right" />
            <AppRoutes />
        </Router>
    );
}

export default App;
