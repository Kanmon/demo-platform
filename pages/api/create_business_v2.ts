import {
  Business,
  AddressStateEnum,
  CreateUserRequestBodyRolesEnum,
} from '@kanmon/sdk'
import axios from 'axios'
import { plainToClass } from 'class-transformer'
import { NextApiRequest, NextApiResponse } from 'next'
import { v4 } from 'uuid'

import { KanmonClient } from '../../utils/kanmonClient'
import {
  CreateBusinessAndUserRequestBody,
  TestingPrequalType,
} from '../../types/MoreTypes'
import { extractApiKeyFromHeader } from '../../utils'

const create_business_v2 = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const payload = plainToClass(CreateBusinessAndUserRequestBody, req.body)

  const client = new KanmonClient(apiKey)

  if (
    payload.prequalifyForProduct &&
    payload.prequalType === TestingPrequalType.ANON
  ) {
    try {
      await client.TEST_ONLY_CreateTestingPrequalification(
        payload.platformBusinessId,
        payload.prequalifyForProduct,
        payload.prequalType,
      )
      res.status(200).json({ message: 'Success!' })
    } catch (ex) {
      console.error(ex)
      res.status(500).json({
        message: 'Failed to create anon test prequalification',
      })
    }
    return
  }

  const existingBusiness = await client.getBusinesses(
    payload.platformBusinessId,
  )

  let business: Business
  if (existingBusiness.businesses.length > 0) {
    business = existingBusiness.businesses[0]
    console.log(
      `Found existing business with platformBusinessId ${payload.platformBusinessId}`,
    )
  } else {
    try {
      const createBusinessResponse = await client.createBusiness({
        platformBusinessId: payload.platformBusinessId,
        address: {
          addressLineOne: '120 Sigma Dr',
          city: 'Garner',
          state: AddressStateEnum.Nc,
          zipcode: '27529',
          country: 'USA',
        },
        name: `Sigma Electric Manufacturing Corp-${v4().slice(0, 12)}`,
        phoneNumber: '14152223333',
        ein: '123456789',
        website: 'https://www.my-business.com',
      })

      business = createBusinessResponse
    } catch (ex: any) {
      const errorStatus = ex.response.status
      const errorBody = await ex.response.json()

      res.status(errorStatus).json(errorBody)
      return
    }
  }

  try {
    const createUserResponse = await client.createUserForBusiness({
      platformUserId: v4(),
      businessId: business.id,
      email: payload.email,
      firstName: 'Billy',
      lastName: 'Ballard',
      address: {
        addressLineOne: '531 Silver Fox CT',
        city: 'Indianapolis',
        state: AddressStateEnum.In,
        zipcode: '46217',
        country: 'USA',
      },
      roles: payload.userRoles as unknown as CreateUserRequestBodyRolesEnum[],
    })

    if (payload.prequalifyForProduct) {
      try {
        await client.TEST_ONLY_CreateTestingPrequalification(
          payload.platformBusinessId,
          payload.prequalifyForProduct,
          payload.prequalType,
        )
      } catch (ex) {
        console.error(ex)
        res.status(500).json({
          message: 'Failed to create standard test prequalification',
        })
      }
    }

    res.json(createUserResponse)
  } catch (ex: any) {
    const errorStatus = ex.response.status
    const errorBody = await ex.response.json()

    res.status(errorStatus).json(errorBody)
    return
  }
}

export default create_business_v2
