import React, { lazy, Suspense } from 'react';

// Lazy load all components
const AddFood = lazy(() => import("../pages/AddFood"));
const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Cooks = lazy(() => import("../pages/Cooks"));
const Comments = lazy(() => import("../pages/Comments"));
const Financials = lazy(() => import("../pages/Financials"));
const Advertisments = lazy(() => import("../pages/Advertisments"));
const SupportTickets = lazy(() => import("../pages/SupportTickets"));
const CreateSupportTicket = lazy(() => import("../pages/CreateSupportTicket"));
const Bank = lazy(() => import("../pages/Bank"));
const Profile = lazy(() => import("../pages/Profile"));
const Orders = lazy(() => import("../pages/Orders"));
const SingleOrder = lazy(() => import("../pages/SingleOrder"));
const CreateAds = lazy(() => import("../pages/CreateAds"));
const UpdateAds = lazy(() => import("../pages/UpdateAds"));
const Foods = lazy(() => import("../pages/Foods"));
const UpdateFood = lazy(() => import("../pages/UpdateFood"));
const SingleSupportTicket = lazy(() => import("../pages/SingleSupportTicket"));

// Create a loading component
const Loading = () => <div>Loading...</div>; // Replace with your custom loading component

// Wrap each component with Suspense
const withSuspense = (Component) => (props) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
);

const routes = [
  {
    path: '/orders',
    component: withSuspense(Orders),
  },
  {
    path: '/orders/:orderId/show-details',
    component: withSuspense(SingleOrder),
  },
  {
    path: '/financials',
    component: withSuspense(Financials),
  },
  {
    path: '/cooks',
    component: withSuspense(Cooks),
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
    path: '/comments',
    component: withSuspense(Comments),
  },
  {
    path: '/advertisments',
    component: withSuspense(Advertisments),
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
    path: '/bank',
    component: withSuspense(Bank),
  },
  {
    path: '/profile',
    component: withSuspense(Profile),
  },
  {
    path: '/create-advertisment',
    component: withSuspense(CreateAds),
  },
  {
    path: '/advertisements/:adsId/update',
    component: withSuspense(UpdateAds),
  },
  {
    path: '/add-food',
    component: withSuspense(AddFood),
  },
  {
    path: '/foods',
    component: withSuspense(Foods),
  },
  {
    path: '/foods/:foodId/update',
    component: withSuspense(UpdateFood),
  },
];

export default routes;