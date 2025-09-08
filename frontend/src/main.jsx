import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ThemeProvider from './context/ThemeProvider'; // Hamare naye provider ko import karein
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* App ko ThemeProvider ke andar daal dein */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);