import { useDispatch, useSelector } from 'react-redux'
import { updateInvoice } from '../../store/apiInvoicesSlice'
import { getCustomizationState } from '../../store/customizationSlice'
import getInvoiceTotalCents from '../../utils/getInvoiceTotal'
import { OnMouseHover } from '../OnMouseHover'
import { renderCentsValueAsDollarsWithCents } from '../../utils'
import EditableDateField from '../EditableDateField'
import { capitalizeEachWord } from '../../utils/capitalizeEachWord'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { PayorType } from '../../types/MoreTypes'
import {
  PlatformInvoice,
  PlatformInvoiceStatus,
} from '../../types/DemoInvoicesTypes'

interface InvoiceTableItemProps {
  invoice: PlatformInvoice
  onInvoiceCheckboxSelect: () => void
  isChecked: boolean
  onInvoiceDelete: () => void
  onGetPaidNowClick: () => void
  showFinanceColumn?: boolean
}

function InvoiceTableItem({
  invoice,
  isChecked,
  onInvoiceCheckboxSelect,
  onGetPaidNowClick,
  showFinanceColumn,
}: InvoiceTableItemProps) {
  const dispatch = useDispatch()
  const { buttonBgColor } = useSelector(getCustomizationState)

  const totalColor = (status: PlatformInvoiceStatus) => {
    switch (status) {
      case PlatformInvoiceStatus.PAID:
        return 'text-emerald-500'
      case PlatformInvoiceStatus.DUE:
        return 'text-amber-500'
      case PlatformInvoiceStatus.OVERDUE:
        return 'text-rose-500'
    }
  }

  const statusColor = (status: PlatformInvoiceStatus) => {
    switch (status) {
      case PlatformInvoiceStatus.PAID:
        return 'bg-emerald-100 text-emerald-600'
      case PlatformInvoiceStatus.DUE:
        return 'bg-amber-100 text-amber-600'
      case PlatformInvoiceStatus.OVERDUE:
        return 'bg-rose-100 text-rose-500'
    }
  }

  return (
    <tr>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
        <div className="flex items-center">
          <label className="inline-flex">
            <span className="sr-only">Select</span>
            <input
              id={invoice.id}
              className="form-checkbox"
              type="checkbox"
              onChange={onInvoiceCheckboxSelect}
              checked={isChecked}
            />
          </label>
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap cursor-pointer">
        <div
          onClick={onGetPaidNowClick}
          className="font-medium fifty-percent-darker-text-on-hover"
          style={{ color: buttonBgColor }}
        >
          {invoice.invoiceNumber}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <OnMouseHover>
          {(hovering) => {
            const total = getInvoiceTotalCents(invoice, true)
            const hasSomeAmount = total > 0
            return (
              <div className={`font-medium ${totalColor(invoice.status)}`}>
                <span className="relative">
                  {hasSomeAmount ? (
                    <div className="flex">
                      <span>{renderCentsValueAsDollarsWithCents(total)}</span>
                      {hovering && hasSomeAmount && (
                        <FontAwesomeIcon
                          className="ml-2 cursor-pointer hover:text-slate-400 text-slate-500"
                          onClick={() => {
                            dispatch(
                              updateInvoice({
                                invoice: {
                                  ...invoice,
                                  items: [],
                                },
                              }),
                            )
                          }}
                          icon={faTrash}
                          style={{ width: '16px', height: '16px' }}
                        />
                      )}
                    </div>
                  ) : (
                    '—'
                  )}
                </span>
              </div>
            )
          }}
        </OnMouseHover>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div
          className={`inline-flex font-medium rounded-full text-center px-2.5 py-0.5 ${statusColor(
            invoice.status,
          )}`}
        >
          {capitalizeEachWord(invoice.status, '_')}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="font-medium text-slate-800">
          {invoice.payorType === PayorType.BUSINESS
            ? invoice.billFromBusinessName
            : `${invoice.customerFirstName} ${invoice.customerLastName}`}
        </div>
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <EditableDateField field={'createdAtIsoDate'} invoice={invoice} />
      </td>
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <EditableDateField field={'dueDateIsoDate'} invoice={invoice} />
      </td>
      {showFinanceColumn && (
        <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
          <div className="space-x-1">
            {invoice.kanmonInvoiceId ? (
              <span className="inline-flex font-medium rounded-full text-center px-2.5 py-0.5 bg-emerald-100 text-emerald-600">
                Waiting for Repayment
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
        </td>
      )}
    </tr>
  )
}

export default InvoiceTableItem
