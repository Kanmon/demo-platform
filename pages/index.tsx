import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SplitButton } from '@/components/SplitButton'

import { DemoDashboardCard1 } from '@/components/Dashboard/DemoDashboardCard1'
import { DemoDashboardCard2 } from '@/components/Dashboard/DemoDashboardCard2'
import { DemoDashboardCard3 } from '@/components/Dashboard/DemoDashboardCard3'
import { DemoDashboardCard4 } from '@/components/Dashboard/DemoDashboardCard4'
import { DemoDashboardCard5 } from '@/components/Dashboard/DemoDashboardCard5'
import { DemoDashboardCard6 } from '@/components/Dashboard/DemoDashboardCard6'
import { DemoDashboardCard7 } from '@/components/Dashboard/DemoDashboardCard7'
import { DemoDashboardCard8 } from '@/components/Dashboard/DemoDashboardCard8'
import { DemoDashboardCard9 } from '@/components/Dashboard/DemoDashboardCard9'
import { DemoDashboardCard10 } from '@/components/Dashboard/DemoDashboardCard10'
import { DemoDashboardCard11 } from '@/components/Dashboard/DemoDashboardCard11'
import { WelcomeBanner } from '@/components/Dashboard/WelcomeBanner'
import { getCustomizationState } from '@/store/customizationSlice'
import {
  getKanmonConnectSlice,
  updateIssuedProduct,
  updateOnHide,
} from '@/store/kanmonConnectSlice'
import { IssuedProduct } from '@kanmon/sdk'
import { Datepicker } from '../components/shared/DatePicker'
import { DashboardAvatars } from '../components/Dashboard/DashboardAvatars'
import { DropdownFilter } from '../components/shared/DropdownFilter'
import { useKanmonConnectContext } from '../hooks/KanmonConnectContext'
import { axiosWithApiKey } from '../utils'
import { getAuthState } from '../store/authSlice'
import { getApiKeyState } from '../store/apiKeySlice'
import { KanmonConnectComponent } from '@kanmon/web-sdk'

export const V2Home: React.FC = () => {
  const { ctaText, currentWorkflowState, issuedProduct } = useSelector(
    getKanmonConnectSlice,
  )
  const { buttonBgColor } = useSelector(getCustomizationState)
  const dispatch = useDispatch()
  const { showKanmonConnect } = useKanmonConnectContext()

  const { apiKey } = useSelector(getApiKeyState)
  const { userId, businessName, prequalification } = useSelector(getAuthState)

  async function fetchIssuedProductDetails() {
    const params = new URLSearchParams()
    params.append('userId', userId as string)
    const url = `/api/fetch_issued_products?${params.toString()}`
    const issuedProductResp = await axiosWithApiKey(apiKey).get<{
      issuedProducts: IssuedProduct[]
    }>(url)

    // Didn't exist - probably happening during a relog
    if (issuedProductResp.data.issuedProducts.length === 0) {
      return
    }

    dispatch(
      updateIssuedProduct({
        issuedProduct: issuedProductResp.data.issuedProducts[0],
      }),
    )
  }

  useEffect(
    function fetchInvoiceDetailsWhenOnServicing() {
      if (currentWorkflowState === 'SERVICING') {
        fetchIssuedProductDetails()
      }
    },
    [currentWorkflowState],
  )

  const openDrawFlow = async () => {
    showKanmonConnect({
      component: KanmonConnectComponent.DRAW_REQUEST,
    })
    dispatch(
      updateOnHide({
        isOpen: true,
      }),
    )
  }

  const openPaymentHistory = async () => {
    showKanmonConnect({
      component: KanmonConnectComponent.PAYMENT_HISTORY,
    })
    dispatch(
      updateOnHide({
        isOpen: true,
      }),
    )
  }

  const downloadAgreements = async () => {
    showKanmonConnect({
      component: KanmonConnectComponent.DOWNLOAD_AGREEMENTS,
    })
    dispatch(
      updateOnHide({
        isOpen: true,
      }),
    )
  }

  const bannerText = prequalification
    ? `You are pre-qualified! See your offer${businessName ? `, ${businessName}` : ''} 👋`
    : undefined

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <WelcomeBanner
          ctaText={prequalification ? 'See Offers 🎉' : ctaText}
          bannerText={bannerText}
        />

        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <DashboardAvatars />

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <DropdownFilter align="right" />
            <Datepicker align="right" />

            {issuedProduct?.servicingData.productType === 'LINE_OF_CREDIT' && (
              <SplitButton
                buttonColor={buttonBgColor}
                options={[
                  {
                    label: 'New Draw Request',
                    onClick: openDrawFlow,
                  },
                  {
                    label: 'Download Agreements',
                    onClick: downloadAgreements,
                  },
                ]}
              />
            )}
            {issuedProduct?.servicingData.productType === 'TERM_LOAN' && (
              <SplitButton
                buttonColor={buttonBgColor}
                options={[
                  {
                    label: 'Payment History',
                    onClick: openPaymentHistory,
                  },
                  {
                    label: 'Download Agreements',
                    onClick: downloadAgreements,
                  },
                ]}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <DemoDashboardCard1 />
          <DemoDashboardCard2 />
          <DemoDashboardCard3 />
          <DemoDashboardCard4 />
          <DemoDashboardCard5 />
          <DemoDashboardCard6 />
          <DemoDashboardCard7 />
          <DemoDashboardCard8 />
          <DemoDashboardCard9 />
          <DemoDashboardCard10 />
          <DemoDashboardCard11 />
        </div>
      </div>
    </>
  )
}

export default V2Home
