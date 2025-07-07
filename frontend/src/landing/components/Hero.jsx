import React, { useEffect } from "react"

import { Link } from "react-router-dom";
import Navbar from "./SearchHouseComponent";
import { RiTentLine, RiMenuLine } from "@remixicon/react";
import { SlUser } from "react-icons/sl";

import useUserAuthStore from "../store/authStore"


export default function Hero() {

  const { isAuthenticated, checkAuth,user } = useUserAuthStore()


  useEffect(() => {
    checkAuth()
  }, [checkAuth])




  return (
    <div
      className="relative mb-12 h-[clamp(450px,50vh,580px)] rounded-b-3xl overflow-hidden"
      style={{
        backgroundImage: `url("../../../images/covers/cover3.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* Black overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content goes here */}
      <div className="relative z-10">
        <Navbar />
      </div>
    </div>

  );
}