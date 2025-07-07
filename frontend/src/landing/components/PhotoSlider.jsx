import { useEffect, useState } from "react";
import axios from "axios";
import ArrowLeftIcon from '@iconscout/react-unicons/icons/uil-angle-left.js'
import ArrowRightIcon from '@iconscout/react-unicons/icons/uil-angle-right.js'
import { Link } from "react-router-dom"
import Image from "../components/Image";


const images = [
    'https://plus.unsplash.com/premium_photo-1684348962314-64fa628992f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y290dGFnZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1562182384-08115de5ee97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y290dGFnZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1579627559241-aa855a66df15?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y290dGFnZXxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1580202313707-46a966af5c6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNvdHRhZ2V8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNvdHRhZ2V8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1579690602005-647035ff79c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNvdHRhZ2V8ZW58MHx8MHx8fDA%3D',
    'https://media.istockphoto.com/id/1354034882/photo/3d-rendering-of-modern-cozy-bungalow.webp?b=1&s=170667a&w=0&k=20&c=2qScKN-bKLcG7tONLm2Z0x9bKYiwi2rBWAZhmitYSFI=',
    'https://media.istockphoto.com/id/1492307477/photo/modern-house-with-swimming-pool-and-solar-panels.webp?b=1&s=170667a&w=0&k=20&c=B3BmyGtA_dGlIFf7s1xYXn4F5ufUuey3PjtBiv1Oe_o=',
    'https://media.istockphoto.com/id/1414798334/photo/idyllic-landscape-in-the-alps-with-mountain-chalet-and-cows-in-springtime.webp?b=1&s=170667a&w=0&k=20&c=onSzb-JFa2_yqyQS3_KIYSLlmGuolyqgPLvn_WVVUsc=',
    'https://plus.unsplash.com/premium_photo-1661908377130-772731de98f6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG91c2V8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG91c2V8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhvdXNlfGVufDB8fDB8fHww',
    'https://plus.unsplash.com/premium_photo-1661962841993-99a07c27c9f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG91c2V8ZW58MHx8MHx8fDA%3D',
    'https://media.istockphoto.com/id/1916980202/photo/solar-photovoltaic-panels-on-a-wood-house-roof.webp?b=1&s=170667a&w=0&k=20&c=r7L3DXd5_5OfUhen5iJzM4uOiQWICsqPMN-3WrTPqhQ=',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBhcnRtZW50fGVufDB8fDB8fHww',
    'https://plus.unsplash.com/premium_photo-1684175656320-5c3f701c082c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXBhcnRtZW50fGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFwYXJ0bWVudHxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlsbGF8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1682377521741-66b111791809?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dmlsbGF8ZW58MHx8MHx8fDA%3D',
    'https://plus.unsplash.com/premium_photo-1682377521697-bc598b52b08a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8dmlsbGF8ZW58MHx8MHx8fDA%3D',
    'https://images.unsplash.com/photo-1444676632488-26a136c45b9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdXNlfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1465301055284-72f355cfd745?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvdXNlfGVufDB8fDB8fHww',
    'https://media.istockphoto.com/id/1597695209/photo/open-floor-plan-with-dining-table-near-kitchen-and-island.webp?b=1&s=170667a&w=0&k=20&c=JniYENFTsc1xvxdRqLgrWZp-kC0IvmQTsNV4KDTpIgY=',
];



const PhotoSlider = ({ houses }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imagesPerPage = 6;


    const nextSlide = () => {
        if (currentIndex < images.length - imagesPerPage) {
            setCurrentIndex(currentIndex + imagesPerPage);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - imagesPerPage);
        }
    };




    return (
        <div className='bg-black text-white p-8'>
            <div className="flex justify-between items-center">
                <div className="text">

                    <h1 className="text-2xl font-bold">  اقامتگاه های اقتصادی ویژه همراه با تخفیف</h1>
                    <h4 className="mt-1">رزرو اقامتگاه‌ با تخفیف‌های هیجان انگیز</h4>
                </div>
                <div className="buttons ">
                    <button
                        onClick={prevSlide}
                        className="btn mr-2 w-10 h-10 bg-white p-2 border border-gray-300 rounded-xl"
                        disabled={currentIndex === 0}
                    >
                        <ArrowRightIcon />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="btn mr-2 w-10 h-10 bg-white p-2 border border-gray-300 rounded-xl"
                        disabled={currentIndex >= images.length - imagesPerPage}
                    >
                        <ArrowLeftIcon />
                    </button>
                </div>
            </div>

            <div className="relative w-full my-8">
                <div className="flex overflow-hidden">
                    {images.slice(currentIndex, currentIndex + imagesPerPage).map((image, index) => (
                        <img style={{ width: '200px', height: '200px' }} key={index} src={image} alt={`Slide ${index}`} className=" mx-4 rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PhotoSlider