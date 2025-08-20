
const InputField = ({ required, name, type, label, placeholder, value, id, onChange, onBlur, className, autoFocus }) => {
    return (
        <div className={`flex flex-col ${label && "gap-3"}`}>
            {
                label &&
                <label htmlFor={id}>{label} {required && <span className="text-red-500 text-sm">*</span>}</label>
            }
            <input onChange={onChange} onBlur={onBlur} type={type} placeholder={placeholder} name={name} id={id} value={value} autoFocus={autoFocus} autoComplete="name" className={`focus:outline-none border border-gray-200 px-4 h-10 w-full ${className ? className : ""}`} />
        </div>
    )
}

export default InputField