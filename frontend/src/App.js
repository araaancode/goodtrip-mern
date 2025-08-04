import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import useUserAuthStore from "./landing/store/authStore";

// landing pages
import IndexLayout from "./landing/components/Layout";
import IndexPage from "./landing/pages/IndexPage";
import LoginPage from "./landing/pages/LoginPage";
import RegisterPage from "./landing/pages/RegisterPage";
import ProfilePage from "./landing/pages/ProfilePage";
import HousesPage from "./landing/pages/HousesPage";
import HousesFormPage from "./landing/pages/HousesFormPage";
import HousePage from "./landing/pages/HousePage";
import BookingsPage from "./landing/pages/BookingsPage";
import OrderFoodsPage from "./landing/pages/OrderFoodsPage";
import OrderFoodPage from "./landing/pages/OrderFoodPage";
import BookingPage from "./landing/pages/BookingPage";
import ProtectedRoute from "./landing/routing/ProtectedRoute";
import SearchResultsPage from "./landing/pages/SearchResultsPage";
import FavoritesPage from "./landing/pages/FavoritesPage";
import BankPage from "./landing/pages/BankPage";
import NotificationsPage from "./landing/pages/NotificationsPage";
import SupportPage from "./landing/pages/SupportPage";
import ForgotPasswordPage from "./landing/pages/ForgotPasswordPage";
import BookingBus from "./landing/pages/BookingBus";
import OrderFood from "./landing/pages/OrderFood";
import CreateOrderFood from "./landing/pages/CreateOrderFood";
import CartPage from "./landing/pages/CartPage";
import SingleFoodPage from "./landing/pages/SingleFoodPage";
import ConfirmBookingBus from "./landing/pages/ConfirmBookingBus";
import BusTicketsPage from "./landing/pages/BusTicketsPage";

import PublicRoutes from "./landing/routing/publicRoutes";
import PrivateRoutes from "./landing/routing/privateRoutes";

// // admin private routes
// import AdminPublicRoutes from "./admin/routing/publicRoutes"
// import AdminPrivateRoutes from "./admin/routing/privateRoutes"

// import AdminResetPassword from "./admin/features/user/ResetPassword"

// // cook private routes
import CookPublicRoutes from "./cooks/routing/publicRoutes";
import CookPrivateRoutes from "./cooks/routing/privateRoutes";

// // driver private routes
// import DriverPublicRoutes from "./drivers/routing/publicRoutes"
// import DriverPrivateRoutes from "./drivers/routing/privateRoutes"

// // owner private routes
// import OwnerPublicRoutes from "./owners/routing/publicRoutes"
// import OwnerPrivateRoutes from "./owners/routing/privateRoutes"

// // Importing pages
// import Layout from "./admin/containers/Layout"
// import Login from "./admin/pages/Login"
// import ForgotPassword from "./admin/pages/ForgotPassword"
// import Register from "./admin/pages/Register"

// // drivers pages
// import DriversLayout from "./drivers/containers/Layout"
// import DriversLogin from "./drivers/pages/Login"
// import DriversRegister from "./drivers/pages/Register"
// import DriversForgotPassword from "./drivers/pages/ForgotPassword"
// import DriversResetPassword from "./drivers/pages/ResetPassword"

// // owners pages
// import OwnersLayout from "./owners/containers/Layout"
// import OwnersLogin from "./owners/pages/Login"
// import OwnersRegister from "./owners/pages/Register"
// import OwnersForgotPassword from "./owners/pages/ForgotPassword"
// import OwnersResetPassword from "./owners/pages/ResetPassword"

// // cooks pages
import CooksLayout from "./cooks/containers/Layout";
import CooksLogin from "./cooks/pages/Login";
import CooksRegister from "./cooks/pages/Register";
import CooksForgotPassword from "./cooks/pages/ForgotPassword";
import CookResetPassword from "./cooks/pages/ResetPassword";

// not found page
import NotFound from "./NotFound";

function App() {
  const { isAuthenticated, checkAuth } = useUserAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      {/* <Router> */}
      {/* <Routes> */}
      {/* <Route
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

          {/* landing page */}
      {/* <Route path="/" element={<IndexLayout />}>
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
            <Route path="/search-houses" element={<SearchResultsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/bank" element={<BankPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/booking-bus" element={<BookingBus />} />
            <Route path="/order-food" element={<OrderFood />} />
            <Route
              path="/create-order/:foodCode"
              element={<CreateOrderFood />}
            /> */}
      {/* </Route>  */}

      {/* admins routes*/}
      {/* <Route element={<AdminPublicRoutes />}>
            <Route path="/admins/forgot-password" element={<ForgotPassword />} />
            <Route path="/admins/reset-password" element={<AdminResetPassword />} />
            <Route path="/admins/login" element={<Login />} />
            <Route path="/admins/register" element={<Register />} />
          </Route>
          <Route element={<AdminPrivateRoutes />}>
            <Route path="/admins/*" element={<Layout />} />
          </Route> */}

      {/* owners pages */}
      {/* <Route element={<OwnerPublicRoutes />}>
            <Route path="/owners/login" element={<OwnersLogin />} />
            <Route path="/owners/reset-password" element={<OwnersResetPassword />} />
            <Route path="/owners/forgot-password" element={<OwnersForgotPassword />} />
            <Route path="/owners/register" element={<OwnersRegister />} />
          </Route> */}

      {/* <Route element={<OwnerPrivateRoutes />}>
            <Route path="/owners/*" element={<OwnersLayout />} />
          </Route> */}

      {/* drivers pages */}
      {/* <Route element={<DriverPublicRoutes />}>
            <Route path="/drivers/login" element={<DriversLogin />} />
            <Route path="/drivers/forgot-password" element={<DriversForgotPassword />} />
            <Route path="/drivers/reset-password" element={<DriversResetPassword />} />
            <Route path="/drivers/register" element={<DriversRegister />} />
          </Route>

          <Route element={<DriverPrivateRoutes />}>
            <Route path="/drivers/*" element={<DriversLayout />} />
          </Route> */}

      {/* cooks pages */}
      {/* <Route element={<CookPublicRoutes />}>
        <Route path="/cooks/login" element={<CooksLogin />} />
        <Route
          path="/cooks/forgot-password"
          element={<CooksForgotPassword />}
        />
        <Route path="/cooks/reset-password" element={<CookResetPassword />} />
        <Route path="/cooks/register" element={<CooksRegister />} />
      </Route> */}

      {/* <Route element={<CookPrivateRoutes />}>
        <Route path="/cooks/*" element={<CooksLayout />} />
      </Route> */}

      {/* not found Page */}
      {/* <Route path="*" element={<NotFound />} /> */}
      {/* </Routes> */}
      {/* </Router> */}

      <Router>
        <Routes>
          {/* **************************************** cooks routes **************************************** */}
          <Route element={<CookPublicRoutes />}>
            <Route path="/cooks/login" element={<CooksLogin />} />
            <Route
              path="/cooks/forgot-password"
              element={<CooksForgotPassword />}
            />
            <Route
              path="/cooks/reset-password"
              element={<CookResetPassword />}
            />
            <Route path="/cooks/register" element={<CooksRegister />} />
          </Route>

          <Route element={<CookPrivateRoutes />}>
            <Route path="/cooks/*" element={<CooksLayout />} />
          </Route>

          {/* **************************************** users routes **************************************** */}
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
      </Router>
    </>
  );
}

export default App;
