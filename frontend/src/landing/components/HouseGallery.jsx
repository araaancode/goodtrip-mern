import { useState } from "react";
import { RiGridFill, RiCloseFill, RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import houseStore from "../store/houseStore";
import { motion, AnimatePresence } from "framer-motion";

export default function HouseGallery() {
  const { currentHouse: house } = houseStore();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!house?.images?.length) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % house.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + house.images.length) % house.images.length);
  };

  if (showAllPhotos) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-95 overflow-y-auto "
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-black py-4 z-10">
            <h2 className="text-xl font-bold text-white">تصاویر اقامتگاه</h2>
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <RiCloseFill className="w-6 h-6" />
              <span>بستن</span>
            </button>
          </div>

          {/* Fullscreen Image Viewer */}
          <div className="relative h-[70vh] mb-8">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={house.images[currentImageIndex]}
                alt={`${house.name} - تصویر ${currentImageIndex + 1}`}
                className="w-full h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            >
              <RiArrowLeftSLine className="w-6 h-6" />

            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
            >
              <RiArrowRightSLine className="w-6 h-6" />

            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {house.images.length}
            </div>
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-8">
            {house.images.map((image, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-xl overflow-hidden shadow-lg cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${house.name} - تصویر ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative group rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 h-96 gap-1">
        {/* Main large image */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer"
          onClick={() => {
            setCurrentImageIndex(0);
            setShowAllPhotos(true);
          }}
        >
          <img
            src={house.images[0]}
            alt={house.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Smaller images */}
        {[1, 2, 3, 4].map((index) => (
          house.images[index] && (
            <div
              key={index}
              className="relative cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index);
                setShowAllPhotos(true);
              }}
            >
              <img
                src={house.images[index]}
                alt={house.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )
        ))}
      </div>

      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setCurrentImageIndex(0);
          setShowAllPhotos(true);
        }}
        className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <RiGridFill className="w-5 h-5" />
        <span className="font-medium">دیدن همه عکس‌ها ({house.images.length})</span>
      </motion.button>
    </motion.div>
  );
}