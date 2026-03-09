import { KanmonClient } from '@/utils/kanmonClient'
import { NextApiRequest, NextApiResponse } from 'next'
import { extractApiKeyFromHeader } from '../../utils'

const fetchStyleConfigurations = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const client = new KanmonClient(apiKey)

  const styleConfig = await client.TEST_ONLY_GetStyleConfigurations()
  res.status(200).json(styleConfig)
}

export default fetchStyleConfigurations
