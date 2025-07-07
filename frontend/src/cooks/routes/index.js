import React from 'react'

import AddFood from "../pages/AddFood";
import Dashboard from "../pages/protected/Dashboard";
import Welcome from "../pages/protected/Welcome";
import Page404 from "../pages/protected/404";
import Blank from "../pages/protected/Blank";
import Bookings from "../pages/Bookings";
import Cooks from "../pages/Cooks";
import Comments from "../pages/Comments";
import Financials from "../pages/Financials";
import Advertisments from "../pages/Advertisments";
import Prices from "../pages/Prices";
import SupportTickets from "../pages/SupportTickets";
import CreateSupportTicket from "../pages/CreateSupportTicket";
import Bank from "../pages/Bank";
import Owners from "../pages/Owners";
import Profile from "../pages/Profile";
import CookInfo from "../pages/CookInfo";
import Orders from "../pages/Orders";
import SingleOrder from "../pages/SingleOrder";
import CreateAds from "../pages/CreateAds";
import UpdateAds from "../pages/UpdateAds";
import Foods from "../pages/Foods";
import UpdateFood from "../pages/UpdateFood";
import SingleSupportTicket from "../pages/SingleSupportTicket";

const routes = [
  {
    path: '/orders',
    component: Orders,
  },
  {
    path: '/orders/:orderId/show-details',
    component: SingleOrder,
  },
  {
    path: '/financials',
    component: Financials,
  },
  {
    path: '/cooks',
    component: Cooks,
  },

  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/welcome',
    component: Welcome,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/comments',
    component: Comments,
  },
  // {
  //   path: '/rates',
  //   component: Rates,
  // },

  {
    path: '/advertisments',
    component: Advertisments,
  },
  {
    path: '/price',
    component: Prices,
  },
  {
    path: '/support-tickets',
    component: SupportTickets,
  },
  {
    path: '/create-support-ticket',
    component: CreateSupportTicket,
  },

  {
    path: '/support-tickets/:stId',
    component: SingleSupportTicket,
  },
  {
    path: '/bank',
    component: Bank,
  },
  {
    path: '/profile',
    component: Profile,
  },
  // {
  //   path: '/cook-info',
  //   component: CookInfo,
  // },

  {
    path: '/create-advertisment',
    component: CreateAds,
  },

  {
    path: '/advertisments/:adsId/update',
    component: UpdateAds,
  },

  {
    path: '/add-food',
    component: AddFood,
  },

  {
    path: '/foods',
    component: Foods,
  },

  {
    path: '/foods/:foodId/update',
    component: UpdateFood,
  },



]

export default routes
