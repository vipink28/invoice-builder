import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import Button from "../components/forms/Button";
import InputField from "../components/forms/InputField";
import { convertBase64 } from "../helper";
import { updateUserProfile } from "../helper/apiMethods";

const Profile = () => {
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

    const { user } = useAuth();
    const [profileDetails, setProfileDetails] = useState(init);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileDetails((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleProfileImage = async (e) => {
        const file = e.target.files[0];
        const url = await convertBase64(file);
        setProfileDetails((prev) => ({
            ...prev,
            photoURL: url
        }))
    }


    useEffect(() => {
        if (user) {
            setProfileDetails((prev) => ({
                ...prev,
                ...user,
            }));
        }
    }, [user]);

    const handleSave = async () => {
        try {
            await updateUserProfile(user.uid, profileDetails);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1">
                <div className="bg-slate-900 rounded-lg p-4 h-full">
                    <div className="w-64 h-64 rounded-full bg-slate-800 mx-auto relative group">
                        <>
                            <label htmlFor="photoURL" className={`w-64 h-64 cursor-pointer absolute top-0 left-0 flex z-10 justify-center items-center ${profileDetails.photoURL !== "" ? "invisible group-hover:visible bg-slate-900/55" : "visible"}`}>
                                <Upload className="w-8 h-8" />
                            </label>
                            <input type="file" id="photoURL" name="photoURL" onChange={handleProfileImage} className="hidden" />
                        </>
                        {
                            profileDetails.photoURL !== "" &&
                            <img src={profileDetails.photoURL} alt="profile" className="w-64 h-64 rounded-full object-cover" />
                        }
                    </div>
                    <div className="mt-4 text-center">
                        <h4 className="text-2xl font-light mb-2">{profileDetails.url}</h4>
                        <p className="text-sm">{profileDetails.email}</p>
                        <p className="text-lg">{profileDetails.phone}</p>
                    </div>
                    <div className="mt-8 text-center">
                        <h4 className="text-2xl font-medium text-slate-200 mb-2">About</h4>
                        <p className="text-sm px-6">{profileDetails.about}</p>
                    </div>
                </div>
            </div>
            <div className="col-span-2">
                <div className="bg-slate-900 rounded-lg p-4 h-full">
                    <div className="mb-7">
                        <h5 className="mb-4 font-medium text-lg">Personal Details</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField name="displayName" label="Full Name" value={profileDetails.displayName} onChange={handleProfileChange} />
                            <InputField name="email" label="Email" value={profileDetails.email} onChange={handleProfileChange} />
                            <InputField type="number" name="phone" label="Phone" value={profileDetails.phone} onChange={handleProfileChange} />
                            <InputField name="website" label="Website" value={profileDetails.website} onChange={handleProfileChange} />
                            <div className="col-span-2">
                                <label className="mb-3 block">About</label>
                                <textarea name="about" label="About" value={profileDetails.about} className="focus:outline-none border h-20 border-gray-200 p-4 w-full" onChange={handleProfileChange} />
                            </div>
                        </div>
                    </div>
                    <div className="mb-7">
                        <h5 className="mb-4 font-medium text-lg">Address</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField name="street" label="Street" value={profileDetails.street} onChange={handleProfileChange} />
                            <InputField name="city" label="City" value={profileDetails.city} onChange={handleProfileChange} />
                            <InputField name="state" label="State" value={profileDetails.state} onChange={handleProfileChange} />
                            <InputField name="pincode" label="Pincode" value={profileDetails.pincode} onChange={handleProfileChange} />
                        </div>
                    </div>
                    <Button primary onClick={handleSave}>Save</Button>
                </div>
            </div>
        </div>
    )
}

export default Profile