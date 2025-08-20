import { DynamicIcon } from 'lucide-react/dynamic';
const Button = ({ children, primary, onClick, icon, className }) => {
    return (
        <button onClick={onClick} className={`px-4 py-2 border border-gray-400 rounded-md cursor-pointer flex items-center gap-3 ${primary && "bg-slate-950 text-white"} ${className && className}`}>{icon && <DynamicIcon name={icon} className='w-5 h-5 text-inherit' />} {children}</button>
    )
}

export default Button