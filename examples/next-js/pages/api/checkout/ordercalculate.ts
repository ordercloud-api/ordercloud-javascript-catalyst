import { OrderCalculatePayload, withErrorHandledOcWebhookAuth } from '@ordercloud/catalyst';
import type { NextApiResponse } from 'next'
import { OrderCalculateResponse } from 'ordercloud-javascript-sdk';
import { NextApiRequestTyped } from '../../../Types/NextApiRequestTyped';

// Verfies the header "x-oc-hash" matches the provided hashKey
// use withOcWebhookAuth() if you want to catch errors yourself. See shippingrates.ts.
export default withErrorHandledOcWebhookAuth(
  orderCalculateHandler, process.env.OC_WEBHOOK_HASH_KEY
);

// Exporting this config allows access the raw, unparsed http body, which is needed for hash validation.
// withOCWebhookAuth() will populate req.body with the parsed body object so it can be used in the route handler.
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


