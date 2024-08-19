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

  return (
    <>
      <Head>
        <title>Kanmon Demo Platform</title>
      </Head>
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
