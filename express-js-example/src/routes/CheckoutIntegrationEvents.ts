import express from 'express';
import { OrderCalculateResponse, OrderSubmitResponse, ShipEstimateResponse,  } from 'ordercloud-javascript-sdk';
import { useOCWebhookAuth } from 'ordercloud-javascript-catalyst';
import { OrderCalculatePayload, MyCheckoutConfig } from '../types/OrderCalculatePayload';
import { RequestBody } from '../types/RequestBody';

var router = express.Router();

router.post('/shippingRates', useOCWebhookAuth(ShippingRatesHandler, process.env.OC_HASH_KEY));
router.post('/ordercalculate', useOCWebhookAuth(OrderCalculateHandler, process.env.OC_HASH_KEY));
router.post('/ordersubmit', useOCWebhookAuth(OrderSubmitHandler, process.env.OC_HASH_KEY));

export default router;
 
function ShippingRatesHandler(
  req: RequestBody<OrderCalculatePayload<MyCheckoutConfig>>, 
  res, 
  next
) {
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

async function OrderCalculateHandler(
  req: RequestBody<OrderCalculatePayload<MyCheckoutConfig>>, 
  res, 
  next
) {
  var orderCalculate: OrderCalculateResponse = {
    TaxTotal: 123.45
  }
  res.status(200).json(orderCalculate);
}

async function OrderSubmitHandler(
  req: RequestBody<OrderCalculatePayload<MyCheckoutConfig>>, 
  res, 
  next
) {
  var orderSubmit: OrderSubmitResponse = {};
  res.status(200).json(orderSubmit);
}
