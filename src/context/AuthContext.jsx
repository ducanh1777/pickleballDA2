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
    getRedirectResult
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
        const checkRedirect = async () => {
            console.log("Checking for redirect result...");
            try {
                const result = await getRedirectResult(auth);
                if (result?.user) {
                    console.log("Redirect success, user found:", result.user.email);
                    await saveUserToFirestore(result.user);
                } else {
                    console.log("No redirect result found.");
                }
            } catch (error) {
                console.error("Redirect error details:", error);
                if (error.code === 'auth/credential-already-in-use') {
                    alert('Email này đã được sử dụng với một phương thức đăng nhập khác.');
                }
            }
        };
        checkRedirect();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            console.log("onAuthStateChanged fired. User:", firebaseUser ? firebaseUser.email : "null");
            setLoading(true);
            if (firebaseUser) {
                try {
                    const userRef = doc(db, 'users', firebaseUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists() && userSnap.data().status === 'blocked') {
                        console.warn("User is blocked.");
                        await signOut(auth);
                        setUser(null);
                        alert('Tài khoản của bạn đã bị khóa bởi quản trị viên.');
                    } else {
                        console.log("Syncing user with Firestore...");
                        await saveUserToFirestore(firebaseUser);
                        const updatedSnap = await getDoc(userRef);
                        setUser({
                            ...firebaseUser,
                            ...(updatedSnap.exists() ? updatedSnap.data() : {})
                        });
                        console.log("User state updated successfully.");
                    }
                } catch (error) {
                    console.error('Error during auth sync:', error);
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
            console.log("Auth loading finished.");
        });
        return unsubscribe;
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
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
