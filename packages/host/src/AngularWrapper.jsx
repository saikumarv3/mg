import React, { useEffect, useRef, useState } from 'react';

const isDev = process.env.NODE_ENV === 'development';
const log = (...args) => isDev && console.log(...args);
const logError = (...args) => console.error(...args);

const AngularWrapper = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleError = (event) => {
      if (event.message && event.message.includes('app3')) {
        setError('Failed to load Angular component');
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    let cleanup = null;

    const setupMessageBridge = () => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      const handleParentMessage = (event) => {
        if (event.data &&
            event.source !== iframe.contentWindow &&
            iframe.contentWindow) {
          // Forward CROSS_APP_MESSAGE
          if (event.data.type === 'CROSS_APP_MESSAGE') {
            try {
              iframe.contentWindow.postMessage(event.data, '*');
              log('[Bridge] Forwarded message to Angular iframe:', event.data);
            } catch (e) {
              logError('[Bridge] Error forwarding to iframe:', e);
            }
          }
          // Forward CAPACITOR_RESULT and CAPACITOR_ERROR to iframe
          if (event.data.type === 'CAPACITOR_RESULT' || event.data.type === 'CAPACITOR_ERROR') {
            try {
              iframe.contentWindow.postMessage(event.data, '*');
              log('[Bridge] Forwarded Capacitor result to Angular iframe:', event.data);
            } catch (e) {
              logError('[Bridge] Error forwarding Capacitor result to iframe:', e);
            }
          }
        }
      };

      const handleCustomEvent = (event) => {
        const customEvent = event;
        if (iframe.contentWindow) {
          try {
            iframe.contentWindow.postMessage({
              type: 'CUSTOM_EVENT',
              eventType: customEvent.type,
              detail: customEvent.detail
            }, '*');
            log('[Bridge] Forwarded custom event to Angular iframe:', customEvent.type);
          } catch (e) {
            logError('[Bridge] Error forwarding custom event:', e);
          }
        }
      };

      const handleIframeMessage = (event) => {
        if (event.source === iframe.contentWindow) {
          if (event.data && event.data.type === 'CROSS_APP_MESSAGE') {
            window.postMessage(event.data, '*');
            log('[Bridge] Forwarded message from Angular to parent:', event.data);
          }
          if (event.data && event.data.type === 'CUSTOM_EVENT') {
            window.dispatchEvent(new CustomEvent(event.data.eventType, {
              detail: event.data.detail
            }));
            log('[Bridge] Forwarded custom event from Angular to parent:', event.data.eventType);
          }
          // Forward CAPACITOR_CALL from iframe to parent (Host will handle it)
          if (event.data && event.data.type === 'CAPACITOR_CALL') {
            window.postMessage(event.data, '*');
            log('[Bridge] Forwarded Capacitor call from Angular to parent:', event.data);
          }
        }
      };

      window.addEventListener('message', handleParentMessage);
      window.addEventListener('counterUpdate', handleCustomEvent);
      window.addEventListener('message', handleIframeMessage);

      cleanup = () => {
        window.removeEventListener('message', handleParentMessage);
        window.removeEventListener('counterUpdate', handleCustomEvent);
        window.removeEventListener('message', handleIframeMessage);
      };
    };

    const checkIframe = setInterval(() => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        clearInterval(checkIframe);
        setupMessageBridge();
      }
    }, 100);

    return () => {
      clearInterval(checkIframe);
      if (cleanup) cleanup();
    };
  }, []);

  useEffect(() => {
    // Detect if we're running in Capacitor (mobile)
    const isCapacitor = typeof window !== 'undefined' && window.Capacitor;
    
    // On mobile (Capacitor), load from local bundled file
    // On web dev, load from localhost:3003
    const iframeSrc = isCapacitor 
      ? './remoteEntries/app3/index.html'
      : 'http://localhost:3003';
    
    const iframe = document.createElement('iframe');
    iframe.src = iframeSrc;
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100vh - 80px)';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.title = 'Angular Dashboard';
    iframe.sandbox = 'allow-same-origin allow-scripts allow-forms allow-popups';

    let timeoutId = null;
    let isLoaded = false;

    iframe.onload = () => {
      isLoaded = true;
      if (timeoutId) clearTimeout(timeoutId);
      setError(null);
      setLoading(false);
      iframeRef.current = iframe;
      log('[AngularWrapper] Iframe loaded, message bridge should be active');
      
      // Send a test message to iframe to verify communication
      if (iframe.contentWindow) {
        setTimeout(() => {
          iframe.contentWindow.postMessage({
            type: 'IFRAME_READY',
            message: 'Host iframe is ready'
          }, '*');
          log('[AngularWrapper] Sent ready message to iframe');
        }, 500);
      }
    };

    iframe.onerror = () => {
      isLoaded = true;
      if (timeoutId) clearTimeout(timeoutId);
      setError('Failed to load Angular app. Make sure App3 is running on port 3003.');
      setLoading(false);
    };

    // Add timeout to detect connection refused
    timeoutId = setTimeout(() => {
      if (!isLoaded) {
        setError('Connection refused: App3 is not running on port 3003. Please start it with: npm run dev:app3');
        setLoading(false);
      }
    }, 5000); // 5 second timeout

    if (containerRef.current) {
      containerRef.current.appendChild(iframe);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (containerRef.current && iframe.parentNode) {
        containerRef.current.removeChild(iframe);
      }
      iframeRef.current = null;
    };
  }, []);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}>
        <div style={{ color: '#e53e3e', fontSize: '1.2rem', textAlign: 'center' }}>❌ {error}</div>
        <div style={{ 
          backgroundColor: '#fef5e7', 
          padding: '1rem', 
          borderRadius: '6px',
          border: '1px solid #f6ad55',
          fontSize: '0.9rem',
          color: '#744210',
        }}>
          <strong>Solution:</strong>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Make sure you're running <code style={{ backgroundColor: '#edf2f7', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>npm run dev</code> from the root directory</li>
            <li>Or manually start App3: <code style={{ backgroundColor: '#edf2f7', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>npm run dev --workspace=app3</code></li>
            <li>Check that App3 is running on <code style={{ backgroundColor: '#edf2f7', padding: '0.2rem 0.4rem', borderRadius: '3px' }}>http://localhost:3003</code></li>
          </ol>
        </div>
        <button
          onClick={() => {
            setError(null);
            setLoading(true);
            window.location.reload();
          }}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f7fafc', position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}></div>
          <div style={{ color: '#667eea', fontSize: '1rem' }}>Loading Angular app...</div>
        </div>
      )}
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default AngularWrapper;

