import { Component, OnInit } from '@angular/core';

const isDev = process.env.NODE_ENV === 'development';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  template: `
    <div class="dashboard-container">
      <div class="dashboard-card">
        <h1 class="dashboard-title">Dashboard from App3 (Angular)!</h1>
        <p class="dashboard-subtitle">This is an Angular component integrated via Module Federation</p>

        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-number">{{ counter }}</div>
            <div class="stat-label">Counter</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ messageCount }}</div>
            <div class="stat-label">Messages Received</div>
          </div>
        </div>

        <div class="actions">
          <button (click)="incrementCounter()" class="btn btn-primary">
            Increment Counter
          </button>
          <button (click)="sendMessage()" class="btn btn-secondary">
            Send Message to React Apps
          </button>
        </div>

        <div *ngIf="lastMessage" class="message-box">
          <p><strong>Last Message:</strong> {{ lastMessage }}</p>
        </div>

        <!-- App Info Section -->
        <div class="app-info-section" *ngIf="appInfo || loadingAppInfo">
          <h3 class="section-title">📱 App Information</h3>
          <div *ngIf="loadingAppInfo" class="loading-message">
            Loading app information...
          </div>
          <div *ngIf="appInfo && !loadingAppInfo" class="app-info-grid">
            <div class="info-item">
              <strong>App Name:</strong> {{ appInfo.name || 'N/A' }}
            </div>
            <div class="info-item">
              <strong>Version:</strong> {{ appInfo.version || 'N/A' }}
            </div>
            <div class="info-item">
              <strong>Build:</strong> {{ appInfo.build || 'N/A' }}
            </div>
            <div class="info-item">
              <strong>App ID:</strong> {{ appInfo.id || 'N/A' }}
            </div>
            <div class="info-item" *ngIf="appState">
              <strong>State:</strong> {{ appState.isActive ? 'Active' : 'Background' }}
            </div>
          </div>
          <button (click)="requestAppInfo()" class="btn btn-secondary" [disabled]="loadingAppInfo">
            {{ loadingAppInfo ? 'Loading...' : 'Refresh App Info' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
    }

    .dashboard-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 800px;
      width: 100%;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }

    .dashboard-title {
      font-size: 2rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }

    .dashboard-subtitle {
      font-size: 1.1rem;
      color: #718096;
      margin-bottom: 2rem;
    }

    .stats-container {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      flex: 1;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
      border-radius: 8px;
      text-align: center;
    }

    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #718096;
    }

    .actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #48bb78;
      color: white;
    }

    .btn-secondary:hover {
      background: #38a169;
    }

    .message-box {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #edf2f7;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }

    .message-box p {
      margin: 0;
      color: #2d3748;
    }

    .app-info-section {
      margin-top: 2rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
      border-radius: 8px;
      border: 1px solid #cbd5e0;
    }

    .section-title {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.3rem;
      color: #2d3748;
    }

    .loading-message {
      padding: 1rem;
      text-align: center;
      color: #667eea;
      font-style: italic;
    }

    .app-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .info-item {
      padding: 0.75rem;
      background: white;
      border-radius: 6px;
      color: #2d3748;
    }

    .info-item strong {
      display: block;
      margin-bottom: 0.25rem;
      color: #667eea;
      font-size: 0.85rem;
      text-transform: uppercase;
    }
  `]
})
export class DashboardComponent implements OnInit {
  counter = 0;
  messageCount = 0;
  lastMessage: string | null = null;
  appInfo: any = null;
  appState: any = null;
  loadingAppInfo = false;

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const handleMessage = (event: any) => {
        if (event.data && event.data.type === 'CROSS_APP_MESSAGE') {
          this.messageCount++;
          this.lastMessage = event.data.message;
          if (isDev) {
            console.log('[App3] Received message:', event.data);
          }
        }
        if (event.data && event.data.type === 'CUSTOM_EVENT' && event.data.eventType === 'counterUpdate') {
          if (isDev) {
            console.log('[App3] Counter update event:', event.data.detail);
          }
        }
        
        // Handle Capacitor results
        if (event.data && event.data.type === 'CAPACITOR_RESULT') {
          if (event.data.requestId === 'app-info') {
            this.appInfo = event.data.data;
            this.loadingAppInfo = false;
            if (isDev) {
              console.log('[App3] App info received:', event.data.data);
            }
          }
          if (event.data.requestId === 'app-state') {
            this.appState = event.data.data;
            if (isDev) {
              console.log('[App3] App state received:', event.data.data);
            }
          }
        }
        
        // Handle Capacitor errors
        if (event.data && event.data.type === 'CAPACITOR_ERROR') {
          if (event.data.requestId === 'app-info' || event.data.requestId === 'app-state') {
            this.loadingAppInfo = false;
            if (isDev) {
              console.error('[App3] App plugin error:', event.data.error);
            }
          }
        }
      };

      const handleCustomEvent = (event: any) => {
        if (event.type === 'counterUpdate' && event.detail && event.detail.source !== 'app3') {
          if (isDev) {
            console.log('[App3] Counter updated via custom event:', event.detail);
          }
        }
      };

      window.addEventListener('message', handleMessage);
      window.addEventListener('counterUpdate', handleCustomEvent);
      
      // Check if we're in an iframe
      const isInIframe = window.parent !== window;
      if (isDev) {
        console.log('[App3] Is in iframe:', isInIframe, 'Parent origin:', window.parent.location?.origin || 'same');
      }
      
      // Request app info on mount (after a short delay to ensure iframe is ready)
      setTimeout(() => {
        this.requestAppInfo();
      }, 500);
    }
  }

  requestAppInfo() {
    this.loadingAppInfo = true;
    
    // Request app info
    if (typeof window !== 'undefined') {
      const appInfoMessage = {
        type: 'CAPACITOR_CALL',
        plugin: 'app',
        method: 'getInfo',
        args: [],
        requestId: 'app-info',
      };
      
      const appStateMessage = {
        type: 'CAPACITOR_CALL',
        plugin: 'app',
        method: 'getState',
        args: [],
        requestId: 'app-state',
      };
      
      // Always try to send to parent window first (if in iframe)
      // If not in iframe, send to same window (but CapacitorBridge won't be there)
      if (window.parent && window.parent !== window) {
        // In iframe - send to parent (Host app)
        window.parent.postMessage(appInfoMessage, '*');
        window.parent.postMessage(appStateMessage, '*');
        if (isDev) {
          console.log('[App3] Sent app info request to parent window (iframe)');
        }
      }
      // Also send to same window (for debugging or if running standalone)
      window.postMessage(appInfoMessage, '*');
      window.postMessage(appStateMessage, '*');
      if (isDev) {
        console.log('[App3] Sent app info request to same window as fallback');
      }
    }
  }

  incrementCounter() {
    this.counter++;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('counterUpdate', {
        detail: { counter: this.counter, source: 'app3' }
      }));
      if (isDev) {
        console.log('[App3] Counter incremented:', this.counter);
      }
    }
  }

  sendMessage() {
    if (typeof window !== 'undefined') {
      window.postMessage({
        type: 'CROSS_APP_MESSAGE',
        message: `Hello from Angular App3! Counter: ${this.counter}`,
        source: 'app3'
      }, '*');
      if (isDev) {
        console.log('[App3] Sent message');
      }
    }
  }
}

