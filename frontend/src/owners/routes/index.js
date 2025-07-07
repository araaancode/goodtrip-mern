import Dashboard from "../pages/protected/Dashboard";
import Welcome from "../pages/protected/Welcome";
import Page404 from "../pages/protected/404";
import Blank from "../pages/protected/Blank";
import Rents from "../pages/Rents";
import Bookings from "../pages/Bookings";
import MyHouses from "../pages/MyHouses";
import Comments from "../pages/Comments";
import Rates from "../pages/Rates";
import Financials from "../pages/Financials";
import Advertisments from "../pages/Advertisments";
import Prices from "../pages/Prices";
import Support from "../pages/Support";
import Bank from "../pages/Bank";
import Profile from "../pages/Profile";
import AddHouse from "../pages/AddHouse";
import CreateAds from "../pages/CreateAds";
import CreateSupportTicket from "../pages/CreateSupportTicket";
import SupportTickets from "../pages/SupportTickets";
import SingleSupportTicket from "../pages/SingleSupportTicket";
import UpdateAds from "../pages/UpdateAds";
import UpdateHouse from "../pages/UpdateHouse";

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/add-house",
    component: AddHouse,
  },
  {
    path: "/bookings",
    component: Bookings,
  },

  {
    path: "/financials",
    component: Financials,
  },
  {
    path: "/my-houses",
    component: MyHouses,
  },
  {
    path: "/houses/:houseId/update",
    component: UpdateHouse,
  },
  {
    path: "/create-advertisment",
    component: CreateAds,
  },
  {
    path: "/advertisments",
    component: Advertisments,
  },

  {
    path: '/advertisments/:adsId/update',
    component: UpdateAds,
  },

  {
    path: "/comments",
    component: Comments,
  },
  {
    path: "/rates",
    component: Rates,
  },
  {
    path: "/price",
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
    path: "/support",
    component: Support,
  },


  {
    path: "/welcome",
    component: Welcome,
  },
  {
    path: "/blank",
    component: Blank,
  },

  {
    path: "/bank",
    component: Bank,
  },
  {
    path: "/profile",
    component: Profile,
  },
];

export default routes;
