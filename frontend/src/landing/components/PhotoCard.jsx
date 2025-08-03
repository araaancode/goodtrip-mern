import React, { useState, useEffect } from 'react';
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiHeart3Line,
  RiStarFill,
  RiHeart3Fill
} from "@remixicon/react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import useStore from '../store/houseStore';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const PhotoCard = ({ images, house }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get stores
  const { user } = useAuthStore();
  const { toggleFavorite } = useStore();

  // Check if house is favorited
  const isFavorited = user?.favoriteHouses?.includes(house._id);

  // Image navigation
  const navigateImages = (direction) => {
    setCurrentIndex(prev => {
      if (direction === 'next') return (prev + 1) % images.length;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  // Auto-advance slides
  useEffect(() => {
    let interval;
    if (isHovered && images.length > 1) {
      interval = setInterval(() => {
        navigateImages('next');
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // Handle favorite toggle
  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('لطفاً برای افزودن به علاقه‌مندی‌ها وارد شوید');
      return;
    }

    setIsFavoriteLoading(true);
    try {
      await toggleFavorite(house._id);
    } catch (error) {
      toast.error('خطا در بروزرسانی علاقه‌مندی‌ها');
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  return (
    <motion.article
      className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[4/3] overflow-hidden group">
        <Link to={`/house/${house._id}`} className="block h-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              className="w-full h-full object-cover"
              src={images[currentIndex]}
              alt={house.name}
              loading="lazy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </Link>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isFavoriteLoading}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isFavorited ? 'bg-red-100 text-red-600' : 'bg-white/90 text-gray-700'
            }`}
          aria-label={isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
        >
          {isFavorited ? (
            <RiHeart3Fill className="w-5 h-5" />
          ) : (
            <RiHeart3Line className="w-5 h-5" />
          )}
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateImages('prev');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="عکس قبلی"
            >
              <RiArrowLeftSLine className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateImages('next');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="عکس بعدی"
            >
              <RiArrowRightSLine className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* House Info */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/house/${house._id}`} className="hover:opacity-90 flex-1">
            <h3 className="text-gray-800 font-medium text-lg line-clamp-1">
              {house.name}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {house.city}, {house.province}
            </p>
          </Link>

          {house.reviews?.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <RiStarFill className="text-yellow-400" />
              <span>
                {(house.reviews.reduce((a, b) => a + b.rating, 0) / house.reviews.length)}
                <span className="text-gray-400"> ({house.reviews.length})</span>
              </span>
            </div>
          )}
        </div>

        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
          {house.description}
        </p>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs">قیمت هر شب</p>
            <p className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat('fa-IR').format(house.price)} تومان
            </p>
          </div>
          <Link
            to={`/house/${house._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            مشاهده جزئیات
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

PhotoCard.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  house: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string,
    province: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    reviews: PropTypes.arrayOf(PropTypes.shape({
      rating: PropTypes.number
    })),
  }).isRequired,
};

export default PhotoCard;