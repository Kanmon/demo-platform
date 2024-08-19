import { KanmonClient } from '@/utils/kanmonClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { extractApiKeyFromHeader } from '../../utils'

export enum TestApiKeyErrorCode {
  'INVALID_API_KEY' = 'INVALID_API_KEY',
  'UNEXPECTED_ERROR' = 'UNEXPECTED_ERROR',
}

export interface TestApiKeyErrorResponse {
  errorCode: TestApiKeyErrorCode
}

const fetchIssuedProducts = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const client = new KanmonClient(apiKey)

  try {
    // This is an arbitrary request
    await client.getUsers({ limit: 1 })
    res.status(200).send('ok')
  } catch (ex: any) {
    const response = await ex.response.json()

    const errorResponse: TestApiKeyErrorResponse = {
      errorCode:
        response.errorCode === 'ForbiddenException'
          ? TestApiKeyErrorCode.INVALID_API_KEY
          : TestApiKeyErrorCode.UNEXPECTED_ERROR,
    }

    res.status(ex.response.status).send(errorResponse)
    return
  }
}

export default fetchIssuedProducts
