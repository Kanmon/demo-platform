import { KanmonConnectComponent } from '@kanmon/web-sdk'
import { useDispatch, useSelector } from 'react-redux'
import { useKanmonConnectContext } from '../../hooks/KanmonConnectContext'
import { getCustomizationState } from '../../store/customizationSlice'
import { updateOnHide } from '../../store/kanmonConnectSlice'
import { SplitButton } from '../SplitButton'

const FactoringServicingActions = () => {
  const { showKanmonConnect } = useKanmonConnectContext()
  const { primaryColor } = useSelector(getCustomizationState)
  const dispatch = useDispatch()

  const showComponent = (
    component:
      | KanmonConnectComponent.INVOICE_HISTORY
      | KanmonConnectComponent.PAYMENT_HISTORY
      | KanmonConnectComponent.DOWNLOAD_AGREEMENTS
      | KanmonConnectComponent.BANK_ACCOUNTS,
  ) => {
    dispatch(updateOnHide({ isOpen: true }))
    showKanmonConnect({ component })
  }

  return (
    <SplitButton
      buttonColor={primaryColor}
      options={[
        {
          label: 'Invoice History',
          onClick: () => showComponent(KanmonConnectComponent.INVOICE_HISTORY),
        },
        {
          label: 'Payment History',
          onClick: () => showComponent(KanmonConnectComponent.PAYMENT_HISTORY),
        },
        {
          label: 'Download Agreements',
          onClick: () =>
            showComponent(KanmonConnectComponent.DOWNLOAD_AGREEMENTS),
        },
        {
          label: 'Bank Accounts',
          onClick: () => showComponent(KanmonConnectComponent.BANK_ACCOUNTS),
        },
      ]}
    />
  )
}

export default FactoringServicingActions
