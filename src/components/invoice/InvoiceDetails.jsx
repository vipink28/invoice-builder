import { Check, Edit, Plus, Trash, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import InvoiceContext from "../../context/InvoiceContext";
import Button from "../forms/Button";
import InputField from "../forms/InputField";
import SelectField from "../forms/SelectField";

const InvoiceDetails = () => {
    const { updateInvoice } = useContext(InvoiceContext);
    const initItem = {
        id: 0,
        name: "",
        quantity: "",
        unitprice: "",
        taxname: "",
        tax: 0,
        taxamount: 0,
        subtotal: "",
        description: "",
        saved: false
    }

    const [disableNew, setDisableNew] = useState(false);
    const [taxPopup, setTaxPopup] = useState(false);
    const [newTax, setNewTax] = useState({
        name: "Non Taxable",
        rate: 0
    });

    const [currentItem, setCurrentItem] = useState(initItem)
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [itemEdit, setItemEdit] = useState(false);
    const [invoiceTotal, setInvoiceTotal] = useState({
        subtotal: 0,
        totaltax: 0,
        grandtotal: 0,
    });
    const [notes, setNotes] = useState("");

    const calculateTotal = () => {
        let subtotal = 0;
        let totaltax = 0;

        invoiceItems.forEach((item) => {
            const itemSubtotal = Number(item.quantity) * Number(item.unitprice) || 0;
            const itemTax = (itemSubtotal * Number(item.tax)) / 100 || 0;

            subtotal += itemSubtotal;
            totaltax += itemTax;
        });

        const grandtotal = subtotal + totaltax;
        updateInvoice("itemslist", invoiceItems)
        updateInvoice("invoicesummary", { subtotal, totaltax, grandtotal })
        setInvoiceTotal({ subtotal, totaltax, grandtotal });
    };

    const handleItemFieldChange = (e) => {
        let { name, value } = e.target;
        setCurrentItem((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (name === "quantity" || name === "unitprice") {
            setCurrentItem((prev) => {
                if (prev.quantity !== "" && prev.unitprice !== "") {
                    const subtotal = Number(prev.quantity) * Number(prev.unitprice);
                    const tax = subtotal * prev.tax / 100;
                    return ({
                        ...prev,
                        subtotal: subtotal + tax,
                        taxamount: tax
                    })
                } else {
                    return ({
                        ...prev
                    })
                }
            })
        }
    }

    const handleTaxSelect = (e) => {
        let { value } = e.target;
        if (value === 0) {
            setCurrentItem((prev) => ({
                ...prev,
                tax: value
            }))
        } else {
            setTaxPopup(true);
        }
    }

    const handleNewTax = (e) => {
        let { name, value } = e.target;
        setNewTax((prev) => ({
            ...prev,
            [name]: value
        }))
    }


    const saveNewTax = () => {
        setCurrentItem((prev) => ({
            ...prev,
            tax: newTax.rate,
            taxname: newTax.name
        }))
        setCurrentItem((prev) => {
            if (prev.quantity !== "" && prev.unitprice !== "") {
                const subtotal = Number(prev.quantity) * Number(prev.unitprice);
                const tax = subtotal * prev.tax / 100;
                return ({
                    ...prev,
                    subtotal: subtotal + tax,
                    taxamount: tax
                })
            } else {
                return ({
                    ...prev
                })
            }
        })
        setTaxPopup(false)
    }


    const handleItemFieldBlur = (e) => {
        let { value } = e.target;
        if (value === "") {
            e.target.classList.remove("border-gray-200")
            e.target.classList.add("border-red-500")
        } else {
            e.target.classList.add("border-gray-200")
            e.target.classList.remove("border-red-500")
        }
    }

    const addNewItem = () => {
        setInvoiceItems((prev) => {
            let id = prev.length === 0 ? 1 : prev[prev.length - 1]?.id + 1;
            return (
                [
                    ...prev,
                    { ...currentItem, id: id, tax: 0 }
                ]
            )
        })
        setDisableNew(true);
    }


    const saveCurrentItem = (id) => {
        if (itemEdit) {
            setInvoiceItems((prev) => (prev.map((item) => item.id === id ? { ...currentItem, saved: true, id: id } : item)))
        } else {
            setInvoiceItems((prev) => (prev.map((item) => item.id === id ? { ...currentItem, saved: true, id: item.id } : item)))
        }
        setCurrentItem(initItem)
        setItemEdit(false);
        setDisableNew(false);
    }

    const editCurrentItem = (id) => {
        setItemEdit(true);
        const item = invoiceItems.find((item) => item.id === id);
        const collection = invoiceItems.filter((item) => item.id !== id);
        setCurrentItem({ ...item, saved: false, id: id });
        setInvoiceItems(collection);
        setInvoiceItems((prev) => {
            return [...prev, { ...item, saved: false }].sort((a, b) => a.id - b.id)
        })
    }
    const deleteCurrentItem = (id) => {
        const items = invoiceItems.filter((item) => item.id !== id);
        setInvoiceItems(items);
        setDisableNew(false);
    }


    const handleNotes = (e) => {
        const { value } = e.target;
        setNotes(value);
        updateInvoice("notes", value);
    }


    useEffect(() => {
        if (currentItem, invoiceItems.length > 0) {
            calculateTotal();
        }
    }, [currentItem, invoiceItems])

    return (
        <>
            {
                taxPopup &&
                <div className="fixed z-50 bg-black/15 w-screen h-screen top-0 left-0 flex justify-center items-center">
                    <div className="max-w-lg p-5 w-full bg-white flex flex-col gap-5">
                        <h2 className="font-bold text-lg">New Tax Rate</h2>
                        <InputField type="text" label="Name" name="name" required={true} onChange={handleNewTax} />
                        <InputField type="text" label="Tax" name="rate" required={true} onChange={handleNewTax} />
                        <div className="flex gap-4">
                            <Button onClick={() => setTaxPopup(false)}>Cancel</Button>
                            <Button primary={true} onClick={saveNewTax}>Set Tax</Button>
                        </div>
                    </div>
                </div>
            }
            <div className="flex flex-col gap-5">
                <div className="grid grid-cols-6 font-bold text-center">
                    <h5 className="col-span-2">Name</h5>
                    <h5>Quantity</h5>
                    <h5>Unit Price</h5>
                    <h5>Tax</h5>
                    <h5>Sub Total</h5>
                </div>
                {
                    invoiceItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-6 gap-3">
                            <div className="col-span-2">
                                {
                                    item.saved ?
                                        <p>{item.name}</p> :
                                        <InputField type="text" name="name" value={currentItem.name} onChange={handleItemFieldChange} onBlur={handleItemFieldBlur} autoFocus={true} />
                                }
                            </div>
                            <div>
                                {
                                    item.saved ?
                                        <p>{item.quantity}</p> :
                                        <InputField type="number" name="quantity" value={currentItem.quantity} onChange={handleItemFieldChange} onBlur={handleItemFieldBlur} />
                                }
                            </div>
                            <div>
                                {
                                    item.saved ?
                                        <p>{item.unitprice}</p> :
                                        <InputField type="number" name="unitprice" value={currentItem.unitprice} onChange={handleItemFieldChange} onBlur={handleItemFieldBlur} />
                                }
                            </div>
                            <div>
                                {
                                    item.saved ?
                                        <p>{item.tax === 0 ? "-" : item.tax + "%"}</p> :
                                        <SelectField defaultValue={newTax.rate} name="tax" onChange={handleTaxSelect}>
                                            <option value={0}>Non Taxable</option>
                                            {
                                                newTax.rate > 0 &&
                                                <option value={newTax.rate}>{`${newTax.name} ${newTax.rate}`} </option>
                                            }
                                            <option value={1}>Add New Tax</option>
                                        </SelectField>
                                }
                            </div>
                            <div className="flex items-center h-full">
                                {
                                    item.saved ?
                                        <p>{item.subtotal !== "" && `₹ ${item.subtotal.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p> :
                                        <p>{currentItem.subtotal !== "" && `₹ ${currentItem.subtotal.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p>
                                }
                            </div>
                            <div className="col-span-5">
                                {
                                    item.saved ?
                                        <p>{item.description}</p> :
                                        <InputField type="text" name="description" value={currentItem.description} placeholder="Description" onChange={handleItemFieldChange} />
                                }
                            </div>
                            <div className="flex items-center h-full">
                                {
                                    item.saved ?
                                        <button onClick={() => editCurrentItem(item.id)} className="p-2 text-blue-600 cursor-pointer"><Edit className="w-5 h-5 stroke-2" /></button>
                                        :
                                        <button onClick={() => saveCurrentItem(item.id)} className="p-2 text-blue-600 cursor-pointer"><Check className="w-5 h-5 stroke-4" /></button>
                                }
                                {
                                    item.saved ?
                                        <button onClick={() => deleteCurrentItem(item.id)} className="p-2 text-red-500 cursor-pointer"><Trash className="w-5 h-5 stroke-2" /></button>
                                        :
                                        <button onClick={() => deleteCurrentItem(item.id)} className="p-2 text-red-500 cursor-pointer"><X className="w-5 h-5 stroke-4" /></button>
                                }
                            </div>
                        </div>
                    ))

                }

                <button onClick={addNewItem} disabled={disableNew} className="w-full border border-gray-300 bg-gray-200 font-bold flex items-center justify-center p-4 cursor-pointer">
                    <Plus className="w-5 h-5 me-3 stroke-4" /> Add new invoice item
                </button>

                <div className="flex justify-end">
                    <div className="flex flex-col gap-3">
                        <div className="bg-gray-200 border w-64 border-gray-300 font-bold p-3 text-slate-950">
                            <p>Invoice Summary</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Sub Total</p>
                            <p className="text-right">{`₹ ${invoiceTotal.subtotal.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Tax</p>
                            <p className="text-right">{`₹ ${invoiceTotal.totaltax.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p>
                        </div>
                        <div className="flex justify-between">
                            <p>Total</p>
                            <p className="text-right">{`₹ ${invoiceTotal.grandtotal.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p>
                        </div>
                    </div>
                </div>
                <hr className="border-gray-200" />
                <InputField type="text" name="notes" placeholder="Add notes" onChange={handleNotes} />
            </div>
        </>
    )
}

export default InvoiceDetails