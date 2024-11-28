import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'
import { setProductTypeForPage } from '../../store/apiInvoicesSlice'
import { ProductType } from '../../types/MoreTypes'
import InvoiceFinancing from '../../components/InvoiceFinancing'

function AccountPayableFinancingPage() {
  const dispatch = useDispatch()
  useEffectOnce(() => {
    dispatch(
      setProductTypeForPage({
        productType: ProductType.ACCOUNTS_PAYABLE_FINANCING,
      }),
    )
  })
  return <InvoiceFinancing />
}

export default AccountPayableFinancingPage
