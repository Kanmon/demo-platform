import { NextApiRequest, NextApiResponse } from 'next'
import { KanmonClient } from '../../utils/kanmonClient'
import { extractApiKeyFromHeader } from '../../utils/extractApiKeyFromHeader'

const create_connect_token_v2 = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  // TODO: this is kind of ugly, because any key in res.query can have a
  // value of `string | string[]`, but this needs `string`
  const kanmonUserId = req.query.userId?.toString()
  if (!kanmonUserId) {
    res.status(400).send({
      message: 'Please Provide UserId for Connect token',
      errorCode: 'BadRequestException',
    })
    return
  }

  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const client = new KanmonClient(apiKey)

  try {
    const response = await client.connect({
      userId: kanmonUserId,
    })

    const connectPayload = {
      connectToken: response.connectToken,
      userId: kanmonUserId,
    }

    res.json(connectPayload)

    return
  } catch (ex: any) {
    const errorBody = await ex.response.json()

    if (['NotFoundException'].includes(errorBody.errorCode)) {
      res.status(400).send({
        message: 'Business is not found or enabled',
        errorCode: errorBody.errorCode,
      })
      return
    }

    if (['BadRequestException'].includes(errorBody.errorCode)) {
      res.status(400).send(errorBody)
      return
    }
  }
}

export default create_connect_token_v2
