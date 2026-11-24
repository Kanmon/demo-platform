import { resetStoreAction } from '@/store/store'
import {
  ExternalProductType,
  KANMON_CONNECT,
  KanmonConnectEnviroment,
  KanmonConnectParams,
  OnEventCallbackEventType,
  ShowKanmonConnectMessage,
} from '@kanmon/web-sdk'
import axios from 'axios'
import { useRouter } from 'next/router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncFn, useLatest } from 'react-use'
import useScript from 'react-script-hook'
import { getApiKeyState } from '../store/apiKeySlice'
import {
  getKanmonConnectSlice,
  updateDarkMode,
  updateOnHide,
} from '@/store/kanmonConnectSlice'

declare global {
  interface Window {
    KANMON_CONNECT: {
      start(params: KanmonConnectParams): void
      stop: () => void
      show(showArgs?: ShowKanmonConnectMessage): void
      setConfig: (config: any) => void
    }
  }
}

type ConnectOptions = Pick<
  KanmonConnectParams,
  'container' | 'hideCloseButton'
> & {
  sdk?: typeof KANMON_CONNECT
}

interface KanmonConnectContext {
  ready: boolean
  error: Error | undefined
  showKanmonConnect: (
    showArgs?: ShowKanmonConnectMessage,
    options?: ConnectOptions,
  ) => void
  stopKanmonConnect: () => void
  isDarkMode: boolean
  setKanmonDarkMode: (darkMode: boolean) => void
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
  const { useCdnSdk, darkMode } = useSelector(getKanmonConnectSlice)
  const [scriptLoading] = useScript({
    src: useCdnSdk ? NEXT_PUBLIC_KANMON_CDN_HOST : null,
  })
  const sdk = useCdnSdk ? globalThis.window?.KANMON_CONNECT : KANMON_CONNECT
  const canStart = Boolean(sdk && (!useCdnSdk || !scriptLoading))
  const pendingRequest = useRef<AbortController>()
  const activeSdk = useRef<typeof KANMON_CONNECT>()
  const isDarkMode = darkMode ?? false
  const { query, asPath, events: routerEvents } = useRouter()

  const stopKanmonConnect = useCallback(() => {
    pendingRequest.current?.abort()
    pendingRequest.current = undefined
    activeSdk.current?.stop()
    activeSdk.current = undefined
    dispatch(updateOnHide({ isOpen: false }))
  }, [dispatch])

  // Keep new starts current without restarting an open widget on theme/events.
  const connectParams = useLatest<Omit<KanmonConnectParams, 'connectToken'>>({
    environment: process.env.NEXT_PUBLIC_DEPLOY_ENV as KanmonConnectEnviroment,
    ...connectParamOverrides,
    customInitializationName: query?.customInitializationName as
      | string
      | undefined,
    productSubsetDuringOnboarding: (
      query?.productSubsetDuringOnboarding as string | undefined
    )?.split(',') as ExternalProductType[] | undefined,
    darkMode: isDarkMode,
    onEvent: (event) => {
      if (event.eventType === OnEventCallbackEventType.HIDE) {
        stopKanmonConnect()
      }
      connectParamOverrides.onEvent?.(event)
    },
  })

  const [{ loading, error }, startKanmonConnect] = useAsyncFn(
    async (showArgs?: ShowKanmonConnectMessage, options?: ConnectOptions) => {
      const { sdk: targetSdk = sdk, ...viewOptions } = options ?? {}
      if (!canStart || !targetSdk) return
      stopKanmonConnect()
      const controller = new AbortController()
      pendingRequest.current = controller

      try {
        // Connect tokens are single-use; every new iframe needs a fresh one.
        const params = new URLSearchParams({ userId })
        const { data } = await axios.get<{ connectToken: string }>(
          `${connectUrlPath}?${params.toString()}`,
          {
            headers: { Authorization: `ApiKey ${apiKey}` },
            signal: controller.signal,
          },
        )
        if (controller.signal.aborted) return

        activeSdk.current = targetSdk
        targetSdk.start({
          ...connectParams.current,
          ...viewOptions,
          connectToken: data.connectToken,
        })
        if (showArgs !== undefined) {
          targetSdk.show(showArgs)
          dispatch(updateOnHide({ isOpen: true }))
        }
      } catch (error) {
        if (!controller.signal.aborted) throw error
      } finally {
        if (pendingRequest.current === controller) {
          pendingRequest.current = undefined
        }
      }
    },
    [
      canStart,
      sdk,
      stopKanmonConnect,
      userId,
      connectUrlPath,
      apiKey,
      connectParams,
      dispatch,
    ],
  )

  useEffect(() => {
    // Preload workflow state unless an explicit preview start is in progress.
    if (!pendingRequest.current) void startKanmonConnect()
    return stopKanmonConnect
  }, [startKanmonConnect, stopKanmonConnect])

  useEffect(() => {
    const onRouteChangeStart = (url: string) => {
      if (url !== asPath) stopKanmonConnect()
    }
    routerEvents.on('routeChangeStart', onRouteChangeStart)
    return () => routerEvents.off('routeChangeStart', onRouteChangeStart)
  }, [asPath, routerEvents, stopKanmonConnect])

  const showKanmonConnect: KanmonConnectContext['showKanmonConnect'] = (
    showArgs = {},
    options,
  ) => {
    void startKanmonConnect(showArgs, options)
  }

  const setKanmonDarkMode = (nextDarkMode: boolean) => {
    dispatch(updateDarkMode({ darkMode: nextDarkMode }))
    activeSdk.current?.setConfig({ darkMode: nextDarkMode })
  }

  useEffect(() => {
    // If we fail to login, lets logout and try again
    if (error) {
      console.log('ERROR', error)
      dispatch(resetStoreAction(true))
    }
  }, [error, dispatch])

  return (
    <KanmonConnectContext.Provider
      value={{
        ready: canStart && !loading,
        error,
        showKanmonConnect,
        stopKanmonConnect,
        isDarkMode,
        setKanmonDarkMode,
      }}
    >
      {children}
    </KanmonConnectContext.Provider>
  )
}

export default KanmonConnectContextProvider
