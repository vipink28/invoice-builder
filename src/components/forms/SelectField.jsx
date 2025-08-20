import { ChevronDown } from "lucide-react"

const SelectField = ({ children, label, required, name, id, onChange, defaultValue }) => {
    return (
        <div className={`flex flex-col ${label && "gap-3"}`}>
            {
                label &&
                <label htmlFor={id}>{label} {required && <span className="text-red-500 text-sm">*</span>}</label>
            }
            <div className="relative">
                <select id={id} onChange={onChange} defaultValue={defaultValue} name={name} className="focus:outline-none appearance-none border border-gray-200 ps-2 pe-7 h-10 w-full text-ellipsis">
                    {children}
                </select>
                <ChevronDown className="w-5 h-5 absolute top-1/2 right-3 -translate-y-1/2" />
            </div>
        </div>
    )
}

export default SelectField