import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const isDev = process.env.NODE_ENV === 'development';

const WelcomePage = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [sharedCounter, setSharedCounter] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loadingDeviceInfo, setLoadingDeviceInfo] = useState(false);
  const navigate = useNavigate();

  const requestDeviceInfo = () => {
    setLoadingDeviceInfo(true);
    const requestId = 'device-info';
    window.postMessage({
      type: 'CAPACITOR_CALL',
      plugin: 'device',
      method: 'getInfo',
      args: [],
      requestId,
    }, '*');
    
    if (isDev) {
      console.log('[App1] Requested device info');
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CROSS_APP_MESSAGE') {
        setMessageCount(prev => prev + 1);
        setLastMessage(event.data.message);
        if (isDev) {
          console.log('[App1] Received message:', event.data);
        }
      }
      
      // Handle Capacitor results
      if (event.data && event.data.type === 'CAPACITOR_RESULT') {
        if (event.data.requestId === 'device-info') {
          setDeviceInfo(event.data.data);
          setLoadingDeviceInfo(false);
          if (isDev) {
            console.log('[App1] Device info received:', event.data.data);
          }
        }
      }
      
      // Handle Capacitor errors
      if (event.data && event.data.type === 'CAPACITOR_ERROR') {
        if (event.data.requestId === 'device-info') {
          setLoadingDeviceInfo(false);
          if (isDev) {
            console.error('[App1] Device info error:', event.data.error);
          }
        }
      }
    };

    const handleCounterUpdate = (event) => {
      if (event.detail && event.detail.source !== 'app1') {
        setSharedCounter(event.detail.counter || 0);
        if (isDev) {
          console.log('[App1] Counter updated:', event.detail);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('counterUpdate', handleCounterUpdate);

    // Request device info on mount
    requestDeviceInfo();

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('counterUpdate', handleCounterUpdate);
    };
  }, []);

  const sendMessage = () => {
    window.postMessage({
      type: 'CROSS_APP_MESSAGE',
      message: `Hello from App1! Message count: ${messageCount + 1}`,
      source: 'app1'
    }, '*');
    if (isDev) {
      console.log('[App1] Sent message');
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
      <h1 style={styles.title}>Welcome to App1! 🎉</h1>
      <p style={styles.subtitle}>This is the Welcome Page from App1 (React)</p>

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{messageCount}</div>
          <div style={styles.statLabel}>Messages Received</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{sharedCounter}</div>
          <div style={styles.statLabel}>Shared Counter</div>
        </div>
      </div>

      {/* Device Info Card */}
      {deviceInfo && (
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#edf2f7',
          borderRadius: '8px',
          border: '1px solid #cbd5e0',
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2d3748' }}>
            📱 Device Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <strong>Platform:</strong> {deviceInfo.platform}
            </div>
            <div>
              <strong>OS Version:</strong> {deviceInfo.osVersion || 'N/A'}
            </div>
            <div>
              <strong>Model:</strong> {deviceInfo.model || 'N/A'}
            </div>
            <div>
              <strong>Manufacturer:</strong> {deviceInfo.manufacturer || 'N/A'}
            </div>
            {deviceInfo.isVirtual !== undefined && (
              <div>
                <strong>Virtual:</strong> {deviceInfo.isVirtual ? 'Yes' : 'No'}
              </div>
            )}
          </div>
          <button
            onClick={requestDeviceInfo}
            disabled={loadingDeviceInfo}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loadingDeviceInfo ? 'not-allowed' : 'pointer',
              opacity: loadingDeviceInfo ? 0.6 : 1,
            }}
          >
            {loadingDeviceInfo ? 'Loading...' : 'Refresh Device Info'}
          </button>
        </div>
      )}

      {loadingDeviceInfo && !deviceInfo && (
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#fef5e7',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#744210',
        }}>
          Loading device information...
        </div>
      )}

      <div style={styles.actions}>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={() => navigate('/home')}
        >
          Go to Home (App2)
        </button>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard (App3)
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

export default WelcomePage;

