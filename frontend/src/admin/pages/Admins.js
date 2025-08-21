import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import TitleCard from "../components/Cards/TitleCard"
import { showNotification } from '../features/common/headerSlice'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { openModal } from "../features/common/modalSlice"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { setPageTitle } from '../features/common/headerSlice'
import axios from "axios"
import { RiUser3Line } from "@remixicon/react"
import "../components/modal.css"
import { RiEye2Line, RiEyeCloseLine, RiPhoneLine, RiUserSmileLine, RiUser2Line, RiMailLine, RiUser5Line } from "@remixicon/react"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@iconscout/react-unicons/icons/uil-trash-alt'
import EditIcon from '@iconscout/react-unicons/icons/uil-edit-alt'
import { useAdminAuthStore } from "../stores/authStore"

const TopSideButtons = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate()
    const { register, isLoading, error } = useAdminAuthStore();

    const handleChange = (e) => {
        setRole(e.target.value);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePhoneChange = (e) => {
        setPhone(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const createNewAdmin = async (e) => {
        e.preventDefault()

        if (!phone || !password || !name || !username || !email || !role) {
            toast.error('لطفا همه فیلدها را وارد کنید', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        try {
            await register({ phone, password, name, username, email, role });
            
            toast.success('ادمین با موفقیت ایجاد شد', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                navigate('/admins/all-admins')
            }, 2000);
        } catch (error) {
            console.error('Registration error:', error);
            // Error is already handled in the store
        }
    }

    return (
        <>
            <div className="inline-block">
                <button className="btn p-4 bg-blue-800 hover:bg-blue-900 text-white" onClick={openModal}>
                    {isLoading ? 'در حال ایجاد...' : 'ایجاد ادمین جدید'}
                </button>
            </div>
            <div>
                {isOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content mx-10">
                            <h3 className="my-4">ایجاد ادمین جدید</h3>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                                {/* name */}
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام و نام خانوادگی </label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <RiUser2Line />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" value={name}
                                            onChange={handleNameChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" />
                                    </div>
                                </div>

                                {/* username */}
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">نام کاربری</label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <RiUser5Line />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" value={username}
                                            onChange={handleUsernameChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" />
                                    </div>
                                </div>

                                {/* phone */}
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">شماره همراه</label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <RiPhoneLine />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" value={phone}
                                            onChange={handlePhoneChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" />
                                    </div>
                                </div>

                                {/* email */}
                                <div className="flex flex-col mb-6">
                                    <label htmlFor="phone" className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">  ایمیل</label>
                                    <div className="relative">
                                        <div className="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                                            <RiMailLine />
                                        </div>
                                        <input style={{ borderRadius: '5px' }} type="text" value={email}
                                            onChange={handleEmailChange} className="text-sm sm:text-base placeholder-gray-400 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-800" />
                                    </div>
                                </div>

                                {/* role */}
                                <div className="admin-role-select w-full mx-auto mt-1">
                                    <label htmlFor="adminRole" className="block mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                                        نقش ادمین
                                    </label>
                                    <select
                                        id="adminRole"
                                        value={role}
                                        onChange={handleChange}
                                        className="block w-full items-center px-3 py-3 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    >
                                        <option value="">انتخاب نقش</option>
                                        <option value="superAdmin">مدیر اصلی</option>
                                        <option value="admin">مدیر داخلی</option>
                                        <option value="moderator">نویسنده</option>
                                    </select>
                                    {role && (
                                        <p className="mt-3 text-sm text-gray-600">
                                            نقش انتخاب شده <span className="font-semibold">{role}</span>
                                        </p>
                                    )}
                                </div>

                                {/* password */}
                                <div className="flex flex-col mb-1">
                                    <div className="mb-2 relative">
                                        <label className="block mb-1 sm:text-sm tracking-wide text-gray-600" htmlFor="password">
                                            گذرواژه
                                        </label>

                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            id="password"
                                            onChange={handlePasswordChange}
                                            value={password}
                                            className="w-full px-4 py-2 border border-gray-400 placeholder-gray-400 rounded-sm focus:outline-none focus:border-blue-800"
                                            style={{ borderRadius: '5px' }}
                                        />

                                        <div
                                            onClick={togglePasswordVisibility}
                                            className="absolute inset-y-0 left-3 flex items-center cursor-pointer top-6"
                                        >
                                            {passwordVisible ? (
                                                <RiEye2Line className='text-gray-400' />
                                            ) : (
                                                <RiEyeCloseLine className='text-gray-400' />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={createNewAdmin} 
                                disabled={isLoading}
                                className="text-white modal-btn bg-blue-800 hover:bg-blue-900 disabled:bg-blue-400"
                            >
                                {isLoading ? 'در حال ایجاد...' : 'ایجاد ادمین جدید'}
                            </button>

                            <button onClick={closeModal} className="text-white modal-btn bg-gray-500 hover:bg-gray-600">
                                بستن
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

const deleteUser = async (adminId) => {
    try {
        const result = await Swal.fire({
            title: "<small>آیا از حذف ادمین اطمینان دارید؟</small>",
            showDenyButton: true,
            confirmButtonText: "بله",
            denyButtonText: `خیر`,
            icon: 'warning'
        });

        if (result.isConfirmed) {
            await axios.delete(`/api/admins/${adminId}`, {
                withCredentials: true
            });
            
            Swal.fire("<small>ادمین حذف شد!</small>", "", "success");
            return true;
        }
    } catch (error) {
        console.error('Delete error:', error);
        Swal.fire("<small>خطا در حذف ادمین</small>", error.response?.data?.msg || "خطایی رخ داده است", "error");
        return false;
    }
}

const Admins = () => {
    const [role, setRole] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [adminId, setAdminId] = useState("");
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "ادمین ها" }))
    }, [dispatch])

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admins', {
                withCredentials: true
            });
            setAdmins(response.data.admins || []);
        } catch (error) {
            console.error('Fetch admins error:', error);
            toast.error(error.response?.data?.msg || 'خطا در دریافت اطلاعات ادمین ها', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
            setLoading(false);
        }
    }

    const handleRoleChange = (e) => {
        setRole(e.target.value);
    };

    const openUpdateRoleModal = (adminId) => {
        setIsOpen(true);
        setAdminId(adminId)
    };

    const closeModal = () => {
        setIsOpen(false);
    }

    const getRoleComponent = (role) => {
        if (role === "superadmin") return <div className="badge badge-primary">ادمین</div>
        if (role === "admin") return <div className="badge badge-ghost">مدیر داخلی</div>
        if (role === "moderator") return <div className="badge badge-secondary"> نویسنده</div>
        else return <div className="badge">{role}</div>
    }

    const updateAdminRole = async () => {
        if (!role) {
            toast.error('لطفا یک نقش انتخاب کنید', {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        try {
            const result = await Swal.fire({
                title: "<small>آیا از ویرایش ادمین اطمینان دارید؟</small>",
                showDenyButton: true,
                confirmButtonText: "بله",
                denyButtonText: `خیر`,
                icon: 'question'
            });

            if (result.isConfirmed) {
                await axios.put(`/api/admins/${adminId}/change-role`, {role}, {
                    withCredentials: true
                });
                
                Swal.fire("<small>ادمین ویرایش شد!</small>", "", "success");
                fetchAdmins(); // Refresh the list
                closeModal();
            }
        } catch (error) {
            console.error('Update role error:', error);
            Swal.fire("<small>خطا در ویرایش</small>", error.response?.data?.msg || "خطایی رخ داده است", "error");
        }
    }

    const handleDeleteAdmin = async (adminId) => {
        const success = await deleteUser(adminId);
        if (success) {
            fetchAdmins(); // Refresh the list after deletion
        }
    }

    return (
        <>
            <TitleCard title="" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>
                <div>
                    {isOpen && (
                        <div className="modal-overlay">
                            <div className="modal-content mx-10" id="update-role-modal">
                                <h1 className="my-4 font-bold text-xl"> تغییر نقش ادمین </h1>
                                {/* role */}
                                <div className="admin-role-select w-full mx-auto mt-1">
                                    <select
                                        id="adminRole"
                                        value={role}
                                        onChange={handleRoleChange}
                                        className="block w-full items-center px-3 py-3 border border-gray-400 bg-white rounded-md shadow-sm focus:outline-none sm:text-sm"
                                    >
                                        <option value="">انتخاب نقش</option>
                                        <option value="superadmin">مدیر اصلی</option>
                                        <option value="admin">مدیر داخلی</option>
                                        <option value="moderator">نویسنده</option>
                                    </select>
                                    {role && (
                                        <p className="mt-3 text-sm text-gray-600">
                                            نقش انتخاب شده <span className="font-semibold">{role}</span>
                                        </p>
                                    )}
                                </div>

                                <button onClick={updateAdminRole} className="text-white modal-btn bg-blue-800 hover:bg-blue-900">
                                    ویرایش نقش ادمین
                                </button>

                                <button onClick={closeModal} className="text-white modal-btn bg-gray-500 hover:bg-gray-600">
                                    بستن
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        {admins.length > 0 ? (
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th>نام و نام خانوادگی</th>
                                        <th>ایمیل</th>
                                        <th>تاریخ عضویت</th>
                                        <th>نقش</th>
                                        <th>ویرایش </th>
                                        <th>حذف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((l, k) => {
                                        return (
                                            <tr key={k}>
                                                <td>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="avatar">
                                                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" className="h-8 w-8 text-gray-800" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M 13.0625 4 C 12.1875 4 11.417969 4.449219 10.875 5.03125 C 10.332031 5.613281 9.941406 6.339844 9.59375 7.125 C 9.0625 8.335938 8.683594 9.679688 8.34375 10.9375 C 7.257813 11.253906 6.335938 11.648438 5.59375 12.125 C 4.726563 12.683594 4 13.457031 4 14.5 C 4 15.40625 4.554688 16.132813 5.25 16.65625 C 5.84375 17.101563 6.574219 17.472656 7.4375 17.78125 C 7.488281 18.011719 7.5625 18.246094 7.65625 18.46875 C 6.8125 18.945313 5.476563 19.867188 4.1875 21.625 L 3.59375 22.46875 L 4.4375 23.0625 L 7.71875 25.3125 L 6.375 28 L 25.625 28 L 24.28125 25.3125 L 27.5625 23.0625 L 28.40625 22.46875 L 27.8125 21.625 C 26.523438 19.867188 25.1875 18.945313 24.34375 18.46875 C 24.4375 18.246094 24.511719 18.011719 24.5625 17.78125 C 25.425781 17.472656 26.15625 17.101563 26.75 16.65625 C 27.445313 16.132813 28 15.40625 28 14.5 C 28 13.457031 27.273438 12.683594 26.40625 12.125 C 25.664063 11.648438 24.742188 11.253906 23.65625 10.9375 C 23.28125 9.632813 22.867188 8.265625 22.34375 7.0625 C 22.003906 6.285156 21.628906 5.570313 21.09375 5 C 20.558594 4.429688 19.796875 4 18.9375 4 C 18.355469 4 17.914063 4.160156 17.4375 4.28125 C 16.960938 4.402344 16.480469 4.5 16 4.5 C 15.039063 4.5 14.234375 4 13.0625 4 Z M 13.0625 6 C 13.269531 6 14.5 6.5 16 6.5 C 16.75 6.5 17.417969 6.347656 17.9375 6.21875 C 18.457031 6.089844 18.851563 6 18.9375 6 C 19.167969 6 19.339844 6.074219 19.625 6.375 C 19.910156 6.675781 20.246094 7.21875 20.53125 7.875 C 21.074219 9.117188 21.488281 10.8125 21.9375 12.375 C 21.9375 12.371094 21.992188 12.328125 21.84375 12.40625 C 21.59375 12.542969 21.070313 12.71875 20.4375 12.8125 C 19.167969 13.003906 17.4375 13 16 13 C 14.570313 13 12.835938 12.980469 11.5625 12.78125 C 10.925781 12.683594 10.410156 12.511719 10.15625 12.375 C 10.078125 12.332031 10.050781 12.347656 10.03125 12.34375 C 10.03125 12.332031 10.03125 12.324219 10.03125 12.3125 C 10.035156 12.304688 10.027344 12.289063 10.03125 12.28125 C 10.042969 12.269531 10.050781 12.261719 10.0625 12.25 C 10.136719 12.117188 10.179688 11.964844 10.1875 11.8125 C 10.1875 11.800781 10.1875 11.792969 10.1875 11.78125 C 10.546875 10.453125 10.949219 9.046875 11.4375 7.9375 C 11.730469 7.269531 12.046875 6.726563 12.34375 6.40625 C 12.640625 6.085938 12.84375 6 13.0625 6 Z M 8.1875 13.09375 C 8.414063 13.5625 8.8125 13.9375 9.21875 14.15625 C 9.828125 14.480469 10.527344 14.632813 11.28125 14.75 C 12.789063 14.984375 14.554688 15 16 15 C 17.4375 15 19.207031 15.007813 20.71875 14.78125 C 21.476563 14.667969 22.167969 14.519531 22.78125 14.1875 C 23.191406 13.964844 23.589844 13.570313 23.8125 13.09375 C 24.429688 13.3125 24.949219 13.546875 25.3125 13.78125 C 25.894531 14.15625 26 14.433594 26 14.5 C 26 14.558594 25.949219 14.75 25.53125 15.0625 C 25.113281 15.375 24.394531 15.738281 23.46875 16.03125 C 21.617188 16.621094 18.953125 17 16 17 C 13.046875 17 10.382813 16.621094 8.53125 16.03125 C 7.605469 15.738281 6.886719 15.375 6.46875 15.0625 C 6.050781 14.75 6 14.558594 6 14.5 C 6 14.433594 6.078125 14.183594 6.65625 13.8125 C 7.019531 13.578125 7.554688 13.324219 8.1875 13.09375 Z M 10.78125 18.5625 C 11.109375 18.617188 11.433594 18.707031 11.78125 18.75 C 11.910156 19.628906 12.59375 20.402344 13.6875 20.46875 C 14.53125 20.519531 15.480469 20.121094 15.5625 19 C 15.710938 19 15.851563 19 16 19 C 16.148438 19 16.289063 19 16.4375 19 C 16.519531 20.121094 17.46875 20.519531 18.3125 20.46875 C 19.40625 20.402344 20.089844 19.628906 20.21875 18.75 C 20.566406 18.707031 20.890625 18.617188 21.21875 18.5625 L 21.125 19.1875 C 20.816406 20.832031 20.082031 22.355469 19.15625 23.40625 C 18.230469 24.457031 17.144531 25.015625 16 25 C 14.824219 24.984375 13.761719 24.417969 12.84375 23.375 C 11.925781 22.332031 11.203125 20.839844 10.875 19.1875 Z M 23 20 C 23.371094 20.21875 24.347656 20.859375 25.46875 22.09375 L 22.4375 24.1875 L 21.71875 24.65625 L 22.09375 25.4375 L 22.375 26 L 19.21875 26 C 19.742188 25.648438 20.226563 25.207031 20.65625 24.71875 C 21.757813 23.46875 22.496094 21.832031 22.90625 20.0625 C 22.941406 20.042969 22.96875 20.019531 23 20 Z M 8.96875 20.03125 C 9.007813 20.054688 9.054688 20.070313 9.09375 20.09375 C 9.523438 21.839844 10.257813 23.457031 11.34375 24.6875 C 11.792969 25.199219 12.316406 25.636719 12.875 26 L 9.625 26 L 9.90625 25.4375 L 10.28125 24.65625 L 9.5625 24.1875 L 6.53125 22.09375 C 7.589844 20.925781 8.554688 20.28125 8.96875 20.03125 Z"></path>
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold mr-3">{l.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{l.email}</td>
                                                <td>{new Date(l.createdAt).toLocaleDateString('fa')}</td>
                                                <td>{getRoleComponent(l.role)}</td>
                                                <td><button onClick={() => openUpdateRoleModal(l._id)}><EditIcon /></button></td>
                                                <td><button onClick={() => handleDeleteAdmin(l._id)}><DeleteIcon /></button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-8">
                                <h3 className="text-gray-500 text-lg">هنوز ادمینی وجود ندارد...</h3>
                            </div>
                        )}
                    </div>
                )}
                <ToastContainer />
            </TitleCard>
        </>
    )
}

export default Admins