// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OrderCalculateResponse } from 'ordercloud-javascript-sdk';
import { apiHandler } from '../../../helpers/api/apiHander';
import { useOCWebhookAuth } from '../../../lib/OCWebhookAuth';

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apiHandler({
    post: useOCWebhookAuth(OrderCalculate)
});

function OrderCalculate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  var orderCalculate: OrderCalculateResponse = {
    TaxTotal: 123.45
  }
  res.status(200).json(orderCalculate)
}

