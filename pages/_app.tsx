import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import 'tailwindcss/tailwind.css'
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import { DemoLayoutWithRedux } from '../components/Layout/DemoLayout'

// From NextJS docs https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#with-typescript
export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <DemoLayoutWithRedux>
      <Component {...pageProps} />
    </DemoLayoutWithRedux>
  )
}
