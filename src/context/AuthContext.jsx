import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup
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

    function loginWithGoogle() {
        return signInWithPopup(auth, googleProvider);
    }

    function loginWithFacebook() {
        return signInWithPopup(auth, facebookProvider);
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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true); // Ensure loading is true while we verify the user
            if (currentUser) {
                try {
                    // Check if user is blocked in Firestore
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists() && userSnap.data().status === 'blocked') {
                        await signOut(auth);
                        setUser(null);
                        alert('Tài khoản của bạn đã bị khóa bởi quản trị viên.');
                    } else {
                        // Success - user is not blocked
                        setUser(currentUser);
                        // Record login/sign-up
                        const syncRef = doc(db, 'users', currentUser.uid);
                        const syncSnap = await getDoc(syncRef);
                        if (!syncSnap.exists()) {
                            await setDoc(syncRef, {
                                uid: currentUser.uid,
                                email: currentUser.email,
                                displayName: currentUser.displayName || '',
                                photoURL: currentUser.photoURL || '',
                                role: currentUser.email === 'admin@pickleball.com' ? 'admin' : 'user',
                                status: 'active',
                                createdAt: serverTimestamp()
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error during auth sync:', error);
                    setUser(currentUser); // Fallback to allow login if Firestore fails
                }
            } else {
                setUser(null);
            }
            setLoading(false);
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
        isAdmin: user?.email === 'admin@pickleball.com' // Simple admin check for now
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
