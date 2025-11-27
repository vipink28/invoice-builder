import { ArrowUpDown, Eye, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { formatFirestoreTimestamp } from "../../helper";
import { getAllUsers } from "../../helper/apiMethods";

const Users = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [sortAsc, setSortAsc] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const list = await getAllUsers();

            setUsers(list);
            setFilteredUsers(list);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load:", error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [])

    useEffect(() => {
        let data = users.filter((u) => u.userId !== user.userId);
        console.log(data)
        // search
        if (search.trim()) {
            const s = search.toLowerCase();
            data = data.filter(
                (c) =>
                    c.displayName.toLowerCase().includes(s) ||
                    c.email.toLowerCase().includes(s) ||
                    c.pincode?.includes(s) ||
                    c.phone?.includes(s)
            );
        }

        data.sort((a, b) => {
            return sortAsc
                ? a.displayName.localeCompare(b.displayName)
                : b.displayName.localeCompare(a.displayName);
        });

        setFilteredUsers(data);
    }, [search, sortAsc, users]);


    return (
        <div className="flex flex-col gap-6 h-full bg-slate-900 p-8">
            <h2 className="font-semibold text-2xl">Users List</h2>

            <div className="pb-5 flex justify-between items-center border-b ">
                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search by name, city, postal code, phone, email"
                        className="px-3 py-2 border rounded-md w-80"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-auto h-full">
                <table className="min-w-full border-collapse bg-slate-950">
                    <thead className="bg-slate-700">
                        <tr className="text-left">
                            <th>Sr. No.</th>
                            <th className="p-3">
                                <button
                                    className="flex items-center gap-1"
                                    onClick={() => setSortAsc(!sortAsc)}
                                >
                                    Name <ArrowUpDown size={16} />
                                </button>
                            </th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Pincode</th>
                            <th className="p-3">Created At</th>
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
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((c, i) => (
                                <tr
                                    key={c.userId}
                                    className="border-b border-b-slate-600 hover:bg-slate-800"
                                >
                                    <td className="p-3">{i + 1}</td>
                                    <td className="p-3">{c.displayName}</td>
                                    <td className="p-3">{c.email}</td>
                                    <td className="p-3">{c.phone || "-"}</td>
                                    <td className="p-3">{c.pincode || "-"}</td>
                                    <td className="p-3">{formatFirestoreTimestamp(c.createdAt)}</td>
                                    <td className="p-3 flex gap-2">
                                        <Link
                                            to={`/admin/user/view/${c.userId}`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye size={18} />
                                        </Link>
                                        <Link
                                            to={`/admin/user/edit/${c.userId}`}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Pencil size={18} />
                                        </Link>
                                        <button
                                            className="text-red-600 hover:text-red-800"
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
                                    No User found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Users