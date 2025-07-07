// stores/cartStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import CartService from "../services/cartService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Helper function to calculate total
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isLoading: false,
      error: null,

      // Initialize cart from database
      initializeCart: async () => {
        set({ isLoading: true });
        try {
          const cart = await CartService.getCart();
          set({
            items: cart.items,
            total: cart.total,
            isLoading: false,
          });
          toast.success('سبد خرید با موفقیت بارگذاری شد', { rtl: true });
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          toast.error('خطا در بارگذاری سبد خرید', { rtl: true });
        }
      },

      // Add item with database sync
      addItemToCart: async (food) => {
        set({ isLoading: true });
        try {
          const { items } = get();
          const existingItem = items.find((item) => item.food._id === food._id);

          let updatedItems;
          if (existingItem) {
            const response = await CartService.updateItem(
              existingItem.food._id,
              existingItem.quantity + 1
            );
            updatedItems = response.items;
            toast.success(`تعداد "${food.name}" در سبد خرید افزایش یافت`, { rtl: true });
          } else {
            const response = await CartService.addItem(food._id);
            updatedItems = response.items;
            toast.success(`"${food.name}" به سبد خرید اضافه شد`, { rtl: true });
          }

          set({
            items: updatedItems,
            total: calculateTotal(updatedItems),
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          toast.error(`خطا در اضافه کردن "${food.name}" به سبد خرید`, { rtl: true });
        }
      },

      // Remove item with database sync
      removeItem: async (foodId) => {
        set({ isLoading: true });
        try {
          const { items } = get();
          const itemToRemove = items.find((item) => item.food._id === foodId);

          if (itemToRemove) {
            await CartService.removeItem(itemToRemove.food._id);
            const updatedItems = items.filter(
              (item) => item.food._id !== foodId
            );

            set({
              items: updatedItems,
              total: calculateTotal(updatedItems),
              isLoading: false,
            });
            toast.success('آیتم با موفقیت از سبد خرید حذف شد', { rtl: true });
          }
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          toast.error('خطا در حذف آیتم از سبد خرید', { rtl: true });
        }
      },

      // Update quantity with database sync
      updateQuantity: async (foodId, newQuantity) => {
        if (newQuantity < 1) return;

        set({ isLoading: true });
        try {
          const { items } = get();
          const itemToUpdate = items.find((item) => item.food._id === foodId);

          if (itemToUpdate) {
            const response = await CartService.updateItem(
              itemToUpdate.food._id, 
              newQuantity
            );

            set({
              items: response.items,
              total: response.total,
              isLoading: false,
            });
            toast.success('تعداد آیتم با موفقیت به‌روزرسانی شد', { rtl: true });
          }
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          toast.error('خطا در به‌روزرسانی تعداد آیتم', { rtl: true });
        }
      },

      // Clear cart with database sync
      clearCart: async () => {
        set({ isLoading: true });
        try {
          await CartService.clearCart();
          set({
            items: [],
            total: 0,
            isLoading: false,
          });
          toast.success('سبد خرید با موفقیت خالی شد', { rtl: true });
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          toast.error('خطا در خالی کردن سبد خرید', { rtl: true });
        }
      },

      // Helper functions
      isInCart: (foodId) => {
        const { items } = get();
        return items.some((item) => item.food._id === foodId);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "food-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        total: state.total,
      }),
    }
  )
);

export default useCartStore;