import { Outlet } from "react-router"
import Navbar from "../components/global/Navbar"
import Container from "../components/layout/Container"

const AdminLayout = () => {
    return (
        <>
            <Navbar />
            <Container>
                <div className="py-4 h-[calc(100vh-56px)]">
                    <Outlet />
                </div>
            </Container>
        </>
    )
}

export default AdminLayout