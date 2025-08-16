import React, { lazy, Suspense } from 'react';

// Lazy load all page components
const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Bookings = lazy(() => import("../pages/Bookings"));
const Booking = lazy(() => import("../pages/Booking"));
const Advertisments = lazy(() => import("../pages/Advertisments"));
const Support = lazy(() => import("../pages/Support"));
const Bank = lazy(() => import("../pages/Bank"));
const Profile = lazy(() => import("../pages/Profile"));
const AddHouse = lazy(() => import("../pages/AddHouse"));
const CreateAds = lazy(() => import("../pages/CreateAds"));
const CreateSupportTicket = lazy(() => import("../pages/CreateSupportTicket"));
const SupportTickets = lazy(() => import("../pages/SupportTickets"));
const SingleSupportTicket = lazy(() => import("../pages/SingleSupportTicket"));
const UpdateAds = lazy(() => import("../pages/UpdateAds"));
const UpdateHouse = lazy(() => import("../pages/UpdateHouse"));
const MyHouses = lazy(() => import("../pages/MyHouses"));

const Loading = () => <div>Loading...</div>

// Wrap each component with Suspense
const lazyLoadComponent = (Component) => (props) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
);

const routes = [
  {
    path: "/dashboard",
    component: lazyLoadComponent(Dashboard),
  },
  {
    path: "/add-house",
    component: lazyLoadComponent(AddHouse),
  },
  {
    path: "/bookings",
    component: lazyLoadComponent(Bookings),
  },
   {
    path: "/bookings/:reservationId/update",
    component: lazyLoadComponent(Booking),
  },
 
  {
    path: "/my-houses",
    component: lazyLoadComponent(MyHouses),
  },
  {
    path: "/houses/:houseId/update",
    component: lazyLoadComponent(UpdateHouse),
  },
  {
    path: "/create-advertisment",
    component: lazyLoadComponent(CreateAds),
  },
  {
    path: "/advertisments",
    component: lazyLoadComponent(Advertisments),
  },
  {
    path: '/advertisments/:adsId/update',
    component: lazyLoadComponent(UpdateAds),
  },
  {
    path: '/support-tickets',
    component: lazyLoadComponent(SupportTickets),
  },
  {
    path: '/create-support-ticket',
    component: lazyLoadComponent(CreateSupportTicket),
  },
  {
    path: '/support-tickets/:stId',
    component: lazyLoadComponent(SingleSupportTicket),
  },
  {
    path: "/support",
    component: lazyLoadComponent(Support),
  },
  {
    path: "/welcome",
    component: lazyLoadComponent(Welcome),
  },
  {
    path: "/blank",
    component: lazyLoadComponent(Blank),
  },
  {
    path: "/bank",
    component: lazyLoadComponent(Bank),
  },
  {
    path: "/profile",
    component: lazyLoadComponent(Profile),
  },
];

export default routes;