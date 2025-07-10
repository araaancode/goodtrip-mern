import React, { useState, useEffect, useRef } from 'react';
import useCartStore from '../store/cartStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OrderFoodService from '../services/orderFoodService';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);

  const map = useMapEvents({
    click(e) {
      const newPos = e.latlng;
      setPosition([newPos.lat, newPos.lng]);
      console.log('Marker moved to:', newPos.lat, newPos.lng);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={{
        dragend: () => {
          const marker = markerRef.current;
          if (marker != null) {
            const newPos = marker.getLatLng();
            setPosition([newPos.lat, newPos.lng]);
            console.log('Marker dragged to:', newPos.lat, newPos.lng);
          }
        },
      }}
      position={position}
      ref={markerRef}
    >
      <Popup>موقعیت تحویل سفارش</Popup>
    </Marker>
  );
};

const CreateOrderFood = () => {
  const { items, total, clearCart, getTotalItems } = useCartStore();
  const navigate = useNavigate();
  const [position, setPosition] = useState([35.6892, 51.3890]);
  const [orderData, setOrderData] = useState({
    deliveryAddress: {
      text: '',
      coordinates: {
        lat: 35.6892,
        lng: 51.3890,
      },
    },
    contactNumber: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getTotalItems() === 0) {
      toast.error('سبد خرید شما خالی است', { rtl: true });
      navigate('/foods');
    }
  }, [getTotalItems, navigate]);

  useEffect(() => {
    console.log('Position updated:', position);
    setOrderData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        coordinates: {
          lat: position[0],
          lng: position[1],
        },
      },
    }));
  }, [position]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { value } = e.target;
    setOrderData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        text: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Attempting to create order");

    // Validate coordinates exist
    if (!position || position.length !== 2) {
      toast.error('لطفا روی نقشه کلیک کنید تا موقعیت تحویل مشخص شود', { rtl: true });
      return;
    }

    // Prepare complete order data including cart items
    const finalOrderData = {
      ...orderData,
      items: items.map(item => ({
        food: item.food._id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      totalAmount: total,
      deliveryAddress: {
        ...orderData.deliveryAddress,
        coordinates: {
          lat: position[0],
          lng: position[1],
        },
      },
    };

    console.log('Submitting order with data:', finalOrderData);

    if (!finalOrderData.deliveryAddress.text) {
      toast.error('لطفا آدرس تحویل را وارد کنید', { rtl: true });
      return;
    }

    if (!finalOrderData.contactNumber) {
      toast.error('لطفا شماره تماس را وارد کنید', { rtl: true });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Sending order data to API...');
      const response = await OrderFoodService.createOrder(finalOrderData);
      console.log('Order created successfully:', response.data);
      
      toast.success('سفارش شما با موفقیت ثبت شد', { rtl: true });
      clearCart();
      navigate('/order-food');
    } catch (error) {
      console.error('Order creation error:', error);
      
      let errorMessage = 'خطا در ثبت سفارش. لطفا دوباره تلاش کنید';
      if (error.response) {
        console.error('Server response:', error.response.data);
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'پاسخی از سرور دریافت نشد';
      }
      
      toast.error(errorMessage, { rtl: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-right">
            تکمیل اطلاعات سفارش
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 text-right">
                اطلاعات تحویل
              </h3>

              <div className="grid grid-cols-1 gap-6">
                {/* Address Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    آدرس دقیق
                  </label>
                  <input
                    type="text"
                    name="deliveryAddress"
                    value={orderData.deliveryAddress.text}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="خیابان، پلاک، واحد"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 text-right">
                    شماره تماس
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={orderData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="09123456789"
                    required
                  />
                </div>
              </div>

              {/* Map Section */}
              <div className="h-96 rounded-xl overflow-hidden shadow-md mt-4 relative">
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <div className="inline-block bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-lg">
                    روی نقشه کلیک کنید یا نشانگر را بکشید
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 text-right">
                توضیحات (اختیاری)
              </label>
              <textarea
                name="description"
                value={orderData.description}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg text-right focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="توضیحات اضافه درباره سفارش..."
                rows="3"
              />
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-800 text-right mb-4">
                خلاصه سفارش
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.food._id}
                    className="flex justify-between items-center text-right bg-gray-50 p-3 rounded-lg"
                  >
                    <span className="font-medium">
                      {item.name} <span className="text-gray-500">(تعداد: {item.quantity})</span>
                    </span>
                    <span className="font-semibold">
                      {(item.price * item.quantity).toLocaleString()} تومان
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <span className="text-lg font-bold">جمع کل:</span>
                <span className="text-xl font-bold text-green-600">
                  {total.toLocaleString()} تومان
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال ثبت سفارش...
                </>
              ) : (
                'تایید و ثبت سفارش'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderFood;