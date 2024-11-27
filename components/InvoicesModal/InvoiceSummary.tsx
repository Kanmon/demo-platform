import { IssuedProduct } from '@kanmon/sdk'
import { useSelector } from 'react-redux'
import { getIssuedProductSelector } from '../../store/apiInvoicesSlice'
import { ResponsiveImage } from '../shared/ResponsiveImage'
import { DefaultLogoSVG } from '../shared/Logo'
import formatInvoiceFinancingProductName from '../../utils/formatInvoiceFinancingProductName'
import {
  renderCentsValueAsDollarsWithCents,
  renderValueAsDate,
} from '../../utils'
import getInvoiceTotalCents from '../../utils/getInvoiceTotal'
import { getCustomizationState } from '../../store/customizationSlice'
import { PlatformInvoice } from '../../types/DemoInvoicesTypes'

interface TopSectionProps {
  onFastPayClick: () => void
  invoice: PlatformInvoice
  logo: string
  issuedProduct: IssuedProduct
  productType: 'INVOICE_FINANCING' | 'ACCOUNTS_PAYABLE_FINANCING'
}

const TopSection = ({
  onFastPayClick,
  invoice,
  logo,
  issuedProduct,
  productType,
}: TopSectionProps) => {
  return (
    <section className="bg-gray-100 py-8 px-12 grid grid-cols-12 gap-x-12">
      <div className="col-span-4">
        {logo ? (
          <ResponsiveImage alt="logo" src={logo} width={250} height={60} />
        ) : (
          <DefaultLogoSVG />
        )}
      </div>
      <div className="col-span-4">
        <div className="mb-6">
          <span className="text-2xl font-medium">
            {formatInvoiceFinancingProductName(productType)}
          </span>
        </div>
        <div className="mb-6">
          <span className="font-medium">
            {formatInvoiceFinancingProductName(productType)} Number:
          </span>
          <br />
          <span>{invoice.invoiceNumber}</span>
        </div>
        <div>
          <span className="font-medium">Issued Date:</span>
          <br />
          <span>
            {renderValueAsDate(invoice.createdAtIsoDate, 'MM/dd/yyyy')}
          </span>
        </div>
      </div>
      <div className="col-span-4 text-right mr-3">
        <div className="mb-4">
          {!invoice.kanmonInvoiceId && issuedProduct && (
            <button
              className="btn bg-green-600 hover:bg-green-700 text-white"
              onClick={onFastPayClick}
            >
              Finance {formatInvoiceFinancingProductName(productType)}
            </button>
          )}
        </div>
        <br />
      </div>
    </section>
  )
}

const BillToFromSection = ({ invoice }: { invoice: PlatformInvoice }) => {
  const {
    billToPersonFullName,
    billToPersonAddress: {
      addressLineOne: billToAddressLineOne,
      addressLineTwo: billToAddressLineTwo,
      city: billToCity,
      country: billToCountry,
      state: billToState,
      zipcode: billToZipcode,
    },
    billFromPersonAddress: {
      addressLineOne: billFromAddressLineOne,
      addressLineTwo: billFromAddressLineTwo,
      city: billFromCity,
      country: billFromCountry,
      state: billFromState,
      zipcode: billFromZipcode,
    },
    customerFirstName,
    customerLastName,
  } = invoice
  return (
    <section className="py-8 px-16 grid grid-cols-12 gap-x-12">
      <div className="col-span-6">
        <span className="font-medium">Bill To:</span>
        <br />
        <span>{billToPersonFullName}</span>
        <br />
        <span>
          {billToAddressLineOne} {billToAddressLineTwo}
        </span>
        <br />
        <span>
          {billToCity}, {billToState}, {billToZipcode}
        </span>
        <br />
        <span>{billToCountry}</span>
        <br />
      </div>
      <div className="col-span-6">
        <span className="font-medium">Bill To:</span>
        <br />
        <span>
          {customerFirstName} {customerLastName}
        </span>
        <br />
        <span>
          {billFromAddressLineOne} {billFromAddressLineTwo}
        </span>
        <br />
        <span>
          {billFromCity}, {billFromState}, {billFromZipcode}
        </span>
        <br />
        <span>{billFromCountry}</span>
        <br />
      </div>
    </section>
  )
}

const AmountsSection = ({
  invoice,
  productType,
}: {
  invoice: PlatformInvoice
  productType: 'INVOICE_FINANCING' | 'ACCOUNTS_PAYABLE_FINANCING'
}) => {
  const invoiceTotal = getInvoiceTotalCents(invoice)
  return (
    <section>
      <div className="grid grid-cols-12  gap-x-4 bg-gray-100 py-2">
        <div className="font-medium col-start-2">ITEM</div>
        <div className="font-medium col-start-7">COST</div>
        <div className="font-medium col-start-9">QTY</div>
        <div className="font-medium col-start-10 col-span-2 text-right">
          PRICE
        </div>
      </div>
      {invoice.items.map((item, i) => (
        <div key={i} className="grid grid-cols-12  gap-x-4 col-span-12 my-3">
          <div className="font-medium col-start-2">{item.itemName}</div>
          <div className="col-start-7">
            {renderCentsValueAsDollarsWithCents(item.itemCostCents)}
          </div>
          <div className="col-start-9">{item.itemQuantity}</div>
          <div className="col-start-10 col-span-2 text-right">
            {renderCentsValueAsDollarsWithCents(
              item.itemQuantity * item.itemCostCents,
            )}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-12  gap-x-4 col-span-12 my-3">
        <hr
          className="col-start-7 col-span-5 inline-block bg-black my-3"
          style={{ height: '3px' }}
        />

        <div className="mb-2 col-start-7 col-span-3">Subtotal</div>
        <div className="col-start-10 col-span-2 text-right">
          {renderCentsValueAsDollarsWithCents(invoiceTotal)}
        </div>

        <div className="mb-2 col-start-7 col-span-3">Taxes</div>
        <div className="col-start-10 col-span-2 text-right">
          {renderCentsValueAsDollarsWithCents(0.1 * invoiceTotal)}
        </div>

        <div className="mb-2 font-medium col-start-7 col-span-3">
          {formatInvoiceFinancingProductName(productType)} Total
        </div>
        <div className="font-medium col-start-10 col-span-2 text-right">
          {renderCentsValueAsDollarsWithCents(
            getInvoiceTotalCents(invoice, true),
          )}
        </div>

        <hr
          className="col-start-7 col-span-5 inline-block bg-black my-3"
          style={{ height: '3px' }}
        />

        <div className="mb-2 font-medium col-start-7 col-span-2">
          Amount Due
        </div>
        <div className="font-medium col-start-9 col-span-3 text-right">
          {renderCentsValueAsDollarsWithCents(1.1 * invoiceTotal)}
        </div>
      </div>
    </section>
  )
}

const FooterSection = () => {
  return (
    <section className="bg-gray-100 flex justify-center items-center py-8"></section>
  )
}

interface InvoiceSummaryProps {
  onFastPayClick: () => void
  invoice: PlatformInvoice
  issuedProduct: IssuedProduct
}

const InvoiceSummary = ({
  onFastPayClick,
  invoice,
  issuedProduct,
}: InvoiceSummaryProps) => {
  const { logoBase64 } = useSelector(getCustomizationState)
  // Using productTypeForPage here in the edge case where
  // we demo INVOICE_FINANCING and accidentally go to the ACCOUNTS_PAYABLE_FINANCING page.
  // In this case the user would be in servicing, but have the wrong
  // product. Using productTypeForPage at least makes it so that the
  // display of invoice vs purchase order is consistent.
  const { productTypeForPage } = useSelector(getIssuedProductSelector)

  const castedProductType = productTypeForPage as
    | 'INVOICE_FINANCING'
    | 'ACCOUNTS_PAYABLE_FINANCING'

  return (
    <>
      <TopSection
        logo={logoBase64 as string}
        invoice={invoice}
        onFastPayClick={onFastPayClick}
        issuedProduct={issuedProduct}
        productType={castedProductType}
      />
      <div className="flex-grow">
        <BillToFromSection invoice={invoice} />
        <AmountsSection productType={castedProductType} invoice={invoice} />
      </div>
      <div className="flex-none">
        <FooterSection />
      </div>
    </>
  )
}

export default InvoiceSummary
