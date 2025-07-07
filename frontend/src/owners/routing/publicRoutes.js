//publicRoutes.js

import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

function PublicRoutes() {
    const token = useAuth()
    return token ? <Navigate to='/owners/welcome' /> : <Outlet />
}

export default PublicRoutes