import { Route, Routes } from "react-router"
import ProtectedRoute from "../auth/ProtectedRoute"
import Navbar from "../components/global/Navbar"
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
    return (
        <>
            <Navbar />
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
        </>
    )
}

export default AppRouter