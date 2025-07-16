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
import PropTypes from 'prop-types';

const PhotoCard = ({ images, house }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");

  // Fetch user data and favorites
  useEffect(() => {
    if (!userToken) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/me', {
          headers: { 'authorization': `Bearer ${userToken}` }
        });
        setUser(response.data.user);
        setFavorites(response.data.user.favoriteHouses || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [userToken]);

  // Image navigation handlers
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Toggle favorite status
  const toggleFavorite = async (houseId) => {
    if (!userToken) return;
    
    setIsLoading(true);
    try {
      await axios.put('/api/users/handle-favorite', 
        { house: houseId }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${userToken}`
          }
        }
      );

      setFavorites((prev) =>
        prev.some(h => h._id === houseId)
          ? prev.filter(h => h._id !== houseId)
          : [...prev, { _id: houseId }]
      );
    } catch (err) {
      console.error('Error updating favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorited = favorites.some(fav => fav._id === house._id);

  return (
    <article className="bg-white rounded-lg md:rounded-xl overflow-hidden transition-all duration-300 ease-in-out">
      {/* Image Carousel Section */}
      <div className="relative aspect-[4/3]">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={images[currentIndex]}
          alt={`${house.name} - Slide ${currentIndex + 1}`}
          loading="lazy"
        />
        
        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(house._id)}
          disabled={isLoading}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors"
        >
          {isFavorited ? (
            <RiHeart3Fill className="w-5 h-5 text-red-500" />
          ) : (
            <RiHeart3Line className="w-5 h-5 text-gray-700 hover:text-red-500 transition-colors" />
          )}
        </button>
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/70 hover:bg-white rounded-full shadow-sm transition-colors"
            >
              <RiArrowLeftSLine className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/70 hover:bg-white rounded-full shadow-sm transition-colors"
            >
              <RiArrowRightSLine className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <Link 
            to={`/house/${house._id}`} 
            className="hover:opacity-90 transition-opacity"
          >
            <h3 className="text-gray-800 font-medium text-lg line-clamp-1">
              {house.name}
            </h3>
          </Link>
          
          {house.reviews?.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600 shrink-0">
              <RiStarFill className="w-4 h-4 text-yellow-400" />
              <span>({house.reviews.length})</span>
            </div>
          )}
        </div>
        
        <p className="mt-2 text-gray-600 line-clamp-2 text-sm">
          {house.description}
        </p>
        
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-500 text-xs">قیمت به ازای هر شب</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {new Intl.NumberFormat('fa-IR').format(house.price)} تومان
          </p>
        </div>
      </div>
    </article>
  );
};

PhotoCard.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  house: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    reviews: PropTypes.array,
  }).isRequired,
};

export default PhotoCard;