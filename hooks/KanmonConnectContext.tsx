import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useAsyncFn } from 'react-use'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getApiKeyState } from '../store/apiKeySlice'
import {
  KANMON_CONNECT,
  KanmonConnectParams,
  SentToKanmonConnectMessage,
  KanmonConnectComponent,
  KanmonConnectEnviroment,
} from '@kanmon/web-sdk'

interface ShowArgs {
  component?: KanmonConnectComponent
  sessionToken?: string
}

interface KanmonConnectContext {
  ready: boolean
  error: Error | undefined
  sendMessageToIframe: (message: SentToKanmonConnectMessage) => void
  showKanmonConnect: (showArgs?: ShowArgs) => void
}

export const KanmonConnectContext = createContext<KanmonConnectContext>(
  {} as KanmonConnectContext,
)

export const useKanmonConnectContext = () => {
  return useContext(KanmonConnectContext)
}

interface KanmonConnectContextProviderProps {
  children: React.ReactNode
  userId: string
  connectParamOverrides: Omit<KanmonConnectParams, 'connectToken'>
  connectUrlPath?: string
}

const KanmonConnectContextProvider = ({
  children,
  userId,
  connectParamOverrides,
  connectUrlPath = '/api/create_connect_token_v2',
}: KanmonConnectContextProviderProps) => {
  const dispatch = useDispatch()

  const { apiKey } = useSelector(getApiKeyState)

  const [ready, setReady] = useState(false)

  const { query } = useRouter()

  const [{ error }, startKanmon] = useAsyncFn(async function startKanmon() {
    // Note - typically platforms will not be sending their emails
    // to the connect endpoint. This is an implementation detail
    // specific to the fake platform.
    const params = new URLSearchParams()
    params.append('userId', userId)
    const connectUrl = `${connectUrlPath}?${params.toString()}`

    const connectTokenResponse = await axios.get(connectUrl, {
      headers: {
        Authorization: `ApiKey ${apiKey}`,
      },
    })

    const { connectToken } = connectTokenResponse.data

    const config: KanmonConnectParams = {
      connectToken,
      environment: 'LOCAL' as KanmonConnectEnviroment,
      ...(connectParamOverrides ? connectParamOverrides : {}),
      customInitializationName: query?.customInitializationName as
        | string
        | undefined,
    }

    // Initialize kanmon connect. There is no need to call `show`, since
    // the widget will render on start.
    KANMON_CONNECT.start(config)

    setReady(true)
  })

  useEffect(() => {
    startKanmon()
  }, [])

  const sendMessageToIframe = (message: SentToKanmonConnectMessage) => {
    KANMON_CONNECT.sendMessageToIframe(message)
  }

  const showKanmonConnect = (showArgs?: ShowArgs) => {
    KANMON_CONNECT.show(showArgs)
  }

  useEffect(() => {
    // If we fail to login, lets logout and try again
    if (error) {
      console.log('ERROR', error)
      dispatch({
        type: 'RESET_STORE',
      })
    }
  }, [error])

  return (
    <KanmonConnectContext.Provider
      value={{ ready, error, sendMessageToIframe, showKanmonConnect }}
    >
      {children}
    </KanmonConnectContext.Provider>
  )
}

export default KanmonConnectContextProvider
