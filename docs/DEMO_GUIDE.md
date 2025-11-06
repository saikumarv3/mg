# Demo Guide - Micro-Frontend Application

This guide walks you through the features and capabilities of the micro-frontend application.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Running All Apps
```bash
npm run dev
```

This starts:
- **Host App**: http://localhost:3000
- **App1 (Welcome)**: http://localhost:3001
- **App2 (Home)**: http://localhost:3002
- **App3 (Dashboard - Angular)**: http://localhost:3003

## 📱 Features

### 1. Navigation Between Apps
- Navigate seamlessly between React apps (App1, App2) and Angular app (App3)
- All navigation happens within the host app (port 3000)
- URL routing handled by React Router

### 2. Cross-App Communication

#### Message Passing
- **Send Messages**: Click "Send Message" button in any app
- **Receive Messages**: Messages appear in all other apps
- Uses `window.postMessage` API

#### Counter Updates
- **Increment Counter**: Click "Increment Counter" in App2 or App3
- **Shared State**: Counter updates propagate to other apps via CustomEvents
- Real-time synchronization across all apps

### 3. Module Federation
- **Dynamic Loading**: Apps load on-demand when navigating
- **Shared Dependencies**: React, React-DOM, React Router shared between React apps
- **Independent Deployment**: Each app can be deployed separately

### 4. Multi-Framework Support
- **React Apps**: App1 and App2 built with React
- **Angular App**: App3 built with Angular
- **Integration**: Angular app loaded via iframe with message bridge

## 🎯 Demo Scenarios

### Scenario 1: Basic Navigation
1. Start at Welcome page (App1)
2. Click "Go to Home (App2)"
3. Click "Go to Dashboard (App3)"
4. Navigate back using the nav bar

**Expected Result**: Smooth navigation between all three apps

### Scenario 2: Cross-App Messaging
1. Go to Welcome page (App1)
2. Click "Send Message"
3. Navigate to Home page (App2)
4. Check "Last Message" section

**Expected Result**: Message count increments, last message appears

### Scenario 3: Counter Synchronization
1. Go to Home page (App2)
2. Click "Increment Counter" 3 times
3. Navigate to Dashboard (App3)
4. Check counter value

**Expected Result**: Counter updates visible across apps

### Scenario 4: Angular Integration
1. Navigate to Dashboard (App3)
2. Verify Angular app loads in iframe
3. Send message from Angular app
4. Check other React apps receive it

**Expected Result**: Angular app communicates with React apps

## 🔧 Technical Details

### Architecture
- **Host App**: Container app using React Router
- **Remote Apps**: Exposed via Module Federation
- **Communication**: window.postMessage + CustomEvents
- **Angular Integration**: iframe with message bridge

### Message Flow
```
App1 → window.postMessage → Host → AngularWrapper → iframe → App3
App3 → iframe → AngularWrapper → window.postMessage → Host → App1/App2
```

### Event Flow
```
App2 → CustomEvent('counterUpdate') → Window → App1/App3 Listeners
```

## 🐛 Troubleshooting

### Issue: Apps not loading
- **Solution**: Ensure all apps are running (`npm run dev`)
- **Check**: Open browser console for errors

### Issue: Messages not appearing
- **Solution**: Check browser console for message logs
- **Verify**: All apps listening on `message` event

### Issue: Angular app not loading
- **Solution**: Ensure App3 is running on port 3003
- **Check**: AngularWrapper console logs

### Issue: Counter not updating
- **Solution**: Verify CustomEvent listeners are active
- **Check**: Event dispatch in browser console

## 📊 Performance Tips

1. **Lazy Loading**: Apps load on-demand (lazy React.lazy)
2. **Shared Dependencies**: Reduces bundle size
3. **Caching**: Module Federation caches remoteEntry.js

## 🎨 UI Features

- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Spinner shown during app loading
- **Error Handling**: Error messages for failed loads
- **Styling**: Consistent design across all apps

## 🔐 Security Notes

- **CORS**: Enabled for development (localhost)
- **postMessage**: Uses '*' origin (restrict in production)
- **iframe sandbox**: Configured for Angular app

## 📝 Next Steps

1. **Production Build**: Run `npm run build`
2. **Mobile Build**: Run `npm run build:mobile`
3. **Deployment**: Deploy each app separately
4. **Monitoring**: Add error tracking and analytics

## 🎓 Learning Points

- Module Federation setup
- Cross-app communication patterns
- Multi-framework integration
- Dynamic loading strategies
- Shared dependency management

