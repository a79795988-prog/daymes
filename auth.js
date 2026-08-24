/**
 * DAYMES - Authentication Module
 * Handles Sign Up, Sign In, Session Management, and Logout.
 * Passwords are hashed with SHA-256 before storage. No plain-text storage.
 */

// ─── SHA-256 Password Hashing (Web Crypto API) ─────────────────────────────
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Auth Storage Keys ────────────────────────────────────────────────────
const AUTH_USERS_KEY  = 'daymes_users';
const AUTH_SESSION_KEY = 'daymes_session';

// ─── Helpers: Read / Write ─────────────────────────────────────────────────
function getUsers() {
  return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY)) || null;
}

function saveSession(user) {
  // Strip password hash before saving to session
  const { passwordHash: _, ...safeUser } = user;
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(safeUser));
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function isLoggedIn() {
  return getSession() !== null;
}

function getCurrentUser() {
  return getSession();
}

// ─── Registration ──────────────────────────────────────────────────────────
async function registerUser({ fullName, email, mobile, password }) {
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
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);
  saveSession(newUser);

  return { success: true, user: newUser };
}

// ─── Login ─────────────────────────────────────────────────────────────────
async function loginUser({ email, password }) {
  const users = getUsers();
  const emailLower = email.trim().toLowerCase();
  const user = users.find(u => u.email === emailLower);

  if (!user) {
    return { success: false, error: 'No account found with this email address.' };
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
  clearSession();
  updateAuthUI();
  navigateTo('home');
  showToast('You have been signed out of DAYMES.', 'info');
}

// ─── UI Rendering ──────────────────────────────────────────────────────────
function updateAuthUI() {
  const session = getSession();
  const signInBtn  = document.getElementById('auth-signin-btn');
  const profileMenu = document.getElementById('auth-profile-menu');
  const profileName = document.getElementById('auth-profile-name');
  const profileInitial = document.getElementById('auth-profile-initial');

  // Mobile counterparts
  const mobileSignIn = document.getElementById('mobile-signin-btn');
  const mobileProfile = document.getElementById('mobile-profile-section');
  const mobileProfileName = document.getElementById('mobile-profile-name');

  if (session) {
    // Logged in state
    if (signInBtn)  signInBtn.classList.add('hidden');
    if (profileMenu) profileMenu.classList.remove('hidden');
    if (profileName) profileName.textContent = session.fullName.split(' ')[0];
    if (profileInitial) profileInitial.textContent = session.fullName.charAt(0).toUpperCase();

    if (mobileSignIn) mobileSignIn.classList.add('hidden');
    if (mobileProfile) mobileProfile.classList.remove('hidden');
    if (mobileProfileName) mobileProfileName.textContent = session.fullName;
  } else {
    // Logged out state
    if (signInBtn)  signInBtn.classList.remove('hidden');
    if (profileMenu) profileMenu.classList.add('hidden');

    if (mobileSignIn) mobileSignIn.classList.remove('hidden');
    if (mobileProfile) mobileProfile.classList.add('hidden');
  }
}

// ─── Auth Modal Controllers ─────────────────────────────────────────────────
function openSignInModal(redirectTab = null) {
  document.getElementById('signin-modal').classList.remove('hidden');
  document.getElementById('signup-modal').classList.add('hidden');
  document.getElementById('signin-error').textContent = '';
  document.getElementById('signin-form').reset();
  if (redirectTab) {
    document.getElementById('signin-modal').dataset.redirectTab = redirectTab;
  } else {
    delete document.getElementById('signin-modal').dataset.redirectTab;
  }
}

function closeSignInModal() {
  document.getElementById('signin-modal').classList.add('hidden');
}

function openSignUpModal() {
  document.getElementById('signup-modal').classList.remove('hidden');
  document.getElementById('signin-modal').classList.add('hidden');
  document.getElementById('signup-error').textContent = '';
  document.getElementById('signup-form').reset();
}

function closeSignUpModal() {
  document.getElementById('signup-modal').classList.add('hidden');
}

function switchToSignUp() {
  closeSignInModal();
  openSignUpModal();
}

function switchToSignIn() {
  closeSignUpModal();
  openSignInModal();
}

function togglePasswordVisibility(inputId, toggleBtnId) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(toggleBtnId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = '<i data-lucide="eye-off" class="w-4 h-4"></i>';
  } else {
    input.type = 'password';
    btn.innerHTML = '<i data-lucide="eye" class="w-4 h-4"></i>';
  }
  lucide.createIcons();
}

function toggleProfileDropdown() {
  const dropdown = document.getElementById('profile-dropdown');
  dropdown.classList.toggle('hidden');
}

// Close profile dropdown when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('auth-profile-menu');
  const dropdown = document.getElementById('profile-dropdown');
  if (menu && dropdown && !menu.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// ─── Sign In Form Submit ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
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

      if (result.success) {
        closeSignInModal();
        updateAuthUI();
        showToast(`Welcome back, ${result.user.fullName.split(' ')[0]}! 👋`, 'success');

        // Handle redirect from sign-in modal or auth gate
        const redirectTab = document.getElementById('signin-modal').dataset.redirectTab;
        const gateEl = document.getElementById('auth-gate-modal');
        const gatePendingTab = gateEl ? gateEl.dataset.pendingTab : null;
        closeAuthGate();

        const targetTab = redirectTab || gatePendingTab;
        if (targetTab) {
          navigateTo(targetTab);
        }
      } else {
        errorEl.textContent = result.error;
      }
    });
  }

  // ─── Sign Up Form Submit ────────────────────────────────────────────────
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName        = document.getElementById('signup-name').value;
      const email           = document.getElementById('signup-email').value;
      const mobile          = document.getElementById('signup-mobile').value;
      const password        = document.getElementById('signup-password').value;
      const confirmPassword = document.getElementById('signup-confirm-password').value;
      const errorEl         = document.getElementById('signup-error');
      const submitBtn       = document.getElementById('signup-submit-btn');

      errorEl.textContent = '';

      // Validation
      if (password !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match. Please try again.';
        return;
      }
      if (password.length < 8) {
        errorEl.textContent = 'Password must be at least 8 characters long.';
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

      if (result.success) {
        closeSignUpModal();
        updateAuthUI();
        showToast(`Welcome to DAYMES, ${result.user.fullName.split(' ')[0]}! 🎉`, 'success');
      } else {
        errorEl.textContent = result.error;
      }
    });
  }

  // Initialize auth UI on page load
  updateAuthUI();
});
