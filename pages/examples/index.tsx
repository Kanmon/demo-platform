import { Box, Modal } from '@mui/material'
import { useState } from 'react'
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

export const CtaExamplesPage = () => {
  const { ctaText } = useSelector(getKanmonConnectSlice)
  const { ctaButtonColor } = useSelector(getCustomizationState)
  const [open, setOpen] = useState(false)
  const { showKanmonConnect } = useKanmonConnectContext()

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto flex flex-col gap-8 rounded-xl">
        <div className="sm:flex sm:justify-between sm:items-center mb-12">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
              CTA Examples
            </h1>
          </div>
        </div>
        <div>
          <div className="text-4xl mb-4 font-medium">Banner</div>
          <WelcomeBanner ctaText={ctaText} />
        </div>
        <div className="mb-8">
          <div className="text-4xl mb-4 font-medium">Button</div>
          <div
            className="md:mr-24 text-white btn-lg px-4 py-2 text-lg z-20 rounded-md hover:cursor-pointer forty-percent-darker-on-hover"
            style={{ backgroundColor: ctaButtonColor }}
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
            style={{ borderColor: ctaButtonColor }}
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
