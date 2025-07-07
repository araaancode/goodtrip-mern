import React, { useState, useEffect } from 'react';
import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiHeart3Line,
    RiStarFill,
    RiHeart3Fill
} from "@remixicon/react";
import { Link } from "react-router-dom";
import axios from "axios";

const Card = ({ images, house }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [favorites, setFavorites] = useState([]);
    const [user, setUser] = useState({});
    const userToken = localStorage.getItem("userToken");

    useEffect(() => {
        if (!userToken) return;

        axios.get('/api/users/me', {
            headers: { 'authorization': `Bearer ${userToken}` }
        })
            .then(res => {
                setUser(res.data.user);
                setFavorites(res.data.user.favoriteHouses);
            })
            .catch(err => console.error(err));
    }, [userToken]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const toggleFavorite = async (houseId) => {
        try {
            await axios.put('/api/users/handle-favorite', { house: houseId }, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${userToken}`
                }
            });

            // Optimistically toggle favorite
            setFavorites((prev) =>
                prev.some(h => h._id === houseId)
                    ? prev.filter(h => h._id !== houseId)
                    : [...prev, { _id: houseId }]
            );
        } catch (err) {
            console.error(err);
        }
    };

    const isFavorited = favorites.some(fav => fav._id === house._id);

    return (
        <div className="group bg-white rounded-lg md:rounded-xl overflow-hidden transition duration-300">
        <div className="relative">
          <img
            className="w-full object-cover h-64 sm:h-72 md:h-80"
            src={images[currentIndex]}
            alt={`Slide ${currentIndex}`}
          />
      
          <button
            onClick={() => toggleFavorite(house._id)}
            aria-label="Toggle Favorite"
            className="absolute top-4 right-4 text-white"
          >
            {isFavorited ? (
              <RiHeart3Fill className="w-8 h-8 hover:text-blue-900" />
            ) : (
              <RiHeart3Line className="w-8 h-8 hover:text-blue-900" />
            )}
          </button>
      
          <button
            onClick={handlePrevious}
            aria-label="Previous Image"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-1 rounded-full shadow"
          >
            <RiArrowLeftSLine />
          </button>
      
          <button
            onClick={handleNext}
            aria-label="Next Image"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 p-1 rounded-full shadow"
          >
            <RiArrowRightSLine />
          </button>
        </div>
      
        <div className="mt-3 px-4">
          <div className="flex justify-between items-center">
            <Link to={`/house/${house._id}`}>
              <h3 className="text-gray-800 font-vazir text-base sm:text-lg group-hover:text-blue-900 transition">
                {house.name}
              </h3>
            </Link>
            <div className="flex items-center text-sm text-gray-600 group-hover:text-blue-900 transition">
              <span>({house.reviews.length} نظر)</span>
            </div>
          </div>
      
          <div className="mt-1">
            <p className="text-gray-700 text-sm sm:text-base font-semibold group-hover:text-blue-900 transition">
              {house.description.slice(0, 35)}...
            </p>
            <p className="text-gray-700 text-sm group-hover:text-blue-900 transition my-2">قیمت به ازای هر شب</p>
            <p className="text-lg font-bold text-gray-900 font-vazir group-hover:text-blue-900 transition mb-3">
              {house.price}
            </p>
          </div>
        </div>
      </div>
      

    );
};

export default Card;
