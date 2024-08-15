import classNames from 'classnames'
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { getCustomizationState } from '../../store/customizationSlice'
import {
  PlatformInvoice,
  PlatformInvoiceStatus,
  PlatformInvoiceStatusFilter,
} from '../../types/DemoInvoicesTypes'

interface InvoiceStatusFiltersProps {
  onInvoiceStatusFilterSelect: (
    invoiceStatusFilter: PlatformInvoiceStatusFilter,
  ) => void
  currentFilter: PlatformInvoiceStatusFilter
  allInvoices: PlatformInvoice[]
}

const InvoiceStatusFilters = ({
  onInvoiceStatusFilterSelect,
  currentFilter,
  allInvoices,
}: InvoiceStatusFiltersProps) => {
  const { buttonBgColor } = useSelector(getCustomizationState)

  const baseButtonStyles =
    'inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm duration-150 ease-in-out'
  const selectedClassStyles = 'text-white'
  const notSelectedClassStyles = 'bg-white text-slate-500'

  const addButtonBackgroundColor = (
    invoiceStatusFilter: PlatformInvoiceStatusFilter,
  ) => {
    return invoiceStatusFilter === currentFilter
      ? selectedClassStyles
      : notSelectedClassStyles
  }

  const numPaid = allInvoices.filter(
    (invoice) => invoice.status === PlatformInvoiceStatus.PAID,
  ).length
  const numDue = allInvoices.filter(
    (invoice) => invoice.status === PlatformInvoiceStatus.DUE,
  ).length
  const numOverDue = allInvoices.filter(
    (invoice) => invoice.status === PlatformInvoiceStatus.OVERDUE,
  ).length
  const totalCount = allInvoices.length

  return (
    <div className="mb-4 sm:mb-0">
      <ul className="flex flex-wrap -m-1">
        <li className="m-1">
          <button
            onClick={() => {
              onInvoiceStatusFilterSelect('ALL')
            }}
            className={classNames(
              baseButtonStyles,
              addButtonBackgroundColor('ALL'),
              'text-white',
            )}
            style={{
              backgroundColor: 'ALL' === currentFilter ? buttonBgColor : '',
            }}
          >
            All <span className="ml-1 text-indigo-200">{totalCount}</span>
          </button>
        </li>
        <li className="m-1">
          <button
            onClick={() => {
              onInvoiceStatusFilterSelect(PlatformInvoiceStatus.PAID)
            }}
            className={classNames(
              baseButtonStyles,
              addButtonBackgroundColor(PlatformInvoiceStatus.PAID),
            )}
            style={{
              backgroundColor:
                PlatformInvoiceStatus.PAID === currentFilter
                  ? buttonBgColor
                  : '',
            }}
          >
            Paid <span className="ml-1 text-slate-400">{numPaid}</span>
          </button>
        </li>
        <li className="m-1">
          <button
            onClick={() => {
              onInvoiceStatusFilterSelect(PlatformInvoiceStatus.DUE)
            }}
            className={classNames(
              baseButtonStyles,
              addButtonBackgroundColor(PlatformInvoiceStatus.DUE),
            )}
            style={{
              backgroundColor:
                PlatformInvoiceStatus.DUE === currentFilter
                  ? buttonBgColor
                  : '',
            }}
          >
            Due <span className="ml-1 text-slate-400">{numDue}</span>
          </button>
        </li>
        <li className="m-1">
          <button
            onClick={() => {
              onInvoiceStatusFilterSelect(PlatformInvoiceStatus.OVERDUE)
            }}
            className={classNames(
              baseButtonStyles,
              addButtonBackgroundColor(PlatformInvoiceStatus.OVERDUE),
            )}
            style={{
              backgroundColor:
                PlatformInvoiceStatus.OVERDUE === currentFilter
                  ? buttonBgColor
                  : '',
            }}
          >
            Overdue <span className="ml-1 text-slate-400">{numOverDue}</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default InvoiceStatusFilters
