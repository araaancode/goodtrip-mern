import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icons (Grouped logically)
import {
  RiUser3Fill,
  RiCalendar2Line,
  RiHeart2Line,
  RiBankCard2Line,
  RiNotificationLine,
  RiCustomerService2Line,
  RiLogoutBoxRLine,
} from '@remixicon/react';
import { IoIosCamera } from 'react-icons/io';
import { BsTrash } from 'react-icons/bs';

// Components
import HeaderPages from '../components/HeaderPages';
import Footer from '../components/Footer';

// Constants (Move to a separate file if reused)
const DEFAULT_USER_IMAGE = 'https://cdn-icons-png.flaticon.com/128/17384/17384295.png';

const FavoritesPage = () => {
  // State
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const userToken = localStorage.getItem('userToken');

  // Fetch user data
  useEffect(() => {
    // if (!userToken) {
    //   navigate('/login');
    //   return;
    // }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setUser(response.data.user);
        setFavorites(response.data.user.favorites || []);
      } catch (error) {
        toast.error('Failed to fetch user data');
        console.error('Error fetching user:', error);
      }
    };

    fetchUserData();
  }, [userToken, navigate]);

  // Remove favorite
  const removeFavorite = async (houseId) => {
    try {
      await axios.put(
        '/api/users/handle-favorite',
        { house: houseId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setFavorites(favorites.filter((fav) => fav._id !== houseId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
      console.error('Error removing favorite:', error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/');
    window.location.reload();
  };

  // Sidebar menu items (Avoid repetition)
  const menuItems = [
    { icon: <RiUser3Fill />, label: 'حساب کاربری', path: '/profile' },
    { icon: <RiCalendar2Line />, label: 'رزروهای من', path: '/bookings' },
    {
      icon: <RiHeart2Line className="text-blue-800" />,
      label: 'لیست علاقه مندی ها',
      path: '/favorites',
      active: true,
    },
    { icon: <RiBankCard2Line />, label: 'اطلاعات حساب بانکی', path: '/bank' },
    { icon: <RiNotificationLine />, label: 'لیست اعلان ها', path: '/notifications' },
    { icon: <RiCustomerService2Line />, label: 'پشتیبانی', path: '/support' },
    {
      icon: <RiLogoutBoxRLine />,
      label: 'خروج',
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <div className="flex flex-col md:flex-row p-4 rtl mt-4">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 py-6 bg-white border border-gray-200 rounded-lg shadow mb-4 md:mb-0">
          <div className="mb-8 px-4 text-center mx-auto flex justify-center">
            <div className="relative" style={{ width: '160px', height: '160px' }}>
              <img
                src={user?.profileImage || DEFAULT_USER_IMAGE}
                alt="User profile"
                className="object-cover rounded-full mx-auto w-full h-full"
              />
              <div className="absolute bottom-8 left-0 p-2 bg-white cursor-pointer shadow shadow-full rounded-full">
                <IoIosCamera className="text-blue-800 h-8 w-8" />
              </div>
              <p className="text-gray-900 text-center mt-2">
                {user?.name || user?.phone || 'User'}
              </p>
            </div>
          </div>
          <div className="border"></div>
          <ul className="my-6 px-8">
            {menuItems.map((item, index) => (
              <li key={index} className="flex items-center mb-2">
                <span className="mr-2 text-gray-400">{item.icon}</span>
                {item.onClick ? (
                  <button onClick={item.onClick} className="mr-4 text-lg">
                    {item.label}
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`mr-4 text-lg ${item.active ? 'text-blue-800' : ''}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-6 bg-white border border-gray-200 rounded-lg shadow mx-6">
          {favorites.length > 0 ? (
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favorites.map((house) => (
                  <div
                    key={house._id}
                    className="rounded-lg overflow-hidden transition-shadow duration-300"
                  >
                    <div className="relative group">
                      <img
                        src={house.cover}
                        alt={house.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeFavorite(house._id)}
                        className="absolute top-2 left-2 p-1 opacity-0 group-hover:opacity-100 bg-white rounded-full transition-opacity duration-300"
                        aria-label="Remove favorite"
                      >
                        <BsTrash className="text-blue-800 w-10 h-10 cursor-pointer bg-white bg-opacity-50 rounded-full p-2" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{house.name}</h3>
                      <p className="text-gray-600">
                        {house.description?.slice(0, 20)}...
                      </p>
                      <span className="text-sm">
                        هر شب از {house.price}
                        <span className="text-xl font-semibold"> تومان</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h1 className="text-xl text-gray-500">لیست شما خالی است!</h1>
              </div>
            </div>
          )}
        </div>
        <ToastContainer position="bottom-left" autoClose={3000} />
      </div>
    </>
  );
};

export default FavoritesPage;