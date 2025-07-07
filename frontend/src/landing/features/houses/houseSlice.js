import { createSlice } from '@reduxjs/toolkit'
import { searchHouses } from './houseActions'


const initialState = {
  loading: false,
  houses: null,
  error: null,
  success: false,
}

const authSlice = createSlice({
  name: 'house',
  initialState,
  reducers: {
   
  },
  extraReducers: {
    // login user
    [searchHouses.pending]: (state) => {
      state.loading = true
      state.error = null
    },
    [searchHouses.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.userInfo = payload.houses
    },
    [searchHouses.rejected]: (state, { payload }) => {
      state.loading = false
      state.error = payload
    },
  },
})

export const { logout, setCredentials } = authSlice.actions

export default authSlice.reducer