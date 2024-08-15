import classNames from 'classnames'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import baseImage from './images/baseHeroImage.webp'
import { updateOnHide } from '../../store/kanmonConnectSlice'
import { useKanmonConnectContext } from '../../hooks/KanmonConnectContext'

export const FinanceLandingText = ({
  buttonBgColor,
  ctaText,
}: {
  buttonBgColor: string
  ctaText: string | null
}) => {
  const dispatch = useDispatch()
  const { showKanmonConnect } = useKanmonConnectContext()

  return (
    <section
      className={classNames(
        'justify-between flex w-full',
        'sm:mt-28',
        'lg:mt-8',
        'xl:mt-28',
      )}
    >
      <div
        className={classNames(
          'max-w-[30rem] pr-12',
          'lg:max-w-[40rem] lg:pr-24',
        )}
      >
        <h1
          className={classNames(
            'text-5xl font-bold mb-9 leading-tight pr-36',
            'md:text-4xl',
            'lg:mt-8',
            'xl:text-5xl',
          )}
        >
          Simplified, fast funding for your growing business
        </h1>
        <section
          className={classNames('text-2xl', 'md:text-lg', 'xl:text-2xl')}
        >
          Get your business moving and accelerate growth with quick and easy
          access to funding. Multiple options available.
        </section>
        <div className="pt-11 pb-6">
          <div
            className="md:mr-24 text-white btn-lg px-4 py-2 text-lg z-20 rounded-md hover:cursor-pointer forty-percent-darker-on-hover"
            style={{ backgroundColor: buttonBgColor }}
            onClick={() => {
              dispatch(
                updateOnHide({
                  isOpen: true,
                }),
              )
              showKanmonConnect()
            }}
          >
            <div className="whitespace-nowrap">{ctaText}</div>
          </div>
        </div>
      </div>
      <div className="hidden md:contents">
        <div className="lg:mt-28 xl:mt-0">
          <div className="relative">
            <Image
              src={baseImage}
              alt="Header Logo"
              width="475"
              height="475"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
