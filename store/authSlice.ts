import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'

export interface AuthState {
  userId: string | undefined
  email: string | undefined
  businessId: string | undefined
}

const initialState: AuthState = {
  userId: undefined,
  email: undefined,
  businessId: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveCredentials(
      state,
      action: {
        payload: { email?: string; userId: string; businessId: string }
      },
    ) {
      state.email = action.payload.email
      state.userId = action.payload.userId
      state.businessId = action.payload.businessId
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      }
    },
  },
})

export const { saveCredentials } = authSlice.actions

export const getAuthState = (state: AppState) => state.auth

export default authSlice.reducer
