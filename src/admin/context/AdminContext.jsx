import { createContext } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    return (
        <AdminContext.Provider value={{}}>
            {children}
        </AdminContext.Provider>
    )
}


export default AdminContext;