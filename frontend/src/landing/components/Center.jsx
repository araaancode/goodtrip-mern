import { useEffect, useState } from "react";
import axios from "axios";
import ArrowLeftIcon from '@iconscout/react-unicons/icons/uil-angle-left.js'
import ArrowRightIcon from '@iconscout/react-unicons/icons/uil-angle-right.js'
import { Link } from "react-router-dom"
import PhotoCard from "./PhotoCard"


const Center = ({ houses }) => {
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
            <div className="mt-8 mb-10 grid gap-x-6 gap-y-8 grid-cols-6 md:grid-cols-4 lg:grid-cols-4 min-w-4xl">
                {/* {houses.length > 0 && houses.slice(13, 19).map(house => (

                    // <Link to={'/house/' + house._id} key={house._id}>
                    //     <div className="bg-gray-500 mb-2 rounded-xl flex">
                    //         {house.images?.[0] && (
                    //             <Image className="rounded-xl object-cover aspect-square" src={house.images?.[0]} alt="" />
                    //         )}
                    //     </div>
                    //     <h2 className="font-bold">{house.address}</h2>
                    //     <h3 className="text-gray-500">{house.name}</h3>
                    //     <div className="mt-1 text-sm">
                    //         قیمت به ازای هر شب
                    //         <span className="font-bold"> {house.price}</span>
                    //         <small className="text-gray-500 block">{house.description}</small>
                    //     </div>
                    // </Link>

                    <h1>Hello</h1>

                ))} */}
                    {houses.slice(21, 100).map((_, index) => (
                        <PhotoCard key={index} images={houses[index].images} house={houses[index]} />
                    ))}


            </div>
        </div>
    )
}

export default Center