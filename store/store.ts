import {
  Action,
  AnyAction,
  CombinedState,
  combineReducers,
  configureStore,
  createListenerMiddleware,
  Reducer,
  ReducersMapObject,
  ThunkAction,
} from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import storage from 'redux-persist/lib/storage'
import { PersistConfig } from 'redux-persist/lib/types'
import { apiInvoicesSlice } from '@/store/apiInvoicesSlice'
import { authSlice, AuthState } from '@/store/authSlice'
import {
  customizationSlice,
  CustomizationState,
} from '@/store/customizationSlice'
import {
  kanmonConnectSlice,
  KanmonConnectState,
} from '@/store/kanmonConnectSlice'
import { ApiInvoicesState } from '../types/DemoInvoicesTypes'
import { apiKeySlice, ApiKeyState } from '@/store/apiKeySlice'

export type RootState = CombinedState<{
  auth: AuthState
  customization: CustomizationState
  apiInvoices: ApiInvoicesState
  kanmonConnect: KanmonConnectState
  apiKey: ApiKeyState
}>

export const resetStore = () => storage.removeItem('persist:kanmonDemo')

const allSlices = [
  authSlice,
  customizationSlice,
  apiInvoicesSlice,
  kanmonConnectSlice,
  apiKeySlice,
]

const combinedReducers = combineReducers<RootState, AnyAction>(
  allSlices.reduce((agg, nextSlice) => {
    return {
      ...agg,
      [nextSlice.name]: nextSlice.reducer,
    }
  }, {} as ReducersMapObject<RootState>),
)

interface ResetStoreAction {
  type: 'RESET_STORE'
  completeReset: boolean
}

export const resetStoreAction = (completeReset: boolean): ResetStoreAction => {
  return {
    type: 'RESET_STORE',
    completeReset,
  }
}

const isResetStoreAction = (action: AnyAction): action is ResetStoreAction => {
  return action.type === 'RESET_STORE'
}

const rootReducer: Reducer<RootState, AnyAction> = (state, action) => {
  // https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store/35641992#35641992
  if (isResetStoreAction(action)) {
    const resetState = allSlices.reduce((agg, nextSlice) => {
      let sliceState = nextSlice.getInitialState()

      // Preserve API key when completeReset is false
      if (nextSlice.name === 'apiKey' && !action.completeReset && state?.apiKey) {
        sliceState = state.apiKey
      }

      // Preserve configuration settings (useCdnSdk, enableV2View) when clicking "Start Over"
      if (nextSlice.name === 'kanmonConnect' && !action.completeReset && state?.kanmonConnect) {
        sliceState = state?.kanmonConnect
      }

      return {
        ...agg,
        [nextSlice.name]: sliceState,
      }
    }, {} as RootState)

    return combinedReducers(resetState, action)
  }

  return combinedReducers(state, action)
}

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    devTools: true,
  })

export const makeStore = () => {
  const isServer = typeof window === 'undefined'

  const listenerMiddleware = createListenerMiddleware()

  if (isServer) {
    return makeConfiguredStore()
  } else {
    // we need it only on client side
    const persistConfig: PersistConfig<RootState> = {
      key: 'kanmonDemo',
      whitelist: [
        'auth',
        'customization',
        'apiInvoices',
        'kanmonConnect',
        'apiKey',
      ], // make sure it does not clash with server keys
      storage,
      // Automerge level 2 does a shallow merge two levels down
      // This is important for us so that any NEW default values we set are respected
      // But these are overwritten with our saved changes if found
      // Docs: https://github.com/rt2zz/redux-persist#state-reconciler
      stateReconciler: autoMergeLevel2,
      version: 1,
    }
    const persistedReducer = persistReducer(persistConfig, rootReducer)

    const store = configureStore({
      reducer: persistedReducer,
      devTools: process.env.NODE_ENV !== 'production',
      // https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }).prepend(listenerMiddleware.middleware),
    })

    // Nasty hack to get the persistance on the store
    ;(store as any).__persistor = persistStore(store)

    return store
  }
}

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>

export const wrapper = createWrapper<AppStore>(makeStore)
