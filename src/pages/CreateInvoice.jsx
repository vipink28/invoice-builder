import { useState } from "react"
import { useAuth } from "../auth/AuthContext"
import Button from "../components/forms/Button"
import CompanyInfo from "../components/invoice/CompanyInfo"
import InvoiceDetails from "../components/invoice/InvoiceDetails"
import InvoiceHeader from "../components/invoice/InvoiceHeader"
import InvoicePreview from "../components/invoice/InvoicePreview"
import { useInvoice } from "../context/InvoiceContext"

const CreateInvoice = () => {
    const [preview, setPreview] = useState(false);
    const { user } = useAuth();
    const { saveInvoice, invoice } = useInvoice();

    return (
        <div className="grid grid-cols-3 xl:grid-cols-3 gap-4 h-full">
            <div className="w-full bg-white min-h-10 p-6 text-slate-950 rounded col-span-2 h-full overflow-auto">
                <div className="flex flex-col gap-6">
                    <InvoiceHeader />
                    <div className="flex gap-4">
                        <div className="flex-1/2">
                            <CompanyInfo companyType="sender" />
                        </div>
                        <div className="flex-1/2">
                            <CompanyInfo companyType="recipient" />
                        </div>
                    </div>
                    <InvoiceDetails />
                </div>
            </div>
            <div className="w-full bg-white rounded py-6 px-4">
                <div className="flex flex-col gap-3">
                    <Button primary={true} className="w-full justify-center" onClick={() => setPreview(true)}>Preview & Download PDF</Button>
                    <Button primary={true} onClick={() => saveInvoice(invoice, user)} className="w-full justify-center">Save</Button>
                </div>
            </div>
            {
                preview &&
                <InvoicePreview setPreview={setPreview} invoice={invoice} />
            }
        </div>
    )
}

export default CreateInvoice