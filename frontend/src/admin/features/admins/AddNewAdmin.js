import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../components/Input/InputText'
import ErrorText from '../../components/Typography/ErrorText'
import { showNotification } from "../common/headerSlice"
import { addNewLead } from "../leads/leadSlice"

import { RiEye2Line, RiEyeCloseLine, RiPhoneLine } from "@remixicon/react"
import { CiUser } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";

const INITIAL_ADMIN_OBJ = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
}

function AddNewAdmin({ closeModal }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [leadObj, setLeadObj] = useState(INITIAL_ADMIN_OBJ)
    const [errorPhoneMessage, setErrorPhoneMessage] = useState("")
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const saveNewLead = () => {
        // if (name.trim() === "") return setErrorMessage("نام باید وارد شود!")
        // else if (email.trim() === "") return setErrorMessage("ایمیل باید وارد شود!")
        // else if (phone.trim() === "") return setErrorMessage("شماره همراه باید وارد شود!")
        // else if (role.trim() === "") return setErrorMessage("نقش باید وارد شود!")

        // else {
        let newLeadObj = {
            "id": 7,
            "name": name,
            "email": email,
            "phone": phone,
            "role": role,
            "avatar": "https://cdn-icons-png.flaticon.com/128/2632/2632839.png"
        }
        dispatch(addNewLead({ newLeadObj }))
        dispatch(showNotification({ message: "ادمین جدید ایجاد شد!", status: 1 }))
        closeModal()
        // }
    }

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("")
        setLeadObj({ ...leadObj, [updateType]: value })
    }

    const handleNameChange = (e) => {
        setName(e.target.value);
    };


    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div className="px-5 py-5">
            <div className="flex flex-col mb-6">
                <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"> نام و نام خانوادگی</label>
                <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <RiPhoneLine className="w-6 h-6 text-gray-400" />
                    </div>
                    <input style={{ borderRadius: '5px' }} type="text" value={name}
                        onChange={handleNameChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره تلفن" />
                </div>
                <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
            </div>

            <div className="flex flex-col mb-6">
                <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره تلفن</label>
                <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <CiUser className="w-6 h-6 text-gray-400" />
                    </div>
                    <input style={{ borderRadius: '5px' }} type="text" value={phone}
                        onChange={handlePhoneChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره تلفن" />
                </div>
                <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
            </div>

            <div className="flex flex-col mb-6">
                <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600"> ایمیل</label>
                <div className="relative">
                    <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                        <TfiEmail className="w-6 h-6 text-gray-400" />
                    </div>
                    <input style={{ borderRadius: '5px' }} type="text" value={email}
                        onChange={handleEmailChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" placeholder="شماره تلفن" />
                </div>
                <span className='text-red-500 relative text-sm'>{errorPhoneMessage ? errorPhoneMessage : ""}</span>
            </div>

            <div className="modal-action" dir="ltr">
                <button className="btn bg-gray-200 hover:bg-gray-300 mx-2" onClick={() => closeModal()}>لغو</button>
                <button className="btn bg-blue-800 hover:bg-blue-900 px-12 text-white" onClick={() => saveNewLead()}>تایید</button>
            </div>
        </div>
    )
}

export default AddNewAdmin