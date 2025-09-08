//src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './globals.css';
import App from './App';
// Add this import:
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // or './serviceWorker' if that's the file

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// Register the service worker here:
serviceWorkerRegistration.register();
