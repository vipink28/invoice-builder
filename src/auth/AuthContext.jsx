import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, googleProvider } from "../firebaseConfig";
import { createUserProfile } from "../helper/apiMethods";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const profile = await fetchUserProfile(currentUser.uid);
                try {
                    await updateDoc(doc(db, "users", currentUser.uid), {
                        lastLogin: serverTimestamp()
                    });
                } catch (err) {

                }
                setUser({
                    uid: currentUser.uid,
                    email: currentUser.email,
                    ...profile,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signup = async (email, password, fullName) => {
        try {
            const promise = createUserWithEmailAndPassword(auth, email, password)
                .then(async ({ user }) => {
                    await updateProfile(user, { displayName: fullName });
                    await createUserProfile({ ...user, displayName: fullName });
                    const profile = await fetchUserProfile(user.uid);
                    setUser({ uid: user.uid, email: user.email, ...profile });
                    return user;
                });

            return await notifyPromise(promise, {
                loading: "Creating account...",
                success: "Account created successfully",
                error: "Signup failed",
            });
        } catch (err) {
            notifyError(err.message);
        }
    };

    const signin = async (email, password) => {
        try {
            const promise = signInWithEmailAndPassword(auth, email, password).then(
                async ({ user }) => {
                    const profile = await fetchUserProfile(user.uid);
                    setUser({ uid: user.uid, email: user.email, ...profile });
                    return user;
                }
            );

            return await notifyPromise(promise, {
                loading: "Signing in...",
                success: "Signed in successfully",
                error: "Login failed",
            });
        } catch (err) {
            notifyError(err.message);
        }
    };

    const signinWithGoogle = async () => {
        try {
            const promise = signInWithPopup(auth, googleProvider).then(async ({ user }) => {
                await createUserProfile(user);
                const profile = await fetchUserProfile(user.uid);
                setUser({ uid: user.uid, email: user.email, ...profile });
                return user;
            });

            return await notifyPromise(promise, {
                loading: "Signing in with Google...",
                success: "Welcome back",
                error: "Google login failed",
            });
        } catch (err) {
            notifyError(err.message);
        }
    };

    const logout = async () => {
        try {
            await notifyPromise(signOut(auth), {
                loading: "Logging out...",
                success: "Logged out successfully",
                error: "Logout failed",
            });
        } catch (err) {
            notifyError(err.message);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, signup, signin, signinWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
export const useAuth = () => useContext(AuthContext);
