import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "finanzen-sokph",
  appId: "1:528738428971:web:038257708c96b55a7ba26e",
  storageBucket: "finanzen-sokph.firebasestorage.app",
  apiKey: "AIzaSyBWRi4kugmSxp7LMVf81GrzWdUku2fbPVQ",
  authDomain: "finanzen-sokph.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "528738428971"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
