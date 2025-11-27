import { endOfMonth, startOfMonth } from "date-fns";
import {
    collection,
    collectionGroup,
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
    debugger
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

export const getCompanyByIdForUser = async (uid, companyId) => {
    if (!uid) return null;
    try {
        const companyRef = doc(db, "users", uid, "companies", companyId);
        const snapshot = await getDoc(companyRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    } catch (err) {
        notifyError("Failed to fetch company");
        return null;
    }
};


export const updateCompanyByIdForUser = async (uid, companyId, updatedData) => {
    if (!uid) return;
    try {
        const companyRef = doc(db, "users", uid, "companies", companyId);
        await notifyPromise(updateDoc(companyRef, updatedData), {
            loading: "Updating company...",
            success: "Company updated",
            error: "Failed to update company",
        });
    } catch (err) {
        notifyError(err.message);
    }
};


export const deleteCompanyForUser = async (uid, companyId) => {
    if (!uid) return;
    try {
        const companyRef = doc(db, "users", uid, "companies", companyId);
        await notifyPromise(deleteDoc(companyRef), {
            loading: "Deleting company...",
            success: "Company deleted",
            error: "Failed to delete company",
        });
    } catch (err) {
        notifyError(err.message);
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

export const updateInvoiceById = async (uid, invoiceId, updatedData) => {
    if (!uid) return;
    try {
        const invoiceRef = doc(db, "users", uid, "invoices", invoiceId);
        debugger
        await notifyPromise(updateDoc(invoiceRef, updatedData), {
            loading: "Updating invoice...",
            success: "Invoice updated",
            error: "Failed to update invoice",
        });
    } catch (err) {
        notifyError(err.message);
    }
};

export const deleteInvoice = async (uid, invoiceId) => {
    if (!uid) return;
    try {
        await notifyPromise(
            deleteDoc(doc(db, "users", uid, "invoices", invoiceId)),
            {
                loading: "Deleting invoice...",
                success: "Invoice deleted",
                error: "Failed to delete invoice",
            }
        );
    } catch (err) {
        notifyError(err.message);
    }
};


export const getDashboardStats = async () => {
    // users
    const usersSnap = await getDocs(collection(db, "users"));
    const totalUsers = usersSnap.size;

    // all invoices (collectionGroup)
    const invoicesSnap = await getDocs(collectionGroup(db, "invoices"));
    const invoices = invoicesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const totalInvoices = invoices.length;

    // all companies
    const companiesSnap = await getDocs(collectionGroup(db, "companies"));
    const totalCompanies = companiesSnap.size;

    // compute totals and breakdowns
    let totalRevenue = 0;
    let invoicesThisMonth = 0;
    let revenueThisMonth = 0;
    let overdueCount = 0;
    let paid = 0, partially = 0, unpaid = 0;

    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    // helper to parse possible stored date types (Firestore Timestamp or ISO/string)
    const asDate = (val) => {
        if (!val) return null;
        if (val.toDate) return val.toDate();
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
    };

    // top clients aggregator: by recipient.companyname
    const clientMap = new Map();

    for (const inv of invoices) {
        const g = Number(inv?.invoicesummary?.grandtotal || 0);
        totalRevenue += g;

        const issued = asDate(inv?.invoiceheader?.issuedate);
        const due = asDate(inv?.invoiceheader?.duedate);

        // this month check: issued date inside current month OR createdAt inside month
        const issuedDate = issued || asDate(inv?.createdAt);
        if (issuedDate && issuedDate >= start && issuedDate <= end) {
            invoicesThisMonth++;
            revenueThisMonth += g;
        }

        // status
        if (inv.ispaid || inv.isPaid) paid++;
        else if (inv.partiallypaid || inv.partialyPaid) partially++;
        else unpaid++;

        if (due && due < now && !(inv.ispaid || inv.isPaid)) overdueCount++;

        // top clients
        const name = inv?.recipient?.companyname || "Unknown";
        const entry = clientMap.get(name) || { count: 0, revenue: 0 };
        entry.count += 1;
        entry.revenue += g;
        clientMap.set(name, entry);
    }

    // top clients array sorted by revenue
    const topClients = Array.from(clientMap.entries())
        .map(([companyname, { count, revenue }]) => ({ companyname, count, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6);

    // recent invoices (sort by createdAt or issued date)
    const recentInvoices = invoices
        .map(inv => ({ ...inv, createdAtDate: asDate(inv.createdAt) || asDate(inv.invoiceheader?.issuedate) }))
        .sort((a, b) => (b.createdAtDate?.getTime() || 0) - (a.createdAtDate?.getTime() || 0))
        .slice(0, 10);

    return {
        totalUsers,
        totalInvoices,
        totalCompanies,
        totalRevenue,
        invoicesThisMonth,
        revenueThisMonth,
        overdueCount,
        paid,
        partially,
        unpaid,
        topClients,
        recentInvoices
    };
};