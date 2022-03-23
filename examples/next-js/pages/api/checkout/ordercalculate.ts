import { OrderCalculatePayload, withOcErrorHandler, withOcWebhookAuth } from '@ordercloud/catalyst';
import type { NextApiResponse } from 'next'
import { OrderCalculateResponse } from 'ordercloud-javascript-sdk';
import { NextApiRequestTyped } from '../../../Types/NextApiRequestTyped';

export default 
  // withOcErrorHandler catches thrown errors and formats them matching OrderCloud.
  withOcErrorHandler(
    // withOCWebhookAuth verfies the header "x-oc-hash" matches the hashKey
    withOcWebhookAuth(
      orderCalculateHandler, process.env.OC_WEBHOOK_HASH_KEY
    )
  );

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


