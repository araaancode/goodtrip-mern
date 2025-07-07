import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../features/auth/authSlice'
import { authApi } from './services/auth/authService'


import houseReducer from '../features/houses/houseSlice'


const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    house:houseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
})

export default store