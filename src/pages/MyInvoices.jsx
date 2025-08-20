import { ArrowUpDown, CheckCircle2, CircleDashed, Eye, Pencil, Trash, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import InvoicePreview from "../components/invoice/InvoicePreview";
import { useInvoice } from "../context/InvoiceContext";

const MyInvoices = () => {
    const { user } = useAuth();
    const [preview, setPreview] = useState(false);
    const { getInvoices } = useInvoice();
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    const [confirmDialog, setConfirmDialog] = useState(false);

    const fetchInvoices = async (user) => {
        try {
            setLoading(true)
            const invoices = await getInvoices(user);
            setInvoices(invoices);
            setFilteredInvoices(invoices);
            setLoading(false)
        } catch (error) {
            console.error("Failed to load:", error.message);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetchInvoices(user)
        }
    }, [user]);

    useEffect(() => {
        let data = [...invoices];

        if (search.trim()) {
            data = data.filter(
                (inv) =>
                    inv.recipient.companyname.toLowerCase().includes(search.toLowerCase()) ||
                    inv.invoiceheader.invoicenumber.includes(search)
            );
        }


        const today = new Date();
        if (filter === "due") {
            data = data.filter((inv) => new Date(inv.invoiceheader.duedate) < today);
        } else if (filter === "isPaid") {
            data = data.filter((inv) => inv.isPaid);
        } else if (filter === "partially") {
            data = data.filter((inv) => inv.partialyPaid);
        } else if (filter === "dueSoon") {
            const twoDays = new Date();
            twoDays.setDate(today.getDate() + 2);
            data = data.filter(
                (inv) => new Date(inv.invoiceheader.duedate) >= today && new Date(inv.invoiceheader.duedate) <= twoDays
            );
        }
        data.sort((a, b) => {
            const da = new Date(a.invoiceheader.duedate);
            const db = new Date(b.invoiceheader.duedate);
            return sortAsc ? da - db : db - da;
        });

        setFilteredInvoices(data);
    }, [search, filter, sortAsc, invoices]);

    return (
        <>
            <div className="flex flex-col gap-6 h-full bg-slate-900 p-8">
                <h2 className="font-semibold text-2xl">Invoices List</h2>

                <div className="pb-5 flex justify-between items-center border-b ">
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Search by company or invoice number"
                            className="px-3 py-2 border rounded-md w-80"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="px-3 py-2 border rounded-md bg-slate-900"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="due">Due Date Passed</option>
                            <option value="isPaid">Paid</option>
                            <option value="partially">Partially Paid</option>
                            <option value="dueSoon">Due within 2 Days</option>
                        </select>
                    </div>

                    <Link
                        to="/create-invoice"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
                    >
                        + Add New
                    </Link>
                </div>


                <div className="overflow-auto h-full">
                    <table className="min-w-full border-collapse bg-slate-950">
                        <thead className="bg-slate-700">
                            <tr className="text-left">
                                <th className="p-3">Invoice #</th>
                                <th className="p-3">Recipient</th>
                                <th className="p-3">
                                    <button
                                        className="flex items-center gap-1"
                                        onClick={() => setSortAsc(!sortAsc)}
                                    >
                                        Due Date <ArrowUpDown size={16} />
                                    </button>
                                </th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ?
                                    <tr>
                                        <td className="p-5 text-center text-gray-500" colSpan="7">
                                            ...Loading data
                                        </td>
                                    </tr>
                                    :
                                    filteredInvoices.length > 0 ? (
                                        filteredInvoices.map((inv) => (
                                            <tr key={inv.id} className="border-b border-b-slate-600 hover:bg-slate-800">
                                                <td className="p-3">{inv.invoiceheader.invoicenumber}</td>
                                                <td className="p-3">{inv.recipient.companyname}</td>
                                                <td className="p-3">{inv.invoiceheader.duedate}</td>
                                                <td className="p-3">{inv.invoiceheader.invoicetype}</td>
                                                <td className="p-3">₹{inv.invoicesummary.grandtotal}</td>
                                                <td className="p-3">
                                                    {inv.ispaid ? (
                                                        <CheckCircle2 className="text-green-600 inline" size={18} />
                                                    ) : inv.partiallypaid ? (
                                                        <CircleDashed className="text-yellow-500 inline" size={18} />
                                                    ) : (
                                                        <XCircle className="text-red-500 inline" size={18} />
                                                    )}
                                                </td>
                                                <td className="p-3 flex gap-2">
                                                    <button className="text-blue-600 hover:text-blue-800" onClick={() => {
                                                        setPreview(true)
                                                        setSelectedInvoice(inv)
                                                    }}>
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="text-green-600 hover:text-green-800">
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        <Trash size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="p-5 text-center text-gray-500" colSpan="7">
                                                No invoices found.
                                            </td>
                                        </tr>
                                    )
                            }

                        </tbody>
                    </table>
                </div>
            </div>
            {

            }
            {
                preview &&
                <InvoicePreview setPreview={setPreview} invoice={selectedInvoice} view={true} />
            }
        </>

    )
}

export default MyInvoices