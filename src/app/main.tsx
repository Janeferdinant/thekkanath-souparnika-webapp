import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '../styles/index.css';
import { installChunkRecovery } from './chunkRecovery';

installChunkRecovery(window);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
