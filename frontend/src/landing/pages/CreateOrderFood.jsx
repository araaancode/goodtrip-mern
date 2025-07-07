import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FaRegClock,
    FaRegUser,
    FaCheckCircle,
} from 'react-icons/fa';
import { CiShoppingCart } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoMapOutline } from "react-icons/io5";
import { IoFastFoodOutline } from "react-icons/io5";
import { PiCreditCard } from "react-icons/pi";

const NESHAN_API_KEY = 'web.SJVgOZY4Hk4YI7lMpLcZsJmgJ4cotrOaRBT7WTON';

const CreateOrderFood = () => {
    const [deliveryOption, setDeliveryOption] = useState('delivery');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [position, setPosition] = useState({ lat: 35.6892, lng: 51.3890 });
    const [mapLoaded, setMapLoaded] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        notes: ''
    });

    const mapRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        const loadMapResources = () => {
            // Check if Leaflet is already loaded
            if (window.L) {
                initMap();
                return;
            }

            // Load Leaflet CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
            document.head.appendChild(link);

            // Load Leaflet JS
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
            script.onload = () => {
                // Load Neshan plugin
                const neshanScript = document.createElement('script');
                neshanScript.src = 'https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.js';
                neshanScript.onload = initMap;
                document.body.appendChild(neshanScript);
            };
            document.body.appendChild(script);
        };

        loadMapResources();

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    const initMap = () => {
        // Create map instance
        const map = window.L.map('map', {
            center: [position.lat, position.lng],
            zoom: 13,
            zoomControl: true
        });

        mapRef.current = map;

        // Add Neshan tile layer
        window.L.tileLayer(`https://api.neshan.org/v1/static/tile/{z}/{x}/{y}.png`, {
            attribution: '<a href="https://neshan.org" target="_blank">Neshan Map</a>',
            maxZoom: 18,
            headers: {
                'Api-Key': NESHAN_API_KEY
            }
        }).addTo(map);

        // Custom icon
        const customIcon = window.L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        // Add marker
        const marker = window.L.marker([position.lat, position.lng], {
            draggable: true,
            icon: customIcon
        }).addTo(map);

        markerRef.current = marker;

        // Marker events
        marker.on('dragend', function(e) {
            const newPos = marker.getLatLng();
            setPosition({ lat: newPos.lat, lng: newPos.lng });
        });

        // Map click event
        map.on('click', function(e) {
            marker.setLatLng(e.latlng);
            setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
        });

        setMapLoaded(true);
    };

    // Mock cart data
    const cart = [
        { id: 1, name: 'کباب کوبیده', price: 120000, quantity: 2 },
        { id: 2, name: 'نوشابه', price: 15000, quantity: 1 }
    ];

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = deliveryOption === 'delivery' ? 15000 : 0;
    const tax = totalPrice * 0.09;
    const grandTotal = totalPrice + deliveryFee + tax;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Order submitted:', {
            ...formData,
            cart,
            grandTotal,
            deliveryLocation: position
        });
        setOrderPlaced(true);
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
                            <p className="font-medium text-blue-900">کد پیگیری سفارش: <span className="font-bold">ORD-{Math.floor(Math.random() * 1000000)}</span></p>
                            <p className="text-blue-800">زمان تحویل حدودی: 30-45 دقیقه</p>
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
                                                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 peer-checked:border-blue-900 peer-checked:bg-blue-50 cursor-pointer transition-all duration-200">
                                                    <div className="flex items-start">
                                                        <div className="relative mt-0.5 ml-2">
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-900 flex items-center justify-center transition-all">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${deliveryOption === 'delivery' ? 'bg-blue-900' : 'bg-transparent'} transition-all`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-800 block">ارسال به آدرس</span>
                                                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                                                                سفارش شما به آدرس مشخص شده ارسال می‌شود
                                                            </p>
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
                                                <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 peer-checked:border-blue-900 peer-checked:bg-blue-50 cursor-pointer transition-all duration-200">
                                                    <div className="flex items-start">
                                                        <div className="relative mt-0.5 ml-2">
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-900 flex items-center justify-center transition-all">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${deliveryOption === 'pickup' ? 'bg-blue-900' : 'bg-transparent'} transition-all`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-800 block">تحویل حضوری</span>
                                                            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                                                                سفارش را خودتان از رستوران تحویل بگیرید
                                                            </p>
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
                                                <label className="block text-gray-700 mb-2">نام و نام خانوادگی</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{borderRadius:'5px'}}
                                                    className="w-full px-3 py-4 border border-gray-300 roundeds-sm focus:border-blue-900 outline-none"
                                                    placeholder='نام و نام خانوادگی خود را وارد کنید'
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-gray-700 mb-2">شماره تلفن</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{borderRadius:'5px'}}
                                                    className="w-full px-3 py-4 border border-gray-300 roundeds-sm focus:border-blue-900 outline-none text-right"
                                                    placeholder='شماره خود را وارد کنید'
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    {deliveryOption === 'delivery' && (
                                        <>
                                            <div className="mb-6">
                                                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                                    <HiOutlineLocationMarker className="ml-2 font-bold w-6 h-6" />
                                                    آدرس تحویل
                                                </h3>
                                                <div>
                                                    <label className="block text-gray-700 mb-2">آدرس دقیق</label>
                                                    <textarea
                                                        name="address"
                                                        value={formData.address}
                                                        onChange={handleInputChange}
                                                        required
                                                        rows="3"
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-blue-500 outline-none transition-all mb-4"
                                                        placeholder='آدرس خود را وارد کنید'
                                                    ></textarea>
                                                </div>
                                            </div>

                                            {/* Map Component */}
                                            <div className="mb-8">
                                                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                                    <IoMapOutline className="ml-2 font-bold w-6 h-6" />
                                                    موقعیت روی نقشه
                                                </h3>
                                                <div className="rounded-lg overflow-hidden border border-gray-300 h-64 bg-gray-100">
                                                    <div 
                                                        id="map"
                                                        style={{ height: '100%', width: '100%' }}
                                                    ></div>
                                                </div>
                                                <div className="mt-2 text-sm bg-gray-100 p-2 rounded">
                                                    <p>موقعیت انتخاب شده:</p>
                                                    <p>عرض جغرافیایی: {position.lat.toFixed(6)}</p>
                                                    <p>طول جغرافیایی: {position.lng.toFixed(6)}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Payment Method */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                            <PiCreditCard className="ml-2 font-bold w-6 h-6" />
                                            روش پرداخت
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <label className="flex-1">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cash"
                                                    checked={paymentMethod === 'cash'}
                                                    onChange={() => setPaymentMethod('cash')}
                                                    className="hidden peer"
                                                />
                                                <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-100 peer-checked:bg-blue-50 cursor-pointer transition-all duration-200 ease-in-out">
                                                    <div className="flex items-start gap-3">
                                                        <div className="relative mt-0.5 shrink-0">
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 flex items-center justify-center transition-colors bg-white">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${paymentMethod === 'cash' ? 'bg-blue-900 scale-100' : 'scale-0'} transition-all duration-200`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900 block">پرداخت در محل</span>
                                                            <p className="text-sm text-gray-500 mt-1.5 leading-normal">
                                                                پس از دریافت سفارش پرداخت انجام می‌شود
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>

                                            <label className="flex-1">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="online"
                                                    checked={paymentMethod === 'online'}
                                                    onChange={() => setPaymentMethod('online')}
                                                    className="hidden peer"
                                                />
                                                <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm peer-checked:border-blue-600 peer-checked:ring-2 peer-checked:ring-blue-100 peer-checked:bg-blue-50 cursor-pointer transition-all duration-200 ease-in-out">
                                                    <div className="flex items-start gap-3">
                                                        <div className="relative mt-0.5 shrink-0">
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-blue-600 flex items-center justify-center transition-colors bg-white">
                                                                <div className={`w-2.5 h-2.5 rounded-full ${paymentMethod === 'online' ? 'bg-blue-900 scale-100' : 'scale-0'} transition-all duration-200`}></div>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium text-gray-900 block">پرداخت آنلاین</span>
                                                            <p className="text-sm text-gray-500 mt-1.5 leading-normal">
                                                                پرداخت امن از طریق درگاه بانکی
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Order Notes */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                                            <IoFastFoodOutline className="ml-2 font-bold w-6 h-6" />
                                            توضیحات سفارش
                                        </h3>
                                        <div>
                                            <label className="block text-gray-700 mb-2">یادداشت برای رستوران (اختیاری)</label>
                                            <textarea
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows="2"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2  focus:border-blue-500 outline-none transition-all"
                                                placeholder="مثلاً: غذاها را کم نمک بپزید"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-bold text-lg transition-colors"
                                    >
                                        تایید و پرداخت
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Right Side - Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white shadow-md rounded-xl sticky top-4">
                                <div className="bg-blue-900 text-white p-4 rounded-tl-md rounded-tr-xl">
                                    <h2 className="text-xl font-bold flex items-center">
                                        <CiShoppingCart className="ml-2 font-bold w-8 h-8" />
                                        خلاصه سفارش
                                    </h2>
                                </div>

                                <div className="p-4">
                                    <div className="border-b border-gray-200 pb-4 mb-4">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex justify-between items-center mb-3">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-600">{item.quantity} × {item.price.toLocaleString()} تومان</p>
                                                </div>
                                                <p className="font-medium">{(item.price * item.quantity).toLocaleString()} تومان</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">جمع کل:</span>
                                            <span className="font-medium">{totalPrice.toLocaleString()} تومان</span>
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

                                    <div className="flex justify-between border-t border-gray-200 pt-4 mb-4">
                                        <span className="font-bold text-lg">مبلغ قابل پرداخت:</span>
                                        <span className="font-bold text-lg text-blue-900">{grandTotal.toLocaleString()} تومان</span>
                                    </div>

                                    {paymentMethod === 'online' && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                                            <p className="text-blue-800 text-sm">پس از کلیک بر روی دکمه "تایید و پرداخت"، به درگاه پرداخت بانکی هدایت خواهید شد.</p>
                                        </div>
                                    )}
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