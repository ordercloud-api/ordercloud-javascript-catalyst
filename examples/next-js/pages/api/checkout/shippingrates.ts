import { NextApiResponse } from "next"
import { OrderCalculatePayload, withOcErrorHandler, withOcWebhookAuth } from "@ordercloud/catalyst";
import { ShipEstimateResponse } from "ordercloud-javascript-sdk";
import { NextApiRequestTyped } from "../../../Types/NextApiRequestTyped";

export default 
  // withOcErrorHandler catches thrown errors and formats them matching OrderCloud.
  withOcErrorHandler(
    // Verfies the header "x-oc-hash" matches the provided hashKey
    withOcWebhookAuth(
      shippingRatesHandler, process.env.OC_WEBHOOK_HASH_KEY
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
function shippingRatesHandler(
  req: NextApiRequestTyped<OrderCalculatePayload>, 
  res: NextApiResponse<ShipEstimateResponse>
): void | Promise<void> {
  // Put your custom shipping rates logic here.
  var shipEstimates: ShipEstimateResponse = {
    ShipEstimates: [
      {
        ShipMethods: [
          {
            ID: "abcd-efgh-ijkl-mnop",
            Name: "Fedex 2 Day Priority",
            Cost: 12.34,
            EstimatedTransitDays: 2,
            xp: {
              Carrier: "Fedex"
            }
          }
        ]
      }
    ]
  }
  res.status(200).json(shipEstimates);
}
