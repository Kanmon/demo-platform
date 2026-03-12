import classNames from 'classnames'
import { DateTime } from 'luxon'
import {
  PlatformInvoice,
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

const selectedStyle = {
  backgroundColor: '#374151',
  color: '#ffffff',
  borderColor: '#4b5563',
}
const unselectedStyle = {
  backgroundColor: '',
  color: undefined,
} as React.CSSProperties

const InvoiceStatusFilters = ({
  onInvoiceStatusFilterSelect,
  currentFilter,
  allInvoices,
}: InvoiceStatusFiltersProps) => {
  const today = DateTime.now().startOf('day')

  const counts = allInvoices.reduce(
    (acc, invoice) => {
      if (
        !invoice.dueDateIsoDate ||
        DateTime.fromISO(invoice.dueDateIsoDate) >= today
      ) {
        acc.availableForFinancing++
      } else {
        acc.pastDue++
      }

      return acc
    },
    { availableForFinancing: 0, pastDue: 0 },
  )

  const filters: {
    filter: PlatformInvoiceStatusFilter
    label: string
    count: number
  }[] = [
    {
      filter: 'AVAILABLE_FOR_FINANCING',
      label: 'Available for Financing',
      count: counts.availableForFinancing,
    },
    { filter: 'PAST_DUE', label: 'Past Due', count: counts.pastDue },
    { filter: 'ALL', label: 'All', count: allInvoices.length },
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
