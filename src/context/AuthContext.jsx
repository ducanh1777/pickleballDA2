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
            }
        } catch (error) {
            console.error('Error saving user to Firestore:', error);
        }
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        try {
            if (isMobile) {
                await signInWithRedirect(auth, provider);
            } else {
                const result = await signInWithPopup(auth, provider);
                await saveUserToFirestore(result.user);
            }
        } catch (error) {
            console.error("Google Login Error:", error);
            throw error;
        }
    };

    const loginWithFacebook = async () => {
        const provider = new FacebookAuthProvider();
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        try {
            if (isMobile) {
                await signInWithRedirect(auth, provider);
            } else {
                const result = await signInWithPopup(auth, provider);
                await saveUserToFirestore(result.user);
            }
        } catch (error) {
            console.error("Facebook Login Error:", error);
            throw error;
        }
    };

    useEffect(() => {
        let isUnsubscribed = false;

        const initializeAuth = async () => {
            console.log("Auth System: Initializing...");
            setLoading(true);

            try {
                // Ensure persistence is set to local
                await setPersistence(auth, browserLocalPersistence);

                // Check for redirect result BEFORE setting up the listener
                console.log("Auth System: Checking redirect...");
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    console.log("Auth System: Redirect result found for", result.user.email);
                    await saveUserToFirestore(result.user);
                }
            } catch (error) {
                console.error("Auth System: Redirect check error:", error);
            }

            // Setup the auth state listener
            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (isUnsubscribed) return;

                console.log("Auth System: State changed ->", firebaseUser ? firebaseUser.email : "null");

                if (firebaseUser) {
                    // 1. Set basic user IMMEDIATELY so app can proceed
                    setUser(firebaseUser);
                    setLoading(false);
                    console.log("Auth System: User set basics, loading=false");

                    // 2. Background sync metadata
                    try {
                        await saveUserToFirestore(firebaseUser);
                        const userRef = doc(db, 'users', firebaseUser.uid);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            if (userSnap.data().status === 'blocked') {
                                await signOut(auth);
                                setUser(null);
                                alert('Tài khoản bị khóa.');
                            } else {
                                setUser(prev => ({ ...prev, ...userSnap.data() }));
                            }
                        }
                    } catch (e) {
                        console.error('Auth System: Background sync failed:', e);
                    }
                } else {
                    setUser(null);
                    setLoading(false);
                    console.log("Auth System: Settled (User null)");
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
        refreshRedirect: async () => {
            setLoading(true);
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    await saveUserToFirestore(result.user);
                } else {
                    alert('Không tìm thấy thông tin đăng nhập từ Google. Vui lòng thử lại.');
                }
            } catch (e) {
                alert('Lỗi kiểm tra: ' + e.message);
            }
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
