import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

const SignUp = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullname: "", email: "", password: "" });

    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await signup(formData.email, formData.password, formData.fullname);
            navigate("/my-invoices");
        } catch (error) {
            console.error("Signup error:", error.message);
        }
    };

    return (
        <div className="bg-slate-900 p-8 w-full max-w-lg mx-auto fixed top-1/2 left-1/2 -translate-1/2">
            <h2 className="font-bold text-2xl mb-5">Sign Up</h2>
            <div>
                <div className="mb-4">
                    <label className="block font-medium mb-3">Full Name</label>
                    <input type="text" name="fullname" onChange={handleChange} className="h-10 px-2 rounded-md border w-full" />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-3">Email</label>
                    <input type="email" name="email" onChange={handleChange} className="h-10 px-2 rounded-md border w-full" />
                </div>
                <div className="mb-6">
                    <label className="block font-medium mb-3">Password</label>
                    <input type="password" name="password" onChange={handleChange} className="h-10 px-2 rounded-md border w-full" />
                </div>

                <button onClick={handleSubmit} className="bg-slate-300 text-slate-950 px-4 py-2 rounded-md font-bold cursor-pointer mb-6">
                    Sign Up
                </button>

                <p>Already registered? <Link to="/signin" className="text-blue-500">Click here</Link></p>
            </div>
        </div>
    );
};

export default SignUp;
