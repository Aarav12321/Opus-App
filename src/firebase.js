import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword, sendEmailVerification,  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

// Firebase config is read from environment variables.
// Copy .env.example to .env and fill in your Firebase project's values
// (Firebase console > Project settings > General > Your apps > Web app).
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// True only once all required config values are present.
export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.storageBucket &&
  firebaseConfig.messagingSenderId &&
  firebaseConfig.appId
);

let app = null;
let auth = null;
let db = null;
let googleProvider = null;
let appleProvider = null;

if (firebaseEnabled) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  appleProvider = new OAuthProvider('apple.com');
  appleProvider.addScope('email');
  appleProvider.addScope('name');
}

export {
  auth,
  db,
  googleProvider,
  appleProvider,
  createUserWithEmailAndPassword, sendEmailVerification,  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  onAuthStateChanged,
  getFirestore,
  doc,
  getDoc,
  setDoc
};
