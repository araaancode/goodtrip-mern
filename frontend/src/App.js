import React, { useState,useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Loader
import HouseLoader from "./Loader/Loader";

// hooks
import useUserAuthStore from "./landing/store/authStore";
import { useCookAuthStore } from "./cooks/stores/authStore";
import { useOwnerAuthStore } from "./owners/stores/authStore";

// routing
import PublicRoutes from "./landing/routing/publicRoutes";
import PrivateRoutes from "./landing/routing/privateRoutes";
import CookPublicRoutes from "./cooks/routing/publicRoutes";
import CookPrivateRoutes from "./cooks/routing/privateRoutes";

// landing pages (Kept non-lazy for frequently used components)
import IndexLayout from "./landing/components/Layout";
import IndexPage from "./landing/pages/IndexPage";
import LoginPage from "./landing/pages/LoginPage";
import RegisterPage from "./landing/pages/RegisterPage";

// Lazy-loaded landing pages (Optimized for rarely used routes)
const ProfilePage = lazy(() => import("./landing/pages/ProfilePage"));
const HousesPage = lazy(() => import("./landing/pages/HousesPage"));
const HousesFormPage = lazy(() => import("./landing/pages/HousesFormPage"));
const HousePage = lazy(() => import("./landing/pages/HousePage"));
const BookingsPage = lazy(() => import("./landing/pages/BookingsPage"));
const OrderFoodsPage = lazy(() => import("./landing/pages/OrderFoodsPage"));
const OrderFoodPage = lazy(() => import("./landing/pages/OrderFoodPage"));
const BookingPage = lazy(() => import("./landing/pages/BookingPage"));
const SearchResultsPage = lazy(() =>
  import("./landing/pages/SearchResultsPage")
);
const FavoritesPage = lazy(() => import("./landing/pages/FavoritesPage"));
const BankPage = lazy(() => import("./landing/pages/BankPage"));
const NotificationsPage = lazy(() =>
  import("./landing/pages/NotificationsPage")
);
const SupportPage = lazy(() => import("./landing/pages/SupportPage"));
const BookingBus = lazy(() => import("./landing/pages/BookingBus"));
const OrderFood = lazy(() => import("./landing/pages/OrderFood"));
const CreateOrderFood = lazy(() => import("./landing/pages/CreateOrderFood"));
const CartPage = lazy(() => import("./landing/pages/CartPage"));
const SingleFoodPage = lazy(() => import("./landing/pages/SingleFoodPage"));
const ConfirmBookingBus = lazy(() =>
  import("./landing/pages/ConfirmBookingBus")
);
const BusTicketsPage = lazy(() => import("./landing/pages/BusTicketsPage"));
const ForgotPasswordPage = lazy(() =>
  import("./landing/pages/ForgotPasswordPage")
);
const NotFound = lazy(() => import("./NotFound"));

// Lazy-loaded cook routes
const CooksLayout = lazy(() => import("./cooks/containers/Layout"));
const CooksLogin = lazy(() => import("./cooks/pages/Login"));
const CooksRegister = lazy(() => import("./cooks/pages/Register"));
const CooksForgotPassword = lazy(() => import("./cooks/pages/ForgotPassword"));
const CookResetPassword = lazy(() => import("./cooks/pages/ResetPassword"));
const CookUpdateAds = lazy(() => import("./cooks/pages/UpdateAds"));

// owners pages
const OwnersLayout = lazy(() => import("./owners/containers/Layout"));
const OwnersLogin = lazy(() => import("./owners/pages/Login"));
const OwnersRegister = lazy(() => import("./owners/pages/Register"));
const OwnersForgotPassword = lazy(() =>
  import("./owners/pages/ForgotPassword")
);
const OwnersResetPassword = lazy(() => import("./owners/pages/ResetPassword"));

// drivers pages
const DriversLayout = lazy(() => import("./drivers/containers/Layout"));
const DriversLogin = lazy(() => import("./drivers/pages/Login"));
const DriversRegister = lazy(() => import("./drivers/pages/Register"));
const DriversForgotPassword = lazy(() =>
  import("./drivers/pages/ForgotPassword")
);
const DriversResetPassword = lazy(() =>
  import("./drivers/pages/ResetPassword")
);

// admin private routes
const AdminsLayout = lazy(() => import("./admin/containers/Layout"));
const AdminsLogin = lazy(() => import("./admin/pages/Login"));
const AdminsRegister = lazy(() => import("./admin/pages/Register"));
// const AdminsForgotPassword = lazy(() =>
//   import("./admin/pages/ForgotPassword")
// );
// const AdminsResetPassword = lazy(() =>
//   import("./admin/pages/ResetPassword")
// );

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

function App() {
  const { isAuthenticated, checkAuth } = useUserAuthStore();
  const { isCookAuthenticated, checkAuthCook } = useCookAuthStore();
  const { isOwnerAuthenticated, checkAuthOwner } = useOwnerAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    checkAuth();
    checkAuthCook();
    checkAuthOwner();
  }, [checkAuth, checkAuthCook, checkAuthOwner]);

  return (
    <Router>
      <Suspense
        fallback={
          <div>
            <HouseLoader />
          </div>
        }
      >
        <Routes>
          {/* ******************************** admins routes ******************************** */}
          <Route
            path="/admins/login"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/admins/welcome" />
              ) : (
                <AdminsLogin />
              )
            }
          />
          {/* <Route
            path="/admins/forgot-password"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/admins/welcome" />
              ) : (
                <AdminsForgotPassword />
              )
            }
          /> */}
          {/* <Route
            path="/admins/reset-password"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/admins/welcome" />
              ) : (
                <AdminsResetPassword />
              )
            }
          /> */}
          <Route
            path="/admins/register"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/admins/welcome" />
              ) : (
                <AdminsRegister />
              )
            }
          />
          <Route path="/admins/*" element={<AdminsLayout />} />

          {/* ******************************** Cooks routes ******************************** */}
          <Route
            path="/cooks/login"
            element={
              isCookAuthenticated ? (
                <Navigate to="/cooks/welcome" />
              ) : (
                <CooksLogin />
              )
            }
          />
          <Route
            path="/cooks/forgot-password"
            element={
              isCookAuthenticated ? (
                <Navigate to="/cooks/welcome" />
              ) : (
                <CooksForgotPassword />
              )
            }
          />
          <Route
            path="/cooks/reset-password"
            element={
              isCookAuthenticated ? (
                <Navigate to="/cooks/welcome" />
              ) : (
                <CookResetPassword />
              )
            }
          />
          <Route
            path="/cooks/register"
            element={
              isCookAuthenticated ? (
                <Navigate to="/cooks/welcome" />
              ) : (
                <CooksRegister />
              )
            }
          />
          <Route path="/cooks/*" element={<CooksLayout />} />

          {/* ******************************** Owners routes ******************************** */}
          <Route
            path="/owners/login"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/owners/welcome" />
              ) : (
                <OwnersLogin />
              )
            }
          />
          <Route
            path="/owners/forgot-password"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/owners/welcome" />
              ) : (
                <OwnersForgotPassword />
              )
            }
          />
          <Route
            path="/owners/reset-password"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/owners/welcome" />
              ) : (
                <OwnersResetPassword />
              )
            }
          />
          <Route
            path="/owners/register"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/owners/welcome" />
              ) : (
                <OwnersRegister />
              )
            }
          />
          <Route path="/owners/*" element={<OwnersLayout />} />

          {/* ******************************** drivers routes ******************************** */}
          <Route
            path="/drivers/login"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/drivers/welcome" />
              ) : (
                <DriversLogin />
              )
            }
          />
          <Route
            path="/drivers/forgot-password"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/drivers/welcome" />
              ) : (
                <DriversForgotPassword />
              )
            }
          />
          <Route
            path="/drivers/reset-password"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/drivers/welcome" />
              ) : (
                <driversResetPassword />
              )
            }
          />
          <Route
            path="/drivers/register"
            element={
              isOwnerAuthenticated ? (
                <Navigate to="/drivers/welcome" />
              ) : (
                <DriversRegister />
              )
            }
          />
          <Route path="/drivers/*" element={<DriversLayout />} />

          {/* ******************************** Users routes ******************************** */}
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/profile" /> : <RegisterPage />
            }
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Main App Routes (With Layout) */}
          <Route element={<IndexLayout />}>
            <Route index element={<IndexPage />} />
            <Route
              path="/profile"
              element={
                isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />
              }
            />
            <Route path="/account/places" element={<HousesPage />} />
            <Route path="/account/places/new" element={<HousesFormPage />} />
            <Route path="/account/places/:id" element={<HousesFormPage />} />
            <Route path="/house/:id" element={<HousePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/bookings/:id" element={<BookingPage />} />
            <Route path="/order-foods" element={<OrderFoodsPage />} />
            <Route path="/order-foods/:orderId" element={<OrderFoodPage />} />
            <Route path="/search-houses" element={<SearchResultsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/bank" element={<BankPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/booking-bus" element={<BookingBus />} />
            <Route
              path="/confirm-bus-ticket/:id"
              element={<ConfirmBookingBus />}
            />
            <Route path="/bus-tickets" element={<BusTicketsPage />} />
            <Route
              path="/cart"
              element={
                isAuthenticated ? <CartPage /> : <Navigate to="/login" />
              }
            />
            <Route path="/order-food" element={<OrderFood />} />
            <Route path="/create-order" element={<CreateOrderFood />} />
            <Route path="/foods/:foodId" element={<SingleFoodPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
