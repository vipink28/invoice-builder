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
import { notifyError, notifyPromise } from "./toastutils";

export const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;
    try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);

        if (!snapshot.exists()) {
            await notifyPromise(
                setDoc(userRef, {
                    userId: user.uid,
                    email: user.email || "",
                    displayName: user.displayName || additionalData.displayName || "",
                    role: additionalData.role || "user",
                    createdAt: serverTimestamp(),
                    ...additionalData,
                }),
                {
                    loading: "Creating user profile...",
                    success: "User profile created",
                    error: "Failed to create user profile",
                }
            );
        }
    } catch (err) {
        notifyError(err.message);
    }
};

export const updateUserProfile = async (uid, profileData) => {
    if (!uid || !profileData) return;
    try {
        const userRef = doc(db, "users", uid);
        await notifyPromise(
            updateDoc(userRef, {
                ...profileData,
                updatedAt: serverTimestamp(),
            }),
            {
                loading: "Updating profile...",
                success: "Profile updated",
                error: "Failed to update profile ",
            }
        );
    } catch (err) {
        notifyError(err.message);
    }
};


export const getAllUsers = async () => {
    try {
        const usersRef = collection(db, "users");
        const snap = await getDocs(usersRef);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
        notifyError("Failed to fetch users");
        return [];
    }
};

export const getUserById = async (uid) => {
    if (!uid) return null;
    try {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (err) {
        notifyError("Failed to fetch user");
        return null;
    }
};

export const setUserRole = async (uid, role) => {
    if (!uid) return;
    try {
        const userRef = doc(db, "users", uid);
        await notifyPromise(
            updateDoc(userRef, { role, updatedAt: serverTimestamp() }),
            {
                loading: "Updating role...",
                success: "Role updated ",
                error: "Failed to update role ",
            }
        );
    } catch (err) {
        notifyError(err.message);
    }
};

export const setUserActive = async (uid, isActive) => {
    if (!uid) return;
    try {
        const userRef = doc(db, "users", uid);
        await notifyPromise(
            updateDoc(userRef, { active: isActive, updatedAt: serverTimestamp() }),
            {
                loading: isActive ? "Activating user..." : "Deactivating user...",
                success: isActive ? "User activated " : "User deactivated",
                error: "Failed to update user status",
            }
        );
    } catch (err) {
        notifyError(err.message);
    }
};

export const deleteUserDoc = async (uid) => {
    if (!uid) return;
    try {
        await notifyPromise(deleteDoc(doc(db, "users", uid)), {
            loading: "Deleting user...",
            success: "User deleted",
            error: "Failed to delete user",
        });
    } catch (err) {
        notifyError(err.message);
    }
};


export const getCompaniesForUser = async (uid) => {
    if (!uid) return [];
    try {
        const companiesRef = collection(db, "users", uid, "companies");
        const snap = await getDocs(companiesRef);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
        notifyError("Failed to fetch companies");
        return [];
    }
};

export const getInvoicesForUser = async (uid) => {
    if (!uid) return [];
    try {
        const invoicesRef = collection(db, "users", uid, "invoices");
        const snap = await getDocs(invoicesRef);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
        notifyError("Failed to fetch invoices");
        return [];
    }
};