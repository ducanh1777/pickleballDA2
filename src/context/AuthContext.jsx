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
        provider.setCustomParameters({ prompt: 'select_account' });

        try {
            const result = await signInWithPopup(auth, provider);
            await saveUserToFirestore(result.user);
        } catch (error) {
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
                await signInWithRedirect(auth, provider);
            } else {
                console.error("Google Login Error:", error);
                throw error;
            }
        }
    };

    const loginWithFacebook = async () => {
        const provider = new FacebookAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            await saveUserToFirestore(result.user);
        } catch (error) {
            if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
                await signInWithRedirect(auth, provider);
            } else {
                console.error("Facebook Login Error:", error);
                throw error;
            }
        }
    };

    useEffect(() => {
        let isUnsubscribed = false;

        const initializeAuth = async () => {
            setLoading(true);

            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    await saveUserToFirestore(result.user);
                }
            } catch (error) {
                console.error("Auth System: Redirect check error:", error);
            }

            const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
                if (isUnsubscribed) return;

                if (firebaseUser) {
                    setUser(firebaseUser);
                    setLoading(false);

                    try {
                        await saveUserToFirestore(firebaseUser);
                        const userRef = doc(db, 'users', firebaseUser.uid);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()) {
                            if (userSnap.data().status === 'blocked') {
                                await signOut(auth);
                                setUser(null);
                            } else {
                                setUser(prev => ({ ...prev, ...userSnap.data() }));
                            }
                        }
                    } catch (e) {
                        console.error("Sync Error:", e);
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
        loading: loading
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
