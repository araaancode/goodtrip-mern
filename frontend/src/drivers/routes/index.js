import Dashboard from '../pages/protected/Dashboard'
import Welcome from '../pages/protected/Welcome'
import Blank from '../pages/protected/Blank'
import Bookings from '../pages/Bookings'
import Buses from '../pages/Buses'
import Comments from '../pages/Comments'
import Rates from '../pages/Rates'
import Financials from '../pages/Financials'
import Advertisments from '../pages/Advertisments'
import Prices from '../pages/Prices'
import Support from '../pages/Support'
import Bank from '../pages/Bank'
import Profile from '../pages/Profile'
import AddBus from '../pages/AddBus'
import CreateAds from "../pages/CreateAds"
import UpdateAds from "../pages/UpdateAds"
import CreateSupportTicket from "../pages/CreateSupportTicket"
import SupportTickets from "../pages/SupportTickets"
import SingleSupportTicket from "../pages/SingleSupportTicket"
import MyBus from "../pages/MyBus"

const routes = [
  
 
  {
    path: '/bookings', 
    component: Bookings,
  },
  {
    path: '/buses', 
    component: Buses,
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
  {
    path: '/rates',
    component: Rates,
  },
  {
    path: '/financials',
    component: Financials,
  },
  {
    path: '/advertisments',
    component: Advertisments,
  },
  {
    path: '/create-advertisment',
    component: CreateAds,
  },
  {
    path: '/advertisments/:adsId/update',
    component: UpdateAds,
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
    path: '/support',
    component: Support,
  },
  {
    path: '/bank',
    component: Bank,
  },
  {
    path: '/profile',
    component: Profile,
  },
  {
    path: '/add-bus',
    component: AddBus,
  },

  {
    path: '/my-bus',
    component: MyBus,
  },
  
]

export default routes
