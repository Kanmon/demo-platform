import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'
import { PlatformStyleConfigurationsDTO } from '../types/PlatformStyleConfigTypes'

export interface PlatformStyleConfigState {
  config: PlatformStyleConfigurationsDTO | null
}

const initialState: PlatformStyleConfigState = {
  config: null,
}

export const platformStyleConfigSlice = createSlice({
  name: 'platformStyleConfig',
  initialState,
  reducers: {
    savePlatformStyleConfig(
      state,
      action: { payload: PlatformStyleConfigurationsDTO },
    ) {
      state.config = action.payload
    },
    clearPlatformStyleConfig(state) {
      state.config = null
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.platformStyleConfig,
      }
    },
  },
})

export const { savePlatformStyleConfig, clearPlatformStyleConfig } =
  platformStyleConfigSlice.actions

export const getPlatformStyleConfigState = (state: AppState) =>
  state.platformStyleConfig

export default platformStyleConfigSlice.reducer
