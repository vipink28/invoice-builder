import { ChevronDown, LogOut, UserCircle, UserPen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import Container from "../layout/Container";
import PrimaryMenu from "./PrimaryMenu";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [dropdown, setDropdown] = useState(false);
    const dropdownMenuRef = useRef(null)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownMenuRef.current &&
                !dropdownMenuRef.current.contains(event.target)
            ) {
                setDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="bg-slate-900">
            <Container>
                <div className="flex items-center justify-between">
                    <Link to="/" className="font-bold text-xl">Invoice Builder</Link>
                    <div className="flex items-center py-2">
                        <PrimaryMenu />
                        {
                            user &&
                            <div ref={dropdownMenuRef} className="relative">
                                <button onClick={() => setDropdown(!dropdown)} className="py-2 cursor-pointer px-4 font-semibold hover:text-white flex items-center">
                                    <UserCircle className="w-4 h-4 me-2" />
                                    {user?.displayName || "User"}
                                    <ChevronDown className="w-5 h-5 ms-2" />
                                </button>
                                {
                                    dropdown &&
                                    <div className="absolute flex flex-col w-52 right-0 top-14 bg-slate-900 px-3">
                                        <NavLink onClick={() => setDropdown(false)} to="/profile" className={({ isActive }) =>
                                            `py-2 px-4 font-semibold hover:text-white flex border-b w-full border-slate-400 items-center ${isActive ? "text-white" : "text-slate-200"}`
                                        }><UserPen className="w-4 h-4 me-2" /> Profile</NavLink>
                                        <button onClick={logout} className="py-2 px-4 cursor-pointer font-semibold hover:text-white flex items-center">
                                            <LogOut className="w-4 h-4 me-2" />
                                            Logout
                                        </button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default Navbar