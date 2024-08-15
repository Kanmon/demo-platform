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
  PlatformInvoiceType,
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

  const typeIcon = (type: PlatformInvoiceType) => {
    switch (type) {
      case PlatformInvoiceType.SUBSCRIPTION:
        return (
          <svg
            className="w-4 h-4 fill-current text-slate-400 shrink-0 mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M4.3 4.5c1.9-1.9 5.1-1.9 7 0 .7.7 1.2 1.7 1.4 2.7l2-.3c-.2-1.5-.9-2.8-1.9-3.8C10.1.4 5.7.4 2.9 3.1L.7.9 0 7.3l6.4-.7-2.1-2.1zM15.6 8.7l-6.4.7 2.1 2.1c-1.9 1.9-5.1 1.9-7 0-.7-.7-1.2-1.7-1.4-2.7l-2 .3c.2 1.5.9 2.8 1.9 3.8 1.4 1.4 3.1 2 4.9 2 1.8 0 3.6-.7 4.9-2l2.2 2.2.8-6.4z" />
          </svg>
        )
      case PlatformInvoiceType.ONE_TIME:
        return (
          <svg
            className="w-4 h-4 fill-current text-slate-400 shrink-0 mr-2"
            viewBox="0 0 16 16"
          >
            <path d="M11.4 0L10 1.4l2 2H8.4c-2.8 0-5 2.2-5 5V12l-2-2L0 11.4l3.7 3.7c.2.2.4.3.7.3.3 0 .5-.1.7-.3l3.7-3.7L7.4 10l-2 2V8.4c0-1.7 1.3-3 3-3H12l-2 2 1.4 1.4 3.7-3.7c.4-.4.4-1 0-1.4L11.4 0z" />
          </svg>
        )
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
                    <>
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
                        />
                      )}
                    </>
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
      <td className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
        <div className="flex items-center">
          {typeIcon(invoice.type)}
          <div>{capitalizeEachWord(invoice.type, '_')}</div>
        </div>
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
