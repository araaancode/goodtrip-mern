// src/BookingsPage.js
import React, { useState, useEffect } from 'react';
import { RiTentLine, RiUser3Fill, RiSearchLine, RiCalendar2Line, RiLogoutBoxRLine, RiHeart2Line, RiBankCard2Line, RiNotificationLine, RiCustomerService2Line, RiCameraFill } from "@remixicon/react";
import { FaCamera } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios"
import HeaderPages from '../components/HeaderPages';
import Footer from "../components/Footer"

import { IoIosCamera } from "react-icons/io";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BookingsPage = () => {

  const [name, setName] = useState('')
  const [user, setUser] = useState('')
  const [items, setItems] = useState([])
  const navigate = useNavigate();

  const userToken = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null

  // State for the search term and selected category
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    axios.get('/api/users/me', {
      headers: {
        'authorization': 'Bearer ' + userToken
      }
    })
      .then((res) => {
        setUser(res.data.user)
      })
      .catch((err) => console.error(err));

    // bookings
    axios.get('/api/users/bookings', {
      headers: {
        'authorization': 'Bearer ' + userToken
      }
    })
      .then((res) => {
        // console.log(res.data.bookings);
        setItems(res.data.bookings)
      })
      .catch((err) => console.error(err));
  }, [userToken])


  // Handle the search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle category selection change
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Unique categories
  // const categories = [...new Set(items.map(item => item.house.houseType))];
  const categories = ["cottage", "apartment", "garden", "villa", "room"];


  const persianHouseType = (type) => {
    switch (type) {
      case "cottage":
        return "کلبه"
        break;

      case "apartment":
        return "آپارتمان"
        break;

      case "garden":
        return "باغ"
        break;

      case "villa":
        return "ویلا"
        break;

      case "room":
        return "اتاق"
        break;

      default:
        break;
    }
  }


  // Filter items based on search term and selected category
  const filteredItems = items.filter(item => {
    let houseType = persianHouseType(item.house.houseType)
    const matchesSearch = item.house.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.house.houseType === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  const cancelBooking = async (id) => {
    await axios.put(`/api/users/cancel-booking/${id}`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      }
    })
      .then((res) => {
        toast.info(res.data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

      })
      .catch((err) => {
        toast.error(err, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      });
  }

  function logout() {
    localStorage.removeItem("userToken")
    navigate('/');
    window.location.reload()

  }


  return (
    <>
      <HeaderPages />
      <div className="flex flex-col md:flex-row p-4 rtl mt-4">

        {/* User Basic Information Column 1 */}
        <div className="w-full md:w-1/4 py-6 bg-white border border-gray-200 rounded-lg shadow mb-4 md:mb-0">
          <div className="mb-8 px-4 text-center mx-auto flex justify-center">
            <div className="relative" style={{ width: '160px', height: '160px' }}>
              <img
                src="https://cdn-icons-png.flaticon.com/128/17384/17384295.png"
                alt="user"
                className="object-cover rounded-full mx-auto"
              />
              <div className="absolute bottom-8 left-0 p-2 bg-white cursor-pointer shadow shadow-full rounded-full">
                <IoIosCamera className='text-blue-800 h-8 w-8' />
              </div>

              <p className="text-gray-900 text-center mt-2">{name ? user.name : user.phone}</p>
            </div>
          </div>


          <div className='border'></div>
          <div className='my-6 px-8'>
            <Link to="/profile">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiUser3Fill /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">حساب کاربری</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/bookings">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiCalendar2Line className='text-blue-800' /></span>
                <span style={{ fontSize: '18px' }} className="mr-4 text-blue-800">رزروهای من</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/favorites">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiHeart2Line /></span>
                <span style={{ fontSize: '18px' }} className="mr-4"> لیست علاقه مندی ها</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/bank">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiBankCard2Line /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">اطلاعات حساب بانکی</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/notifications">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiNotificationLine /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">لیست اعلان ها</span>
              </li>
            </Link>
          </div>

          <div className='my-6 px-8'>
            <Link to="/support">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiCustomerService2Line /></span>
                <span style={{ fontSize: '18px' }} className="mr-4">پشتیبانی</span>
              </li>
            </Link>
          </div>
          <div className='my-6 px-8'>
            <Link to="/">
              <li className="flex items-center mb-2">
                <span className="mr-2 text-gray-400"><RiLogoutBoxRLine /></span>
                <button className="mx-4" onClick={logout}>خروج</button>
              </li>
            </Link>
          </div>
        </div>


        {items.length > 0 ? (
          <div className="w-full md:w-3/4 p-6 bg-white border border-gray-200 rounded-lg shadow mx-10">
            <div className='flex justify-between items-center'>
              <div className="mb-4 ml-2" style={{ width: '80%' }}>
                <input
                  style={{ borderRadius: '5px', padding: '20px', border: '1px solid black' }}
                  type="text"
                  className="w-full border focus:outline-none"
                  placeholder="جستجو کنید..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div className="mb-4">
                <select
                  className="w-full p-6 border bg-white focus:outline-none"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  style={{ borderRadius: '5px', padding: '20px', border: '1px solid black' }}
                >
                  <option className='bg-white px-4' value="All">مرتب سازی </option>
                  {categories.map((category, index) => (
                    <option className='bg-white' key={index} value={category}>
                      {persianHouseType(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filteredItems.map((item, index) => (
              // <div key={index} className="py-6 px-4 my-6">
              //   {item.name} <span className="text-gray-500 text-sm">({item.category})</span>
              // </div>

              <div className="w-full flex justify-between rounded-lg overflow-hidden border bg-white my-4 py-4 mx-2" key={index}>
                <div className="px-2 py-4">
                  <div className="font-bold text-xl mb-2"> {item.house.name} {persianHouseType(item.house.houseType)}</div>
                  <div className="mb-2 text-gray-500">کد رزرو: {item._id}</div>
                </div>

                <div className="px-2 my-auto">
                  <div className="mb-2 text-gray-500"> {new Date(item.checkIn).toLocaleString("fa").split(',')[0]}</div>
                  <div className="mb-2 text-gray-500"> الی </div>
                  <div className="mb-2 text-gray-500"> {new Date(item.checkOut).toLocaleString("fa").split(',')[0]}</div>
                </div>

                <div className="px-2 my-auto">
                  <p className="mb-2 text-gray-500 inline"> {item.price} تومان</p>
                </div>
                <div className="px-2 my-auto">
                  <a href="#" onClick={()=>cancelBooking(item._id)} className="bg-blue-800 hover:bg-blue-900 mx-2 text-white font-bold py-4 px-6 rounded shadow-lg">
                    لغو رزرو
                  </a>

                  <a href={`/bookings/${item._id}`} className="bg-white border py-4 px-6 font-bold rounded">
                    جزئیات
                  </a>

                </div>
              </div>
            ))}
          </div>) : (
          <div className="w-full md:w-3/4 p-6 bg-white border border-gray-200 rounded-lg shadow mx-10">


            <div className="flex items-center justify-center h-screen">
              <div className="bg-whit p-8 text-center">
                <h1 className='text-xl text-gray-500'>شما هیچ رزروی ندارید !!!</h1>
              </div>
            </div>
          </div>
        )}

        {/* Update User Information Column 2 */}

        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default BookingsPage;
