/**
 * DAYMES - Authentication Module with Firebase Auth Integration
 * Handles Firebase Auth (Email/Password, Google Popup, Password Reset, Auth State Listener),
 * Google Identity Services (GIS), and resilient local storage fallback.
 */

// ─── Firebase Auth Error Message Formatter ──────────────────────────────────
function formatFirebaseError(err) {
  if (!err) return 'An unexpected authentication error occurred.';
  const code = err.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please check or sign up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in your Firebase Console.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a moment and try again.';
    default:
      return err.message || 'Authentication error. Please try again.';
  }
}

// ─── Google OAuth 2.0 / Identity Services Configuration ────────────────────
const GOOGLE_AUTH_CONFIG = {
  clientId: window.DAYMES_GOOGLE_CLIENT_ID || '108234918234-yourclientid.apps.googleusercontent.com',
  isConfigured: function() {
    return this.clientId && !this.clientId.includes('yourclientid');
  }
};

// ─── Safari & Private Browsing Safe Storage Helpers ───────────────────────
window._DAYMES_MEM_STORE = window._DAYMES_MEM_STORE || {};

function safeStorageGet(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (e) {
    // Safari Private Browsing quota/security restriction fallback
  }
  return window._DAYMES_MEM_STORE[key] || null;
}

function safeStorageSet(key, val) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
  } catch (e) {
    // Safari Private Browsing fallback
  }
  window._DAYMES_MEM_STORE[key] = val;
}

function safeStorageRemove(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    // Safari Private Browsing fallback
  }
  delete window._DAYMES_MEM_STORE[key];
}

window.safeStorageGet = safeStorageGet;
window.safeStorageSet = safeStorageSet;
window.safeStorageRemove = safeStorageRemove;

// ─── SHA-256 Password Hashing Fallback ────────────────────────────────────
async function hashPassword(password) {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      const msgBuffer = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('DAYMES: Web Crypto SHA-256 unavailable in this context, using compatible hash fallback:', err);
  }
  let h1 = 0xdeadbeef ^ password.length, h2 = 0x41c6ce57 ^ password.length;
  for (let i = 0; i < password.length; i++) {
    const ch = password.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 'safari_hash_' + (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

// ─── Auth Storage Keys ────────────────────────────────────────────────────
const AUTH_USERS_KEY   = 'daymes_users';
const AUTH_SESSION_KEY = 'daymes_session';

// ─── Helpers: Read / Write Session ─────────────────────────────────────────
function getUsers() {
  try {
    const val = safeStorageGet(AUTH_USERS_KEY);
    return val ? JSON.parse(val) : [];
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  try {
    safeStorageSet(AUTH_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.warn('DAYMES: saveUsers error:', e);
  }
}

function getSession() {
  try {
    const val = safeStorageGet(AUTH_SESSION_KEY);
    return val ? JSON.parse(val) : null;
  } catch (e) {
    return null;
  }
}

function saveSession(user) {
  try {
    const { passwordHash: _, ...safeUser } = user;
    safeStorageSet(AUTH_SESSION_KEY, JSON.stringify(safeUser));
  } catch (e) {
    console.warn('DAYMES: saveSession error:', e);
  }
}

function clearSession() {
  safeStorageRemove(AUTH_SESSION_KEY);
}

function isLoggedIn() {
  return getSession() !== null;
}

function getCurrentUser() {
  return getSession();
}

// ─── Firebase Auth Integration API Wrappers ────────────────────────────────

/**
 * Initialize Firebase Auth state listener to synchronize session
 */
function initFirebaseAuthListener() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      const auth = firebase.auth();
      auth.onAuthStateChanged((fbUser) => {
        if (fbUser) {
          console.log('🔥 DAYMES: Firebase Auth state changed -> Logged in:', fbUser.email);
          const userSession = {
            id: fbUser.uid,
            uid: fbUser.uid,
            fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Firebase User',
            email: fbUser.email || '',
            mobile: fbUser.phoneNumber || '',
            picture: fbUser.photoURL || '',
            provider: fbUser.providerData?.[0]?.providerId || 'firebase',
            emailVerified: fbUser.emailVerified,
            isFirebase: true
          };
          saveSession(userSession);
          updateAuthUI();
        } else {
          console.log('🔥 DAYMES: Firebase Auth state changed -> Logged out');
        }
      });
    } catch (e) {
      console.warn('DAYMES: Firebase Auth listener setup error:', e);
    }
  }
}

/**
 * Firebase Register with Email & Password
 */
async function firebaseRegister({ fullName, email, password }) {
  if (typeof firebase !== 'undefined' && firebase.auth && window.DAYMES_FIREBASE?.isConfigured()) {
    try {
      const auth = firebase.auth();
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      if (cred.user) {
        await cred.user.updateProfile({ displayName: fullName });
        const user = {
          id: cred.user.uid,
          uid: cred.user.uid,
          fullName: fullName,
          email: cred.user.email,
          provider: 'firebase-email',
          emailVerified: cred.user.emailVerified,
          isFirebase: true
        };
        saveSession(user);
        return { success: true, user };
      }
    } catch (err) {
      console.warn('DAYMES: Firebase register attempt failed:', err);
      return { success: false, error: formatFirebaseError(err) };
    }
  }
  return null; // Not configured or unavailable
}

/**
 * Firebase Login with Email & Password
 */
async function firebaseLogin({ email, password }) {
  if (typeof firebase !== 'undefined' && firebase.auth && window.DAYMES_FIREBASE?.isConfigured()) {
    try {
      const auth = firebase.auth();
      const cred = await auth.signInWithEmailAndPassword(email, password);
      if (cred.user) {
        const user = {
          id: cred.user.uid,
          uid: cred.user.uid,
          fullName: cred.user.displayName || cred.user.email.split('@')[0],
          email: cred.user.email,
          picture: cred.user.photoURL || '',
          provider: 'firebase-email',
          emailVerified: cred.user.emailVerified,
          isFirebase: true
        };
        saveSession(user);
        return { success: true, user };
      }
    } catch (err) {
      console.warn('DAYMES: Firebase login attempt failed:', err);
      return { success: false, error: formatFirebaseError(err) };
    }
  }
  return null; // Not configured or unavailable
}

/**
 * Firebase Google Sign-In with Popup
 */
async function firebaseGoogleSignIn() {
  if (typeof firebase !== 'undefined' && firebase.auth && window.DAYMES_FIREBASE?.isConfigured()) {
    try {
      const auth = firebase.auth();
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const cred = await auth.signInWithPopup(provider);
      if (cred.user) {
        const user = {
          id: cred.user.uid,
          uid: cred.user.uid,
          fullName: cred.user.displayName || 'Google User',
          email: cred.user.email,
          picture: cred.user.photoURL || '',
          provider: 'google.com',
          emailVerified: cred.user.emailVerified,
          isFirebase: true
        };
        saveSession(user);
        return { success: true, user };
      }
    } catch (err) {
      console.warn('DAYMES: Firebase Google popup login failed:', err);
      return { success: false, error: formatFirebaseError(err) };
    }
  }
  return null;
}

/**
 * Firebase Password Reset Email
 */
async function firebaseResetPassword(email) {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      const auth = firebase.auth();
      await auth.sendPasswordResetEmail(email);
      return { success: true, message: `Password reset link successfully sent to ${email}. Check your inbox!` };
    } catch (err) {
      return { success: false, error: formatFirebaseError(err) };
    }
  }
  // Local fallback simulation
  return { success: true, message: `Simulated password reset email sent to ${email}.` };
}

// ─── JWT Parser for Google ID Tokens ───────────────────────────────────────
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('DAYMES: Failed to parse Google JWT credential', e);
    return null;
  }
}

// ─── Google Identity Services (GIS) Callback & Processing ──────────────────
async function handleGoogleCredentialResponse(response) {
  if (!response || !response.credential) {
    showToast('Google sign-in was cancelled or failed.', 'error');
    return;
  }

  const payload = parseJwt(response.credential);
  if (!payload || !payload.email) {
    showToast('Failed to verify Google account credentials.', 'error');
    return;
  }

  const result = await processGoogleUser({
    googleId: payload.sub,
    fullName: payload.name || payload.given_name || 'Google User',
    email: payload.email,
    picture: payload.picture || '',
    emailVerified: payload.email_verified || true
  });

  if (result.success) {
    closeSignInModal();
    closeSignUpModal();
    updateAuthUI();
    showToast(`Welcome, ${result.user.fullName.split(' ')[0]}! Signed in with Google. 👋`, 'success');

    const redirectTab = document.getElementById('signin-modal')?.dataset?.redirectTab;
    const gateEl = document.getElementById('auth-gate-modal');
    const gatePendingTab = gateEl ? gateEl.dataset.pendingTab : null;
    closeAuthGate();

    const targetTab = redirectTab || gatePendingTab;
    if (targetTab) {
      navigateTo(targetTab);
    }
  } else {
    showToast(result.error || 'Google authentication failed.', 'error');
  }
}

// Process and store Google account profile
async function processGoogleUser({ googleId, fullName, email, picture, emailVerified }) {
  const users = getUsers();
  const emailLower = email.trim().toLowerCase();
  let user = users.find(u => u.email === emailLower);

  if (!user) {
    user = {
      id: 'google-' + (googleId || Date.now()),
      googleId: googleId || '',
      fullName: fullName.trim(),
      email: emailLower,
      mobile: '',
      picture: picture || '',
      provider: 'google',
      emailVerified: emailVerified,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
  } else {
    let modified = false;
    if (!user.googleId && googleId) { user.googleId = googleId; modified = true; }
    if (picture && !user.picture) { user.picture = picture; modified = true; }
    if (user.fullName === 'User' && fullName) { user.fullName = fullName; modified = true; }
    if (modified) saveUsers(users);
  }

  saveSession(user);
  return { success: true, user };
}

// ─── Trigger "Continue with Google" ────────────────────────────────────────
async function continueWithGoogle(source = 'signin') {
  // 1. Try Firebase Google Sign-In Popup first if Firebase is configured
  if (typeof firebase !== 'undefined' && firebase.auth) {
    showToast('Opening Firebase Google Sign-In popup…', 'info');
    const fbResult = await firebaseGoogleSignIn();
    if (fbResult && fbResult.success) {
      closeSignInModal();
      closeSignUpModal();
      updateAuthUI();
      showToast(`Welcome, ${fbResult.user.fullName.split(' ')[0]}! Signed in via Firebase Google. 🔥`, 'success');
      
      const redirectTab = document.getElementById('signin-modal')?.dataset?.redirectTab;
      const gateEl = document.getElementById('auth-gate-modal');
      const gatePendingTab = gateEl ? gateEl.dataset.pendingTab : null;
      closeAuthGate();

      const targetTab = redirectTab || gatePendingTab;
      if (targetTab) navigateTo(targetTab);
      return;
    } else if (fbResult && fbResult.error && !fbResult.error.includes('closed')) {
      showToast(fbResult.error, 'error');
    }
  }

  // 2. If Google Identity Services is available and Client ID is configured
  if (window.google && window.google.accounts && window.google.accounts.id && GOOGLE_AUTH_CONFIG.isConfigured()) {
    try {
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log('GIS prompt status:', notification.getNotDisplayedReason());
        }
      });
      return;
    } catch (err) {
      console.warn('Google Identity Services prompt warning:', err);
    }
  }

  // 3. Fallback: Demo Google account selector
  showGoogleDemoSelector(source);
}

// Demo Google account selection modal
function showGoogleDemoSelector(source) {
  const demoAccounts = [
    {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@gmail.com',
      picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
      googleId: '1092837461928374'
    },
    {
      name: 'Dr. Alex Rivera',
      email: 'alex.rivera.md@gmail.com',
      picture: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80',
      googleId: '1928374610928375'
    }
  ];

  const existing = document.getElementById('google-demo-modal');
  if (existing) existing.remove();

  const modalHtml = `
    <div id="google-demo-modal" class="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div class="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden text-white p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center gap-2.5">
            <svg class="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h3 class="text-sm font-bold">Sign in with Google</h3>
          </div>
          <button onclick="document.getElementById('google-demo-modal').remove()" class="p-1 text-slate-400 hover:text-white rounded-lg">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <p class="text-xs text-slate-400 leading-relaxed">
          Choose a Google Account to continue to <span class="text-white font-bold">DAYMES Healthcare</span>:
        </p>

        <div class="space-y-2">
          ${demoAccounts.map(acc => `
            <button onclick="selectGoogleDemoAccount('${acc.name}', '${acc.email}', '${acc.picture}', '${acc.googleId}')" class="w-full p-3 bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 hover:border-sky-500 rounded-2xl flex items-center gap-3 text-left transition-all group">
              <img src="${acc.picture}" alt="${acc.name}" class="w-10 h-10 rounded-full object-cover border border-slate-600 flex-shrink-0" />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold text-white group-hover:text-sky-300 transition-colors truncate">${acc.name}</p>
                <p class="text-[11px] text-slate-400 truncate">${acc.email}</p>
              </div>
              <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-sky-400 flex-shrink-0"></i>
            </button>
          `).join('')}
        </div>

        <div class="pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center leading-tight">
          🔥 Powered by <span class="text-amber-400 font-bold">Firebase Auth</span>. Customize <code class="text-sky-300 bg-slate-800 px-1 py-0.5 rounded">window.DAYMES_FIREBASE_CONFIG</code> for live Firebase Console link.
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function selectGoogleDemoAccount(name, email, picture, googleId) {
  const modal = document.getElementById('google-demo-modal');
  if (modal) modal.remove();

  const result = await processGoogleUser({
    googleId,
    fullName: name,
    email,
    picture,
    emailVerified: true
  });

  if (result.success) {
    closeSignInModal();
    closeSignUpModal();
    updateAuthUI();
    showToast(`Welcome back, ${result.user.fullName.split(' ')[0]}! Signed in with Google. 👋`, 'success');

    const redirectTab = document.getElementById('signin-modal')?.dataset?.redirectTab;
    const gateEl = document.getElementById('auth-gate-modal');
    const gatePendingTab = gateEl ? gateEl.dataset.pendingTab : null;
    closeAuthGate();

    const targetTab = redirectTab || gatePendingTab;
    if (targetTab) {
      navigateTo(targetTab);
    }
  }
}

function initGoogleIdentity() {
  if (window.google && window.google.accounts && window.google.accounts.id && GOOGLE_AUTH_CONFIG.isConfigured()) {
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_AUTH_CONFIG.clientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
      console.log('DAYMES: Google Identity Services initialized successfully.');
    } catch (e) {
      console.warn('DAYMES: Could not initialize Google Identity Services:', e);
    }
  }
}

// ─── Registration ──────────────────────────────────────────────────────────
async function registerUser({ fullName, email, mobile, password }) {
  // 1. Try Firebase Auth Registration first if configured
  const fbResult = await firebaseRegister({ fullName, email, password });
  if (fbResult) {
    if (fbResult.success) {
      updateAuthUI();
      return fbResult;
    } else if (fbResult.error) {
      return fbResult; // Surface Firebase explicit error (e.g. email already in use)
    }
  }

  // 2. Try Backend API Registration if available
  if (typeof DaymesAPI !== 'undefined' && backendAvailable) {
    try {
      const apiResult = await DaymesAPI.register({ fullName, email, mobile, password });
      if (apiResult && !apiResult.error) {
        if (apiResult.success) {
          saveSession(apiResult.user);
          updateAuthUI();
          return { success: true, user: apiResult.user };
        } else {
          return { success: false, error: apiResult.error || 'Registration failed' };
        }
      }
    } catch (e) { console.warn('[Auth] Backend register failed, using local:', e); }
  }

  // 3. Fallback: Local Storage Account Store
  const users = getUsers();
  const emailLower = email.trim().toLowerCase();

  if (users.find(u => u.email === emailLower)) {
    return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
  }

  const passwordHash = await hashPassword(password);
  const newUser = {
    id: 'usr-' + Date.now(),
    fullName: fullName.trim(),
    email: emailLower,
    mobile: mobile.trim(),
    passwordHash,
    provider: 'local',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);

  return { success: true, user: newUser };
}

// ─── Login ─────────────────────────────────────────────────────────────────
async function loginUser({ email, password }) {
  // 1. Try Firebase Auth Login first if configured
  const fbResult = await firebaseLogin({ email, password });
  if (fbResult) {
    if (fbResult.success) {
      updateAuthUI();
      return fbResult;
    } else if (fbResult.error) {
      return fbResult; // Surface Firebase login error
    }
  }

  // 2. Try Backend API Login
  if (typeof DaymesAPI !== 'undefined' && backendAvailable) {
    try {
      const apiResult = await DaymesAPI.login({ email, password });
      if (apiResult && !apiResult.error) {
        if (apiResult.success) {
          saveSession(apiResult.user);
          updateAuthUI();
          return { success: true, user: apiResult.user };
        } else {
          return { success: false, error: apiResult.error || 'Login failed' };
        }
      }
    } catch (e) { console.warn('[Auth] Backend login failed, using local:', e); }
  }

  // 3. Fallback: Local Storage Account Store
  const users = getUsers();
  const emailLower = email.trim().toLowerCase();
  const user = users.find(u => u.email === emailLower);

  if (!user) {
    return { success: false, error: 'No account found with this email address.' };
  }

  if (user.provider === 'google' && !user.passwordHash) {
    return { success: false, error: 'This account was created with Google. Please use "Continue with Google" to sign in.' };
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { success: false, error: 'Incorrect password. Please try again.' };
  }

  saveSession(user);
  return { success: true, user };
}

// ─── Logout ────────────────────────────────────────────────────────────────
function logoutUser() {
  // Sign out from Firebase if authenticated
  if (typeof firebase !== 'undefined' && firebase.auth) {
    try {
      firebase.auth().signOut().catch(e => console.warn('Firebase signOut error:', e));
    } catch (e) {}
  }

  if (typeof DaymesAPI !== 'undefined') {
    DaymesAPI.logout().catch(() => {});
  }

  clearSession();

  if (window.google && window.google.accounts && window.google.accounts.id) {
    try {
      google.accounts.id.disableAutoSelect();
    } catch (e) {}
  }

  updateAuthUI();
  navigateTo('home');
  showToast('You have been signed out of DAYMES.', 'info');
}

// ─── UI Rendering & State ──────────────────────────────────────────────────
function updateAuthUI() {
  const session = getSession();
  const signInBtn  = document.getElementById('auth-signin-btn');
  const profileMenu = document.getElementById('auth-profile-menu');
  const profileName = document.getElementById('auth-profile-name');
  const profileInitial = document.getElementById('auth-profile-initial');

  const mobileSignIn = document.getElementById('mobile-signin-btn');
  const mobileProfile = document.getElementById('mobile-profile-section');
  const mobileProfileName = document.getElementById('mobile-profile-name');
  const mobileProfileInitial = document.getElementById('mobile-profile-initial');

  if (session) {
    if (signInBtn)  signInBtn.classList.add('hidden');
    if (profileMenu) profileMenu.classList.remove('hidden');
    if (profileName) profileName.textContent = session.fullName.split(' ')[0];

    if (profileInitial) {
      if (session.picture) {
        profileInitial.innerHTML = `<img src="${session.picture}" alt="${session.fullName}" class="w-full h-full rounded-full object-cover" />`;
      } else {
        profileInitial.textContent = session.fullName.charAt(0).toUpperCase();
      }
    }

    const dropdownName  = document.getElementById('profile-dropdown-name');
    const dropdownEmail = document.getElementById('profile-dropdown-email');
    const dropdownBadge = document.getElementById('profile-dropdown-badge');
    
    if (dropdownName)  dropdownName.textContent  = session.fullName;
    if (dropdownEmail) dropdownEmail.textContent = session.email;
    if (dropdownBadge) {
      const providerLabel = session.isFirebase 
        ? (session.provider === 'google.com' ? '🔥 Firebase Google' : '🔥 Firebase Auth')
        : (session.provider === 'google' ? 'Google OAuth' : 'DAYMES Member');
      dropdownBadge.textContent = providerLabel;
    }

    if (mobileSignIn) mobileSignIn.classList.add('hidden');
    if (mobileProfile) mobileProfile.classList.remove('hidden');
    if (mobileProfileName) mobileProfileName.textContent = session.fullName;
    if (mobileProfileInitial) {
      if (session.picture) {
        mobileProfileInitial.innerHTML = `<img src="${session.picture}" alt="${session.fullName}" class="w-full h-full rounded-full object-cover" />`;
      } else {
        mobileProfileInitial.textContent = session.fullName.charAt(0).toUpperCase();
      }
    }
  } else {
    if (signInBtn)  signInBtn.classList.remove('hidden');
    if (profileMenu) profileMenu.classList.add('hidden');

    if (mobileSignIn) mobileSignIn.classList.remove('hidden');
    if (mobileProfile) mobileProfile.classList.add('hidden');
  }
}

// ─── Auth Modal Controllers ─────────────────────────────────────────────────
function openSignInModal(redirectTab = null) {
  document.getElementById('signin-modal')?.classList.remove('hidden');
  document.getElementById('signup-modal')?.classList.add('hidden');
  document.getElementById('reset-password-modal')?.classList.add('hidden');
  
  const errEl = document.getElementById('signin-error');
  if (errEl) errEl.textContent = '';
  document.getElementById('signin-form')?.reset();
  
  if (redirectTab) {
    document.getElementById('signin-modal').dataset.redirectTab = redirectTab;
  } else {
    delete document.getElementById('signin-modal')?.dataset.redirectTab;
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSignInModal() {
  document.getElementById('signin-modal')?.classList.add('hidden');
}

function openSignUpModal() {
  document.getElementById('signup-modal')?.classList.remove('hidden');
  document.getElementById('signin-modal')?.classList.add('hidden');
  document.getElementById('reset-password-modal')?.classList.add('hidden');
  
  const errEl = document.getElementById('signup-error');
  if (errEl) errEl.textContent = '';
  document.getElementById('signup-form')?.reset();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeSignUpModal() {
  document.getElementById('signup-modal')?.classList.add('hidden');
}

function openForgotPasswordModal() {
  document.getElementById('signin-modal')?.classList.add('hidden');
  document.getElementById('signup-modal')?.classList.add('hidden');
  document.getElementById('reset-password-modal')?.classList.remove('hidden');
  
  const msgEl = document.getElementById('reset-password-msg');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.className = 'text-xs font-semibold min-h-[1rem]';
  }
  
  // Pre-fill email from sign-in form if present
  const signinEmail = document.getElementById('signin-email')?.value;
  const resetEmailInput = document.getElementById('reset-password-email');
  if (signinEmail && resetEmailInput) {
    resetEmailInput.value = signinEmail;
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeForgotPasswordModal() {
  document.getElementById('reset-password-modal')?.classList.add('hidden');
}

function switchToSignUp() {
  closeSignInModal();
  openSignUpModal();
}

function switchToSignIn() {
  closeSignUpModal();
  closeForgotPasswordModal();
  openSignInModal();
}

function togglePasswordVisibility(inputId, toggleBtnId) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(toggleBtnId);
  if (!input || !btn) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById('profile-dropdown');
  if (!dropdown) return;
  dropdown.classList.toggle('hidden');
  if (!dropdown.classList.contains('hidden')) {
    updateAuthUI();
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('auth-profile-menu');
  const dropdown = document.getElementById('profile-dropdown');
  if (menu && dropdown && !menu.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// ─── Form Event Listeners ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Firebase Auth listener & Google Identity
  initFirebaseAuthListener();
  initGoogleIdentity();

  // Sign In Submit Handler
  const signinForm = document.getElementById('signin-form');
  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      const errorEl  = document.getElementById('signin-error');
      const submitBtn = document.getElementById('signin-submit-btn');

      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in…';
      errorEl.textContent = '';

      const result = await loginUser({ email, password });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';

      if (result && result.success) {
        closeSignInModal();
        updateAuthUI();
        showToast(`Welcome back, ${result.user.fullName.split(' ')[0]}! 👋`, 'success');

        const redirectTab = document.getElementById('signin-modal').dataset.redirectTab;
        const gateEl = document.getElementById('auth-gate-modal');
        const gatePendingTab = gateEl ? gateEl.dataset.pendingTab : null;
        closeAuthGate();

        const targetTab = redirectTab || gatePendingTab;
        if (targetTab) {
          navigateTo(targetTab);
        }
      } else {
        errorEl.textContent = result?.error || 'Sign in failed. Please try again.';
      }
    });
  }

  // Sign Up Submit Handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName        = document.getElementById('signup-name').value;
      const email           = document.getElementById('signup-email').value;
      const mobile          = document.getElementById('signup-mobile')?.value || '';
      const password        = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password')?.value || password;
      const errorEl         = document.getElementById('signup-error');
      const submitBtn       = document.getElementById('signup-submit-btn');

      errorEl.textContent = '';

      if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match. Please try again.';
        return;
      }
      if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters long.';
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating Account…';

      const result = await registerUser({ fullName, email, mobile, password });

      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';

      if (result && result.success) {
        closeSignUpModal();
        updateAuthUI();
        showToast(`Welcome to DAYMES, ${result.user.fullName.split(' ')[0]}! 🎉`, 'success');
      } else {
        errorEl.textContent = result?.error || 'Registration failed. Please try again.';
      }
    });
  }

  // Forgot Password Submit Handler
  const resetForm = document.getElementById('reset-password-form');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('reset-password-email').value;
      const msgEl = document.getElementById('reset-password-msg');
      const submitBtn = document.getElementById('reset-password-submit-btn');

      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        msgEl.textContent = 'Please enter a valid email address.';
        msgEl.className = 'text-xs font-semibold text-rose-400 min-h-[1rem]';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending reset link…';

      const result = await firebaseResetPassword(email);

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Reset Email';

      if (result.success) {
        msgEl.textContent = result.message;
        msgEl.className = 'text-xs font-semibold text-emerald-400 min-h-[1rem]';
        showToast('Password reset link sent to your email! 📧', 'success');
      } else {
        msgEl.textContent = result.error;
        msgEl.className = 'text-xs font-semibold text-rose-400 min-h-[1rem]';
      }
    });
  }

  // Initial Auth UI Sync
  updateAuthUI();
});
