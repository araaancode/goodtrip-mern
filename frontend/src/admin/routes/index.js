import React, { Suspense, lazy } from 'react';

// Loading fallback component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy import for all components
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Welcome = lazy(() => import('../pages/protected/Welcome'));
const Page404 = lazy(() => import('../pages/protected/404'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const Users = lazy(() => import('../pages/Users'));
const Drivers = lazy(() => import('../pages/Drivers'));
const Cooks = lazy(() => import('../pages/Cooks'));
const Rooms = lazy(() => import('../pages/Rooms'));
const Owners = lazy(() => import('../pages/Owners'));
const Admins = lazy(() => import('../pages/Admins'));
const Profile = lazy(() => import('../pages/Profile'));
const UsersTickets = lazy(() => import('../pages/UsersTickets'));
const SingleUserTicket = lazy(() => import('../pages/SingleUserTicket'));
const DriversTickets = lazy(() => import('../pages/DriversTickets'));
const SingleDriverTicket = lazy(() => import('../pages/SingleDriverTicket'));
const CooksTickets = lazy(() => import('../pages/CooksTickets'));
const SingleCookTicket = lazy(() => import('../pages/SingleCookTicket'));
const OwnersTickets = lazy(() => import('../pages/OwnersTickets'));
const SingleOwnerTicket = lazy(() => import('../pages/SingleOwnerTicket'));
const ResetPassword = lazy(() => import('../features/user/ResetPassword'));

// Higher Order Component to wrap each component with Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component {...props} />
  </Suspense>
);

const routes = [
  {
    path: '/all-admins',
    component: withSuspense(Admins),
  },
  {
    path: '/dashboard',
    component: withSuspense(Dashboard),
  },
  {
    path: '/welcome',
    component: withSuspense(Welcome),
  },
  {
    path: '/blank',
    component: withSuspense(Blank),
  },
  {
    path: '/users/support-tickets',
    component: withSuspense(UsersTickets),
  },
  {
    path: '/users/:userId/support-tickets/:stId',
    component: withSuspense(SingleUserTicket),
  },
  {
    path: '/drivers/support-tickets',
    component: withSuspense(DriversTickets),
  },
  {
    path: '/drivers/:driverId/support-tickets/:stId',
    component: withSuspense(SingleDriverTicket),
  },
  {
    path: '/owners/support-tickets',
    component: withSuspense(OwnersTickets),
  },
  {
    path: '/owners/:ownerId/support-tickets/:stId',
    component: withSuspense(SingleOwnerTicket),
  },
  {
    path: '/cooks/support-tickets',
    component: withSuspense(CooksTickets),
  },
  {
    path: '/cooks/:cookId/support-tickets/:stId',
    component: withSuspense(SingleCookTicket),
  },
  {
    path: '/users',
    component: withSuspense(Users),
  },
  {
    path: '/drivers',
    component: withSuspense(Drivers),
  },
  {
    path: '/cooks',
    component: withSuspense(Cooks),
  },
  {
    path: '/rooms',
    component: withSuspense(Rooms),
  },
  {
    path: '/owners',
    component: withSuspense(Owners),
  },
  {
    path: '/all-admins',
    component: withSuspense(Admins),
  },
  {
    path: '/profile',
    component: withSuspense(Profile),
  },
  {
    path: '/reset-password',
    component: withSuspense(ResetPassword),
  },
];

export default routes;