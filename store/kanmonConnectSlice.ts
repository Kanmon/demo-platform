import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'
import { IssuedProduct } from '@kanmon/sdk'
import { UserState } from '@kanmon/web-sdk'

export interface KanmonConnectState {
  ctaText: string | null
  currentWorkflowState: UserState | null
  issuedProduct: IssuedProduct | null
  isOpen: boolean
  useCdnSdk?: boolean
  enableV2View?: boolean
}

const initialState: KanmonConnectState = {
  ctaText: null,
  currentWorkflowState: null,
  issuedProduct: null,
  isOpen: false,
  useCdnSdk: false, // This can be set based on your application logic
  enableV2View: false,
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
    updateIssuedProduct(
      state,
      action: {
        payload: {
          issuedProduct: IssuedProduct
        }
      },
    ) {
      state.issuedProduct = action.payload.issuedProduct
    },
    updateUseCdnSdk(
      state,
      action: { payload: { useCdnSdk: boolean; enableV2View: boolean } },
    ) {
      state.useCdnSdk = action.payload.useCdnSdk
      state.enableV2View = action.payload.enableV2View
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
  updateIssuedProduct,
  updateUseCdnSdk,
} = kanmonConnectSlice.actions

export const getKanmonConnectSlice = (state: AppState) => state.kanmonConnect

export default kanmonConnectSlice.reducer
