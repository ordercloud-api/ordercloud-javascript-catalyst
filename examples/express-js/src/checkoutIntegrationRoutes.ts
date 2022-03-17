import express from 'express';
import { OrderCalculateResponse, OrderSubmitResponse, ShipEstimateResponse,  } from 'ordercloud-javascript-sdk';
import { useOCWebhookAuth, OrderCalculatePayload } from 'ordercloud-javascript-catalyst';

export interface RequestBody<T> extends Express.Request {
  body: T
}

var router = express.Router();

router.post('/shippingRates', 
  // useOCWebhookAuth is a middleware that executes before the route handler.
  // It verifies the request header "x-oc-hash" matches the provided hashKey.
  useOCWebhookAuth(shippingRatesHandler, process.env.OC_HASH_KEY)
);
router.post('/ordercalculate', 
  useOCWebhookAuth(orderCalculateHandler, process.env.OC_HASH_KEY)
);
router.post('/ordersubmit', 
  useOCWebhookAuth(orderSubmitHandler, process.env.OC_HASH_KEY)
);

export default router;

// route handler
function shippingRatesHandler(
  req: RequestBody<OrderCalculatePayload>, 
  res : express.Response<ShipEstimateResponse>, 
  next
) {
  // Put custom shipping rates logic here
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

// route handler
async function orderCalculateHandler(
  req: RequestBody<OrderCalculatePayload>, 
  res : express.Response<OrderCalculateResponse>, 
  next
) {
  // Put custom order calculate logic here
  var orderCalculate: OrderCalculateResponse = {
    TaxTotal: 123.45
  }
  res.status(200).json(orderCalculate);
}

// route handler
async function orderSubmitHandler(
  req: RequestBody<OrderCalculatePayload>, 
  res : express.Response<OrderSubmitResponse>, 
  next
) {
  // Put custom post-submit logic here
  res.status(200).json({ });
}
