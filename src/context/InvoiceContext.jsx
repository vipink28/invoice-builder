import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { db } from "../firebaseConfig";

const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);

    const invoiceInit = {
        invoiceheader: {
            logo: "",
            invoicetype: "Invoice",
            invoicenumber: "0001",
            issuedate: today.toISOString().split("T")[0],
            duedate: future.toISOString().split("T")[0],
        },
        sender: {
            companyname: "",
            taxnumber: "",
            firstname: "",
            lastname: "",
            addressline1: "",
            addressline2: "",
            postalcode: "",
            city: "",
            state: "",
            country: "",
            phone: "",
            email: "",
            companyType: ""
        },
        recipient: {
            companyname: "",
            taxnumber: "",
            firstname: "",
            lastname: "",
            addressline1: "",
            addressline2: "",
            postalcode: "",
            city: "",
            state: "",
            country: "",
            phone: "",
            email: "",
            companyType: ""
        },
        itemslist: [{
            id: 0,
            name: "",
            quantity: "",
            unitprice: "",
            taxname: "",
            tax: 0,
            taxamount: 0,
            subtotal: "",
            description: "",
            saved: false
        }],
        invoicesummary: {
            subtotal: 0,
            totaltax: 0,
            grandtotal: 0,
        },
        notes: "",
        ispaid: false,
        partiallypaid: false,
        amountpaid: 0
    }

    const [invoice, setInvoice] = useState(invoiceInit);

    const updateInvoice = (prop, value) => {
        setInvoice((prev) => ({
            ...prev,
            [prop]: value
        }))
    }


    const saveCompanyIfNew = async (company, user) => {
        if (!user || !company?.companyname) return;

        const companiesRef = collection(doc(db, "users", user.uid), "companies");


        const q = query(
            companiesRef,
            where("companyname", "==", company.companyname),
            where("taxnumber", "==", company.taxnumber)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            await addDoc(companiesRef, {
                ...company,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }
    };


    const getInvoices = async (user) => {
        if (!user) return [];
        const invoicesRef = collection(db, "users", user.uid, "invoices");
        const snapshot = await getDocs(invoicesRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };


    const getInvoiceById = async (user, invoiceId) => {
        if (!user) return null;
        const invoiceRef = doc(db, "users", user.uid, "invoices", invoiceId);
        const snapshot = await getDoc(invoiceRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    };


    const updateInvoiceById = async (user, invoiceId, updatedData) => {
        if (!user) return;
        const invoiceRef = doc(db, "users", user.uid, "invoices", invoiceId);
        await updateDoc(invoiceRef, updatedData);
    };


    const deleteInvoice = async (user, invoiceId) => {
        if (!user) return;
        const invoiceRef = doc(db, "users", user.uid, "invoices", invoiceId);
        await deleteDoc(invoiceRef);
    };



    const getCompanies = async (user) => {
        if (!user) return [];
        const companiesRef = collection(db, "users", user.uid, "companies");
        const snapshot = await getDocs(companiesRef);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };


    const getCompanyById = async (user, companyId) => {
        if (!user) return null;
        const companyRef = doc(db, "users", user.uid, "companies", companyId);
        const snapshot = await getDoc(companyRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    };


    const updateCompanyById = async (user, companyId, updatedData) => {
        if (!user) return;
        const companyRef = doc(db, "users", user.uid, "companies", companyId);
        await updateDoc(companyRef, updatedData);
    };


    const deleteCompany = async (user, companyId) => {
        if (!user) return;
        const companyRef = doc(db, "users", user.uid, "companies", companyId);
        await deleteDoc(companyRef);
    };

    const saveInvoice = async (invoice, user) => {
        if (!user) return;

        const invoicesRef = collection(doc(db, "users", user.uid), "invoices");

        await addDoc(invoicesRef, {
            ...invoice,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        await saveCompanyIfNew(invoice.sender, user);
        await saveCompanyIfNew(invoice.recipient, user);
    };


    return (
        <InvoiceContext.Provider value={{
            updateInvoice,
            invoice,
            saveInvoice,
            getCompanies,
            getCompanyById,
            getInvoiceById,
            getInvoices,
            updateCompanyById,
            updateInvoiceById,
            deleteCompany,
            deleteInvoice,
            saveCompanyIfNew
        }}>
            {children}
        </InvoiceContext.Provider>
    )
}

export default InvoiceContext;
export const useInvoice = () => useContext(InvoiceContext);