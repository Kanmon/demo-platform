import { faker } from '@faker-js/faker'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'
import { DateTime } from 'luxon'
import { HYDRATE } from 'next-redux-wrapper'
import { v4 } from 'uuid'

import {
  getFakeAddress,
  getRandomInvoiceType,
} from '@/utils/invoiceFakeDataGenerators'
import { AppState } from './store'
import { IssuedProduct, Invoice as KanmonInvoice } from '@kanmon/sdk'
import {
  ApiInvoicesState,
  PlatformInvoice,
  PlatformInvoiceStatus,
  PlatformInvoiceStatusFilter,
} from '../types/DemoInvoicesTypes'

export const getNewInvoiceNumber = () => `#${_.random(1000000, 9999999)}`
export const getFakePhoneNumber = () =>
  faker.helpers.fromRegExp('([0-9]{3}) [0-9]{3}-[0-9]{4}')

const buildInitialInvoices = (): PlatformInvoice[] => {
  return [
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      billFromBusinessName: faker.company.name(),
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.OVERDUE,
      payorType: 'BUSINESS',
      createdAtIsoDate: DateTime.now().minus({ days: 1 }).toISO(),
      paidOnIsoDate: null,
      dueDateIsoDate: DateTime.now().plus({ days: 30 }).toISODate(),
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      billFromBusinessEmail: faker.internet.email(),
      payorType: 'INDIVIDUAL',
      status: PlatformInvoiceStatus.PAID,
      customerFirstName: faker.person.firstName(),
      customerLastName: faker.person.lastName(),
      createdAtIsoDate: DateTime.now().minus({ days: 16 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 46 }).toISODate(),
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      billFromBusinessName: faker.company.name(),
      billFromBusinessEmail: faker.internet.email(),
      payorType: 'BUSINESS',
      status: PlatformInvoiceStatus.PAID,
      createdAtIsoDate: DateTime.now().minus({ days: 21 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 60 }).toISODate(),
      paidOnIsoDate: DateTime.now().minus({ days: 17 }).toISO(),
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      payorType: 'INDIVIDUAL',
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.DUE,
      customerFirstName: faker.person.firstName(),
      customerLastName: faker.person.lastName(),
      createdAtIsoDate: DateTime.now().minus({ days: 22 }).toISO(),
      paidOnIsoDate: null,
      dueDateIsoDate: DateTime.now().plus({ days: 44 }).toISODate(),
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      payorType: 'BUSINESS',
      billFromBusinessName: faker.company.name(),
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.DUE,
      createdAtIsoDate: DateTime.now().minus({ days: 24 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 65 }).toISODate(),
      paidOnIsoDate: null,
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),

      payorType: 'INDIVIDUAL',
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.PAID,
      customerFirstName: faker.person.firstName(),
      customerLastName: faker.person.lastName(),
      createdAtIsoDate: DateTime.now().minus({ days: 27 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 54 }).toISODate(),
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      payorType: 'BUSINESS',
      billFromBusinessName: faker.company.name(),
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.PAID,
      createdAtIsoDate: DateTime.now().minus({ days: 29 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 99 }).toISODate(),
      paidOnIsoDate: DateTime.now().minus({ days: 18 }).toISO(),
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      payorType: 'INDIVIDUAL',
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.OVERDUE,
      customerFirstName: faker.person.firstName(),
      customerLastName: faker.person.lastName(),
      createdAtIsoDate: DateTime.now().minus({ days: 31 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 58 }).toISODate(),
      paidOnIsoDate: null,
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: _.range(0, 3).map(() => ({
        itemName: faker.commerce.product(),
        itemCostCents: _.random(100_000, 500_000),
        itemQuantity: _.random(2, 5),
      })),
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      payorType: 'BUSINESS',
      billFromBusinessName: faker.company.name(),
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.PAID,
      createdAtIsoDate: DateTime.now().minus({ days: 32 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 88 }).toISODate(),
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: [
        {
          itemName: faker.commerce.product(),
          itemCostCents: _.random(100_000, 500_000),
          itemQuantity: _.random(2, 5),
        },
      ],
    },
    {
      id: v4(),
      invoiceNumber: getNewInvoiceNumber(),
      payorType: 'INDIVIDUAL',
      billFromBusinessEmail: faker.internet.email(),
      status: PlatformInvoiceStatus.DUE,
      customerFirstName: faker.person.firstName(),
      customerLastName: faker.person.lastName(),
      createdAtIsoDate: DateTime.now().minus({ days: 33 }).toISO(),
      dueDateIsoDate: DateTime.now().plus({ days: 95 }).toISODate(),
      paidOnIsoDate: null,
      type: getRandomInvoiceType(),
      phoneNumber: getFakePhoneNumber(),
      billToPersonFullName: faker.person.fullName(),
      billToPersonAddress: getFakeAddress(),
      billFromPersonAddress: getFakeAddress(),
      items: [
        {
          itemName: faker.commerce.product(),
          itemCostCents: _.random(100_000, 500_000),
          itemQuantity: _.random(2, 5),
        },
      ],
    },
  ]
}

const makeInitialState = (): ApiInvoicesState => {
  return {
    availableLimitCents: null,
    invoices: buildInitialInvoices(),
    invoiceStatusFilter: 'ALL',
    kanmonInvoices: [],
  }
}

export const apiInvoicesSlice = createSlice({
  name: 'apiInvoices',
  initialState: makeInitialState,
  reducers: {
    updateAvailableLimit(
      state,
      action: { payload: { newAvailableLimitCents: number } },
    ) {
      state.availableLimitCents = action.payload.newAvailableLimitCents
    },
    createInvoice(state, action: { payload: { invoice: PlatformInvoice } }) {
      state.invoices.push(action.payload.invoice)
    },
    updateInvoice(state, action: { payload: { invoice: PlatformInvoice } }) {
      // update the invoice
      const index = state.invoices.findIndex(
        (i) => i.id === action.payload.invoice.id,
      )
      state.invoices[index] = action.payload.invoice
    },
    deleteInvoices(state, action: { payload: { invoiceIds: string[] } }) {
      state.invoices = state.invoices.filter(
        (invoice) => !action.payload.invoiceIds.includes(invoice.id),
      )
    },
    filterInvoices(
      state,
      action: { payload: { invoiceStatusFilter: PlatformInvoiceStatusFilter } },
    ) {
      state.invoiceStatusFilter = action.payload.invoiceStatusFilter
    },
    updateInvoiceIssuedProduct(
      state,
      action: {
        payload: {
          issuedProduct: IssuedProduct
        }
      },
    ) {
      if (
        action.payload.issuedProduct.servicingData.productType ===
          'INVOICE_FINANCING' ||
        action.payload.issuedProduct.servicingData.productType ===
          'ACCOUNTS_PAYABLE_FINANCING'
      ) {
        state.availableLimitCents =
          action.payload.issuedProduct.servicingData.availableLimitCents
      }
      state.invoiceFinancingIssuedProduct = action.payload.issuedProduct
    },
    updateKanmonInvoices(
      state,
      action: { payload: { invoices: KanmonInvoice[] } },
    ) {
      state.kanmonInvoices = action.payload.invoices
    },
    addKanmonIdToInvoice(
      state,
      action: {
        payload: { invoice: { id: string; platformInvoiceId: string | null } }
      },
    ) {
      const index = state.invoices.findIndex(
        (i) => i.id === action.payload.invoice.platformInvoiceId,
      )

      const invoice = state.invoices[index]

      invoice.kanmonInvoiceId = action.payload.invoice.id

      state.invoices[index] = invoice
    },
  },

  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      }
    },
  },
})

export const {
  createInvoice,
  deleteInvoices,
  updateInvoice,
  filterInvoices,
  updateInvoiceIssuedProduct,
  updateKanmonInvoices,
  addKanmonIdToInvoice,
  updateAvailableLimit,
} = apiInvoicesSlice.actions

export const getInvoicesSelector = createSelector(
  [
    (state: AppState) => state.apiInvoices.invoiceStatusFilter,
    (state: AppState) => state.apiInvoices.invoices,
  ],
  (filter, invoices) => {
    const orderedInvoices = _.orderBy(
      invoices,
      (invoice) => invoice.createdAtIsoDate,
      'desc',
    )

    return {
      invoices,
      filteredInvoices:
        filter === 'ALL'
          ? orderedInvoices
          : orderedInvoices.filter((invoice) => invoice.status === filter),
      filter,
    }
  },
)

export const getIssuedProductSelector = (state: AppState) => ({
  issuedProduct: state.apiInvoices.invoiceFinancingIssuedProduct,
  kanmonInvoices: state.apiInvoices.kanmonInvoices,
  availableLimit: state.apiInvoices.availableLimitCents,
})

export default apiInvoicesSlice.reducer
