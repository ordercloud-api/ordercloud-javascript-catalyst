import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import { OrderCalculatePayload, useOCWebhookAuth } from "ordercloud-javascript-catalyst";
import { ShipEstimateResponse } from "ordercloud-javascript-sdk";
import { apiHandler, NextApiRequestTyped } from "../../../helpers/ApiHander"

// apiHandler verifies the http method and provides global error handling.
export default apiHandler({
  // useOCWebhookAuth is a middleware that executes before the route handler.
  // It verifies the request header "x-oc-hash" matches the provided hashKey.
  post: useOCWebhookAuth(shippingRatesHandler, process.env.OC_HASH_KEY)
});

// Exporting this config allows access the raw, unparsed http body, which is needed for hash validation.
// useOCWebhookAuth will populate req.body with the parsed body object so it can be used in the route handler.
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
