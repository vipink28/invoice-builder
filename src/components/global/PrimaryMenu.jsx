import { DynamicIcon } from "lucide-react/dynamic";
import { NavLink } from "react-router";
import { useAuth } from "../../auth/AuthContext";

const PrimaryMenu = () => {
    const { user, logout } = useAuth();
    const publicRoutes = [
        { path: "/", linkText: "Home", icon: "house" },
        { path: "/signin", linkText: "Sign In", icon: "user" },
        { path: "/signup", linkText: "Sign Up", icon: "user-plus" },
    ]
    const restrictedRoutes = [
        { path: "/create-invoice", linkText: "Create Invoice", icon: "file-pen" },
        { path: "/companies", linkText: "Companies", icon: "building" },
        { path: "/my-invoices", linkText: "My Invoices", icon: "list" },
    ]
    return (
        user ?
            restrictedRoutes.map((route) => (
                <NavLink key={route.path} to={route.path} className={({ isActive }) =>
                    `py-2 px-4 font-semibold hover:text-white flex items-center ${isActive ? "text-white" : "text-slate-200"}`
                }><DynamicIcon name={route.icon} className="w-4 h-4 me-2" /> {route.linkText}</NavLink>
            ))
            :
            publicRoutes.map((route) => (
                <NavLink key={route.path} to={route.path} className={({ isActive }) =>
                    `py-2 px-4 font-semibold hover:text-white flex items-center ${isActive ? "text-white" : "text-slate-200"}`
                }><DynamicIcon name={route.icon} className="w-4 h-4 me-2" /> {route.linkText}</NavLink>
            ))
    )
}

export default PrimaryMenu