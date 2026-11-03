import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.jsx';

// Entry point. StrictMode adds dev-only checks; BrowserRouter enables routing;
// ToastContainer renders the toast notifications triggered via react-toastify.
createRoot(document.getElementById('root')).render(

    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" />
    </BrowserRouter>

);
