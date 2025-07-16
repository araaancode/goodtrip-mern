import { useState } from 'react';
import { StarIcon, HeartIcon, ChevronLeftIcon, ClockIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/solid';

const SingleFoodPage = ({ food = {} }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details');
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Complete default food data structure matching your schema
  const defaultFood = {
    _id: '',
    cook: '',
    cookName: 'آشپز ناشناس',
    name: 'نام غذا',
    foodCode: 'کد نامعلوم',
    price: 0,
    description: 'توضیحات موجود نیست',
    category: 'دسته بندی نشده',
    isAvailable: false,
    isActive: false,
    count: 0,
    cookDate: ['تاریخ نامعلوم'],
    cookHour: 'ساعت نامعلوم',
    photo: 'https://via.placeholder.com/500x300?text=عکس+غذا',
    photos: [],
    reviews: [],
    rating: 0,
    numReviews: 0,
    createdAt: 'تاریخ نامعلوم'
  };

  // Merge provided food with defaults
  const foodData = { ...defaultFood, ...food };
  
  // Set initial selected image with fallbacks
  const initialImage = foodData.photo || 
                      (foodData.photos && foodData.photos.length > 0 ? foodData.photos[0] : null) || 
                      defaultFood.photo;
  const [selectedImage, setSelectedImage] = useState(initialImage);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > (foodData.count || 0)) return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    alert(`${quantity} عدد ${foodData.name} به سبد خرید اضافه شد!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price || 0) + ' تومان';
  };

  const formatDate = (date) => {
    return date || 'تاریخ نامعلوم';
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <StarIcon 
          key={i}
          className={`h-5 w-5 ${i < roundedRating ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 mr-4">جزئیات غذا</h1>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Food Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6 h-64 md:h-80 lg:h-96">
          <img 
            src={selectedImage} 
            alt={foodData.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = defaultFood.photo;
              setSelectedImage(defaultFood.photo);
            }}
          />
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`absolute top-4 left-4 p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
          >
            <HeartIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Thumbnail Images */}
        {foodData.photos && foodData.photos.length > 0 && (
          <div className="flex space-x-2 space-x-reverse mb-6 overflow-x-auto pb-2">
            {foodData.photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(photo)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === photo ? 'border-primary-600' : 'border-transparent'}`}
              >
                <img 
                  src={photo} 
                  alt={`${foodData.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = defaultFood.photo;
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Food Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{foodData.name}</h1>
              <p className="text-gray-500 mt-1">آشپز: {foodData.cookName}</p>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {renderRatingStars(foodData.rating)}
                </div>
                <span className="text-gray-600 mr-2">
                  {foodData.rating?.toFixed(1) || 0} ({foodData.numReviews || 0} نظر)
                </span>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary-600">{formatPrice(foodData.price)}</span>
          </div>

          <p className="text-gray-600 mb-6">{foodData.description}</p>

          {/* Cook Time Info */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <CalendarIcon className="h-5 w-5 mr-2" />
              <span>تاریخ پخت: {Array.isArray(foodData.cookDate) ? foodData.cookDate.join('، ') : foodData.cookDate}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>ساعت پخت: {foodData.cookHour}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <UserIcon className="h-5 w-5 mr-2" />
              <span>موجودی: {foodData.count || 0} عدد</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center border border-gray-200 rounded-full">
              <button 
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-r-full"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-l-full"
                disabled={quantity >= (foodData.count || 0)}
              >
                +
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={!foodData.isAvailable || (foodData.count || 0) === 0}
              className={`${foodData.isAvailable && (foodData.count || 0) > 0 ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium py-2 px-6 rounded-full transition-colors`}
            >
              {foodData.isAvailable && (foodData.count || 0) > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
            </button>
          </div>

          {/* Quick Info */}
          <div className="flex space-x-6 space-x-reverse text-sm text-gray-500 border-t border-b border-gray-100 py-4">
            <div>
              <span className="block font-medium text-gray-700">دسته بندی</span>
              <span>{foodData.category}</span>
            </div>
            <div>
              <span className="block font-medium text-gray-700">کد غذا</span>
              <span>{foodData.foodCode}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 font-medium ${activeTab === 'details' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              جزئیات
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-4 font-medium ${activeTab === 'reviews' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              نظرات ({foodData.numReviews || 0})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'details' ? (
              <div>
                <h3 className="font-semibold text-lg mb-3">اطلاعات تکمیلی</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">آشپز</h4>
                    <p className="text-gray-600">{foodData.cookName}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">تاریخ ثبت</h4>
                    <p className="text-gray-600">{formatDate(foodData.createdAt)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">وضعیت</h4>
                    <p className="text-gray-600">
                      {foodData.isAvailable ? 'موجود' : 'ناموجود'} - 
                      {foodData.isActive ? ' فعال' : ' غیرفعال'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {foodData.reviews && foodData.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {foodData.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-900">{review.userName || 'کاربر ناشناس'}</h4>
                          <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>
                        <div className="flex mt-1 mb-2">
                          {renderRatingStars(review.rating)}
                        </div>
                        <p className="text-gray-600">{review.comment || 'بدون نظر'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">هنوز نظری ثبت نشده است.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-lg font-bold text-primary-600">{formatPrice(foodData.price)}</span>
        </div>
        <button 
          onClick={handleAddToCart}
          disabled={!foodData.isAvailable || (foodData.count || 0) === 0}
          className={`${foodData.isAvailable && (foodData.count || 0) > 0 ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium py-3 px-6 rounded-full transition-colors`}
        >
          {foodData.isAvailable && (foodData.count || 0) > 0 ? 'افزودن به سبد' : 'ناموجود'}
        </button>
      </div>
    </div>
  );
};

export default SingleFoodPage;