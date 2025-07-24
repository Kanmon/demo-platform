import { Header } from '@/components/Layout/Header'
import { Sidebar } from '@/components/Layout/Sidebar'
import {
  KanmonConnectWrapper,
  TempAuthWrapper,
  TempReduxWrapper,
} from '@/components/wrappers'
import { getCustomizationState } from '@/store/customizationSlice'
import { wrapper } from '@/store/store'
import { pSBC } from '@/utils/pSBC'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

const DemoLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const customizationState = useSelector(getCustomizationState)

  const router = useRouter()

  const hideHeader = router.asPath === '/financing'

  const isStagingEnvironment = process.env.NEXT_PUBLIC_DEPLOY_ENV === 'staging'

  return (
    <>
      <Head>
        <link rel="icon" href="/images/favicon.ico"></link>
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
            <div className="flex h-screen overflow-hidden newFont">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />

              <div
                className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden"
                style={{
                  backgroundColor: pSBC(
                    0.85,
                    customizationState.sidenavBgColor,
                  ) as string,
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
