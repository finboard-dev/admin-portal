import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdminPortalApp from './App.adminportal';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AdminPortalApp />
  </React.StrictMode>
);