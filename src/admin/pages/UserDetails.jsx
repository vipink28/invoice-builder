import { ArrowLeft, Building, NotepadText, Upload } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import Button from "../../components/forms/Button"
import InputField from "../../components/forms/InputField"
import LoadingFullScreen from "../../components/global/LoadingFullScreen"
import Container from "../../components/layout/Container"
import { convertBase64 } from "../../helper"
import { getUserById, updateUserProfile } from "../../helper/apiMethods"

const UserDetails = () => {
    const init = {
        photoURL: "",
        displayName: "",
        email: "",
        phone: "",
        about: "",
        website: "",
        street: "",
        city: "",
        state: "",
        pincode: ""
    }
    const { type, userid } = useParams();
    const [userDetails, setUserDetails] = useState(init);
    const [loading, setLoading] = useState(false);
    const fetchUserDetails = async (uid) => {
        try {
            setLoading(true);
            const user = await getUserById(uid);
            setUserDetails((prev) => ({
                ...prev,
                ...user
            }));
            setLoading(false);
        } catch (error) {
            console.error("Failed to load:", error.message);
            setLoading(false);
        }
    };


    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleProfileImage = async (e) => {
        const file = e.target.files[0];
        const url = await convertBase64(file);
        setUserDetails((prev) => ({
            ...prev,
            photoURL: url
        }))
    }

    const handleSave = async () => {
        try {
            await updateUserProfile(userDetails.userId, userDetails);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    useEffect(() => {
        if (userid) {
            fetchUserDetails(userid)
        }
    }, [userid]);

    if (loading) {
        return (
            <LoadingFullScreen />
        );
    }
    return (
        <Container>
            <div className="py-4 flex items-center gap-4">
                <Link to="/admin/users" className="inline-flex py-2 ps-2 pe-3 rounded-md items-center gap-3 font-medium border border-gray-300"><ArrowLeft className="w-4 h-4" /> Back to User List</Link>
                <Link to="/admin/users" className="inline-flex py-2 ps-2 pe-3 rounded-md items-center gap-3 font-medium border border-gray-300 ms-auto"><NotepadText className="w-4 h-4" /> Invoices List</Link>
                <Link to="/admin/users" className="inline-flex py-2 ps-2 pe-3 rounded-md items-center gap-3 font-medium border border-gray-300"><Building className="w-4 h-4" /> Companies List</Link>
            </div>

            <div className="grid grid-cols-3 gap-5">
                <div className="col-span-1">
                    <div className="bg-slate-900 rounded-lg p-4 h-full">
                        <div className="w-64 h-64 rounded-full bg-slate-800 mx-auto relative group">
                            <>
                                <label htmlFor="photoURL" className={`w-64 h-64 cursor-pointer absolute top-0 left-0 flex z-10 justify-center items-center ${userDetails.photoURL !== "" ? "invisible group-hover:visible bg-slate-900/55" : "visible"}`}>
                                    <Upload className="w-8 h-8" />
                                </label>
                                <input type="file" id="photoURL" name="photoURL" onChange={handleProfileImage} className="hidden" />
                            </>
                            {
                                userDetails.photoURL !== "" &&
                                <img src={userDetails.photoURL} alt="profile" className="w-64 h-64 rounded-full object-cover" />
                            }
                        </div>
                        <div className="mt-4 text-center">
                            <h4 className="text-2xl font-light mb-2">{userDetails.url}</h4>
                            <p className="text-sm">{userDetails.email}</p>
                            <p className="text-lg">{userDetails.phone}</p>
                        </div>
                        <div className="mt-8 text-center">
                            <h4 className="text-2xl font-medium text-slate-200 mb-2">About</h4>
                            <p className="text-sm px-6">{userDetails.about}</p>
                        </div>
                    </div>
                </div>
                <div className="col-span-2">
                    <div className="bg-slate-900 rounded-lg p-4 h-full">
                        <div className="mb-7">
                            <h5 className="mb-4 font-medium text-lg">Personal Details</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField name="displayName" label="Full Name" value={userDetails.displayName} onChange={handleProfileChange} />
                                <InputField name="email" label="Email" value={userDetails.email} onChange={handleProfileChange} />
                                <InputField type="number" name="phone" label="Phone" className="appearance-none" value={userDetails.phone} onChange={handleProfileChange} />
                                <InputField name="website" label="Website" value={userDetails.website} onChange={handleProfileChange} />
                                <div className="col-span-2">
                                    <label className="mb-3 block">About</label>
                                    <textarea name="about" label="About" value={userDetails.about} className="focus:outline-none border h-20 border-gray-200 p-4 w-full" onChange={handleProfileChange} />
                                </div>
                            </div>
                        </div>
                        <div className="mb-7">
                            <h5 className="mb-4 font-medium text-lg">Address</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <InputField name="street" label="Street" value={userDetails.street} onChange={handleProfileChange} />
                                <InputField name="city" label="City" value={userDetails.city} onChange={handleProfileChange} />
                                <InputField name="state" label="State" value={userDetails.state} onChange={handleProfileChange} />
                                <InputField name="pincode" label="Pincode" value={userDetails.pincode} onChange={handleProfileChange} />
                            </div>
                        </div>
                        <Button primary onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default UserDetails