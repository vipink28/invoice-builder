import { Outlet } from "react-router"
import Container from "../components/layout/Container"


const MainLayout = () => {
    return (
        <Container>
            <div className="py-4 h-[calc(100vh-56px)]">
                <Outlet />
            </div>
        </Container>
    )
}

export default MainLayout