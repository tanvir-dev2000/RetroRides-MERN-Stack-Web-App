// frontend/src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CompareProvider } from './context/CompareContext.jsx'; // <-- ADD THIS LINE
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // If you're using Font Awesome

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CompareProvider> {/* <-- WRAP YOUR APP HERE */}
        <App />
      </CompareProvider>
    </AuthProvider>
  </BrowserRouter>
);
