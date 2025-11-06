import { Component, OnInit, OnDestroy } from '@angular/core';

const isDev = process.env.NODE_ENV === 'development';

// Constants for Capacitor request IDs
const REQUEST_IDS = {
  APP_INFO: 'app-info',
  APP_STATE: 'app-state',
} as const;

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  counter = 0;
  messageCount = 0;
  lastMessage: string | null = null;
  appInfo: any = null;
  appState: any = null;
  loadingAppInfo = false;
  
  private isInIframe = window.parent !== window;
  private messageHandler?: (event: MessageEvent) => void;

  ngOnInit() {
    this.setupMessageHandling();
    
    if (isDev) {
      console.log('[App3] Is in iframe:', this.isInIframe);
    }
    
    // Request app info on mount (after a short delay to ensure iframe is ready)
    setTimeout(() => {
      this.requestAppInfo();
    }, 500);
  }

  ngOnDestroy() {
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
    }
  }

  private setupMessageHandling() {
    this.messageHandler = (event: MessageEvent) => {
      if (!event.data) return;

      const { type, requestId, data: eventData } = event.data;

      // Handle cross-app messages
      if (type === 'CROSS_APP_MESSAGE') {
        this.messageCount++;
        this.lastMessage = eventData?.message || event.data.message;
        if (isDev) {
          console.log('[App3] Received message:', event.data);
        }
        return;
      }

      // Handle Capacitor results
      if (type === 'CAPACITOR_RESULT') {
        if (requestId === REQUEST_IDS.APP_INFO) {
          this.appInfo = eventData;
          this.loadingAppInfo = false;
          if (isDev) {
            console.log('[App3] App info received:', eventData);
          }
        } else if (requestId === REQUEST_IDS.APP_STATE) {
          this.appState = eventData;
          if (isDev) {
            console.log('[App3] App state received:', eventData);
          }
        }
        return;
      }

      // Handle Capacitor errors
      if (type === 'CAPACITOR_ERROR') {
        if (requestId === REQUEST_IDS.APP_INFO || requestId === REQUEST_IDS.APP_STATE) {
          this.loadingAppInfo = false;
          if (isDev) {
            console.error('[App3] App plugin error:', event.data.error);
          }
        }
      }
    };

    window.addEventListener('message', this.messageHandler);
  }

  requestAppInfo() {
    this.loadingAppInfo = true;
    
    const appInfoMessage = {
      type: 'CAPACITOR_CALL',
      plugin: 'app',
      method: 'getInfo',
      args: [],
      requestId: REQUEST_IDS.APP_INFO,
    };
    
    const appStateMessage = {
      type: 'CAPACITOR_CALL',
      plugin: 'app',
      method: 'getState',
      args: [],
      requestId: REQUEST_IDS.APP_STATE,
    };
    
    // Send to parent if in iframe, otherwise send to same window
    const targetWindow = this.isInIframe ? window.parent : window;
    targetWindow.postMessage(appInfoMessage, '*');
    targetWindow.postMessage(appStateMessage, '*');
    
    if (isDev) {
      console.log('[App3] Sent app info request to', this.isInIframe ? 'parent window (iframe)' : 'same window');
    }
  }

  incrementCounter() {
    this.counter++;
    window.dispatchEvent(new CustomEvent('counterUpdate', {
      detail: { counter: this.counter, source: 'app3' }
    }));
    if (isDev) {
      console.log('[App3] Counter incremented:', this.counter);
    }
  }

  sendMessage() {
    const targetWindow = this.isInIframe ? window.parent : window;
    targetWindow.postMessage({
      type: 'CROSS_APP_MESSAGE',
      message: `Hello from Angular App3! Counter: ${this.counter}`,
      source: 'app3'
    }, '*');
    if (isDev) {
      console.log('[App3] Sent message');
    }
  }
}

