import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const isDev = process.env.NODE_ENV === 'development';

const HomePage = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [localCounter, setLocalCounter] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CROSS_APP_MESSAGE') {
        setMessageCount(prev => prev + 1);
        setLastMessage(event.data.message);
        if (isDev) {
          console.log('[App2] Received message:', event.data);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const incrementCounter = () => {
    const newCounter = localCounter + 1;
    setLocalCounter(newCounter);
    window.dispatchEvent(new CustomEvent('counterUpdate', {
      detail: { counter: newCounter, source: 'app2' }
    }));
    if (isDev) {
      console.log('[App2] Counter incremented:', newCounter);
    }
  };

  const sendMessage = () => {
    window.postMessage({
      type: 'CROSS_APP_MESSAGE',
      message: `Hello from App2! Counter: ${localCounter}`,
      source: 'app2'
    }, '*');
    if (isDev) {
      console.log('[App2] Sent message');
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    title: {
      fontSize: '2rem',
      color: '#2d3748',
      marginBottom: '1rem',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#718096',
      marginBottom: '2rem',
    },
    stats: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      flex: 1,
      padding: '1rem',
      backgroundColor: '#f7fafc',
      borderRadius: '8px',
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#667eea',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#718096',
      marginTop: '0.5rem',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap',
    },
    button: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    primaryButton: {
      backgroundColor: '#667eea',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#48bb78',
      color: 'white',
    },
    messageBox: {
      marginTop: '2rem',
      padding: '1rem',
      backgroundColor: '#edf2f7',
      borderRadius: '6px',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Home from App2! 🏠</h1>
      <p style={styles.subtitle}>This is the Home Page from App2 (React)</p>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{localCounter}</div>
          <div style={styles.statLabel}>Local Counter</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{messageCount}</div>
          <div style={styles.statLabel}>Messages Received</div>
        </div>
      </div>

      <div style={styles.actions}>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={() => navigate('/')}
        >
          Go to Welcome (App1)
        </button>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard (App3)
        </button>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={incrementCounter}
        >
          Increment Counter
        </button>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={sendMessage}
        >
          Send Message
        </button>
      </div>

      {lastMessage && (
        <div style={styles.messageBox}>
          <p><strong>Last Message:</strong> {lastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

