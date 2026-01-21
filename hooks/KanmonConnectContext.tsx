import { resetStoreAction } from '@/store/store'
import {
  ExternalProductType,
  KANMON_CONNECT,
  KanmonConnectEnviroment,
  KanmonConnectParams,
  ShowKanmonConnectMessage,
} from '@kanmon/web-sdk'
import axios from 'axios'
import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsync } from 'react-use'
import useScript from 'react-script-hook'
import { getApiKeyState } from '../store/apiKeySlice'
import { getKanmonConnectSlice } from '@/store/kanmonConnectSlice'

declare global {
  interface Window {
    KANMON_CONNECT: {
      start(params: any): void
      stop: () => void
      show(showArgs?: ShowKanmonConnectMessage): void
    }
  }
}
interface KanmonConnectContext {
  ready: boolean
  error: Error | undefined
  showKanmonConnect: (showArgs?: ShowKanmonConnectMessage) => void
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

const NEXT_PUBLIC_KANMON_CDN_HOST = `${process.env.NEXT_PUBLIC_KANMON_CDN_HOST}/scripts/v2/kanmon-connect.js`
const KanmonConnectContextProvider = ({
  children,
  userId,
  connectParamOverrides,
  connectUrlPath = '/api/create_connect_token_v2',
}: KanmonConnectContextProviderProps) => {
  const dispatch = useDispatch()

  const { apiKey } = useSelector(getApiKeyState)
  const { useCdnSdk } = useSelector(getKanmonConnectSlice)
  const [scriptLoading] = useScript({
    src: NEXT_PUBLIC_KANMON_CDN_HOST,
  })
  const [ready, setReady] = useState(false)

  const { query } = useRouter()

  const { error } = useAsync(
    async function startKanmon() {
      // Wait for CDN script to load with timeout
      if (scriptLoading && useCdnSdk) {
        return
      }
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
      const productSubsetDuringOnboarding =
        query?.productSubsetDuringOnboarding as string

      const config: KanmonConnectParams = {
        connectToken,
        environment: process.env
          .NEXT_PUBLIC_DEPLOY_ENV as KanmonConnectEnviroment,
        ...(connectParamOverrides ? connectParamOverrides : {}),
        customInitializationName: query?.customInitializationName as
          | string
          | undefined,
        productSubsetDuringOnboarding: productSubsetDuringOnboarding?.split(
          ',',
        ) as ExternalProductType[] | undefined,
      }

      // Check if CDN SDK is available
      if (useCdnSdk) {
        window.KANMON_CONNECT.start({
          ...config,
        })
        setReady(true)
      } else {
        // Initialize kanmon connect. There is no need to call `show`, since
        // the widget will render on start.
        KANMON_CONNECT.start(config)
        setReady(true)
      }
    },
    [scriptLoading, useCdnSdk, apiKey],
  )

  const showKanmonConnect = (showArgs?: ShowKanmonConnectMessage) => {
    if (useCdnSdk) {
      window.KANMON_CONNECT.show(showArgs)
    } else {
      KANMON_CONNECT.show(showArgs)
    }
  }

  useEffect(() => {
    // If we fail to login, lets logout and try again
    if (error) {
      console.log('ERROR', error)
      dispatch(resetStoreAction(true))
    }
  }, [error, dispatch])

  return (
    <KanmonConnectContext.Provider value={{ ready, error, showKanmonConnect }}>
      {children}
    </KanmonConnectContext.Provider>
  )
}

export default KanmonConnectContextProvider
