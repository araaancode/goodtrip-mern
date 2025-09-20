import React, { useState, useCallback, useMemo } from 'react';
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

// Extract carousel component for better separation of concerns
const ImageCarousel = ({ 
  images, 
  currentIndex, 
  onNavigate, 
  onImageClick,
  showCounter = true 
}) => {
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden group">
      <Link to={onImageClick} className="block h-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            className="w-full h-full object-cover"
            src={images[currentIndex]}
            alt="House"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </Link>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNavigate('prev');
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
              onNavigate('next');
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="عکس بعدی"
          >
            <RiArrowRightSLine className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Image Counter */}
      {showCounter && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1}/{images.length}
        </div>
      )}
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  currentIndex: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onImageClick: PropTypes.string.isRequired,
  showCounter: PropTypes.bool,
};

// Extract favorite button component
const FavoriteButton = ({ 
  isFavorited, 
  isLoading, 
  onClick,
  className = "absolute top-3 right-3 p-2 rounded-full transition-colors" 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${className} ${isFavorited ? 'bg-red-100 text-red-600' : 'bg-white/90 text-gray-700'}`}
      aria-label={isFavorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
    >
      {isFavorited ? (
        <RiHeart3Fill className="w-5 h-5" />
      ) : (
        <RiHeart3Line className="w-5 h-5" />
      )}
    </button>
  );
};

FavoriteButton.propTypes = {
  isFavorited: PropTypes.bool,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

// Extract house info component
const HouseInfo = ({ house }) => {
  // Memoize average rating calculation
  const averageRating = useMemo(() => {
    if (!house.reviews || house.reviews.length === 0) return null;
    
    const sum = house.reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / house.reviews.length).toFixed(1);
  }, [house.reviews]);

  return (
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

        {averageRating && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <RiStarFill className="text-yellow-400" />
            <span>
              {averageRating}
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
  );
};

HouseInfo.propTypes = {
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

// Main component
const PhotoCard = ({ images, house }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Get stores
  const { user } = useAuthStore();
  const { toggleFavorite } = useStore();

  // Memoize favorite check
  const isFavorited = useMemo(() => 
    user?.favoriteHouses?.includes(house._id), 
    [user, house._id]
  );

  // Memoize and use callback for image navigation
  const navigateImages = useCallback((direction) => {
    setCurrentIndex(prev => {
      if (direction === 'next') return (prev + 1) % images.length;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  }, [images.length]);

  // Handle favorite toggle with useCallback
  const handleFavorite = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info('لطفا برای افزودن به علاقه‌مندی‌ها وارد شوید');
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
  }, [user, house._id, toggleFavorite]);

  // Auto-advance slides with cleanup
  React.useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    
    const interval = setInterval(() => {
      navigateImages('next');
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered, images.length, navigateImages]);

  // Early return for invalid data
  if (!house) return null;

  return (
    <motion.article
      className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <ImageCarousel 
          images={images} 
          currentIndex={currentIndex} 
          onNavigate={navigateImages}
          onImageClick={`/house/${house._id}`}
        />
        
        <FavoriteButton 
          isFavorited={isFavorited}
          isLoading={isFavoriteLoading}
          onClick={handleFavorite}
        />
      </div>

      <HouseInfo house={house} />
    </motion.article>
  );
};

PhotoCard.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
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
  }),
};

PhotoCard.defaultProps = {
  images: [],
};

export default React.memo(PhotoCard);