import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const isDev = process.env.NODE_ENV === 'development';

const HomePage = () => {
  const [messageCount, setMessageCount] = useState(0);
  const [lastMessage, setLastMessage] = useState(null);
  const [localCounter, setLocalCounter] = useState(0);
  const [hapticStatus, setHapticStatus] = useState(null);
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
      
      // Handle Capacitor results
      if (event.data && event.data.type === 'CAPACITOR_RESULT') {
        if (event.data.requestId && event.data.requestId.startsWith('haptics-')) {
          setHapticStatus({ success: true, message: 'Haptic feedback triggered!' });
          setTimeout(() => setHapticStatus(null), 2000);
          if (isDev) {
            console.log('[App2] Haptic result:', event.data.data);
          }
        }
      }
      
      // Handle Capacitor errors
      if (event.data && event.data.type === 'CAPACITOR_ERROR') {
        if (event.data.requestId && event.data.requestId.startsWith('haptics-')) {
          setHapticStatus({ 
            success: false, 
            message: 'Haptics not available (web browser or device not supported)' 
          });
          setTimeout(() => setHapticStatus(null), 3000);
          if (isDev) {
            console.error('[App2] Haptic error:', event.data.error);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const triggerHaptic = (method, value = 'MEDIUM') => {
    const requestId = `haptics-${method}-${Date.now()}`;
    let args = [];
    
    if (method === 'impact') {
      args = [{ style: value }];
    } else if (method === 'notification') {
      args = [{ type: value }];
    } else if (method === 'vibrate') {
      args = [{ duration: value }];
    }
    
    window.postMessage({
      type: 'CAPACITOR_CALL',
      plugin: 'haptics',
      method: method,
      args: args,
      requestId,
    }, '*');
    
    if (isDev) {
      console.log('[App2] Requested haptic:', method, value);
    }
  };

  const incrementCounter = () => {
    const newCounter = localCounter + 1;
    setLocalCounter(newCounter);
    
    // Trigger success haptic on counter increment
    triggerHaptic('notification', 'SUCCESS');
    
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

      {/* Haptic Status Message */}
      {hapticStatus && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: hapticStatus.success ? '#c6f6d5' : '#fed7d7',
          color: hapticStatus.success ? '#22543d' : '#742a2a',
          borderRadius: '6px',
          border: `1px solid ${hapticStatus.success ? '#9ae6b4' : '#fc8181'}`,
          textAlign: 'center',
        }}>
          {hapticStatus.success ? '✅' : '⚠️'} {hapticStatus.message}
        </div>
      )}

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

      {/* Haptics Test Section */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f7fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#2d3748' }}>
          📳 Haptic Feedback Test
        </h3>
        <p style={{ marginBottom: '1rem', color: '#718096', fontSize: '0.9rem' }}>
          Test haptic feedback (works on mobile devices, not in web browsers)
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => triggerHaptic('impact', 'LIGHT')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Light Impact
          </button>
          <button
            onClick={() => triggerHaptic('impact', 'MEDIUM')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Medium Impact
          </button>
          <button
            onClick={() => triggerHaptic('impact', 'HEAVY')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ed8936',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Heavy Impact
          </button>
          <button
            onClick={() => triggerHaptic('notification', 'SUCCESS')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#38a169',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Success
          </button>
          <button
            onClick={() => triggerHaptic('notification', 'WARNING')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#d69e2e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Warning
          </button>
          <button
            onClick={() => triggerHaptic('notification', 'ERROR')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Error
          </button>
        </div>
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

