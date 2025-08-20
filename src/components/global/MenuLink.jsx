import { NavLink } from 'react-router'

const MenuLink = ({ path, children, end }) => {
    return (
        <NavLink path={path} end={end} className={({ isActive }) =>
            `py-2 px-4 ${isActive ? "text-red-500" : "text-black"}`
        }>{children}</NavLink>
    )
}

export default MenuLink