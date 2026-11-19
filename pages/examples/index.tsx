import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Portal,
  Select,
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import Button from '../../components/shared/Button'
import { useSelector } from 'react-redux'
import { getKanmonConnectSlice } from '../../store/kanmonConnectSlice'
import { getCustomizationState } from '../../store/customizationSlice'
import { WelcomeBanner } from '../../components/Dashboard/WelcomeBanner'
import { useKanmonConnectContext } from '../../hooks/KanmonConnectContext'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '0.75rem',
  outline: 'none',
  p: 4,
}

const containerPresets = {
  desktop: { label: 'Desktop', size: { width: 896, height: 720 } },
  minimum: { label: 'Minimum', size: { width: 768, height: 720 } },
  mobile: { label: 'Mobile', size: { width: 360, height: 640 } },
}

type ConnectView = keyof typeof containerPresets | 'fullscreen'

export const CtaExamplesPage = () => {
  const { ctaText, isOpen, useCdnSdk } = useSelector(getKanmonConnectSlice)
  const { primaryColor, primaryTextColor } = useSelector(getCustomizationState)
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<ConnectView>('desktop')
  const isInline = view !== 'fullscreen'
  const [hideCloseButton, setHideCloseButton] = useState(false)
  const previewFrame = useRef<HTMLIFrameElement>(null)
  const [preview, setPreview] = useState<Window['KANMON_DEMO_PREVIEW']>()
  const [openRequested, setOpenRequested] = useState(true)
  const { ready, showKanmonConnect, stopKanmonConnect } =
    useKanmonConnectContext()

  useEffect(() => {
    const onPreviewReady = (event: MessageEvent) => {
      const previewWindow = previewFrame.current?.contentWindow
      if (
        event.origin === window.location.origin &&
        event.source === previewWindow &&
        event.data === 'kanmon-demo-preview-ready'
      ) {
        setPreview(previewWindow?.KANMON_DEMO_PREVIEW)
      }
    }
    window.addEventListener('message', onPreviewReady)
    return () => window.removeEventListener('message', onPreviewReady)
  }, [])

  useEffect(() => {
    if (!openRequested || !ready || (isInline && !preview)) return
    setOpenRequested(false)
    showKanmonConnect(undefined, {
      ...(isInline ? preview : undefined),
      hideCloseButton,
    })
  }, [
    openRequested,
    ready,
    isInline,
    preview,
    hideCloseButton,
    showKanmonConnect,
  ])

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto flex flex-col gap-8 rounded-xl">
        <div className="sm:flex sm:justify-between sm:items-center mb-12">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-override-default font-bold">
              CTA Examples
            </h1>
          </div>
        </div>
        <section>
          <h2 className="text-4xl mb-4 font-medium">Connect embedding</h2>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="connect-view-label">View</InputLabel>
              <Select
                labelId="connect-view-label"
                label="View"
                value={view}
                onChange={(event) => {
                  stopKanmonConnect()
                  if (event.target.value === 'fullscreen') setPreview(undefined)
                  setView(event.target.value as ConnectView)
                  setOpenRequested(true)
                }}
              >
                {Object.entries(containerPresets).map(([value, preset]) => (
                  <MenuItem key={value} value={value}>
                    {preset.label}
                  </MenuItem>
                ))}
                <MenuItem value="fullscreen">Fullscreen</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              label="Hide X button"
              control={
                <Checkbox
                  checked={hideCloseButton}
                  onChange={(_, checked) => {
                    stopKanmonConnect()
                    setHideCloseButton(checked)
                    setOpenRequested(true)
                  }}
                />
              }
            />
            {!isInline && isOpen && (
              <Portal>
                <Button
                  variant="contained"
                  sx={{
                    position: 'fixed',
                    bottom: 16,
                    left: 16,
                    zIndex: 2147483647,
                  }}
                  onClick={() => {
                    stopKanmonConnect()
                    setView('desktop')
                    setOpenRequested(true)
                  }}
                >
                  Back to preview
                </Button>
              </Portal>
            )}
          </div>
          {isInline && (
            <div className="max-w-full overflow-x-auto">
              <iframe
                ref={previewFrame}
                title="Connect preview"
                src={`/examples/preview?sdk=${useCdnSdk ? 'cdn' : 'npm'}`}
                style={containerPresets[view].size}
                className="block border-0 rounded-lg bg-white ring-1 ring-inset ring-slate-300"
              />
            </div>
          )}
        </section>
        <div>
          <div className="text-4xl mb-4 font-medium">Banner</div>
          <WelcomeBanner ctaText={ctaText} />
        </div>
        <div className="mb-8">
          <div className="text-4xl mb-4 font-medium">Button</div>
          <div
            className="md:mr-24 btn-lg px-4 py-2 text-lg z-20 rounded-md hover:cursor-pointer forty-percent-darker-on-hover"
            style={{ backgroundColor: primaryColor, color: primaryTextColor }}
            onClick={() => showKanmonConnect()}
          >
            <div className="whitespace-nowrap">{ctaText}</div>
          </div>
        </div>
        <div className="mb-8">
          <div className="text-4xl mb-4 font-medium">Modal (Pop Up)</div>
          <div
            onClick={() => {
              setOpen(true)
            }}
            className="border-2 w-fit px-4 py-2 rounded-md bg-white text-lg font-medium cursor-pointer hover:bg-slate-200"
            style={{ borderColor: primaryColor }}
          >
            Open Modal
          </div>
          <Modal
            open={open}
            onClose={() => {
              setOpen(false)
            }}
          >
            <Box sx={style}>
              <div className="text-2xl font-semibold">
                Hey Tycho LLC, Do you need funding?
              </div>
              <div className="my-16">
                Get your business moving and accelerate growth with quick and
                easy access to funding. Multiple options available.
              </div>
              <div className="flex justify-between">
                <div
                  onClick={() => {
                    setOpen(false)
                  }}
                  className="text-white btn-lg px-4 py-2 text-lg rounded-md bg-red-400 hover:bg-red-700 cursor-pointer"
                >
                  No thank you
                </div>
                <div
                  onClick={() => {
                    setOpen(false)
                    showKanmonConnect()
                  }}
                  className="text-white btn-lg px-4 py-2 text-lg rounded-md bg-emerald-500 hover:bg-emerald-800 cursor-pointer"
                >
                  Yes, Please!
                </div>
              </div>
            </Box>
          </Modal>
        </div>
      </div>
    </>
  )
}

export default CtaExamplesPage
