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

  try {
    const styleConfig = await client.getStyleConfigurations()
    res.status(200).json(styleConfig)
  } catch {
    // Platform may not have style configurations — return 404 gracefully
    res.status(404).send(null)
  }
}

export default fetchStyleConfigurations
