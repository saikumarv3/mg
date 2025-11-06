import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { App } from '@capacitor/app';

const isDev = process.env.NODE_ENV === 'development';

class CapacitorBridge {
  constructor() {
    this.setupListeners();
    if (isDev) {
      console.log('[CapacitorBridge] Initialized');
    }
  }

  setupListeners() {
    window.addEventListener('message', (event) => {
      // Only process messages from same origin or trusted sources
      if (event.data && event.data.type === 'CAPACITOR_CALL') {
        if (isDev) {
          console.log('[CapacitorBridge] Received CAPACITOR_CALL:', event.data, 'from:', event.source === window ? 'same window' : 'iframe/other');
        }
        this.handleCapacitorCall(event.data, event.source);
      }
    });
  }

  async handleCapacitorCall(data, source) {
    const { plugin, method, args = [], requestId } = data;
    
    if (isDev) {
      console.log('[CapacitorBridge] Received call:', { plugin, method, args });
    }

    try {
      let result;
      
      switch (plugin) {
        case 'device':
          result = await this.callDevicePlugin(method, args);
          break;
        case 'haptics':
          result = await this.callHapticsPlugin(method, args);
          break;
        case 'app':
          result = await this.callAppPlugin(method, args);
          break;
        default:
          throw new Error(`Unknown plugin: ${plugin}`);
      }

      this.sendResult(result, requestId);
    } catch (error) {
      if (isDev) {
        console.error('[CapacitorBridge] Error:', error);
      }
      this.sendError(error, requestId);
    }
  }

  async callDevicePlugin(method, args) {
    switch (method) {
      case 'getInfo':
        const info = await Device.getInfo();
        return {
          platform: info.platform,
          osVersion: info.osVersion,
          model: info.model,
          manufacturer: info.manufacturer,
          isVirtual: info.isVirtual,
          memTotal: info.memTotal,
        };
      default:
        throw new Error(`Unknown device method: ${method}`);
    }
  }

  async callHapticsPlugin(method, args) {
    switch (method) {
      case 'impact':
        const style = args[0]?.style || 'MEDIUM';
        const impactStyleMap = {
          'LIGHT': ImpactStyle.Light,
          'MEDIUM': ImpactStyle.Medium,
          'HEAVY': ImpactStyle.Heavy,
        };
        await Haptics.impact({ style: impactStyleMap[style] || ImpactStyle.Medium });
        return { success: true, style };
      case 'notification':
        const type = args[0]?.type || 'SUCCESS';
        const notificationTypeMap = {
          'SUCCESS': NotificationType.Success,
          'WARNING': NotificationType.Warning,
          'ERROR': NotificationType.Error,
        };
        await Haptics.notification({ type: notificationTypeMap[type] || NotificationType.Success });
        return { success: true, type };
      case 'vibrate':
        const duration = args[0]?.duration || 200;
        await Haptics.vibrate({ duration });
        return { success: true, duration };
      default:
        throw new Error(`Unknown haptics method: ${method}`);
    }
  }

  async callAppPlugin(method, args) {
    try {
      switch (method) {
        case 'getInfo':
          const info = await App.getInfo();
          return {
            id: info.id || 'com.microfrontend.app',
            name: info.name || 'MicroFrontend App',
            version: info.version || '1.0.0',
            build: info.build || '1',
          };
        case 'getState':
          const state = await App.getState();
          return {
            isActive: state.isActive !== undefined ? state.isActive : true,
          };
        default:
          throw new Error(`Unknown app method: ${method}`);
      }
    } catch (error) {
      // Fallback for web browser
      if (method === 'getInfo') {
        return {
          id: 'com.microfrontend.app',
          name: 'MicroFrontend App',
          version: '1.0.0',
          build: '1',
        };
      }
      if (method === 'getState') {
        return {
          isActive: document.hasFocus ? document.hasFocus() : true,
        };
      }
      throw error;
    }
  }

  sendResult(data, requestId) {
    const message = {
      type: 'CAPACITOR_RESULT',
      data,
      requestId,
    };
    
    // Broadcast to all windows (for iframe and parent)
    window.postMessage(message, '*');
    
    if (isDev) {
      console.log('[CapacitorBridge] Sent result:', data);
    }
  }

  sendError(error, requestId) {
    const message = {
      type: 'CAPACITOR_ERROR',
      error: {
        message: error.message,
        stack: error.stack,
      },
      requestId,
    };
    
    window.postMessage(message, '*');
    
    if (isDev) {
      console.error('[CapacitorBridge] Sent error:', error);
    }
  }
}

// Initialize bridge
const capacitorBridge = new CapacitorBridge();

export default capacitorBridge;

