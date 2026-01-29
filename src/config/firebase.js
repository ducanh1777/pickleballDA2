// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAI9UUcEupQWdhaJP2ikdhUf5KGawaQwO0",
    authDomain: "pickleballda-d560f.firebaseapp.com",
    projectId: "pickleballda-d560f",
    storageBucket: "pickleballda-d560f.firebasestorage.app",
    messagingSenderId: "611939762394",
    appId: "1:611939762394:web:ac05d5372cd69161fee5e3",
    measurementId: "G-G2YWL8NQQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { app, analytics, db, auth, googleProvider, facebookProvider };
