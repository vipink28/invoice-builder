import { Briefcase, DollarSign, FileText, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { getDashboardStats } from "../../helper/apiMethods";

const StatCard = ({ title, value, icon }) => (
    <div className="bg-slate-800 p-4 rounded shadow-sm flex items-center gap-4">
        <div className="p-3 bg-slate-700 rounded">{icon}</div>
        <div>
            <div className="text-sm text-slate-400">{title}</div>
            <div className="text-xl font-semibold">{value}</div>
        </div>
    </div>
);

const Sparkline = ({ values = [] }) => {
    if (!values.length) return null;
    const width = 120, height = 28, padding = 2;
    const max = Math.max(...values);
    const points = values.map((v, i) => {
        const x = padding + (i * (width - padding * 2) / (values.length - 1 || 1));
        const y = height - padding - ((v / (max || 1)) * (height - padding * 2));
        return `${x},${y}`;
    }).join(" ");
    return (
        <svg width={width} height={height}><polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={points} /></svg>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || user.role !== "admin") return;
        (async () => {
            setLoading(true);
            try {
                const s = await getDashboardStats();
                setStats(s);
            } catch (err) {
                console.error("Dashboard load error", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [user]);

    if (!user || user.role !== "admin") return <div className="p-6 text-center">Access denied</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

            {loading && <div className="text-sm text-slate-400">Loading...</div>}

            {stats && (
                <>
                    {/* KPI Tiles */}
                    <div className="grid grid-cols-4 gap-4">
                        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={20} />} />
                        <StatCard title="Total Invoices" value={stats.totalInvoices} icon={<FileText size={20} />} />
                        <StatCard title="Total Companies" value={stats.totalCompanies} icon={<Briefcase size={20} />} />
                        <StatCard title="Total Revenue" value={`₹${Number(stats.totalRevenue || 0).toFixed(2)}`} icon={<DollarSign size={20} />} />
                    </div>

                    {/* second row */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="bg-slate-800 p-4 rounded">
                            <div className="flex justify-between">
                                <div>
                                    <div className="text-sm text-slate-400">Invoices this month</div>
                                    <div className="text-xl font-semibold">{stats.invoicesThisMonth}</div>
                                    <div className="text-sm text-slate-400">Revenue: ₹{Number(stats.revenueThisMonth || 0).toFixed(2)}</div>
                                </div>
                                <div>
                                    <Sparkline values={[stats.invoicesThisMonth, stats.paid, stats.partially, stats.unpaid]} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded">
                            <div className="text-sm text-slate-400">Overdue Invoices</div>
                            <div className="text-2xl font-semibold">{stats.overdueCount}</div>
                            <div className="text-sm mt-2">Paid: {stats.paid} · Partial: {stats.partially} · Unpaid: {stats.unpaid}</div>
                        </div>

                        <div className="bg-slate-800 p-4 rounded">
                            <div className="text-sm text-slate-400">Top Clients (by revenue)</div>
                            <ul className="mt-2 space-y-1">
                                {stats.topClients.map((c, i) => (
                                    <li key={i} className="flex justify-between text-sm">
                                        <span>{c.companyname}</span>
                                        <span>₹{Number(c.revenue || 0).toFixed(0)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Recent invoices */}
                    <div className="bg-slate-800 rounded p-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-medium">Recent Invoices</h3>
                            <Link to="/admin/invoices" className="text-sm text-blue-400">View all</Link>
                        </div>

                        <div className="overflow-auto">
                            <table className="min-w-full">
                                <thead className="text-sm text-slate-400">
                                    <tr>
                                        <th className="p-2 text-left">#</th>
                                        <th className="p-2 text-left">Invoice</th>
                                        <th className="p-2 text-left">Recipient</th>
                                        <th className="p-2 text-left">User</th>
                                        <th className="p-2 text-left">Due</th>
                                        <th className="p-2 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentInvoices.map(inv => (
                                        <tr key={inv.id} className="border-t border-slate-700">
                                            <td className="p-2 text-sm">{inv.id}</td>
                                            <td className="p-2 text-sm">{inv.invoiceheader?.invoicenumber}</td>
                                            <td className="p-2 text-sm">{inv.recipient?.companyname}</td>
                                            <td className="p-2 text-sm">{inv.userId || inv.uid || "-"}</td>
                                            <td className="p-2 text-sm">{inv.invoiceheader?.duedate || "-"}</td>
                                            <td className="p-2 text-sm text-right">₹{Number(inv.invoicesummary?.grandtotal || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard