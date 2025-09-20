// src/pages/BankPage.js
import React, { useState, useEffect } from 'react';
import {
  RiLogoutBoxRLine,
  RiSearchLine,
  RiMenuLine,
  RiCloseLine,
  RiBankLine,
  RiMoneyDollarCircleLine,
  RiVisaLine,
  RiMastercardLine,
  RiAddCircleLine,
  RiEditLine,
  RiDeleteBinLine,
  RiShieldCheckLine,
  RiInformationLine
} from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoFastFoodOutline } from "react-icons/io5";
import { IoIosCamera } from 'react-icons/io';
import { motion, AnimatePresence } from 'framer-motion';

// React Icons from pi package for sidebar
import { PiUser } from 'react-icons/pi';
import { BsHouses } from "react-icons/bs";
import { LiaBusSolid } from "react-icons/lia";
import {
  RiHeart2Line,
  RiBankCard2Line,
  RiNotificationLine,
  RiCustomerService2Line,
} from '@remixicon/react';

// Import your actual auth store
import useUserAuthStore from '../store/authStore';

const BankPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    bankName: '',
    sheba: ''
  });

  // Use your actual auth store
  const { user, isAuthenticated, logout, checkAuth } = useUserAuthStore();

  // Mock bank accounts data - replace with actual API calls
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check authentication status on component mount
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadBankAccounts();
    }
  }, [isAuthenticated]);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      // Replace with actual API call to get user's bank accounts
      // const response = await axios.get('/api/users/bank-accounts');
      // setAccounts(response.data);

      // Mock data for demonstration
      setTimeout(() => {
        setAccounts([
          {
            _id: '1',
            cardNumber: '6037-9912-3456-7890',
            cardHolder: user?.name || 'کاربر',
            bankName: 'بانک ملی',
            sheba: 'IR580120000000003144851234',
            isDefault: true
          },
          {
            _id: '2',
            cardNumber: '5022-2910-3847-5621',
            cardHolder: user?.name || 'کاربر',
            bankName: 'بانک پاسارگاد',
            sheba: 'IR650570028380010736839112',
            isDefault: false
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      toast.error('خطا در دریافت اطلاعات حساب‌های بانکی', {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    }
  };

  const addAccount = async (accountData) => {
    try {
      // Replace with actual API call
      // const response = await axios.post('/api/users/bank-accounts', accountData);
      const newAccount = {
        _id: Date.now().toString(),
        ...accountData,
        isDefault: accounts.length === 0
      };
      setAccounts([...accounts, newAccount]);
      return newAccount;
    } catch (error) {
      console.error('Error adding bank account:', error);
      throw error;
    }
  };

  const updateAccount = async (accountId, updates) => {
    try {
      // Replace with actual API call
      // const response = await axios.put(`/api/users/bank-accounts/${accountId}`, updates);
      setAccounts(accounts.map(account =>
        account._id === accountId ? { ...account, ...updates } : account
      ));
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw error;
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      // Replace with actual API call
      // await axios.delete(`/api/users/bank-accounts/${accountId}`);
      setAccounts(accounts.filter(account => account._id !== accountId));
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error;
    }
  };

  const setDefaultAccount = async (accountId) => {
    try {
      // Replace with actual API call
      // await axios.patch(`/api/users/bank-accounts/${accountId}/set-default`);
      setAccounts(accounts.map(account => ({
        ...account,
        isDefault: account._id === accountId
      })));
    } catch (error) {
      console.error('Error setting default account:', error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);

    // Format as XXXX-XXXX-XXXX-XXXX
    if (value.length > 0) {
      value = value.match(new RegExp('.{1,4}', 'g')).join('-');
    }

    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }));
  };

  const handleShebaChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.startsWith('IR')) {
      value = 'IR' + value.substring(2).replace(/\D/g, '');
    } else {
      value = 'IR' + value.replace(/\D/g, '');
    }

    if (value.length > 26) value = value.slice(0, 26);

    if (value.length > 4) {
      value = value.replace(/(IR\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{2})/, '$1-$2-$3-$4-$5-$6-$7');
    }

    setFormData(prev => ({
      ...prev,
      sheba: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editingAccount) {
        await updateAccount(editingAccount._id, formData);
        toast.success('حساب بانکی با موفقیت ویرایش شد', {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        await addAccount(formData);
        toast.success('حساب بانکی با موفقیت اضافه شد', {
          position: "top-right",
          autoClose: 3000,
        });
      }
      setIsAddingAccount(false);
      setIsEditing(false);
      setEditingAccount(null);
      setFormData({
        cardNumber: '',
        cardHolder: '',
        bankName: '',
        sheba: ''
      });
    } catch (error) {
      toast.error('خطا در ثبت اطلاعات', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setIsEditing(true);
    setIsAddingAccount(true);
    setFormData({
      cardNumber: account.cardNumber,
      cardHolder: account.cardHolder,
      bankName: account.bankName,
      sheba: account.sheba
    });
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('آیا از حذف این حساب بانکی مطمئن هستید؟')) {
      try {
        await deleteAccount(accountId);
        toast.success('حساب بانکی با успеیت حذف شد', {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error('خطا در حذف حساب بانکی', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  const handleSetDefault = async (accountId) => {
    try {
      await setDefaultAccount(accountId);
      toast.success('حساب پیشفرض با موفقیت تغییر کرد', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('خطا در تغییر حساب پیشفرض', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const cancelForm = () => {
    setIsAddingAccount(false);
    setIsEditing(false);
    setEditingAccount(null);
    setFormData({
      cardNumber: '',
      cardHolder: '',
      bankName: '',
      sheba: ''
    });
  };

  const logoutUser = async () => {
    try {
      await logout();
      toast.info('عملیات خروج انجام شد');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('خطا در خروج از حساب', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Navigation items
  const navItems = [
    { id: 'profile', icon: <PiUser className="ml-2 w-5 h-5" />, text: 'حساب کاربری', link: '/profile' },
    { id: 'bookings', icon: <BsHouses className="ml-2 w-5 h-5" />, text: 'رزروهای اقامتگاه', link: '/bookings' },
    { id: 'foods', icon: <IoFastFoodOutline className="ml-2 w-5 h-5" />, text: 'سفارش های غذا', link: '/order-foods' },
    { id: 'bus', icon: <LiaBusSolid className="ml-2 w-5 h-5" />, text: 'بلیط های اتوبوس', link: '/bus-tickets' },
    { id: 'favorites', icon: <RiHeart2Line className="ml-2 w-5 h-5" />, text: 'لیست علاقه مندی ها', link: '/favorites' },
    { id: 'bank', icon: <RiBankCard2Line className="ml-2 w-5 h-5" />, text: 'اطلاعات حساب بانکی', link: '/bank' },
    { id: 'notifications', icon: <RiNotificationLine className="ml-2 w-5 h-5" />, text: 'لیست اعلان ها', link: '/notifications' },
    { id: 'support', icon: <RiCustomerService2Line className="ml-2 w-5 h-5" />, text: 'پشتیبانی', link: '/support' },
  ];

  const renderBankCard = (account) => (
    <motion.div
      key={account._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-4 left-4 opacity-20">
        <RiBankLine size={40} />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-lg mb-1">{account.bankName}</h3>
          <p className="text-blue-100 text-sm">{account.cardHolder}</p>
        </div>
        {account.isDefault && (
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            پیشفرض
          </span>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <RiMoneyDollarCircleLine className="ml-2" />
          <span className="text-sm">شماره کارت:</span>
        </div>
        <p className="font-mono text-xl tracking-wider">{account.cardNumber}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <RiInformationLine className="ml-2" />
          <span className="text-sm">شماره شبا:</span>
        </div>
        <p className="font-mono text-sm tracking-wide">{account.sheba}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {account.cardNumber.startsWith('6037') || account.cardNumber.startsWith('5892') ? (
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bank_Melli_Iran_logo.svg/200px-Bank_Melli_Iran_logo.svg.png" alt="Melli Bank" className="h-6" />
          ) : account.cardNumber.startsWith('5022') || account.cardNumber.startsWith('6393') ? (
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Pasargad_Bank_logo.svg/200px-Pasargad_Bank_logo.svg.png" alt="Pasargad Bank" className="h-6" />
          ) : (
            <RiBankLine size={24} />
          )}
        </div>

        <div className="flex gap-2">
          {!account.isDefault && (
            <button
              onClick={() => handleSetDefault(account._id)}
              className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-50 transition-colors"
            >
              پیشفرض
            </button>
          )}
          <button
            onClick={() => handleEdit(account)}
            className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-50 transition-colors"
          >
            ویرایش
          </button>
          <button
            onClick={() => handleDelete(account._id)}
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
          >
            حذف
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">دسترسی محدود</h2>
          <p className="text-gray-600 mb-6">برای مشاهده اطلاعات بانکی لطفا وارد حساب کاربری شوید</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
          >
            ورود به حساب کاربری
          </Link>
        </div>
      </div>
    );
  }

  if (loading && !accounts.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">در حال دریافت اطلاعات بانکی...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 md:px-8">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between mb-4 p-4 bg-white rounded-xl shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">حساب‌های بانکی</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-blue-50 text-blue-600 z-50 relative"
        >
          {isMobileMenuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 md:gap-6">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* User Sidebar */}
        <div className={`
          w-full lg:w-1/4 bg-white rounded-2xl shadow-lg border border-gray-100 
          transition-all duration-300 z-50 lg:z-auto
          ${isMobileMenuOpen
            ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 max-w-md max-h-[80vh] overflow-y-auto'
            : 'hidden lg:block'
          }
        `}>
          {/* Close button for mobile */}
          {isMobileMenuOpen && (
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center lg:hidden">
              <h2 className="text-lg font-semibold text-gray-800">منو</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-full bg-gray-100 text-gray-600"
              >
                <RiCloseLine size={20} />
              </button>
            </div>
          )}

          <div className="p-4 md:p-6 text-center">
            <div className="relative mx-auto w-24 h-24 md:w-32 md:h-32 mb-4">
              <img
                src={"https://cdn-icons-png.flaticon.com/128/17384/17384295.png" || user?.avatar}
                alt="پروفایل کاربر"
                className="object-cover rounded-full w-full h-full border-4 border-white shadow-lg transition-all duration-300 hover:scale-105"
              />
              <button className="absolute bottom-0 right-0 p-1 md:p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-110">
                <IoIosCamera className="text-blue-600 text-lg md:text-xl" />
              </button>
            </div>
            <h3 className="mt-2 text-lg md:text-xl font-semibold text-gray-800 truncate">
              {user?.name || user?.phone || 'کاربر'}
            </h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base truncate">کاربر عزیز، خوش آمدید</p>
          </div>

          <div className="border-t border-gray-100 mx-4"></div>

          <nav className="p-2 md:p-4">
            <ul className="space-y-1 md:space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${item.id === 'bank'
                      ? 'bg-blue-50 text-blue-600 shadow-inner'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-blue-500'
                      }`}
                  >
                    {item.icon}
                    <span className="text-right flex-1 text-sm md:text-base">{item.text}</span>
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={logoutUser}
                  className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <RiLogoutBoxRLine className="ml-2 w-5 h-5" />
                  <span className="text-right flex-1 text-sm md:text-base">خروج از حساب</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <div className="p-4 md:p-6 lg:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800">حساب‌های بانکی</h2>
                  <p className="text-gray-500 text-sm mt-1">مدیریت حساب‌های بانکی شما</p>
                </div>

                {!isAddingAccount && (
                  <button
                    onClick={() => setIsAddingAccount(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <RiAddCircleLine className="ml-1" size={18} />
                    <span>افزودن حساب جدید</span>
                  </button>
                )}
              </div>

              {isAddingAccount ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 p-6 rounded-2xl mb-6"
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-4">
                    {isEditing ? 'ویرایش حساب بانکی' : 'افزودن حساب بانکی جدید'}
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          نام بانک
                        </label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                          placeholder="نام بانک"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          نام دارنده کارت
                        </label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                          placeholder="نام کامل دارنده کارت"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        شماره کارت
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        شماره شبا
                      </label>
                      <input
                        type="text"
                        name="sheba"
                        value={formData.sheba}
                        onChange={handleShebaChange}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-300"
                        placeholder="IRXX-XXXX-XXXX-XXXX-XXXX-XXXX-XX"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors duration-300"
                      >
                        {isEditing ? 'ویرایش حساب' : 'افزودن حساب'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelForm}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-xl transition-colors duration-300"
                      >
                        انصراف
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : null}

              {accounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {accounts.map(renderBankCard)}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <RiBankLine className="text-blue-600 text-3xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mt-4">حساب بانکی یافت نشد</h3>
                    <p className="text-gray-500 mt-2">شما هنوز هیچ حساب بانکی اضافه نکرده‌اید</p>
                    <button
                      onClick={() => setIsAddingAccount(true)}
                      className="inline-block mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      افزودن حساب بانکی
                    </button>
                  </div>
                </div>
              )}

              {accounts.length > 0 && (
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start">
                    <RiShieldCheckLine className="text-blue-600 text-xl mt-1 ml-2" />
                    <div>
                      <h4 className="font-bold text-blue-800 mb-2">اطلاعات امنیتی</h4>
                      <p className="text-blue-600 text-sm">
                        اطلاعات حساب بانکی شما با استانداردهای امنیتی بالا محافظت می‌شود.
                        این اطلاعات فقط برای پرداخت‌های مربوط به رزرو اقامتگاه استفاده می‌شود.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default BankPage;