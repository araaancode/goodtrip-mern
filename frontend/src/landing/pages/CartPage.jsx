import { useEffect, useState, useCallback } from 'react';
import { CiShoppingCart } from "react-icons/ci";
import { Link } from "react-router-dom";
import useCartStore from '../store/cartStore';

// Component for loading state
const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">در حال بارگذاری سبد خرید...</p>
    </div>
  </div>
);

// Component for error state
const ErrorState = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
      <svg
        className="h-12 w-12 mx-auto text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 className="text-lg font-medium text-gray-800 mt-4">خطا در بارگذاری سبد خرید</h3>
      <p className="mt-2 text-gray-600">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg transition shadow-sm"
      >
        تلاش مجدد
      </button>
    </div>
  </div>
);

// Component for empty cart state
const EmptyCartState = () => (
  <div className="bg-white p-12 rounded-xl shadow-sm text-center max-w-2xl mx-auto border border-gray-100">
    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
      <CiShoppingCart className="w-12 h-12 font-bold text-blue-900" />
    </div>
    <h2 className="mt-6 text-2xl font-semibold text-gray-800">سبد خرید شما خالی است</h2>
    <p className="mt-3 text-gray-600 max-w-md mx-auto">
      می‌توانید با مراجعه به صفحه سفارش غذا، غذای مورد نظر خود را انتخاب کنید
    </p>
    <Link
      to="/order-food"
      className="mt-8 inline-flex items-center px-8 py-3 bg-blue-900 text-white rounded-lg shadow-sm transition font-semibold"
    >
      مشاهده غذاها
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </Link>
  </div>
);

// Component for individual cart item
const CartItem = ({ item, isLoading, onIncrease, onDecrease, onRemove }) => {
  const { food, quantity } = item;
  
  return (
    <li className="p-6 hover:bg-gray-50 transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="relative flex-shrink-0">
            <img
              className="w-28 h-28 object-cover rounded-lg border border-gray-200"
              src={food.photo || '/images/food-placeholder.jpg'}
              alt={food.name}
            />
            <div className="absolute -top-2 -right-2 bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              {quantity}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{food.name}</h3>
            <p className="text-gray-500 mt-1">{food.price.toLocaleString('fa-IR')} تومان</p>
            <p className="text-sm text-gray-400 mt-2">توسط: {food.cookName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onDecrease(food._id)}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
              disabled={isLoading}
            >
              -
            </button>
            <span className="px-4 py-2 bg-white text-center text-gray-700 font-medium min-w-[3rem]">
              {quantity.toLocaleString('fa-IR')}
            </span>
            <button
              onClick={() => onIncrease(food._id)}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 transition"
              disabled={isLoading}
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(food._id)}
            className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-50"
            title="حذف از سبد"
            disabled={isLoading}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </li>
  );
};

// Component for order summary
const OrderSummary = ({ items, total, isLoading, isClient }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 border border-gray-100">
    <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">خلاصه سفارش</h2>
    
    <div className="space-y-4 mb-6">
      {items.map(item => (
        <div key={item._id} className="flex justify-between items-center">
          <span className="text-gray-600">
            {item.food.name} <span className="text-sm text-gray-400">(×{item.quantity})</span>
          </span>
          <span className="font-medium">
            {isClient ? (item.food.price * item.quantity).toLocaleString('fa-IR') : '0'} تومان
          </span>
        </div>
      ))}
    </div>

    <div className="border-t border-gray-100 pt-4 mb-6">
      <div className="flex justify-between text-lg font-bold text-gray-800">
        <span>جمع کل:</span>
        <span>{isClient ? total.toLocaleString('fa-IR') : '0'} تومان</span>
      </div>
    </div>

    <button
      className="w-full py-3.5 bg-blue-900 text-white rounded-lg font-bold shadow-sm transition flex items-center justify-center gap-2"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          در حال پردازش...
        </>
      ) : (
        <Link to="/create-order" className="inline">
          تکمیل سفارش
        </Link>
      )}
    </button>
  </div>
);

const CartPage = () => {
  const {
    items,
    total,
    isLoading,
    error,
    initializeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
  } = useCartStore();

  const [isClient, setIsClient] = useState(false);
  const totalItems = getTotalItems();

  useEffect(() => {
    setIsClient(true);
    initializeCart();
  }, [initializeCart]);

  const handleIncreaseQuantity = useCallback(async (foodId) => {
    const item = items.find(item => item.food._id === foodId);
    if (item) {
      await updateQuantity(foodId, item.quantity + 1);
    }
  }, [items, updateQuantity]);

  const handleDecreaseQuantity = useCallback(async (foodId) => {
    const item = items.find(item => item.food._id === foodId);
    if (item && item.quantity > 1) {
      await updateQuantity(foodId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      await removeItem(foodId);
    }
  }, [items, updateQuantity, removeItem]);

  const handleRemoveItem = useCallback(async (foodId) => {
    await removeItem(foodId);
  }, [removeItem]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={initializeCart} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            سبد خرید شما <span className="text-blue-900">({totalItems} عدد)</span>
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="px-5 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-lg transition flex items-center gap-2 shadow-sm"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              پاک کردن سبد
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <ul className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <CartItem
                      key={item.food._id}
                      item={item}
                      isLoading={isLoading}
                      onIncrease={handleIncreaseQuantity}
                      onDecrease={handleDecreaseQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary 
                items={items} 
                total={total} 
                isLoading={isLoading} 
                isClient={isClient} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;