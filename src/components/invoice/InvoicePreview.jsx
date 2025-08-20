
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useInvoice } from "../../context/InvoiceContext";
import { formatDate } from "../../helper";
import Button from "../forms/Button";

const InvoicePreview = ({ setPreview, invoice, view }) => {
    const { user } = useAuth();
    const { saveInvoice } = useInvoice();
    const { invoiceheader, sender, recipient, itemslist, invoicesummary, notes, ispaid, partiallypaid } = invoice;
    const invoiceRef = useRef(null);
    const handleDownloadPDF = async () => {
        const invoiceElement = invoiceRef.current;
        if (!invoiceElement) return;

        try {

            const canvas = await html2canvas(invoiceElement, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#fff"
            });

            const imgData = canvas.toDataURL("image/png", 1.0);
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();


            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;


            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;


            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }


            const timestamp = new Date().toISOString().split("T")[0];
            const fileName = `${invoice.recipient.companyname || "Invoice"}_${invoiceheader.issuedate}_${timestamp}.pdf`;

            pdf.save(fileName);
        } catch (err) {
            console.error("PDF generation failed:", err);
        }
    };


    return (
        <div className="fixed top-0 left-0 flex flex-col py-9 w-screen h-screen z-40 bg-black/30">
            <div className="h-full max-w-7xl mx-auto w-full relative">
                <div className="bg-white text-slate-950 pb-24 h-full relative overflow-auto">
                    <div id="invoice" ref={invoiceRef} className="flex flex-col gap-6 p-6">
                        <div className="flex">
                            {
                                invoiceheader.logo !== "" && <img src={invoiceheader.logo} alt="logo" className="h-32 object-contain" />
                            }
                            <div className="flex flex-col ms-auto">
                                <h1 className="text-4xl font-medium mb-2">Invoice: {invoiceheader.invoicenumber}</h1>
                                <p>Issued On: {formatDate(invoiceheader.issuedate)}</p>
                                <p>Due By: {formatDate(invoiceheader.duedate)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-8">
                            <div className="w-full">
                                <p className="font-bold">From</p>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold">{sender.companyname}</p>
                                    <div className="flex gap-2">
                                        <p>{sender.firstname}</p>
                                        <p>{sender.lastname}</p>
                                    </div>
                                    <p>{sender.addressline1}</p>
                                    <p>{sender.addressline2}</p>
                                    <div className="flex gap-2">
                                        <p>{sender.city}</p>
                                        <p>{sender.state}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p>{sender.postalcode}</p>
                                        <p>{sender.country}</p>
                                    </div>
                                    <p>{sender.email}</p>
                                    <p>{sender.phone}</p>
                                    <p>{sender.taxnumber}</p>
                                </div>
                            </div>
                            <div className="w-full">
                                <p className="font-bold">To</p>
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold">{recipient.companyname}</p>
                                    <div className="flex gap-2">
                                        <p>{recipient.firstname}</p>
                                        <p>{recipient.lastname}</p>
                                    </div>
                                    <p>{recipient.addressline1}</p>
                                    <p>{recipient.addressline2}</p>
                                    <div className="flex gap-2">
                                        <p>{recipient.city}</p>
                                        <p>{recipient.state}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p>{recipient.postalcode}</p>
                                        <p>{recipient.country}</p>
                                    </div>
                                    <p>{recipient.email}</p>
                                    <p>{recipient.phone}</p>
                                    <p>{recipient.taxnumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col ">
                            <div className="bg-gray-200 flex font-bold p-3 text-slate-800">
                                <div className="w-6/12">Item</div>
                                <div className="w-1/12 text-center">Quantity</div>
                                <div className="w-2/12 text-center">Unit Price</div>
                                <div className="w-1/12 text-center">Tax</div>
                                <div className="w-2/12 text-right">Total</div>
                            </div>
                            {itemslist.map((item, index) => (
                                <div key={index} className="bg-white flex p-3 text-black border-b-2 border-b-gray-300">
                                    <div className="w-6/12">
                                        <p className="font-bold text-xl">{item.name}</p>
                                        <p>{item.description}</p>
                                    </div>
                                    <div className="w-1/12 text-center">{item.quantity}</div>
                                    <div className="w-2/12 text-center">₹ {item.unitprice.toLocaleString("en", { minimumFractionDigits: 2 })}</div>
                                    <div className="w-1/12 text-center">{item.tax > 0 ? `${item.taxname} ${item.tax}%` : "-"}</div>
                                    <div className="w-2/12 text-right">₹ {item.subtotal.toLocaleString("en", { minimumFractionDigits: 2 })}</div>
                                </div>
                            ))
                            }
                        </div>

                        <div className="flex justify-end">
                            <div className="flex flex-col gap-3">
                                <div className="bg-gray-200 border w-64 border-gray-300 font-bold p-3 text-slate-950">
                                    <p>Invoice Summary</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Sub Total</p>
                                    <p className="text-right">{`₹ ${invoicesummary.subtotal.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Tax</p>
                                    <p className="text-right">{`₹ ${invoicesummary.totaltax.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Total</p>
                                    <p className="text-right">{`₹ ${invoicesummary.grandtotal.toLocaleString("en", { minimumFractionDigits: 2 })}`}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-200" />
                        <p className="font-semibold">Note: {notes}</p>
                    </div>
                </div>
                <div className="flex gap-5 justify-center absolute w-full bottom-0 left-0 bg-white py-3 border-t border-t-gray-300">
                    <Button onClick={() => setPreview(false)} primary={true}>Close</Button>
                    {
                        !view && <Button onClick={() => saveInvoice(invoice, user)} primary={true}>Save</Button>
                    }
                    <Button onClick={handleDownloadPDF} primary={true}>Download PDF</Button>
                </div>
            </div>
        </div>
    )
}

export default InvoicePreview