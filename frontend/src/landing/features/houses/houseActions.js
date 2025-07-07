import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const backendURL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:5000'
    : import.meta.env.VITE_SERVER_URL

export const searchHouses = createAsyncThunk(
  'auth/login',
  async ({ city }, { rejectWithValue }) => {
    try {
      // configure header's Content-Type as JSON
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }

      const { data } = await axios.post(
        `${backendURL}/api/users/search-houses`,
        { city },
        config
      )

      await axios.post(
        `${backendURL}/api/users/search-houses`,
        { city },
        config
      )


      console.log(data);

      return data
      
    } catch (error) {
      // return custom error message from API if any
      if (error.response && error.response.data.msg) {
        return rejectWithValue(error.response.data.msg)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)