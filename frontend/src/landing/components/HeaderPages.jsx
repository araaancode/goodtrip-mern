import React, { useState,useEffect } from 'react'
import { RiTentLine, RiMenuLine } from "@remixicon/react";
import { SlUser } from "react-icons/sl";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiShoppingCart } from "react-icons/ci";

import useCartStore from '../store/cartStore';



const convertCityPersianToEnglish = (city) => {
    switch (city) {
        case "اراک":
            return "arak"
            break;

        case "اردبیل":
            return "ardebil"
            break;


        case "ارومیه":
            return "oromieh"
            break;


        case "اصفهان":
            return "isfahan"
            break;

        case "اهواز":
            return "ahvaz"
            break;

        case "ایلام":
            return "elam"
            break;

        case "بجنورد":
            return "bognord"
            break;

        case "بندرعباس":
            return "bandar_abbas"
            break;

        case "بوشهر":
            return "boshehr"
            break;

        case "بیرجند":
            return "birgand"
            break;

        case "تبریز":
            return "tabriz"
            break;

        case "تهران":
            return "tehran"
            break;

        case "خرم آباد":
            return "khoram_abad"
            break;

        case "رشت":
            return "rasht"
            break;

        case "زاهدان":
            return "zahedan"
            break;

        case "زنجان":
            return "zanjan"
            break;

        case "ساری":
            return "sari"
            break;

        case "سمنان":
            return "semnan"
            break;

        case "سنندج":
            return "sanandaj"
            break;

        case "شهرکرد":
            return "sharekord"
            break;


        case "شیراز":
            return "shiraz"
            break;


        case "قزوین":
            return "ghazvin"
            break;

        case "قم":
            return "ghom"
            break;

        case "کرج":
            return "karaj"
            break;

        case "کرمان":
            return "kerman"
            break;

        case "کرمانشاه":
            return "kermanshah"
            break;


        case "گرگان":
            return "gorgan"
            break;

        case "مشهد":
            return "mashhad"
            break;

        case "همدان":
            return "hamedan"
            break;

        case "یاسوج":
            return "yasoj"
            break;

        case "یزد":
            return "yazd"
            break;

        default:
            break;
    }
}

const HeaderPages = () => {

    // ***************** navigate hook *****************
    const navigate = useNavigate();

    // ***************** store states *****************
    const { getTotalItems } = useCartStore()



    // ***************** states *****************
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [city, setCity] = useState(null);
    const userToken = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null
    const [cartCount, setCartCount] = useState(0)


    const searchHouse = async (e) => {
        e.preventDefault()

        if (city === null) {
            toast.error(" شهر باید وارد شود!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } else {
            setLoading(true);
            setError(null);

            try {
                const res = await axios.post('/api/users/search-houses', { city: convertCityPersianToEnglish(city) });
                navigate(`/search-houses?city=${convertCityPersianToEnglish(city)}`);

                console.log(res);
            } catch (err) {
                toast.error("جستجوی شما نتیجه ای نداشت!!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setError(err);
            } finally {
                setLoading(false);
            }
        }
    }



    useEffect(() => {
        setCartCount(getTotalItems())
    }, [cartCount])





    return (
        <>
            <header className="flex items-center justify-between p-4 bg-white">
                {/* Site Icon on the right */}
                <div className="flex items-center space-x-2 w-1/8">
                    <Link to="/">
                        <RiTentLine className="w-12 h-12" />
                    </Link>
                </div>

                {/* Search Input in the center */}
                <div className="flex gap-4 mb-4 sm:mb-0">
                    <Link to="/booking-house" className="font-bold relative after:absolute after:left-0 after:bottom-0 after:translate-y-2 after:w-0 after:h-[2px] after:bg-blue-900 after:transition-all after:duration-300 hover:after:w-full">
                        رزرو اقامتگاه
                    </Link>
                    <Link to="/booking-bus" className="font-bold relative after:absolute after:left-0 after:bottom-0 after:translate-y-2 after:w-0 after:h-[2px] after:bg-blue-900 after:transition-all after:duration-300 hover:after:w-full">
                        رزرو اتوبوس
                    </Link>

                    <Link to="/order-food" className="font-bold relative after:absolute after:left-0 after:bottom-0 after:translate-y-2 after:w-0 after:h-[2px] after:bg-blue-900 after:transition-all after:duration-300 hover:after:w-full">
                        سفارش غذا
                    </Link>
                </div>

                {/* Icons on the left */}
                <div className="flex items-center gap-4">
                    {/* Shopping Cart Icon with Badge */}
                    <Link
                        to="/cart"
                        className="relative p-2 group transition-all duration-200 flex items-center justify-center"
                    >
                        {/* Shopping Cart Icon with smooth hover effect */}
                        <CiShoppingCart className="w-8 h-8 text-gray-700 group-hover:text-blue-900 transition-colors duration-200" />

                        {/* Cart Item Count Badge - more prominent and with pulse animation */}
                        <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
                        >
                            {cartCount}
                        </span>


                    </Link>

                    {/* User Icon */}
                    <Link to={userToken ? "/profile" : "/login"}>
                        <div className="flex items-center p-2 space-x-4 hover:border hover:rounded-full hover:shadow-lg w-[80px] sm:w-[120px] h-[50px] sm:h-[60px] justify-end transition-colors duration-200 group">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 mx-2 sm:mx-3 rounded-full flex items-center justify-center">
                                <SlUser className="w-8 h-8 sm:w-6 sm:h-6 font-bold text-gray-700 group-hover:text-blue-900 transition-colors duration-200" />
                            </div>
                            <RiMenuLine className="w-8 h-8 sm:w-6 sm:h-6 font-bold text-gray-700 group-hover:text-blue-900 transition-colors duration-200" />
                        </div>

                    </Link>
                </div>
            </header>
            <div className="border border-gray-100"></div>
        </>
    )
}

export default HeaderPages