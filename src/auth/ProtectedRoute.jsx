import { Navigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/signin" />;
    }
    return children;
};

export default ProtectedRoute;