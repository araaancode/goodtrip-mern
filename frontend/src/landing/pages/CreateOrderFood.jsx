import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegClock, FaRegUser, FaCheckCircle } from 'react-icons/fa';
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoMapOutline } from "react-icons/io5";
import { IoFastFoodOutline } from "react-icons/io5";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useCartStore from '../store/cartStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from "axios"

// Fix for leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMarker = ({ position, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker 
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    setPosition(e.target.getLatLng());
                }
            }}
        >
            <Popup>موقعیت تحویل سفارش</Popup>
        </Marker>
    );
};

const CreateOrderFood = () => {
    const navigate = useNavigate();
    const { 
        items: cartItems, 
        total: cartTotal, 
        clearCart,
        getTotalItems,
        isLoading: cartLoading
    } = useCartStore();
    
    const [deliveryOption, setDeliveryOption] = useState('delivery');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [position, setPosition] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        notes: ''
    });
    const [trackingCode, setTrackingCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize map position (Tehran coordinates as default)
    useEffect(() => {
        setPosition([35.6892, 51.3890]);
        setMapLoaded(true);
    }, []);

    // Redirect if cart is empty
    useEffect(() => {
        if (getTotalItems() === 0 && !orderPlaced) {
            toast.warning('سبد خرید شما خالی است');
            navigate('/');
        }
    }, [getTotalItems, navigate, orderPlaced]);

    const deliveryFee = deliveryOption === 'delivery' ? 15000 : 0;
    const tax = cartTotal * 0.09; // 9% tax
    const grandTotal = cartTotal + deliveryFee + tax;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form
        if (!formData.name || !formData.phone) {
            toast.error('لطفا نام و شماره تلفن را وارد کنید');
            setIsSubmitting(false);
            return;
        }

        if (deliveryOption === 'delivery' && (!formData.address || !position)) {
            toast.error('لطفا آدرس و موقعیت مکانی را مشخص کنید');
            setIsSubmitting(false);
            return;
        }


        console.log(cartItems)

        try {
            // Prepare order data
            const orderData = {
                items: cartItems.map(item => ({
                    food: item.food._id,
                    cook: item.food.cook,
                    name: item.food.name,
                    quantity: item.quantity,
                    price: item.food.price
                })),
                customerInfo: {
                    name: formData.name,
                    phone: formData.phone,
                    address: deliveryOption === 'delivery' ? formData.address : undefined
                },
                deliveryOption,
                location: deliveryOption === 'delivery' ? {
                    coordinates: [position.lng, position.lat]
                } : undefined,
                notes: formData.notes,
                subtotal: cartTotal,
                deliveryFee,
                tax,
                total: grandTotal
            };

            // Submit order to backend
            const response = await axios.post('/api/users/foods/orders', orderData);
            
            // Clear cart on successful order
            clearCart();
            setTrackingCode(response.data.trackingCode);
            setOrderPlaced(true);
            toast.success('سفارش شما با موفقیت ثبت شد!');

        } catch (error) {
            console.error('Order submission error:', error);
            toast.error(error.response?.data?.message || 'خطا در ثبت سفارش. لطفا دوباره تلاش کنید');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderPlaced) {
        return (
            <div className="min-h-screen flex flex-col font-sans" dir="rtl">
                <main className="flex-grow bg-blue-50 flex items-center justify-center">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-blue-900 mb-4">سفارش شما با موفقیت ثبت شد!</h2>
                        <p className="text-gray-700 mb-6">سفارش شما در حال آماده‌سازی است و به زودی برای شما ارسال خواهد شد.</p>
                        <div className="bg-blue-100 rounded-lg p-4 mb-6 text-right">
                            <p className="font-medium text-blue-900">کد پیگیری سفارش: <span className="font-bold">{trackingCode}</span></p>
                            <p className="text-blue-800">زمان تحویل حدودی: {deliveryOption === 'delivery' ? '30-45 دقیقه' : 'آماده تحویل'}</p>
                        </div>
                        <Link
                            to="/"
                            className="bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                            بازگشت به صفحه اصلی
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    if (cartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mx-auto"></div>
                    <p className="mt-4 text-gray-700">در حال بارگذاری سبد خرید...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans" dir="rtl">
            <main className="flex-grow py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Side - Delivery Information */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                                <div className="bg-blue-900 text-white p-4 flex items-center">
                                    <CiShoppingCart className="ml-2 font-bold w-8 h-8" />
                                    <h2 className="text-xl font-bold">تکمیل اطلاعات سفارش</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6">
                                    {/* Delivery Options */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                            <FaRegClock className="ml-2" />
                                            روش دریافت سفارش
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            <label className="flex-1 min-w-[200px]">
                                                <input
                                                    type="radio"
                                                    name="deliveryOption"
                                                    value="delivery"
                                                    checked={deliveryOption === 'delivery'}
                                                    onChange={() => setDeliveryOption('delivery')}
                                                    className="hidden peer"
                                                />
                                                <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-blue-900 peer-checked:bg-blue-50 cursor-pointer">
                                                    <div className="flex items-start">
                                                        <div className="relative mt-0.5 ml-2">
                                                            <div className={`w-5 h-5 rounded-full border-2 ${deliveryOption === 'delivery' ? 'border-blue-900' : 'border-gray-300'} flex items-center justify-center`}>
                                                                <div className={`w-2.5 h-2.5 rounded-full ${deliveryOption === 'delivery' ? 'bg-blue-900' : 'bg-transparent'}`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-800 block">ارسال به آدرس</span>
                                                            <p className="text-sm text-gray-500 mt-1.5">سفارش شما به آدرس مشخص شده ارسال می‌شود</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>

                                            <label className="flex-1 min-w-[200px]">
                                                <input
                                                    type="radio"
                                                    name="deliveryOption"
                                                    value="pickup"
                                                    checked={deliveryOption === 'pickup'}
                                                    onChange={() => setDeliveryOption('pickup')}
                                                    className="hidden peer"
                                                />
                                                <div className="p-4 border-2 border-gray-200 rounded-lg peer-checked:border-blue-900 peer-checked:bg-blue-50 cursor-pointer">
                                                    <div className="flex items-start">
                                                        <div className="relative mt-0.5 ml-2">
                                                            <div className={`w-5 h-5 rounded-full border-2 ${deliveryOption === 'pickup' ? 'border-blue-900' : 'border-gray-300'} flex items-center justify-center`}>
                                                                <div className={`w-2.5 h-2.5 rounded-full ${deliveryOption === 'pickup' ? 'bg-blue-900' : 'bg-transparent'}`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-800 block">تحویل حضوری</span>
                                                            <p className="text-sm text-gray-500 mt-1.5">سفارش را خودتان از رستوران تحویل بگیرید</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                            <FaRegUser className="ml-2" />
                                            اطلاعات تماس
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-gray-700 mb-2">نام و نام خانوادگی*</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-900 outline-none"
                                                    placeholder="نام خود را وارد کنید"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">شماره تلفن*</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:border-blue-900 outline-none"
                                                    placeholder="شماره تلفن خود را وارد کنید"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {deliveryOption === 'delivery' && (
                                        <>
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                                    <HiOutlineLocationMarker className="ml-2" />
                                                    آدرس تحویل*
                                                </h3>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows="3"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                                    placeholder="آدرس کامل خود را وارد کنید"
                                                ></textarea>
                                            </div>

                                            {/* Map Component */}
                                            <div className="mb-8">
                                                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                                    <IoMapOutline className="ml-2" />
                                                    موقعیت روی نقشه*
                                                </h3>
                                                <div className="rounded-lg overflow-hidden border border-gray-300 h-64">
                                                    {mapLoaded && (
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
                                                    )}
                                                </div>
                                                {position && (
                                                    <p className="text-sm text-gray-600 mt-2">
                                                        موقعیت انتخاب شده: عرض جغرافیایی {position.lat}، طول جغرافیایی {position.lng}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {/* Order Notes */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                            <IoFastFoodOutline className="ml-2" />
                                            توضیحات سفارش
                                        </h3>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="2"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                                            placeholder="یادداشت برای رستوران (اختیاری)"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                در حال ثبت سفارش...
                                            </span>
                                        ) : 'ثبت سفارش'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Side - Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white shadow-md rounded-xl sticky top-4">
                                <div className="bg-blue-900 text-white p-4 rounded-t-xl">
                                    <h2 className="text-xl font-bold flex items-center">
                                        <CiShoppingCart className="ml-2" />
                                        خلاصه سفارش
                                    </h2>
                                </div>

                                <div className="p-4">
                                    <div className="border-b border-gray-200 pb-4 mb-4">
                                        {cartItems.map(item => (
                                            <div key={item.food._id} className="flex justify-between items-center mb-3">
                                                <div>
                                                    <p className="font-medium">{item.food.name}</p>
                                                    <p className="text-sm text-gray-600">{item.quantity} × {item.food.price.toLocaleString()} تومان</p>
                                                </div>
                                                <p className="font-medium">{(item.food.price * item.quantity).toLocaleString()} تومان</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">جمع کل:</span>
                                            <span className="font-medium">{cartTotal.toLocaleString()} تومان</span>
                                        </div>
                                        {deliveryOption === 'delivery' && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-700">هزینه ارسال:</span>
                                                <span className="font-medium">{deliveryFee.toLocaleString()} تومان</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">مالیات (9٪):</span>
                                            <span className="font-medium">{tax.toLocaleString()} تومان</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between border-t border-gray-200 pt-4">
                                        <span className="font-bold text-lg">مبلغ قابل پرداخت:</span>
                                        <span className="font-bold text-lg text-blue-900">{grandTotal.toLocaleString()} تومان</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateOrderFood;