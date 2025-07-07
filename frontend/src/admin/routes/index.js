
import Dashboard from '../pages/protected/Dashboard'
import Welcome from '../pages/protected/Welcome'
import Page404 from '../pages/protected/404'
import Blank from '../pages/protected/Blank'
import Requests from '../pages/Requests'
import Financials from '../pages/Financials'
import Users from '../pages/Users'
import Drivers from '../pages/Drivers'
import Cooks from '../pages/Cooks'
import Rooms from '../pages/Rooms'
import Owners from '../pages/Owners'
import Admins from '../pages/Admins'
import Profile from '../pages/Profile'
import UsersTickets from '../pages/UsersTickets'
import SingleUserTicket from '../pages/SingleUserTicket'
import DriversTickets from '../pages/DriversTickets'
import SingleDriverTicket from '../pages/SingleDriverTicket'
import CooksTickets from '../pages/CooksTickets'
import SingleCookTicket from '../pages/SingleCookTicket'
import OwnersTickets from '../pages/OwnersTickets'
import SingleOwnerTicket from '../pages/SingleOwnerTicket'
import ResetPassword from '../features/user/ResetPassword'


const routes = [
  {
    path: '/all-admins', // the url
    component: Admins, // view rendered
  },
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/welcome', // the url
    component: Welcome, // view rendered
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/requests',
    component: Requests,
  },
  {
    path: '/users/support-tickets',
    component: UsersTickets,
  },
  {
    path: '/users/:userId/support-tickets/:stId',
    component: SingleUserTicket,
  },
  {
    path: '/drivers/support-tickets',
    component: DriversTickets,
  },
  {
    path: '/drivers/:driverId/support-tickets/:stId',
    component: SingleDriverTicket,
  },
  {
    path: '/owners/support-tickets',
    component: OwnersTickets,
  },
  {
    path: '/owners/:ownerId/support-tickets/:stId',
    component: SingleOwnerTicket,
  },
  {
    path: '/cooks/support-tickets',
    component: CooksTickets,
  },
  {
    path: '/cooks/:cookId/support-tickets/:stId',
    component: SingleCookTicket,
  },
  {
    path: '/financials',
    component: Financials,
  },
  {
    path: '/users',
    component: Users,
  },
  {
    path: '/drivers',
    component: Drivers,
  },
  {
    path: '/cooks',
    component: Cooks,
  },
  {
    path: '/rooms',
    component: Rooms,
  },
  {
    path: '/owners',
    component: Owners,
  },
  {
    path: '/all-admins',
    component: Admins,
  },
  {
    path: '/profile',
    component: Profile,
  },

  {
    path: '/reset-password',
    component: ResetPassword,
  },
]

export default routes
