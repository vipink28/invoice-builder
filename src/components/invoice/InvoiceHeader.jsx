import { ImageIcon } from "lucide-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import InvoiceContext from "../../context/InvoiceContext";
import { convertBase64 } from "../../helper";
import Button from "../forms/Button";

const InvoiceHeader = () => {
    const { updateInvoice } = useContext(InvoiceContext);

    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 30);


    const init = {
        logo: "",
        invoicetype: "Invoice",
        invoicenumber: "0001",
        issuedate: today.toISOString().split("T")[0],
        duedate: future.toISOString().split("T")[0],
    }
    const [invoiceHeader, setInvoiceHeader] = useState(init);
    const handleHeaderInput = (e) => {
        const { name, value } = e.target;
        setInvoiceHeader((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleLogo = async (e) => {
        let file = e.target.files[0];
        let imgStr = await convertBase64(file);
        setInvoiceHeader((prev) => ({
            ...prev,
            logo: imgStr
        }))
    }

    const handleHeaderUpdate = (message) => {
        updateInvoice("invoiceheader", invoiceHeader);
        if (message !== "") {
            toast.success(message);
        }
    }

    return (
        <div className="flex gap-4 flex-wrap">
            <div className="flex gap-4 w-full">
                <div className="flex-1/2">
                    <label htmlFor="picklogo" className="flex items-center gap-3 cursor-pointer border border-gray-200 h-10 rounded-sm p-2 mb-2"><ImageIcon className="w-6 h-6" /> Choose Logo</label>
                    {
                        invoiceHeader.logo !== "" &&
                        <img src={invoiceHeader.logo} alt="logo" className="h-20 object-contain" />
                    }
                    <input type="file" id="picklogo" name="logo" className="hidden" onChange={handleLogo} onBlur={handleHeaderUpdate} />
                    <Button primary={true} className="mt-3" onClick={() => handleHeaderUpdate("logo udpated")}>Update Logo</Button>
                </div>
                <div className="flex-1/2 flex gap-3">
                    <div className="relative">
                        <select id="invoicetype" name="invoicetype" className="border border-gray-200 h-10 px-5 appearance-none focus:outline-none focus:border focus:border-slate-600" defaultValue="Invoice" onChange={handleHeaderInput} onBlur={() => handleHeaderUpdate("")}>
                            <option value="Invoice">Invoice</option>
                            <option value="Estimate">Estimate</option>
                            <option value="Bill">Bill</option>
                            <option value="Purchase Order">Purchase Order</option>
                            <option value="Quote">Quote</option>
                        </select>
                    </div>
                    <input type="text" name="invoicenumber" className="flex-1 focus:outline-none border border-gray-200 px-4 h-10" value={invoiceHeader.invoicenumber} onChange={handleHeaderInput} onBlur={() => handleHeaderUpdate("")} />
                </div>
            </div>
            <div className="w-1/2 ms-auto text-right">
                <div className="mb-4 flex items-center">
                    <label htmlFor="issuedate" className="font-medium me-4">Issue Date</label>
                    <input id="issuedate" name="issuedate" type="date" className="flex-1 focus:outline-none border border-gray-200 px-4 h-10" value={invoiceHeader.issuedate} onChange={handleHeaderInput} onBlur={() => handleHeaderUpdate("")} />
                </div>
                <div className="flex items-center">
                    <label htmlFor="duedate" className="font-medium me-4">Due Date</label>
                    <input id="duedate" name="duedate" type="date" className="flex-1 focus:outline-none border border-gray-200 px-4 h-10" value={invoiceHeader.duedate} onChange={handleHeaderInput} onBlur={() => handleHeaderUpdate("")} />
                </div>
            </div>
        </div>
    )
}

export default InvoiceHeader