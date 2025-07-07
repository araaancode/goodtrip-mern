import { useEffect, useState } from "react";
import ArrowLeftIcon from '@iconscout/react-unicons/icons/uil-angle-left.js'
import ArrowRightIcon from '@iconscout/react-unicons/icons/uil-angle-right.js'
import { Link } from "react-router-dom"
import PhotoCard from "./PhotoCard"

import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiHeart3Line,
    RiStarFill,
    RiStarHalfLine
} from "@remixicon/react";

import Spinner from "./Spinner"


const North = ({ houses }) => {


    return (
        <div className='p-8 mt-10'>
            <div className="flex justify-between items-center">
                <div className="text">
                    <h1 className="text-2xl font-bold">جدیدترین بومگردی‌ها و اقامتگاه‌ها</h1>
                    <h4 className="mt-1">بومگردی‌ و اقامتگاه، اختصاصی با ما</h4>
                </div>
                <div className="buttons ">
                    <button className="btn mr-2 w-10 h-10 bg-white text-black p-2 border border-gray-300 rounded-xl"><ArrowRightIcon /></button>
                    <button className="btn mr-2 w-10 h-10 bg-white text-black p-2 border border-gray-300 rounded-xl"><ArrowLeftIcon /></button>
                </div>
            </div>
            {houses ? (<div className="mt-8 mb-10 grid gap-x-6 gap-y-8 grid-cols-6 md:grid-cols-4 lg:grid-cols-4 min-w-4xl">
                {houses.slice(0, 20).map((_, index) => (
                    <PhotoCard key={index} images={houses[index].images} house={houses[index]} />
                ))}
            </div>) : (
                < Spinner />
            )
            }
        </div>
    )
}

export default North