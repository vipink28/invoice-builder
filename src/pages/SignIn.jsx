import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

const SignIn = () => {
    const { signin, signinWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        let { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            await signin(formData.email, formData.password);
            navigate("/my-invoices");
        } catch (error) {
            console.error("Signin error:", error.message);
        }
    };

    const handleGoogle = async () => {
        try {
            await signinWithGoogle();
            navigate("/my-invoices");
        } catch (error) {
            console.error("Google Signin error:", error.message);
        }
    };

    return (
        <div className="bg-slate-900 p-8 w-full max-w-lg mx-auto fixed top-1/2 left-1/2 -translate-1/2">
            <h2 className="font-bold text-2xl mb-5">Sign In</h2>
            <div>
                <div className="mb-4">
                    <label className="block font-medium mb-3">Email</label>
                    <input type="email" name="email" onChange={handleChange} className="h-10 px-2 rounded-md border w-full" />
                </div>
                <div className="mb-6">
                    <label className="block font-medium mb-3">Password</label>
                    <input type="password" name="password" onChange={handleChange} className="h-10 px-2 rounded-md border w-full" />
                </div>
                <div className="flex gap-4 mb-6">
                    <button onClick={handleSubmit} className="bg-slate-300 text-slate-950 px-4 py-2 rounded-md font-bold cursor-pointer">
                        Sign In
                    </button>
                    <button onClick={handleGoogle} className="bg-slate-300 text-slate-950 px-4 py-2 rounded-md font-bold cursor-pointer">
                        Google Sign In
                    </button>
                </div>

                <p>Not a user? <Link to="/signup" className="text-blue-500">Click here</Link></p>
            </div>
        </div>
    );
};

export default SignIn;
