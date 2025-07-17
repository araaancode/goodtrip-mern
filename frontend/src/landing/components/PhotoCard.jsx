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
import houseStore from '../store/houseStore';
import authStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const PhotoCard = ({ images, house }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = authStore();
  const { toggleFavorite } = houseStore();
  const [isHovered, setIsHovered] = useState(false);

  // Check if house is favorited
  const isFavorited = user?.favoriteHouses?.some(fav => fav._id === house._id);



  // Image navigation with animation support
  const navigateImages = (direction) => {
    setCurrentIndex(prev => {
      if (direction === 'next') return (prev + 1) % images.length;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  // Auto-advance slides when hovered
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
  const handleFavorite = async () => {
    if (!user) {
      toast.info('لطفاً برای افزودن به علاقه‌مندی‌ها وارد شوید');
      return;
    }

    setIsLoading(true);
    try {
      await toggleFavorite(house._id);
      toast.success(
        isFavorited
          ? 'از علاقه‌مندی‌ها حذف شد'
          : 'به علاقه‌مندی‌ها اضافه شد'
      );
    } catch (err) {
      toast.error('خطا در بروزرسانی علاقه‌مندی‌ها');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.article
      className="bg-white rounded-lg md:rounded-xl overflow-hidden transition-all duration-300"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Carousel Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            className="w-full h-full object-cover rounded-lg"
            src={images[currentIndex]}
            alt={`${house.name} - Slide ${currentIndex + 1}`}
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Favorite Button */}
        <motion.button
          onClick={handleFavorite}
          disabled={isLoading}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isFavorited ? (
            <RiHeart3Fill className="w-5 h-5 text-red-500" />
          ) : (
            <RiHeart3Line className="w-5 h-5 text-gray-700 hover:text-red-500" />
          )}
        </motion.button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={() => navigateImages('prev')}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RiArrowLeftSLine className="w-5 h-5 text-gray-800" />
            </motion.button>
            <motion.button
              onClick={() => navigateImages('next')}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RiArrowRightSLine className="w-5 h-5 text-gray-800" />
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <Link
            to={`/house/${house._id}`}
            className="hover:opacity-90 transition-opacity flex-1"
          >
            <h3 className="text-gray-800 font-medium text-lg line-clamp-1">
              {house.name}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {house.city}, {house.province}
            </p>
          </Link>

          {house.reviews?.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600 shrink-0">
              <RiStarFill className="w-4 h-4 text-yellow-400" />
              <span>
                {house.reviews.reduce((acc, review) => acc + review.rating, 0) / house.reviews.length}
                <span className="text-gray-400"> ({house.reviews.length})</span>
              </span>
            </div>
          )}
        </div>

        <p className="mt-2 text-gray-600 line-clamp-2 text-sm">
          {house.description}
        </p>

        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-gray-500 text-xs">قیمت به ازای هر شب</p>
            <p className="text-lg font-bold text-gray-900 mt-1">
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
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    city: PropTypes.string,
    province: PropTypes.string,
    reviews: PropTypes.arrayOf(PropTypes.shape({
      rating: PropTypes.number
    })),
  }).isRequired,
};

export default PhotoCard;