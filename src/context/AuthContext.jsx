import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult,
    setPersistence,
    browserLocalPersistence
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, db } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function register(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    const saveUserToFirestore = async (user) => {
        if (!user) return;
        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    role: user.email === 'admin@pickleball.com' ? 'admin' : 'user',
                    status: 'active',
                    createdAt: serverTimestamp()
                });
                addLog("New user registered in Firestore");
            }
        } catch (error) {
            console.error('Error saving user to Firestore:', error);
            addLog("Firestore Sync Error: " + error.code);
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        try {
            if (isMobile) {
                addLog("Initiating Google Redirect...");
                await signInWithRedirect(auth, provider);
            } else {
                const result = await signInWithPopup(auth, provider);
                await saveUserToFirestore(result.user);
            }
        } catch (error) {
            addLog("Google Auth Error: " + error.code);
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const loginWithFacebook = async () => {
        const provider = new FacebookAuthProvider();
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        try {
            if (isMobile) {
                addLog("Initiating FB Redirect...");
                await signInWithRedirect(auth, provider);
            } else {
                const result = await signInWithPopup(auth, provider);
                await saveUserToFirestore(result.user);
            }
        } catch (error) {
            addLog("FB Auth Error: " + error.code);
            console.error("Facebook Login Error:", error);
            throw error;
        }
    };

    useEffect(() => {
        let isUnsubscribed = false;

        const initializeAuth = async () => {
            addLog("System Init...");
            setLoading(true);

            try {
                await setPersistence(auth, browserLocalPersistence);
                addLog("Checking Redirect Result...");
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    addLog("Redirect Success: " + result.user.email);
                    await saveUserToFirestore(result.user);
                } else {
                    addLog("No Redirect data found.");
                }
            } catch (error) {
                addLog("Redirect Check Error: " + error.code);
                console.error("Auth System: Redirect check error:", error);
            }

            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (isUnsubscribed) return;

                addLog("Auth State: " + (firebaseUser ? firebaseUser.email : "Logged Out"));

                if (firebaseUser) {
                    setUser(firebaseUser);
                    setLoading(false);

                    try {
                        await saveUserToFirestore(firebaseUser);
                        const userRef = doc(db, 'users', firebaseUser.uid);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            if (userSnap.data().status === 'blocked') {
                                addLog("User Blocked!");
                                await signOut(auth);
                                setUser(null);
                            } else {
                                setUser(prev => ({ ...prev, ...userSnap.data() }));
                            }
                        }
                    } catch (e) {
                        addLog("Sync Error: " + e.code);
                    }
                } else {
                    setUser(null);
                    setLoading(false);
                }
            });

            return unsubscribe;
        };

        const authPromise = initializeAuth();

        return () => {
            isUnsubscribed = true;
            authPromise.then(unsubscribe => {
                if (typeof unsubscribe === 'function') unsubscribe();
            });
        };
    }, []);

    const value = {
        user,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
        isAdmin: user?.role === 'admin' || user?.email === 'admin@pickleball.com',
        loading: loading,
        logs: logs,
        refreshRedirect: async () => {
            addLog("Manual Redirect Check...");
            setLoading(true);
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    addLog("Manual Success: " + result.user.email);
                    await saveUserToFirestore(result.user);
                } else {
                    addLog("Manual: No Result.");
                    alert('Không tìm thấy thông tin đăng nhập. Hãy thử đăng nhập lại.');
                }
            } catch (e) {
                addLog("Manual Error: " + e.code);
                alert('Lỗi: ' + e.message);
            }
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
