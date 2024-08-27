import { resetStoreAction } from '@/store/store'
import {
  KANMON_CONNECT,
  KanmonConnectComponent,
  KanmonConnectEnviroment,
  KanmonConnectParams,
  SentToKanmonConnectMessage,
} from '@kanmon/web-sdk'
import axios from 'axios'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsync } from 'react-use'
import { getApiKeyState } from '../store/apiKeySlice'

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

  const { error } = useAsync(async function startKanmon() {
    // Note - typically platforms will not be sending their emails
    // to the connect endpoint. This is an implementation detail
    // specific to the demo platform.
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
      environment: process.env
        .NEXT_PUBLIC_DEPLOY_ENV as KanmonConnectEnviroment,
      ...(connectParamOverrides ? connectParamOverrides : {}),
      customInitializationName: query?.customInitializationName as
        | string
        | undefined,
    }

    // Initialize kanmon connect. There is no need to call `show`, since
    // the widget will render on start.
    KANMON_CONNECT.start(config)

    setReady(true)
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
      dispatch(resetStoreAction(true))
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
