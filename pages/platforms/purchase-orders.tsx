import { useDispatch } from 'react-redux'
import { useEffectOnce } from 'react-use'
import { setProductTypeForPage } from '../../store/apiInvoicesSlice'
import { ProductType } from '../../types/MoreTypes'
import InvoiceFinancing from '../../components/InvoiceFinancing'

function PurchaseOrdersPage() {
  const dispatch = useDispatch()
  useEffectOnce(() => {
    dispatch(
      setProductTypeForPage({
        productType: ProductType.PURCHASE_ORDER,
      }),
    )
  })
  return <InvoiceFinancing />
}

export default PurchaseOrdersPage
