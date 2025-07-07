import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import AddressLink from "./AddressLink";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/teal.css";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function BookingWidget({ house, id }) {

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());

  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const [bookings, setBookings] = useState([])


  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  const userToken = localStorage.getItem("userToken") ? localStorage.getItem("userToken") : null

  async function bookHouse(e) {
    e.preventDefault();

    const url = '/api/users/book-house';

    const data = {
      house: house._id,
      owner: house.owner,
      checkIn: checkIn,
      checkOut: checkOut,
      price: house.price * numberOfNights,
      guests: numberOfGuests
    };

    // Define the headers, including the Authorization header
    const headers = {
      'authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    };

    await axios.post(url, data, { headers: headers })
      .then(response => {
        toast.success(response.data.msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

      })
      .catch(error => {
        console.error('Error:', error);
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });

  }

  useEffect(() => {
    axios.get('/api/users/bookings', {
      headers: {
        'authorization': 'Bearer ' + userToken
      }
    })
      .then((res) => {
        console.log(res.data.bookings);
        setBookings(res.data.bookings)

      })
      .catch((err) => console.error(err));
  }, [])



  let foundBooking = bookings.find(b => b.house === house._id)





  return (
    <div dir="rtl" className="bg-white border p-8 rounded-2xl">

      <div className="text-sm text-center text-gray-700 flex justify-between">
        <p style={{ fontSize: '16px' }} className="inline">قیمت به ازای هر شب/  <b style={{ fontSize: "20px" }}>{house.price} تومان</b> </p>
        <AddressLink></AddressLink>
      </div>
      <div style={{ borderRadius: '5px' }} className="border mt-4">
        <form onSubmit={bookHouse}>
          <div className="flex">
            <div className="py-3 px-4">
              <label className="mx-3 py-4" style={{ fontSize: '18px' }}>تاریخ ورود:</label>

              <DatePicker
                value={checkIn}
                onChange={setCheckIn}
                calendar={persian}
                locale={persian_fa}
                className="blue"
                style={{ border: 'none' }}
              />
            </div>
            <div className="w-px bg-gray-300"></div>
            <div className="py-3 px-4 border-l">
              <label className="mx-3 py-4" style={{ fontSize: '18px' }}>تاریخ خروج:</label>
              {/* <input type="date" value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)}
              className="mt-2"
            /> */}
              <DatePicker
                value={checkOut}
                onChange={setCheckOut}
                calendar={persian}
                locale={persian_fa}
                className="blue"
                style={{ border: 'none' }}
              />


            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label>تعداد مهمان ها:</label>
            <input style={{ borderRadius: '5px' }} type="number" className="focus:outline-blue-200"
              value={numberOfGuests}
              onChange={ev => setNumberOfGuests(ev.target.value)} />
          </div>
          <button
            type="submit" disabled={foundBooking ? true : false} style={{
              fontSize: '18px'
            }} className="bg-transparent hover:bg-blue-800 text-blue-700 font-bold hover:text-white py-4 px-4 border border-blue-500 hover:border-transparent rounded mt-4 w-full">
            {foundBooking ? "این اقامتگاه را قبلا رزرو کردید!" : " رزرو این اقامتگاه"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div >
  );
}