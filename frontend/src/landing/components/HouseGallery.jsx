import { useState } from "react";
import { RiGridFill, RiCloseFill } from "@remixicon/react";

export default function HouseGallery({ house }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  if (!house?.images?.length) return null;

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-95 overflow-y-auto">
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

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
            {house.images.map((image, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src={image}
                  alt={`${house.name} - تصویر ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-lg">
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 h-96 gap-1">
        {/* Main large image */}
        <div className="col-span-2 row-span-2 relative">
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
            <div key={index} className="relative">
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
      <button
        onClick={() => setShowAllPhotos(true)}
        className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
      >
        <RiGridFill className="w-5 h-5" />
        <span className="font-medium">دیدن همه عکس‌ها</span>
      </button>
    </div>
  );
}