import { Building, User } from "lucide-react"
import { useState } from "react"
import CompanyDetails from "./CompanyDetails"

const CompanyInfo = ({ companyType }) => {
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
    const [company, setCompany] = useState(null)
    const [companyInfo, setCompanyInfo] = useState(init)

    const saveCompanyDetails = (details) => {
        setCompanyInfo(details);
    }
    return (
        <>
            <div onClick={() => setCompany(companyType)} className="py-4 px-2 cursor-pointer border border-transparent hover:border-slate-600">
                <p className="mb-4">{companyType === "sender" ? "From" : "To"} </p>
                {
                    companyInfo.companyname !== "" &&
                    <div className="flex flex-col gap-1">
                        <p className="font-bold">{companyInfo.companyname}</p>
                        <div className="flex gap-2">
                            <p>{companyInfo.firstname}</p>
                            <p>{companyInfo.lastname}</p>
                        </div>
                        <p>{companyInfo.addressline1}</p>
                        <p>{companyInfo.addressline2}</p>
                        <div className="flex gap-2">
                            <p>{companyInfo.city}</p>
                            <p>{companyInfo.state}</p>
                        </div>
                        <div className="flex gap-2">
                            <p>{companyInfo.postalcode}</p>
                            <p>{companyInfo.country}</p>
                        </div>
                        <p>{companyInfo.email}</p>
                        <p>{companyInfo.phone}</p>
                        <p>{companyInfo.taxnumber}</p>
                    </div>
                }
                {
                    companyInfo.companyname === "" &&
                    <div className="flex items-center">
                        {
                            companyType === "sender" ?
                                <Building className="w-10 h-10" />
                                :
                                <User className="w-10 h-10" />
                        }
                        <div className="flex flex-col ms-4">
                            <h5 className="font-semibold">{companyType === "sender" ? "Sender" : "Recipient"} Name</h5>
                            <p>{companyType === "sender" ? "Sender" : "Recipient"} Contact Details</p>
                        </div>
                    </div>
                }
            </div>

            {
                company && <CompanyDetails companyType={company} saveCompanyDetails={saveCompanyDetails} companyInfo={companyInfo} onClose={() => setCompany(null)} />
            }

        </>
    )
}

export default CompanyInfo