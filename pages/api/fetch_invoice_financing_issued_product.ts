import { KanmonPlatformApi } from '@kanmon/sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { extractApiKeyFromHeader } from '../../utils'

const fetchIssuedProduct = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const apiKey = extractApiKeyFromHeader(req.headers.authorization)
  if (!apiKey) {
    res.status(403).send(null)
    return
  }

  const kanmonUserId = req.query.userId?.toString()
  if (!kanmonUserId) {
    res.status(400).send({
      message: 'User ID is required',
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

  const { businessId } = await sdkClient.users.getUser({
    id: kanmonUserId as string,
  })

  const issuedProductsResponse =
    await sdkClient.issuedProducts.getAllIssuedProducts({
      businessIds: businessId,
    })

  const invoiceFinancingIssuedProducts =
    issuedProductsResponse.issuedProducts.filter(
      (ip) =>
        ip.servicingData.productType === 'INVOICE_FINANCING' ||
        ip.servicingData.productType === 'ACCOUNTS_PAYABLE_FINANCING',
    )

  res.json(invoiceFinancingIssuedProducts[0])
}

export default fetchIssuedProduct
