import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'

export interface ApiKeyState {
  apiKey: string | undefined
}

const initialState: ApiKeyState = {
  apiKey: undefined,
}

export const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState,
  reducers: {
    saveApiKey(state, action: { payload: { apiKey?: string } }) {
      state.apiKey = action.payload.apiKey
    },
    resetApiKey(state) {
      state.apiKey = undefined
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.apiKey,
      }
    },
  },
})

export const { saveApiKey, resetApiKey } = apiKeySlice.actions

export const getApiKeyState = (state: AppState) => state.apiKey

export default apiKeySlice.reducer
