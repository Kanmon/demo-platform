import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'

export interface CustomizationState {
  editMode: boolean
  logoBase64: string | undefined
  logoWidth: number
  logoHeight: number
  primaryColor: string
  ctaButtonColor: string
  sidenavBgColor: string
  buttonBgColor: string
}

const initialState: CustomizationState = {
  editMode: false,
  logoBase64: undefined,
  logoWidth: 32,
  logoHeight: 32,
  primaryColor: '#6366f1',
  ctaButtonColor: '#10b981',
  sidenavBgColor: '#1e293b',
  buttonBgColor: '#6366f1',
}

var a = ''

export const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    importCustomizationState(state, action: { payload: CustomizationState }) {
      // Lets not touch this one
      // state.editMode = true

      state.logoBase64 = action.payload.logoBase64
      state.primaryColor = action.payload.primaryColor
      state.ctaButtonColor = action.payload.ctaButtonColor
      state.sidenavBgColor = action.payload.sidenavBgColor
      state.buttonBgColor = action.payload.buttonBgColor
    },
    saveNewLogo(
      state,
      action: { payload: { imageBase64: string | undefined } },
    ) {
      state.logoBase64 = action.payload.imageBase64
    },
    toggleEditMode(state, _action: { payload: Record<string, unknown> }) {
      state.editMode = !state.editMode
    },
    updatePrimaryColor(state, action: { payload: { color: string } }) {
      state.primaryColor = action.payload.color
    },
    updateCtaButtonColor(state, action: { payload: { color: string } }) {
      state.ctaButtonColor = action.payload.color
    },
    updateSidenavBgColor(state, action: { payload: { color: string } }) {
      state.sidenavBgColor = action.payload.color
    },
    updateButtonBgColor(state, action: { payload: { color: string } }) {
      state.buttonBgColor = action.payload.color
    },
    updateLogoDimensions(
      state,
      action: { payload: { width: number; height: number } },
    ) {
      state.logoWidth = action.payload.width
      state.logoHeight = action.payload.height
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.customization,
      }
    },
  },
})

export const {
  saveNewLogo,
  toggleEditMode,
  updatePrimaryColor,
  importCustomizationState,
  updateLogoDimensions,
  updateCtaButtonColor,
  updateSidenavBgColor,
  updateButtonBgColor,
} = customizationSlice.actions

export const getCustomizationState = (state: AppState) => state.customization

export default customizationSlice.reducer
