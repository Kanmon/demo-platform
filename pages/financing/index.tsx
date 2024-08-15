import classNames from 'classnames'
import Head from 'next/head'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { getKanmonConnectSlice } from '../../store/kanmonConnectSlice'
import { getCustomizationState } from '../../store/customizationSlice'
import { FinanceHeader } from '../../components/Finance/FinanceHeader'
import { FinanceLandingText } from '../../components/Finance/FinanceLandingText'
import { FinanceFaq } from '../../components/Finance/FinanceFaq'

export const Financing: React.FC = () => {
  const { ctaText } = useSelector(getKanmonConnectSlice)
  const { buttonBgColor } = useSelector(getCustomizationState)

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-white">
      <Head>
        <title>Flourish Capital</title>
      </Head>
      <div className={classNames('flex justify-center items-center w-full')}>
        <div className="h-full w-full flex flex-col items-center">
          <FinanceHeader />

          <div className="w-5/6 px-0 max-w-screen-2xl">
            <FinanceLandingText
              ctaText={ctaText}
              buttonBgColor={buttonBgColor}
            />
            <hr className="mt-36" />
            <FinanceFaq />
            <hr className="my-8" />
            <div className="flex justify-center items-center">
              <div className="mt-14 mb-12 text-xs px-16 text-center lg:text-[0.88rem]">
                All loans are subject to credit approval. Your terms may vary.
                Flourish Capital loans are issued by Kanmon. California Loans
                are made pursuant to a Department of Financial Protection and
                Innovation California Lenders Law License. Read more about
                Kanmon{' '}
                <Link href="https://www.kanmon.com" passHref legacyBehavior>
                  <a className="hover:cursor-pointer">here.</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Financing
