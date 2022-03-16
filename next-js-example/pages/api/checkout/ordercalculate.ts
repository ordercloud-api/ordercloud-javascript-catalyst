// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { useOCWebhookAuth } from 'ordercloud-javascript-catalyst';
import { OrderCalculateResponse } from 'ordercloud-javascript-sdk';
import { apiHandler } from '../../../helpers/api/ApiHander';

export const config = {
  api: {
    bodyParser: false,
  },
}

const orderCalculateHandler: NextApiHandler = (req, res) => {
  
  var orderCalculate: OrderCalculateResponse = {
    TaxTotal: 123.45
  }
  res.status(200).json(orderCalculate)
}

export default apiHandler({
  post: useOCWebhookAuth(orderCalculateHandler, process.env.OC_HASH_KEY)
});


