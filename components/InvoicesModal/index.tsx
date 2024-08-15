import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Modal from '@mui/material/Modal'
import InvoiceSummary from './InvoiceSummary'
import { IssuedProduct } from '@kanmon/sdk'
import { PlatformInvoice } from '../../types/DemoInvoicesTypes'

interface InvoicesModalProps {
  open: boolean
  onClose: () => void
  selectedInvoice: PlatformInvoice
  onFinanceInvoice: () => void
  issuedProduct?: IssuedProduct
}

const INVOICE_MODAL_CONTAINER_ID = 'invoice-modal'

const InvoicesModal = ({
  open,
  onClose: onCloseProps,
  selectedInvoice,
  onFinanceInvoice: onInvoiceCreate,
  issuedProduct,
}: InvoicesModalProps) => {
  const onClose = () => {
    onCloseProps()
  }

  return (
    <Modal open={open}>
      <div
        id={INVOICE_MODAL_CONTAINER_ID}
        className="flex flex-col bg-white top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2 rounded overflow-scroll"
        style={{
          transition: 'width 0.3s, height 0.3s',
          width: `800px`,
          maxHeight: '90vh',
        }}
      >
        <div
          onClick={onClose}
          className="absolute top-0 right-0 cursor-pointer w-5 h-5 text-3xl text-gray-600 transform -translate-x-4 translate-y-4"
        >
          <FontAwesomeIcon icon={faTimes} fixedWidth={false} />
        </div>
        <InvoiceSummary
          onFastPayClick={onInvoiceCreate}
          invoice={selectedInvoice}
          issuedProduct={issuedProduct as IssuedProduct}
        />
      </div>
    </Modal>
  )
}

export default InvoicesModal
