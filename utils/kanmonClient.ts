import axios from 'axios'
import {
  KanmonPlatformApi,
  CreateBusinessRequestBody,
  GetBusinessesResponse,
  Business as ApiBusiness,
  User,
  CreateUserRequestBody,
  CreateConnectTokenRequestBody,
  ConnectToken,
  Address,
  GetUsersResponse,
  GetUsersRequest,
} from '@kanmon/sdk'
import { ProductType, TestingPrequalType, UserRole } from '../types/MoreTypes'

const NEXT_PUBLIC_KANMON_API_HOST = process.env.NEXT_PUBLIC_KANMON_API_HOST
const NEXT_PUBLIC_DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV as
  | 'production'
  | 'sandbox'
  | 'staging'
  | 'development'

export interface ConnectTokenParams {
  userId?: string
  platformUserId?: string
}

export class PlatformApiBusinessCreateRequestPayload {
  platformBusinessId!: string | number
  name!: string
  address?: Address
  ein?: string
  phoneNumber?: string
  website?: string
}

export class PlatformApiBusinessResponsePayload extends PlatformApiBusinessCreateRequestPayload {
  id!: string
  createdAt!: string
  updatedAt!: string
}

export class PlatformApiGetBusinessesResponsePayload {
  businesses!: PlatformApiBusinessResponsePayload[]
}

export class PlatformApiUserCreateForPlatformDTO {
  platformUserId!: string | number
  platformBusinessId?: string
  businessId?: string
  email!: string
  firstName?: string
  lastName?: string
  address?: Address
  roles?: UserRole[]
}

export class PlatformApiUserResponsePayload extends PlatformApiUserCreateForPlatformDTO {
  id!: string
  createdAt!: string
  updatedAt!: string
}

export class Platform {
  id!: string
  displayName!: string
  createdAt!: string
  updatedAt!: string
}

export class Offer {
  id!: string
}

export class Business {
  id!: string
}

type KanmonConnectToken = string

export interface KanmonConnectPayload {
  connectToken: KanmonConnectToken
  expiration: Date
  step: string
  userId: string
}

export interface KanmonConnectError {
  errorCode: string
  timestamp: Date
}

export interface APIError {
  errorCode: string
  timestamp: Date
  message: string
}

export class TestingControllerCreatePrequalificationBody {
  platformBusinessId!: string

  productType!: ProductType

  prequalType!: TestingPrequalType
}

export class BusinessIdParams {
  businessId!: string
}

export interface PlatformDetails {
  id: string
  enabledProducts?: ProductType[]
}

export interface OfferDetails {
  id: string
  loanApplicationId: string
}

export class KanmonClient {
  apiKey: string
  // Use the Kanmon Platform API sdk where possible
  sdkClient: KanmonPlatformApi

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.sdkClient = new KanmonPlatformApi(apiKey, NEXT_PUBLIC_DEPLOY_ENV)
  }

  private getApiHeader() {
    return {
      Authorization: `ApiKey ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  connect = async (
    params: CreateConnectTokenRequestBody,
  ): Promise<ConnectToken> => {
    return this.sdkClient.connectTokens.connectToken({
      createConnectTokenRequestBody: params,
    })
  }

  getBusinesses = async (
    platformBusinessId?: string,
  ): Promise<GetBusinessesResponse> => {
    return this.sdkClient.businesses.getBusinesses({
      platformBusinessIds: platformBusinessId,
    })
  }

  createBusiness = async (
    business: CreateBusinessRequestBody,
  ): Promise<ApiBusiness> => {
    return this.sdkClient.businesses.createBusiness({
      createBusinessRequestBody: business,
    })
  }

  getUsers = async (args?: GetUsersRequest): Promise<GetUsersResponse> => {
    return this.sdkClient.users.getUsers(args)
  }

  createUserForBusiness = async (
    user: CreateUserRequestBody,
  ): Promise<User> => {
    return this.sdkClient.users.createUser({ createUserRequestBody: user })
  }

  // This is a test only endpoint used to simulate the creation of a prequalification
  // for a business. This is used for testing purposes only.
  // Does not function in production as prequalifications are created separately by the
  // Kanmon team.
  TEST_ONLY_CreateTestingPrequalification = async (
    platformBusinessId: string,
    prequalifyForProduct: ProductType,
    prequalType: TestingPrequalType,
  ) => {
    const headers = this.getApiHeader()

    const body: TestingControllerCreatePrequalificationBody = {
      platformBusinessId,
      productType: prequalifyForProduct,
      prequalType,
    }

    const response = await axios.post(
      `${NEXT_PUBLIC_KANMON_API_HOST}/v1/testing/prequalifications`,
      body,
      {
        headers,
      },
    )
    return response.data
  }

  TEST_ONLY_GetPlatformForAuthenticatedUser =
    async (): Promise<PlatformDetails | null> => {
      const headers = this.getApiHeader()

      const response = await axios.get(
        `${NEXT_PUBLIC_KANMON_API_HOST}/v1/testing/platforms`,
        {
          headers,
        },
      )

      return response.data
    }

  TEST_ONLY_GetOffer = async (offerId: string): Promise<OfferDetails> => {
    const headers = this.getApiHeader()

    const response = await axios.get(
      `${NEXT_PUBLIC_KANMON_API_HOST}/v1/testing/offers/${offerId}`,
      {
        headers,
      },
    )

    return response.data
  }
}
