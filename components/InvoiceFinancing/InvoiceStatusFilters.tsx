import classNames from 'classnames'
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

const baseButtonStyles =
  'inline-flex items-center justify-center text-sm font-medium leading-5 rounded-full px-3 py-1 border border-slate-200 hover:border-slate-300 shadow-sm duration-150 ease-in-out'

const selectedStyle = { backgroundColor: '#374151', color: '#ffffff' }
const unselectedStyle = {
  backgroundColor: '',
  color: undefined,
} as React.CSSProperties

const InvoiceStatusFilters = ({
  onInvoiceStatusFilterSelect,
  currentFilter,
  allInvoices,
}: InvoiceStatusFiltersProps) => {
  const counts = allInvoices.reduce(
    (acc, invoice) => {
      if (invoice.status === PlatformInvoiceStatus.PAID) acc.paid++
      else if (invoice.status === PlatformInvoiceStatus.DUE) acc.due++
      else if (invoice.status === PlatformInvoiceStatus.OVERDUE) acc.overdue++
      return acc
    },
    { paid: 0, due: 0, overdue: 0 },
  )

  const filters: {
    filter: PlatformInvoiceStatusFilter
    label: string
    count: number
  }[] = [
    { filter: 'ALL', label: 'All', count: allInvoices.length },
    { filter: PlatformInvoiceStatus.PAID, label: 'Paid', count: counts.paid },
    { filter: PlatformInvoiceStatus.DUE, label: 'Due', count: counts.due },
    {
      filter: PlatformInvoiceStatus.OVERDUE,
      label: 'Overdue',
      count: counts.overdue,
    },
  ]

  return (
    <div className="mb-4 sm:mb-0">
      <ul className="flex flex-wrap -m-1">
        {filters.map(({ filter, label, count }) => {
          const selected = filter === currentFilter
          return (
            <li key={filter} className="m-1">
              <button
                onClick={() => onInvoiceStatusFilterSelect(filter)}
                className={classNames(
                  baseButtonStyles,
                  !selected && 'bg-white text-slate-500',
                )}
                style={selected ? selectedStyle : unselectedStyle}
              >
                {label} <span className="ml-1 opacity-60">{count}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default InvoiceStatusFilters
