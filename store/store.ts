import {
  Action,
  AnyAction,
  CombinedState,
  combineReducers,
  configureStore,
  createListenerMiddleware,
  Reducer,
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

const resetStore = () => storage.removeItem('persist:kanmonDemo')

const combinedReducers = combineReducers<RootState, AnyAction>({
  [authSlice.name]: authSlice.reducer,
  [customizationSlice.name]: customizationSlice.reducer,
  [apiInvoicesSlice.name]: apiInvoicesSlice.reducer,
  [kanmonConnectSlice.name]: kanmonConnectSlice.reducer,
  [apiKeySlice.name]: apiKeySlice.reducer,
})

const rootReducer: Reducer<RootState, AnyAction> = (state, action) => {
  // https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store/35641992#35641992
  if (action.type === 'RESET_STORE') {
    resetStore()
    state = undefined
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
