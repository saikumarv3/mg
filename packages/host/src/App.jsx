import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const WelcomePage = React.lazy(() => import('app1/WelcomePage'));
const HomePage = React.lazy(() => import('app2/HomePage'));
const AngularWrapper = React.lazy(() => import('./AngularWrapper'));

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
  },
  nav: {
    backgroundColor: '#2d3748',
    padding: '1rem 2rem',
    display: 'flex',
    gap: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    fontSize: '1.2rem',
    color: '#667eea',
  },
};

function App() {
  return (
    <BrowserRouter>
      <div style={styles.container}>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Welcome (App1)</Link>
          <Link to="/home" style={styles.navLink}>Home (App2)</Link>
          <Link to="/dashboard" style={styles.navLink}>Dashboard (App3)</Link>
        </nav>

        <Suspense fallback={<div style={styles.loading}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<AngularWrapper />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;

