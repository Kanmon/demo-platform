import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'
import { IssuedProduct } from '@kanmon/sdk'

export type UserState =
  | 'START_FLOW'
  | 'IN_MANUAL_REVIEW'
  | 'OTHER_USER_INPUT_REQUIRED'
  | 'USER_INPUT_REQUIRED'
  | 'WAITING_FOR_OFFERS'
  | 'NO_OFFERS_EXTENDED'
  | 'OFFERS_EXPIRED'
  | 'VIEW_OFFERS'
  | 'OFFER_ACCEPTED'
  | 'SERVICING'
  | 'WAITING_FOR_KANMON_DISCOVER_REPORT'
  | 'ERROR'

export interface KanmonConnectState {
  ctaText: string | null
  currentWorkflowState: UserState | null
  issuedProduct: IssuedProduct | null
  isOpen: boolean
}

const initialState: KanmonConnectState = {
  ctaText: null,
  currentWorkflowState: null,
  issuedProduct: null,
  isOpen: false,
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

export const { updateOnWorkflowChange, updateOnHide, updateIssuedProduct } =
  kanmonConnectSlice.actions

export const getKanmonConnectSlice = (state: AppState) => state.kanmonConnect

export default kanmonConnectSlice.reducer
