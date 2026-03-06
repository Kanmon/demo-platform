import { Header } from '@/components/Layout/Header'
import { Sidebar } from '@/components/Layout/Sidebar'
import {
  KanmonConnectWrapper,
  TempAuthWrapper,
  TempReduxWrapper,
} from '@/components/wrappers'
import { getCustomizationState } from '@/store/customizationSlice'
import { getPlatformStyleConfigState } from '@/store/platformStyleConfigSlice'
import { wrapper } from '@/store/store'
import { pSBC } from '@/utils/pSBC'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

const DemoLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const customizationState = useSelector(getCustomizationState)
  const platformStyleConfig = useSelector(getPlatformStyleConfigState)

  const router = useRouter()

  const hideHeader = router.asPath === '/financing'

  const isStagingEnvironment = process.env.NEXT_PUBLIC_DEPLOY_ENV === 'staging'

  // Apply platform style configuration as CSS custom properties
  useEffect(() => {
    const config = platformStyleConfig.config
    if (!config) return

    const s = config.styles
    const root = document.documentElement.style

    // H1 typography
    root.setProperty('--h1-font-family', s.h1FontFamily)
    root.setProperty('--h1-font-size', s.h1FontSize)
    root.setProperty('--h1-line-height', s.h1LineHeight)
    root.setProperty('--h1-font-color', s.h1FontColor)
    root.setProperty('--h1-font-weight', s.h1FontWeight)

    // Subheader typography
    root.setProperty('--subheader-font-family', s.subheaderFontFamily)
    root.setProperty('--subheader-font-size', s.subheaderFontSize)
    root.setProperty('--subheader-line-height', s.subheaderLineHeight)
    root.setProperty('--subheader-font-color', s.subheaderFontColor)
    root.setProperty('--subheader-font-weight', s.subheaderFontWeight)

    // Body large typography
    root.setProperty('--body-large-font-family', s.bodyLargeFontFamily)
    root.setProperty('--body-large-font-size', s.bodyLargeFontSize)
    root.setProperty('--body-large-line-height', s.bodyLargeLineHeight)
    root.setProperty('--body-large-font-color', s.bodyLargeFontColor)
    root.setProperty('--body-large-font-weight', s.bodyLargeFontWeight)

    // Body regular typography
    root.setProperty('--body-regular-font-family', s.bodyRegularFontFamily)
    root.setProperty('--body-regular-font-size', s.bodyRegularFontSize)
    root.setProperty('--body-regular-line-height', s.bodyRegularLineHeight)
    root.setProperty('--body-regular-font-color', s.bodyRegularFontColor)
    root.setProperty('--body-regular-font-weight', s.bodyRegularFontWeight)

    // Body small typography
    root.setProperty('--body-small-font-family', s.bodySmallFontFamily)
    root.setProperty('--body-small-font-size', s.bodySmallFontSize)
    root.setProperty('--body-small-line-height', s.bodySmallLineHeight)
    root.setProperty('--body-small-font-color', s.bodySmallFontColor)
    root.setProperty('--body-small-font-weight', s.bodySmallFontWeight)

    // Button styles
    root.setProperty('--btn-font-family', s.buttonFontFamily)
    root.setProperty('--btn-font-size', s.buttonFontSize)
    root.setProperty('--btn-font-color', s.buttonFontColor)
    root.setProperty('--btn-font-weight', s.buttonFontWeight)
    root.setProperty('--btn-border-radius', s.buttonBorderRadius)
    root.setProperty(
      '--btn-text-transform',
      s.buttonTextAllCaps ? 'uppercase' : 'none',
    )

    // Colors
    root.setProperty('--primary-color', s.primaryColor)
    root.setProperty('--modal-bg-color', s.modalBackgroundColor)
  }, [platformStyleConfig.config])

  // Apply default text color as CSS custom property so it overrides Tailwind classes
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--default-text-color',
      customizationState.defaultTextColor,
    )
  }, [customizationState.defaultTextColor])

  const faviconUrl =
    platformStyleConfig.config?.faviconUrl || '/images/favicon.ico'

  return (
    <>
      <Head>
        <link rel="icon" href={faviconUrl}></link>
        <title>Kanmon Demo Platform</title>
      </Head>
      {isStagingEnvironment && (
        <>
          <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center font-bold text-xs py-2 z-50">
            STAGING
          </div>
          <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden pt-8" />
        </>
      )}
      <TempReduxWrapper>
        <TempAuthWrapper>
          <KanmonConnectWrapper>
            <div className="flex h-screen overflow-hidden">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />

              <div
                className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden newFont"
                style={{
                  backgroundColor: pSBC(
                    0.85,
                    customizationState.bannerBgColor,
                  ) as string,
                  color: customizationState.defaultTextColor,
                }}
              >
                {!hideHeader && (
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                )}

                <main>{children}</main>
                <ToastContainer />
              </div>
            </div>
          </KanmonConnectWrapper>
        </TempAuthWrapper>
      </TempReduxWrapper>{' '}
    </>
  )
}

export const DemoLayoutWithRedux = wrapper.withRedux(DemoLayout)
