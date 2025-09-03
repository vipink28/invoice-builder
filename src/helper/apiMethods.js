import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        await setDoc(userRef, {
            userId: user.uid,
            email: user.email || "",
            displayName: user.displayName || additionalData.displayName || "",
            role: additionalData.role || "user",
            createdAt: serverTimestamp(),
            ...additionalData,
        });
    }
};

export const updateUserProfile = async (uid, profileData) => {
    if (!uid || !profileData) return;
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp(),
    });
};


export const getAllUsers = async () => {
    const usersRef = collection(db, "users");
    const snap = await getDocs(usersRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getUserById = async (uid) => {
    if (!uid) return null;
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

export const setUserRole = async (uid, role) => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { role, updatedAt: serverTimestamp() });
};

export const setUserActive = async (uid, isActive) => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { active: isActive, updatedAt: serverTimestamp() });
};

export const deleteUserDoc = async (uid) => {
    if (!uid) return;
    await deleteDoc(doc(db, "users", uid));
};


export const getCompaniesForUser = async (uid) => {
    if (!uid) return [];
    const companiesRef = collection(db, "users", uid, "companies");
    const snap = await getDocs(companiesRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getInvoicesForUser = async (uid) => {
    if (!uid) return [];
    const invoicesRef = collection(db, "users", uid, "invoices");
    const snap = await getDocs(invoicesRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};