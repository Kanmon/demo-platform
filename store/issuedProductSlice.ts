import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'
import { IssuedProduct } from '@kanmon/sdk'

export interface IssuedProductState {
  issuedProduct: IssuedProduct | null
}

const initialState: IssuedProductState = {
  issuedProduct: null,
}

export const issuedProductSlice = createSlice({
  name: 'issuedProduct',
  initialState,
  reducers: {
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
        ...action.payload.issuedProduct,
      }
    },
  },
})

export const { updateIssuedProduct } = issuedProductSlice.actions

export const getIssuedProductSlice = (state: AppState) => state.issuedProduct

export default issuedProductSlice.reducer
