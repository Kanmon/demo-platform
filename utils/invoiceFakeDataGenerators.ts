import { faker } from '@faker-js/faker'
import _ from 'lodash'
import { Address, AddressStateEnum } from '@kanmon/sdk'
import {
  PlatformInvoiceStatus,
} from '../types/DemoInvoicesTypes'

export const getNewInvoiceNumber = () => `#${_.random(1000000, 9999999)}`

export const getRandomInvoiceAmountCents = () => _.random(100, 10000) * 100

export const getRandomInvoiceStatus = () => {
  const statuses = Object.values(PlatformInvoiceStatus)
  return statuses[_.random(statuses.length - 1)]
}

export const getFakeAddress = (): Address => {
  const state = faker.location.state({ abbreviated: true })

  return {
    addressLineOne: faker.location.streetAddress(),
    addressLineTwo: faker.location.secondaryAddress(),
    city: faker.location.city(),
    state: state as AddressStateEnum,
    country: 'USA',
    zipcode: faker.location.zipCode('#####'),
  }
}
