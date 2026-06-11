import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'
import { UserState } from '@kanmon/web-sdk'

export interface KanmonConnectState {
  ctaText: string | null
  currentWorkflowState: UserState | null
  isOpen: boolean
  useCdnSdk?: boolean
  darkMode?: boolean
}

const initialState: KanmonConnectState = {
  ctaText: null,
  currentWorkflowState: null,
  isOpen: false,
  useCdnSdk: false, // This can be set based on your application logic
  darkMode: false,
}

export const kanmonConnectSlice = createSlice({
  name: 'kanmonConnect',
  initialState,
  reducers: {
    updateOnWorkflowChange(
      state,
      action: { payload: { ctaText: string; currentWorkflowState: UserState } },
    ) {
      state.ctaText = action.payload.ctaText
      state.currentWorkflowState = action.payload.currentWorkflowState
    },
    updateOnHide(state, action: { payload: { isOpen: boolean } }) {
      state.isOpen = action.payload.isOpen
    },
    updateUseCdnSdk(state, action: { payload: { useCdnSdk: boolean } }) {
      state.useCdnSdk = action.payload.useCdnSdk
    },
    updateDarkMode(state, action: { payload: { darkMode: boolean } }) {
      state.darkMode = action.payload.darkMode
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

export const {
  updateOnWorkflowChange,
  updateOnHide,
  updateUseCdnSdk,
  updateDarkMode,
} = kanmonConnectSlice.actions

export const getKanmonConnectSlice = (state: AppState) => state.kanmonConnect

export default kanmonConnectSlice.reducer
