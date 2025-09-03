import { Building2, Download, FileText, Mail } from "lucide-react";
import { Link } from "react-router";
import invoicescreenshot from '../assets/invoicescreenshot.jpg';
const Home = () => {
    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen px-6 py-12">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto">
                <FileText className="mx-auto w-12 h-12 text-blue-500 mb-4" />
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                    Online Invoice Generator
                </h1>
                <p className="text-gray-300 mb-8">
                    Create & download invoices for free
                </p>
                <Link to="/create-invoice" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition">
                    Create Free Invoice Now
                </Link>
            </section>

            {/* Preview Section */}
            <section className="mt-16 flex justify-center">
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md">
                    <h2 className="text-lg font-semibold mb-4 text-center flex items-center justify-center gap-2">
                        <Download className="w-5 h-5 text-blue-400" />
                        Invoice Preview
                    </h2>
                    <div className="bg-gray-700 p-4 rounded-lg text-sm space-y-2">
                        <img src={invoicescreenshot} alt="preview" />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="mt-20 max-w-6xl mx-auto grid gap-12 md:grid-cols-2">
                <div className="flex flex-col justify-center">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-blue-400" />
                        Brand your invoices with your logo
                    </h2>
                    <p className="text-gray-300 mb-4">
                        Customize invoices to each client. Add your company details, client
                        info, items, taxes, and payment terms to make sure you get paid on
                        time.
                    </p>
                    <p className="text-gray-300">
                        Save recurring invoice templates and manage client details easily.
                    </p>
                </div>
                <div className="flex justify-center">
                    {/* Illustration */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-48 h-48 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <rect
                            x="3"
                            y="4"
                            width="18"
                            height="16"
                            rx="2"
                            ry="2"
                            className="stroke-blue-400"
                        />
                        <line x1="8" y1="9" x2="16" y2="9" className="stroke-blue-400" />
                        <line x1="8" y1="13" x2="16" y2="13" className="stroke-blue-400" />
                        <line x1="8" y1="17" x2="12" y2="17" className="stroke-blue-400" />
                    </svg>
                </div>
            </section>

            {/* Unlimited Invoices Section */}
            <section className="mt-20 max-w-6xl mx-auto grid gap-12 md:grid-cols-2">
                <div className="flex justify-center order-2 md:order-1">
                    {/* Illustration */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-48 h-48 text-green-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path
                            d="M9 17v2h6v-2M12 3v14m9-5H3"
                            className="stroke-green-400"
                        />
                    </svg>
                </div>
                <div className="flex flex-col justify-center order-1 md:order-2">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <Download className="w-6 h-6 text-green-400" />
                        Generate unlimited invoices & PDFs
                    </h2>
                    <p className="text-gray-300 mb-4">
                        Create unlimited invoices and download them as PDFs instantly,
                        without paying extra. Save, track, and manage invoices and clients
                        with ease.
                    </p>
                </div>
            </section>

            {/* Why Use Section */}
            <section className="mt-20 max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-semibold mb-6">
                    Why use Free Invoice Builder?
                </h2>
                <p className="text-gray-300 mb-4">
                    Sending invoices to clients is a large part of any business. Free
                    Invoice Builder helps you generate invoices quickly using ready-made
                    templates, apply taxes, and send them instantly.
                </p>
                <p className="text-gray-300">
                    Build professional PDF invoices from scratch in seconds, saving you
                    and your clients valuable time.
                </p>
            </section>

            {/* CTA Section */}
            <section className="mt-16 text-center">
                <p className="mb-4 flex items-center justify-center gap-2">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <a
                        href="mailto:contact@freeinvoicebuilder.com"
                        className="text-blue-400 hover:underline"
                    >
                        contact@freeinvoicebuilder.com
                    </a>
                </p>
                <Link to="/create-invoice" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition">
                    Create Free Invoice Now
                </Link>
            </section>

            {/* Footer */}
            <footer className="mt-20 text-center text-gray-500 text-sm">
                © Copyright 2025, All Rights Reserved

            </footer>
        </div>
    );
}

export default Home