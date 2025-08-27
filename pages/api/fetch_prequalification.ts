import { KanmonPlatformApi } from '@kanmon/sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { extractApiKeyFromHeader } from '../../utils'

const fetchPrequalification = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const platformBusinessId = req.query.platformBusinessId?.toString()
  if (!platformBusinessId) {
    res.status(400).send({
      message: 'Business ID is required',
      errorCode: 'BadRequestException',
    })
    return
  }

  const NEXT_PUBLIC_DEPLOY_ENV = process.env.NEXT_PUBLIC_DEPLOY_ENV as
    | 'production'
    | 'sandbox'
    | 'staging'
    | 'development'

  const sdkClient = new KanmonPlatformApi(apiKey, NEXT_PUBLIC_DEPLOY_ENV)

  const prequalificationResponse =
    await sdkClient.prequalifications.getAllPrequalifiedBusinesses({
      platformBusinessIds: platformBusinessId,
    })

  res.json(prequalificationResponse.prequalifications)
}

export default fetchPrequalification
