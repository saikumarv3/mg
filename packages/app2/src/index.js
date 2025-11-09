import React from 'react';
import ReactDOM from 'react-dom/client';
import { defineCustomElements } from '@r-design-system/loader';
import '@r-design-system/dist/r-design-system/r-design-system.css';
import HomePage from './HomePage';

// Define custom elements for r-design-system
defineCustomElements();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HomePage />
  </React.StrictMode>
);

