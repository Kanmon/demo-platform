import { KANMON_CONNECT } from '@kanmon/web-sdk'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import useScript from 'react-script-hook'
import type { NextPageWithLayout } from '../_app'

declare global {
  interface Window {
    KANMON_DEMO_PREVIEW?: {
      sdk: typeof KANMON_CONNECT
      container: HTMLElement
    }
  }
}

const ConnectPreviewPage: NextPageWithLayout = () => {
  const { query, isReady } = useRouter()
  const useCdnSdk = query.sdk === 'cdn'
  const [scriptLoading, scriptError] = useScript({
    src: useCdnSdk
      ? `${process.env.NEXT_PUBLIC_KANMON_CDN_HOST}/scripts/v2/kanmon-connect.js`
      : null,
  })
  const sdk = useCdnSdk ? globalThis.window?.KANMON_CONNECT : KANMON_CONNECT
  const ready = isReady && Boolean(sdk) && (!useCdnSdk || !scriptLoading)
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready || !sdk) return
    window.KANMON_DEMO_PREVIEW = {
      sdk: {
        ...sdk,
        // SDK plain-object validation uses this window's Object.prototype.
        show: (args) => sdk.show({ ...args }),
        setConfig: (config) => sdk.setConfig({ ...config }),
      },
      container: container.current!,
    }
    window.parent.postMessage(
      'kanmon-demo-preview-ready',
      window.location.origin,
    )
    return () => {
      sdk.stop()
      delete window.KANMON_DEMO_PREVIEW
    }
  }, [ready, sdk])

  return (
    <div ref={container} className="fixed inset-0">
      {scriptError ? (
        <p role="alert">Unable to load the preview SDK.</p>
      ) : !ready ? (
        <p role="status">Loading preview…</p>
      ) : null}
    </div>
  )
}

ConnectPreviewPage.getLayout = (page) => page

export default ConnectPreviewPage
