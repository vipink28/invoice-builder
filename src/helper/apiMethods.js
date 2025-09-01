import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const createUserProfile = async (user) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            photoURL: user.photoURL || "",
            createdAt: new Date(),
        });
    }
};

export const updateUserProfile = async (uid, profileData) => {
    if (!uid || !profileData) return;

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date(),
    });
};