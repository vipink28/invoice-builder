import { X } from "lucide-react"
import { useContext, useEffect, useState } from "react"
import toast from "react-hot-toast"
import countries from "world-countries"
import { useAuth } from "../../auth/AuthContext"
import InvoiceContext from "../../context/InvoiceContext"
import Button from "../forms/Button"
import InputField from "../forms/InputField"
import SelectField from "../forms/SelectField"

const CompanyDetails = ({ onClose, companyType, companyInfo, saveCompanyDetails, newCompany }) => {
    const { user } = useAuth();
    const { updateInvoice } = useContext(InvoiceContext);
    const init = {
        companyname: "",
        taxnumber: "",
        firstname: "",
        lastname: "",
        addressline1: "",
        addressline2: "",
        postalcode: "",
        city: "",
        state: "",
        country: "",
        phone: "",
        email: "",
        companyType: companyType
    }
    const [formData, setFormData] = useState(init);

    useEffect(() => {
        if (companyInfo) {
            setFormData(companyInfo)
        }
    }, [companyInfo])

    const handleFormField = (e) => {
        let { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }


    return (
        <div className="fixed flex flex-col z-20 justify-center items-center top-0 left-0 w-full h-full bg-black/20">
            <div className="bg-white w-full max-w-4xl p-5 text-slate-950">
                <div className="flex justify-end mb-4">
                    <button onClick={onClose} className="cursor-pointer p-2"><X className="w-4 h-4" /></button>
                </div>
                <div className="border border-gray-200 p-4">
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1/2">
                            <InputField type="text" id="companyname" label={`Company / ${companyType === "sender" ? "Sender" : "Recipient"} name`} required={true} name="companyname" value={formData.companyname} onChange={handleFormField} />
                        </div>
                        <div className="flex-1/2">
                            <InputField type="text" id="taxnumber" label="GST Number" name="taxnumber" value={formData.taxnumber} onChange={handleFormField} />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1/2">
                            <InputField type="text" id="firstname" label="First Name" name="firstname" value={formData.firstname} onChange={handleFormField} />
                        </div>
                        <div className="flex-1/2">
                            <InputField type="text" id="lastname" label="Last Name" name="lastname" value={formData.lastname} onChange={handleFormField} />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1/2">
                            <InputField type="text" id="addressline1" label="Address line 1" value={formData.addressline1} name="addressline1" onChange={handleFormField} />
                        </div>
                        <div className="flex-1/2">
                            <InputField type="text" id="addressline2" label="Address line 2" value={formData.addressline2} name="addressline2" onChange={handleFormField} />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1/2">
                            <InputField type="text" id="postalcode" label="Postal code" value={formData.postalcode} name="postalcode" onChange={handleFormField} />
                        </div>
                        <div className="flex-1/2">
                            <InputField type="text" id="city" label="City" name="city" value={formData.city} onChange={handleFormField} />
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1/2">
                            <InputField type="text" id="state" label="State" name="state" value={formData.state} onChange={handleFormField} />
                        </div>
                        <div className="flex-1/2">
                            <SelectField id="country" label="Country" name="country" required={true} defaultValue={formData.country} onChange={handleFormField}>
                                {
                                    countries.map((country) => (
                                        <option key={country.name.common} value={country.name.common}>{country.name.common}</option>
                                    ))
                                }
                            </SelectField>
                        </div>
                    </div>
                    <div className="flex gap-4 mb-4">
                        <div className="flex-1/2">
                            <InputField type="text" id="phone" label="Phone Number" name="phone" value={formData.phone} onChange={handleFormField} />
                        </div>
                        <div className="flex-1/2">
                            <InputField type="text" id="email" label="Email" required={true} name="email" value={formData.email} onChange={handleFormField} />
                        </div>

                    </div>
                    <div className="flex gap-4">
                        <Button onClick={onClose}>Cancel</Button>
                        {
                            newCompany ?
                                <Button onClick={() => saveCompanyDetails(formData, user)} primary={true} icon="check">{`Set ${companyType} Data`} </Button>
                                :
                                companyInfo?.id ?
                                    <Button onClick={() => saveCompanyDetails(user, companyInfo.id, formData)} primary={true} icon="check">{`Update ${companyInfo.companyType} Data`} </Button> :
                                    <Button onClick={() => {
                                        toast.loading("Saving Company Details", { duration: 2000, })
                                        updateInvoice(companyType, formData)
                                        setTimeout(() => {
                                            saveCompanyDetails(formData)
                                            onClose()
                                        }, 2000)
                                    }} primary={true} icon="check">{`Set ${companyType} data`}</Button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetails