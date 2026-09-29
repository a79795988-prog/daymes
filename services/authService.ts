import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type FirebaseUser,
} from '@/lib/firebase';

export interface UserSession {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  picture?: string;
  provider: string;
  isFirebase: boolean;
}

const SESSION_KEY = 'daymes_session';

export const AuthService = {
  // Get active session from local cache
  getSession(): UserSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSession(user: UserSession) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Error saving session:', e);
    }
  },

  clearSession() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
  },

  // Firebase Email Sign Up
  async registerWithEmail(fullName: string, email: string, pass: string): Promise<UserSession> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: fullName });
      const session: UserSession = {
        id: cred.user.uid,
        uid: cred.user.uid,
        fullName: fullName,
        email: cred.user.email || email,
        provider: 'firebase-email',
        isFirebase: true,
      };
      this.setSession(session);
      return session;
    }
    throw new Error('Could not create Firebase account');
  },

  // Firebase Email Sign In
  async loginWithEmail(email: string, pass: string): Promise<UserSession> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      const session: UserSession = {
        id: cred.user.uid,
        uid: cred.user.uid,
        fullName: cred.user.displayName || email.split('@')[0],
        email: cred.user.email || email,
        picture: cred.user.photoURL || undefined,
        provider: 'firebase-email',
        isFirebase: true,
      };
      this.setSession(session);
      return session;
    }
    throw new Error('Authentication failed');
  },

  // Firebase Google Sign In
  async loginWithGoogle(): Promise<UserSession> {
    const cred = await signInWithPopup(auth, googleProvider);
    if (cred.user) {
      const session: UserSession = {
        id: cred.user.uid,
        uid: cred.user.uid,
        fullName: cred.user.displayName || 'Google User',
        email: cred.user.email || '',
        picture: cred.user.photoURL || undefined,
        provider: 'google.com',
        isFirebase: true,
      };
      this.setSession(session);
      return session;
    }
    throw new Error('Google sign-in was cancelled');
  },

  // Password Reset
  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {}
    this.clearSession();
  },

  // State Listener
  onAuthState(callback: (user: UserSession | null) => void) {
    return onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const session: UserSession = {
          id: fbUser.uid,
          uid: fbUser.uid,
          fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
          email: fbUser.email || '',
          picture: fbUser.photoURL || undefined,
          provider: fbUser.providerData?.[0]?.providerId || 'firebase',
          isFirebase: true,
        };
        this.setSession(session);
        callback(session);
      } else {
        this.clearSession();
        callback(null);
      }
    });
  },
};
