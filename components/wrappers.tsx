import { useDispatch, useSelector, useStore } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
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
import { RootState } from '@/store/store'
import KanmonConnectContextProvider from '../hooks/KanmonConnectContext'
import { getApiKeyState } from '../store/apiKeySlice'
import ApiKeyModal from './ApiKeyModal'
import { validate as isValidUUID } from 'uuid'
import { KanmonConnectParams, OnEventCallbackEventType } from '@kanmon/web-sdk'

interface Props {
  children?: React.ReactNode
}

// Initiate state - eventually this should live in _app
export const TempReduxWrapper: React.FC<Props> = ({ children }) => {
  const store = useStore<RootState>()
  const persistor = (store as any).__persistor

  return (
    <PersistGate persistor={persistor} loading={<div>Loading</div>}>
      {children}
    </PersistGate>
  )
}

export const TempAuthWrapper: React.FC<Props> = ({ children }) => {
  const { userId } = useSelector(getAuthState)
  const { apiKey } = useSelector(getApiKeyState)

  if (!process.browser) return null

  if (!apiKey || !isValidUUID(apiKey)) {
    return (
      <div>
        <ApiKeyModal open />
      </div>
    )
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
    return <span>Loading...</span>
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
