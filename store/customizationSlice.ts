import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'
import { AppState } from './store'

export interface CustomizationState {
  editMode: boolean
  primaryColor: string
  primaryTextColor: string
  secondaryColor: string
  secondaryTextColor: string
  tertiaryColor: string
  sidenavBgColor: string
  sidenavTextColor: string
  sidenavSelectedColor: string
  defaultTextColor: string
  bannerBgColor: string
  programName: string
  demoLogoAddedText: string
  logoUrl: string | undefined
}

const initialState: CustomizationState = {
  editMode: false,
  primaryColor: '#6366f1',
  primaryTextColor: '#ffffff',
  secondaryColor: '#60a5fa',
  secondaryTextColor: '#ffffff',
  tertiaryColor: '#10b981',
  sidenavBgColor: '#1e293b',
  sidenavTextColor: '#94a3b8',
  sidenavSelectedColor: '#6366f1',
  defaultTextColor: '#1E293B',
  bannerBgColor: '#C7D2FE',
  programName: 'Flourish Capital',
  demoLogoAddedText: 'DEMO',
  logoUrl: undefined,
}

export const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    importCustomizationState(
      state,
      action: PayloadAction<Partial<CustomizationState>>,
    ) {
      return { ...state, ...action.payload }
    },
    toggleEditMode(state) {
      state.editMode = !state.editMode
    },
    updateCustomizationField<K extends keyof CustomizationState>(
      state: CustomizationState,
      action: PayloadAction<{ field: K; value: CustomizationState[K] }>,
    ) {
      state[action.payload.field] = action.payload.value
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
  importCustomizationState,
  toggleEditMode,
  updateCustomizationField,
} = customizationSlice.actions

export const getCustomizationState = (state: AppState) => state.customization

export default customizationSlice.reducer
