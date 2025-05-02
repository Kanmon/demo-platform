import { IssuedProduct } from '@kanmon/sdk'
import formatInvoiceFinancingProductName from '../../utils/formatInvoiceFinancingProductName'
import InvoiceTableItem from './InvoicesTableItem'
import { PlatformInvoice } from '../../types/DemoInvoicesTypes'

interface InvoicesTableProps {
  invoices: PlatformInvoice[]
  selectedInvoiceIds: Set<string>
  onInvoiceSelect: (invoiceId: string) => void
  onSelectAllInvoices: () => void
  allChecked: boolean
  onSingleInvoiceDelete: (invoiceId: string) => void
  onGetPaidNowClick: (invoiceId: string) => void
  issuedProduct?: IssuedProduct | null
}

function InvoicesTable({
  invoices,
  selectedInvoiceIds,
  onInvoiceSelect,
  onSelectAllInvoices,
  allChecked,
  onSingleInvoiceDelete,
  onGetPaidNowClick,
  issuedProduct,
}: InvoicesTableProps) {
  const showFinanceColumn = !!issuedProduct

  return (
    <div className="bg-white shadow-lg rounded-sm border border-slate-200 relative">
      <header className="px-5 py-4">
        <h2 className="font-semibold text-slate-800">
          {formatInvoiceFinancingProductName(true)}
        </h2>
      </header>
      <div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 border-t border-b border-slate-200">
              <tr>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px">
                  <div className="flex items-center">
                    <label className="inline-flex">
                      <span className="sr-only">Select all</span>
                      <input
                        className="form-checkbox"
                        type="checkbox"
                        checked={allChecked}
                        onChange={onSelectAllInvoices}
                      />
                    </label>
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">
                    {formatInvoiceFinancingProductName()}
                  </div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 min-w-[115px] py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Total</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Status</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Customer</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Issued on</div>
                </th>
                <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                  <div className="font-semibold text-left">Due on</div>
                </th>
                {showFinanceColumn && (
                  <th className="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap">
                    <div className="font-semibold text-left">Financing</div>
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-slate-200">
              {invoices.map((invoice) => {
                return (
                  <InvoiceTableItem
                    key={invoice.id}
                    invoice={invoice}
                    isChecked={selectedInvoiceIds.has(invoice.id)}
                    onInvoiceCheckboxSelect={() => onInvoiceSelect(invoice.id)}
                    onInvoiceDelete={() => onSingleInvoiceDelete(invoice.id)}
                    onGetPaidNowClick={() => onGetPaidNowClick(invoice.id)}
                    showFinanceColumn={showFinanceColumn}
                  />
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default InvoicesTable
