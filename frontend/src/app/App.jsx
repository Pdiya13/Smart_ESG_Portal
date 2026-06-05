import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <Router>
            <Toaster 
                position="top-right" 
                toastOptions={{
                    style: {
                        fontSize: '1.05rem',
                        fontWeight: '500',
                        padding: '16px 24px',
                        maxWidth: '550px',
                        borderRadius: '12px',
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
            <AppRoutes />
        </Router>
    );
}

export default App;
