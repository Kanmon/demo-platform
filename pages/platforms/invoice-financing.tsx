import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'
import { setProductTypeForPage } from '../../store/apiInvoicesSlice'
import { ProductType } from '../../types/MoreTypes'
import InvoiceFinancing from '../../components/InvoiceFinancing'

function InvoiceFinancingPage() {
  const dispatch = useDispatch()
  useEffectOnce(() => {
    dispatch(
      setProductTypeForPage({
        productType: ProductType.INVOICE_FINANCING,
      }),
    )
  })
  return <InvoiceFinancing />
}

export default InvoiceFinancingPage
