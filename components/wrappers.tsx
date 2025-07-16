import BusinessSelectionModalV2 from '@/components/BusinessSelectionModalV2'
import {
  addKanmonIdToInvoice,
  updateAvailableLimit,
} from '@/store/apiInvoicesSlice'
import { getAuthState } from '@/store/authSlice'
import {
  updateOnHide,
  updateOnWorkflowChange,
} from '@/store/kanmonConnectSlice'
import { resetStoreAction, RootState } from '@/store/store'
import { axiosWithApiKey } from '@/utils'
import { KanmonConnectParams, OnEventCallbackEventType } from '@kanmon/web-sdk'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useAsync } from 'react-use'
import { PersistGate } from 'redux-persist/integration/react'
import KanmonConnectContextProvider from '../hooks/KanmonConnectContext'
import { getApiKeyState, saveApiKey } from '../store/apiKeySlice'
import ApiKeyModal from './ApiKeyModal'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

interface Props {
  children?: React.ReactNode
}

// Initiate state - eventually this should live in _app
export const TempReduxWrapper: React.FC<Props> = ({ children }) => {
  const store = useStore<RootState>()
  const persistor = (store as any).__persistor

  return (
    <PersistGate persistor={persistor} loading={null}>
      {children}
    </PersistGate>
  )
}

export const TempAuthWrapper: React.FC<Props> = ({ children }) => {
  const { userId } = useSelector(getAuthState)
  const { apiKey: storeApiKey } = useSelector(getApiKeyState)
  const { dispatch } = useStore()
  const { query, isReady } = useRouter()

  const queryApiKey = query?.kanmonApiKey as string | undefined

  const apiKey = queryApiKey || storeApiKey

  useEffect(() => {
    if (isReady && !storeApiKey && apiKey) {
      dispatch(saveApiKey({ apiKey }))
    }
  }, [isReady, storeApiKey, apiKey, dispatch])

  const { loading: validatingApiKey } = useAsync(async () => {
    try {
      if (apiKey) {
        await axiosWithApiKey(apiKey).post('/api/test_api_key')
      }

      return true
    } catch {
      dispatch(resetStoreAction(true))
      return false
    }
  }, [apiKey])

  if (validatingApiKey) return null

  if (!apiKey) {
    return (
      <div>
        <ApiKeyModal open />
      </div>
    )
  }
  if (!isReady) {
    return null
  }

  return <div>{userId ? children : <BusinessSelectionModalV2 open />}</div>
}

export const KanmonConnectWrapper = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const authState = useSelector(getAuthState)
  const dispatch = useDispatch()

  const connectParamOverrides: Omit<KanmonConnectParams, 'connectToken'> = {
    onError: (error) => {
      // keeping this log here, useful for testing.
      console.error('Kanmon Connect error', error)
    },
    onEvent: (event) => {
      // keeping this log here, useful for testing.
      console.log('Received event', event)
      switch (event.eventType) {
        case OnEventCallbackEventType.USER_CONFIRMED_INVOICE:
          dispatch(
            updateAvailableLimit({
              newAvailableLimitCents: event.data.remainingLimitCents,
            }),
          )

          return dispatch(
            addKanmonIdToInvoice({
              invoice: {
                id: event.data.invoice.id,
                platformInvoiceId: event.data.invoice.platformInvoiceId,
              },
            }),
          )
        case OnEventCallbackEventType.USER_STATE_CHANGED:
          return dispatch(
            updateOnWorkflowChange({
              ctaText: event.data.actionMessage,
              currentWorkflowState: event.data.userState,
            }),
          )
        case OnEventCallbackEventType.HIDE:
          return dispatch(
            updateOnHide({
              isOpen: false,
            }),
          )
      }
    },
  }

  if (!authState.userId) {
    return null
  }

  return (
    <KanmonConnectContextProvider
      userId={authState.userId}
      connectParamOverrides={connectParamOverrides}
    >
      {children}
    </KanmonConnectContextProvider>
  )
}
