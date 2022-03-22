import { withOCWebhookAuth, OrderCalculatePayload } from '@ordercloud/catalyst';
import type { NextApiRequest, NextApiResponse } from 'next'
import { OrderCalculateResponse } from 'ordercloud-javascript-sdk';
import { apiHandler, NextApiRequestTyped } from '../../../helpers/ApiHander';

// apiHandler verifies the http method and provides global error handling.
export default apiHandler({
  // withOCWebhookAuth is a middleware that executes before the route handler.
  // It verifies the request header "x-oc-hash" matches the provided hashKey.
  post: withOCWebhookAuth(orderCalculateHandler, process.env.OC_WEBHOOK_HASH_KEY)
});

// Exporting this config allows access the raw, unparsed http body, which is needed for hash validation.
// withOCWebhookAuth will populate req.body with the parsed body object so it can be used in the route handler.
export const config = {
  api: {
    bodyParser: false,
  },
}

// Route handler
function orderCalculateHandler(
  req: NextApiRequestTyped<OrderCalculatePayload>, 
  res: NextApiResponse<OrderCalculateResponse>
): void | Promise<void> {
  // Put your custom order calculate logic here.
  res.status(200).json({ TaxTotal: 123.45 })
}


