import React, { lazy, Suspense } from 'react';

// Lazy imports for all components
const Dashboard = lazy(() => import('../pages/protected/Dashboard'));
const Welcome = lazy(() => import('../pages/protected/Welcome'));
const Blank = lazy(() => import('../pages/protected/Blank'));
const Bookings = lazy(() => import('../pages/Bookings'));
const Comments = lazy(() => import('../pages/Comments'));
const Rates = lazy(() => import('../pages/Rates'));
const Financials = lazy(() => import('../pages/Financials'));
const Advertisments = lazy(() => import('../pages/Advertisments'));
const Prices = lazy(() => import('../pages/Prices'));
const Support = lazy(() => import('../pages/Support'));
const Bank = lazy(() => import('../pages/Bank'));
const Profile = lazy(() => import('../pages/Profile'));
const AddBus = lazy(() => import('../pages/AddBus'));
const CreateAds = lazy(() => import('../pages/CreateAds'));
const UpdateAds = lazy(() => import('../pages/UpdateAds'));
const CreateSupportTicket = lazy(() => import('../pages/CreateSupportTicket'));
const SupportTickets = lazy(() => import('../pages/SupportTickets'));
const SingleSupportTicket = lazy(() => import('../pages/SingleSupportTicket'));
const MyBus = lazy(() => import('../pages/MyBus'));

// Loading component for Suspense fallback
const LoadingFallback = () => <div>Loading...</div>;

// Wrap each component with Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

const routes = [
  {
    path: '/bookings', 
    component: withSuspense(Bookings),
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
    path: '/comments',
    component: withSuspense(Comments),
  },
  {
    path: '/rates',
    component: withSuspense(Rates),
  },
  {
    path: '/financials',
    component: withSuspense(Financials),
  },
  {
    path: '/advertisments',
    component: withSuspense(Advertisments),
  },
  {
    path: '/create-advertisment',
    component: withSuspense(CreateAds),
  },
  {
    path: '/advertisments/:adsId/update',
    component: withSuspense(UpdateAds),
  },
  {
    path: '/price',
    component: withSuspense(Prices),
  },
  {
    path: '/support-tickets',
    component: withSuspense(SupportTickets),
  },
  {
    path: '/create-support-ticket',
    component: withSuspense(CreateSupportTicket),
  },
  {
    path: '/support-tickets/:stId',
    component: withSuspense(SingleSupportTicket),
  },
  {
    path: '/support',
    component: withSuspense(Support),
  },
  {
    path: '/bank',
    component: withSuspense(Bank),
  },
  {
    path: '/profile',
    component: withSuspense(Profile),
  },
  {
    path: '/add-bus',
    component: withSuspense(AddBus),
  },
  {
    path: '/my-bus',
    component: withSuspense(MyBus),
  },
];

export default routes;