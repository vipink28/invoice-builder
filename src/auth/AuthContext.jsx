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
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: fullName });
        await createUserProfile({ ...user, displayName: fullName });

        const profile = await fetchUserProfile(user.uid);
        setUser({ uid: user.uid, email: user.email, ...profile });
        return user;
    };

    const signin = async (email, password) => {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const profile = await fetchUserProfile(user.uid);
        setUser({ uid: user.uid, email: user.email, ...profile });
        return user;
    };

    const signinWithGoogle = async () => {
        const { user } = await signInWithPopup(auth, googleProvider);
        await createUserProfile(user);
        const profile = await fetchUserProfile(user.uid);
        setUser({ uid: user.uid, email: user.email, ...profile });
        return user;
    };

    const logout = () => signOut(auth);


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
