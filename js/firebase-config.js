/**
 * DAYMES - Firebase Authentication Configuration & Helper Module
 * 
 * Provides initialization, configuration, and helpers for Firebase Auth.
 * To connect your own Firebase Project:
 * 1. Go to Firebase Console (https://console.firebase.google.com)
 * 2. Create or select a Web Project.
 * 3. Replace the configuration object below or set `window.DAYMES_FIREBASE_CONFIG` before loading.
 */

window.DAYMES_FIREBASE_CONFIG = window.DAYMES_FIREBASE_CONFIG || {
  apiKey: "AIzaSyB_vtXDWTTRRzNUB2Fwvd2IpEyH6h51XGg",
  authDomain: "daymes-medicare.firebaseapp.com",
  projectId: "daymes-medicare",
  storageBucket: "daymes-medicare.firebasestorage.app",
  messagingSenderId: "394995227787",
  appId: "1:394995227787:web:33030fa930a6d023d1488e",
  measurementId: "G-1S8QCRJ9KK"
};

// Global reference for Firebase App & Auth instance
window.DAYMES_FIREBASE = {
  app: null,
  auth: null,
  isInitialized: false,
  isConfigured: function() {
    const cfg = window.DAYMES_FIREBASE_CONFIG;
    return !!(cfg && cfg.apiKey && !cfg.apiKey.includes('DemoKey'));
  }
};

/**
 * Initialize Firebase Application & Authentication Service
 */
function initFirebaseApp() {
  if (typeof firebase === 'undefined') {
    console.info('DAYMES: Firebase SDK script tag not loaded or unavailable.');
    return false;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      window.DAYMES_FIREBASE.app = firebase.initializeApp(window.DAYMES_FIREBASE_CONFIG);
    } else {
      window.DAYMES_FIREBASE.app = firebase.app();
    }
    
    window.DAYMES_FIREBASE.auth = firebase.auth();
    window.DAYMES_FIREBASE.isInitialized = true;
    console.log('🔥 DAYMES: Firebase Authentication SDK initialized successfully.');
    return true;
  } catch (err) {
    console.warn('DAYMES: Firebase Auth initialization notice:', err.message);
    return false;
  }
}

// Auto-initialize on load if Firebase SDK is present
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFirebaseApp);
} else {
  initFirebaseApp();
}
