import { Navigate, Route, Routes } from "react-router"
import CompanyDetails from "../admin/pages/CompanyDetails"
import Dashboard from "../admin/pages/Dashboard"
import Invoices from "../admin/pages/Invoices"
import UserDetails from "../admin/pages/UserDetails"
import Users from "../admin/pages/Users"
import { useAuth } from "../auth/AuthContext"
import ProtectedRoute from "../auth/ProtectedRoute"
import InvoiceDetails from "../components/invoice/InvoiceDetails"
import AdminLayout from "../layout/AdminLayout"
import MainLayout from "../layout/MainLayout"
import Companies from "../pages/Companies"
import CreateInvoice from "../pages/CreateInvoice"
import Home from "../pages/Home"
import MyInvoices from "../pages/MyInvoices"
import PageNotFound from "../pages/PageNotFound"
import Profile from "../pages/Profile"
import SignIn from "../pages/SignIn"
import SignUp from "../pages/SignUp"

const AppRouter = () => {
    const { user } = useAuth();

    return (
        <>
            {
                user &&
                    user.role === "user" ?
                    <Routes>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />}></Route>
                            <Route path="signup" element={<SignUp />}></Route>
                            <Route path="signin" element={<SignIn />}></Route>
                            <Route path="my-invoices" element={<ProtectedRoute><MyInvoices /></ProtectedRoute>}></Route>
                            <Route path="companies" element={<ProtectedRoute><Companies /></ProtectedRoute>}></Route>
                            <Route path="create-invoice" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>}></Route>
                            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>
                            <Route path="*" element={<PageNotFound />}></Route>
                        </Route>
                    </Routes>
                    :
                    <Routes>
                        <Route path="/" element={<Navigate to="/admin" />}></Route>
                        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                            <Route index element={<Dashboard />}></Route>
                            <Route path="users" element={<Users />}></Route>
                            <Route path="user/:userid/invoices" element={<Invoices />}></Route>
                            <Route path="user/:userid/companies" element={<Companies />}></Route>
                            <Route path="user/:userid/user-details/:id" element={<UserDetails />}></Route>
                            <Route path="user/:userid/invoice-details/:id" element={<InvoiceDetails />}></Route>
                            <Route path="user/:userid/company-details/:id" element={<CompanyDetails />}></Route>
                            <Route path="profile" element={<Profile />}></Route>
                            <Route path="*" element={<PageNotFound />}></Route>
                        </Route>
                    </Routes>
            }
        </>
    )
}

export default AppRouter