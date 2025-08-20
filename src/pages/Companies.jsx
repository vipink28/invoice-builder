import { ArrowUpDown, Eye, Pencil, Trash, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/forms/Button";
import CompanyDetails from "../components/invoice/CompanyDetails";
import { useInvoice } from "../context/InvoiceContext";

const Companies = () => {
    const { user } = useAuth();
    const { getCompanies, deleteCompany, updateCompanyById, saveCompanyIfNew } = useInvoice();

    const [companies, setCompanies] = useState([]);
    const [filteredCompanies, setFilteredCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [sortAsc, setSortAsc] = useState(true);
    const [loading, setLoading] = useState(false);
    const [newCompany, setNewCompany] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [preview, setPreview] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: "delete",
    });

    const fetchCompanies = async (user) => {
        try {
            setLoading(true);
            const list = await getCompanies(user);
            setCompanies(list);
            setFilteredCompanies(list);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load:", error.message);
            setLoading(false);
        }
    };

    const deleteCompanyById = async (user, id) => {
        try {
            await deleteCompany(user, id);
            setCompanies((prev) => prev.filter((c) => c.id !== id)); // update UI
            setConfirmDialog({ open: false });
            toast.success("Company deleted");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const updateCompany = async (user, id, data) => {
        try {
            const updated = await updateCompanyById(user, id, data);
            setCompanies((prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
            );
            setConfirmDialog({ open: false });
            toast.success("Company updated");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const saveNewCompany = async (formData, user) => {
        try {
            await saveCompanyIfNew(formData, user);
            await fetchCompanies();
            setNewCompany(false);
            toast.success("Company updated");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        if (user) fetchCompanies(user);
    }, [user]);

    useEffect(() => {
        let data = [...companies];

        // search
        if (search.trim()) {
            const s = search.toLowerCase();
            data = data.filter(
                (c) =>
                    c.companyname.toLowerCase().includes(s) ||
                    c.city.toLowerCase().includes(s) ||
                    c.postalcode.includes(s) ||
                    c.phone.includes(s) ||
                    c.email.toLowerCase().includes(s)
            );
        }


        if (filter !== "all") {
            data = data.filter((c) => c.companyType === filter);
        }


        data.sort((a, b) => {
            return sortAsc
                ? a.companyname.localeCompare(b.companyname)
                : b.companyname.localeCompare(a.companyname);
        });

        setFilteredCompanies(data);
    }, [search, filter, sortAsc, companies]);

    return (
        <>
            {
                newCompany &&
                <CompanyDetails companyType="recipient" saveCompanyDetails={saveNewCompany} newCompany={newCompany} onClose={() => setConfirmDialog(false)} />
            }
            <div className="flex flex-col gap-6 h-full bg-slate-900 p-8">
                <h2 className="font-semibold text-2xl">Companies List</h2>

                <div className="pb-5 flex justify-between items-center border-b ">
                    <div className="flex gap-3 items-center">
                        <input
                            type="text"
                            placeholder="Search by name, city, postal code, phone, email"
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
                            <option value="sender">Sender</option>
                            <option value="recipient">Recipient</option>
                        </select>
                    </div>

                    <Button onClick={() => setNewCompany(true)}>
                        + Add New
                    </Button>
                </div>

                <div className="overflow-auto h-full">
                    <table className="min-w-full border-collapse bg-slate-950">
                        <thead className="bg-slate-700">
                            <tr className="text-left">
                                <th className="p-3">
                                    <button
                                        className="flex items-center gap-1"
                                        onClick={() => setSortAsc(!sortAsc)}
                                    >
                                        Company Name <ArrowUpDown size={16} />
                                    </button>
                                </th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Postal Code</th>
                                <th className="p-3">City</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        className="p-5 text-center text-gray-500"
                                        colSpan="7"
                                    >
                                        ...Loading data
                                    </td>
                                </tr>
                            ) : filteredCompanies.length > 0 ? (
                                filteredCompanies.map((c) => (
                                    <tr
                                        key={c.id}
                                        className="border-b border-b-slate-600 hover:bg-slate-800"
                                    >
                                        <td className="p-3">{c.companyname}</td>
                                        <td className="p-3">{c.email}</td>
                                        <td className="p-3">{c.phone}</td>
                                        <td className="p-3">{c.postalcode}</td>
                                        <td className="p-3">{c.city}</td>
                                        <td className="p-3 capitalize">{c.companyType}</td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={() => {
                                                    setPreview(true);
                                                    setSelectedCompany(c);
                                                }}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                className="text-green-600 hover:text-green-800"
                                                onClick={() => {
                                                    setSelectedCompany(c);
                                                    setConfirmDialog({ open: true, type: "update" });
                                                }}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800"
                                                onClick={() => {
                                                    setSelectedCompany(c);
                                                    setConfirmDialog({ open: true, type: "delete" });
                                                }}
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="p-5 text-center text-gray-500"
                                        colSpan="7"
                                    >
                                        No companies found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {confirmDialog.open && (
                <div className="fixed bg-black/30 w-screen h-screen left-0 top-0 flex flex-col justify-center items-center">
                    <div className="bg-white w-full max-w-80 text-slate-950">
                        {confirmDialog.type === "delete" ? (
                            <div className="p-4">
                                <p className="text-lg mb-5">Are you sure to delete?</p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        primary={true}
                                        onClick={() => deleteCompanyById(user, selectedCompany.id)}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        className="text-slate-950"
                                        onClick={() =>
                                            setConfirmDialog({ open: false, type: "delete" })
                                        }
                                    >
                                        No
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-4 pb-8 px-4">
                                <div className="flex justify-end">
                                    <button
                                        className="p-1"
                                        onClick={() =>
                                            setConfirmDialog({ open: false, type: "delete" })
                                        }
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <CompanyDetails companyType={selectedCompany.companyType} saveCompanyDetails={updateCompany} companyInfo={selectedCompany} onClose={() => setConfirmDialog({ open: false, type: "delete" })} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Companies