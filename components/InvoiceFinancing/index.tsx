import { faker } from '@faker-js/faker'
import { useEffect, useState } from 'react'
import { CircularProgress } from '@mui/material'
import _, { isEmpty } from 'lodash'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import { v4 } from 'uuid'
import {
  createInvoice,
  deleteInvoices,
  filterInvoices,
  getInvoicesSelector,
  getIssuedProductSelector,
  getNewInvoiceNumber,
  updateInvoiceIssuedProduct,
} from '../../store/apiInvoicesSlice'
import {
  getKanmonConnectSlice,
  updateOnHide,
} from '../../store/kanmonConnectSlice'
import { getCustomizationState } from '../../store/customizationSlice'
import { IssuedProduct, ProductType } from '@kanmon/sdk'
import {
  axiosWithApiKey,
  formatDollarsWithCents,
  getFakeAddress,
  getRandomInvoiceStatus,
  getRandomInvoiceType,
} from '../../utils'
import InvoicesModal from '../InvoicesModal'
import { SplitButton } from '../SplitButton'
import InvoicesTable from './InvoicesTable'
import formatInvoiceFinancingProductName from '../../utils/formatInvoiceFinancingProductName'
import { PayorType } from '../../types/MoreTypes'
import InvoiceStatusFilters from './InvoiceStatusFilters'
import DeleteButton from './DeleteButton'
import {
  CreateEmbeddedSessionPayload,
  PlatformApiCreateEmbeddedSessionResponse,
} from '../../pages/api/create_embedded_sessions'
import { toast } from 'react-toastify'
import { useKanmonConnectContext } from '../../hooks/KanmonConnectContext'
import {
  PlatformInvoice,
  PlatformInvoiceStatusFilter,
} from '../../types/DemoInvoicesTypes'
import { getApiKeyState } from '../../store/apiKeySlice'
import { getAuthState } from '../../store/authSlice'
import { KanmonConnectComponent } from '@kanmon/web-sdk'
import { genericErrorMessage } from '@/utils/constants'

function ApiInvoices() {
  const { showKanmonConnect } = useKanmonConnectContext()

  const { issuedProduct, availableLimit } = useSelector(
    getIssuedProductSelector,
  )

  const { apiKey } = useSelector(getApiKeyState)
  const { userId } = useSelector(getAuthState)

  const [focusedInvoiceId, setFocusedInvoiceId] = useState<string | null>(null)
  const [invoices, setInvoices] = useState<PlatformInvoice[]>([])
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState(
    new Set<string>(),
  )
  const { ctaText, currentWorkflowState, isOpen } = useSelector(
    getKanmonConnectSlice,
  )
  const { buttonBgColor, ctaButtonColor } = useSelector(getCustomizationState)
  const dispatch = useDispatch()

  async function fetchIssuedProductDetails() {
    const params = new URLSearchParams()
    params.append('userId', userId as string)
    const url = `/api/fetch_invoice_financing_issued_product?${params.toString()}`
    const issuedProductResp = await axiosWithApiKey(apiKey).get<
      IssuedProduct | ''
    >(url)

    // Didn't exist - probably a relog
    if (issuedProductResp.data === '') {
      return
    }

    dispatch(
      updateInvoiceIssuedProduct({ issuedProduct: issuedProductResp.data }),
    )
  }

  useEffect(
    function unselectInvoicesWhenHidingWidget() {
      if (!isOpen) {
        setSelectedInvoiceIds(new Set())
      }
    },
    [isOpen],
  )

  useEffect(
    function fetchInvoiceDetailsWhenOnServicing() {
      if (currentWorkflowState === 'SERVICING') {
        fetchIssuedProductDetails()
      }
    },
    [currentWorkflowState],
  )

  // prettier-ignore
  const ctaTextWithOverride =
    currentWorkflowState === 'START_FLOW' ? 'Need Financing?' :
    currentWorkflowState === 'SERVICING'  ? 'Status'          :
                                            ctaText

  const {
    filteredInvoices,
    filter,
    invoices: allPersistedInvoices,
  } = useSelector(getInvoicesSelector)

  useEffect(
    function setPersistedInvoicesInState() {
      setInvoices(filteredInvoices)
    },
    [filteredInvoices],
  )

  const allChecked =
    !isEmpty(invoices) && invoices.length === selectedInvoiceIds.size

  const onInvoiceSelect = (invoiceId: string) => {
    const nextSet = new Set(selectedInvoiceIds)
    nextSet.has(invoiceId) ? nextSet.delete(invoiceId) : nextSet.add(invoiceId)
    setSelectedInvoiceIds(nextSet)
  }

  const onSingleInvoiceDelete = (invoiceId: string) => {
    dispatch(deleteInvoices({ invoiceIds: [invoiceId] }))

    const nextSet = new Set(selectedInvoiceIds)
    nextSet.delete(invoiceId)
    setSelectedInvoiceIds(nextSet)
  }

  const onInvoiceStatusFilterSelect = (
    invoiceStatusFilter: PlatformInvoiceStatusFilter,
  ) => {
    dispatch(
      filterInvoices({
        invoiceStatusFilter: invoiceStatusFilter,
      }),
    )
  }

  const onSelectAllInvoices = () => {
    !allChecked
      ? setSelectedInvoiceIds(new Set(invoices.map((invoice) => invoice.id)))
      : setSelectedInvoiceIds(new Set())
  }

  // hard coded for now
  const onCreateInvoiceClick = () => {
    const newInvoiceNumber = getNewInvoiceNumber()

    const payorType =
      Math.random() < 0.5 ? PayorType.BUSINESS : PayorType.INDIVIDUAL

    dispatch(
      createInvoice({
        invoice: {
          id: v4(),
          payorType,
          invoiceNumber: newInvoiceNumber,
          billFromBusinessEmail: faker.internet.email(),
          status: getRandomInvoiceStatus(),
          billFromBusinessName:
            payorType === PayorType.BUSINESS ? faker.company.name() : undefined,
          customerFirstName:
            payorType === PayorType.INDIVIDUAL
              ? faker.person.firstName()
              : undefined,
          customerLastName:
            payorType === PayorType.INDIVIDUAL
              ? faker.person.lastName()
              : undefined,
          billToPersonFullName:
            payorType === PayorType.INDIVIDUAL
              ? faker.person.fullName()
              : undefined,
          createdAtIsoDate: DateTime.now().toISO(),
          dueDateIsoDate: DateTime.now()
            .plus({ days: _.random(30, 60) })
            .toISODate(),
          type: getRandomInvoiceType(),
          phoneNumber: faker.helpers.fromRegExp(/\(4\d\d\) \d{3}-\d{4}/),
          billToPersonAddress: getFakeAddress(),
          billFromPersonAddress: getFakeAddress(),
          items: _.range(0, 3).map(() => ({
            itemName: faker.commerce.product(),
            itemCostCents: _.random(100_000, 500_000),
            itemQuantity: _.random(2, 5),
          })),
        },
      }),
    )
  }

  const onDeleteSelectedInvoicesClick = () => {
    dispatch(
      deleteInvoices({
        invoiceIds: [...selectedInvoiceIds],
      }),
    )

    setSelectedInvoiceIds(new Set())
  }

  const financeInvoices = async (
    invoices: PlatformInvoice[],
    includeInvoiceFile: boolean,
  ) => {
    // If the invoice file is included, then all other data
    // fields are optional. Else, they are required.
    if (
      !includeInvoiceFile &&
      invoices.some((invoice) => {
        return (
          _.isNil(invoice.payorType) ||
          // the issued date is only required for Invoice Financing
          (issuedProduct?.servicingData.productType ===
            ProductType.INVOICE_FINANCING &&
            _.isNil(invoice.createdAtIsoDate)) ||
          _.isNil(invoice.dueDateIsoDate) ||
          _.isEmpty(invoice.items)
        )
      })
    ) {
      toast.error(
        'Cannot submit these invoices because some fields are missing. You may want to try submitting with the invoice file instead.',
      )
      return
    }

    if (!issuedProduct) {
      toast.error('No issued product found')
      return
    }

    const data: CreateEmbeddedSessionPayload = {
      invoices,
      platformBusinessId: issuedProduct.platformBusinessId as string,
      includeInvoiceFile,
      productType: issuedProduct.servicingData.productType,
    }

    try {
      const resp = await axiosWithApiKey(
        apiKey,
      ).post<PlatformApiCreateEmbeddedSessionResponse>(
        '/api/create_embedded_sessions',
        data,
      )

      const getKanmonConnectComponent = (
        includeInvoiceFile: boolean,
        productType: ProductType,
      ): KanmonConnectComponent => {
        if (productType === ProductType.INVOICE_FINANCING) {
          return includeInvoiceFile
            ? KanmonConnectComponent.SESSION_INVOICE_FLOW_WITH_INVOICE_FILE
            : KanmonConnectComponent.SESSION_INVOICE_FLOW
        } else if (productType === ProductType.ACCOUNTS_PAYABLE_FINANCING) {
          return includeInvoiceFile
            ? KanmonConnectComponent.SESSION_ACCOUNTS_PAYABLE_INVOICE_FLOW_WITH_INVOICE_FILE
            : KanmonConnectComponent.SESSION_ACCOUNTS_PAYABLE_INVOICE_FLOW
        }

        throw new Error('Invalid product type')
      }

      showKanmonConnect({
        component: getKanmonConnectComponent(
          includeInvoiceFile,
          issuedProduct!.servicingData.productType,
        ),
        sessionToken: resp.data.sessionToken,
      })
      dispatch(
        updateOnHide({
          isOpen: true,
        }),
      )
    } catch (ex) {
      console.error('Failed to create embedded session', ex)
      toast.error(genericErrorMessage)
    }
  }

  const onFinanceSelectedInvoicesClick = async (
    includeInvoiceFile: boolean,
  ) => {
    const invoices: PlatformInvoice[] = [...selectedInvoiceIds].map(
      (invoiceId) =>
        allPersistedInvoices.find(
          (persistedInvoice) => persistedInvoice.id === invoiceId,
        ),
    ) as PlatformInvoice[]
    return financeInvoices(invoices, includeInvoiceFile)
  }

  const onFinanceInvoiceClick = async () => {
    const invoice = allPersistedInvoices.find(
      (persistedInvoice) => persistedInvoice.id === focusedInvoiceId,
    ) as PlatformInvoice
    await financeInvoices([invoice], false)
    setFocusedInvoiceId(null)
  }

  const showLaunchKanmonConnectCTA = !(
    currentWorkflowState === 'NO_OFFERS_EXTENDED'
  )

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-5">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-slate-800 font-bold">
              {formatInvoiceFinancingProductName(true)} ✨
            </h1>
            {!_.isNil(availableLimit) && (
              <h2 className="text-xl font-semibold mt-4">
                Available Limit: {formatDollarsWithCents(availableLimit / 100)}
              </h2>
            )}
          </div>
        </div>

        <div className="sm:flex sm:justify-between sm:items-center mb-5">
          <InvoiceStatusFilters
            onInvoiceStatusFilterSelect={onInvoiceStatusFilterSelect}
            currentFilter={filter}
            allInvoices={allPersistedInvoices}
          />

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            <DeleteButton
              onClick={onDeleteSelectedInvoicesClick}
              numberOfSelectedInvoices={selectedInvoiceIds.size}
            />
            {!_.isEmpty(selectedInvoiceIds) && issuedProduct ? (
              <SplitButton
                buttonColor={buttonBgColor}
                options={[
                  {
                    label: (
                      <span>
                        Finance ({selectedInvoiceIds.size}){' '}
                        {formatInvoiceFinancingProductName(
                          selectedInvoiceIds.size > 1,
                        )}
                      </span>
                    ),
                    onClick: () => onFinanceSelectedInvoicesClick(false),
                  },
                  {
                    label: (
                      <span>
                        Finance ({selectedInvoiceIds.size}){' '}
                        {formatInvoiceFinancingProductName(
                          selectedInvoiceIds.size > 1,
                        )}{' '}
                        (pdf)
                      </span>
                    ),
                    onClick: () => onFinanceSelectedInvoicesClick(true),
                  },
                ]}
              />
            ) : (
              <button
                className="btn text-white forty-percent-darker-on-hover"
                style={{ backgroundColor: buttonBgColor }}
                onClick={onCreateInvoiceClick}
              >
                <svg
                  className="w-4 h-4 fill-current opacity-50 shrink-0"
                  viewBox="0 0 16 16"
                >
                  <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                </svg>
                <span className="hidden xs:block ml-2">
                  Create {formatInvoiceFinancingProductName()}
                </span>
              </button>
            )}

            {showLaunchKanmonConnectCTA && (
              <button
                className="btn forty-percent-darker-on-hover text-white w-[170px]"
                style={{ backgroundColor: ctaButtonColor }}
                onClick={() => {
                  dispatch(
                    updateOnHide({
                      isOpen: true,
                    }),
                  )
                  showKanmonConnect()
                }}
              >
                <span>
                  {ctaTextWithOverride || <CircularProgress size="1.5rem" />}
                </span>
              </button>
            )}

            {issuedProduct?.servicingData.productType ===
              'INVOICE_FINANCING' && (
              <SplitButton
                buttonColor={ctaButtonColor}
                options={[
                  {
                    label: 'Invoice History',
                    onClick: () => {
                      updateOnHide({
                        isOpen: true,
                      })
                      showKanmonConnect({
                        component: KanmonConnectComponent.INVOICE_HISTORY,
                      })
                    },
                  },
                  {
                    label: 'Invoice Upload',
                    onClick: () => {
                      updateOnHide({
                        isOpen: true,
                      })
                      showKanmonConnect({
                        component: KanmonConnectComponent.UPLOAD_INVOICE,
                      })
                    },
                  },
                  {
                    label: 'Pay Now',
                    onClick: () => {
                      updateOnHide({
                        isOpen: true,
                      })
                      showKanmonConnect({
                        component: KanmonConnectComponent.PAY_NOW,
                      })
                    },
                  },
                  {
                    label: 'Download Agreements',
                    onClick: () => {
                      updateOnHide({
                        isOpen: true,
                      })
                      showKanmonConnect({
                        component: KanmonConnectComponent.DOWNLOAD_AGREEMENTS,
                      })
                    },
                  },
                ]}
              />
            )}
          </div>
        </div>

        <InvoicesTable
          invoices={filteredInvoices}
          selectedInvoiceIds={selectedInvoiceIds}
          onInvoiceSelect={onInvoiceSelect}
          onSelectAllInvoices={onSelectAllInvoices}
          allChecked={allChecked}
          onSingleInvoiceDelete={onSingleInvoiceDelete}
          onGetPaidNowClick={(invoiceId: string) => {
            setFocusedInvoiceId(invoiceId)
          }}
          issuedProduct={issuedProduct}
        />

        {selectedInvoiceIds && (
          <InvoicesModal
            open={!!focusedInvoiceId}
            onClose={() => setFocusedInvoiceId(null)}
            selectedInvoice={
              invoices.find(
                (invoice) => invoice.id === focusedInvoiceId,
              ) as PlatformInvoice
            }
            issuedProduct={issuedProduct as IssuedProduct}
            onFinanceInvoice={onFinanceInvoiceClick}
          />
        )}
      </div>
    </>
  )
}

export default ApiInvoices
