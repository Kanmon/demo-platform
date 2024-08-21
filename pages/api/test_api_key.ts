import { KanmonClient } from '@/utils/kanmonClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { extractApiKeyFromHeader } from '../../utils'
import { ResponseWithErrorCode } from '@/types/MoreTypes'

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
    // This is an arbitrary request to test the api key
    await client.getUsers({ limit: 1 })
    res.status(200).send('ok')
  } catch (ex: any) {
    const response = await ex?.response?.json()

    const errorResponse: ResponseWithErrorCode = {
      errorCode: response?.errorCode ?? 'UNEXPECTED_ERROR',
    }

    res.status(ex.response.status).send(errorResponse)
    return
  }
}

export default fetchIssuedProducts
