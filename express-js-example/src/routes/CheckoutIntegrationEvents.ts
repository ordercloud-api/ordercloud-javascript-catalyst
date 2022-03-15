import express from 'express';
import { OrderCalculateResponse, OrderSubmitResponse, ShipEstimateResponse } from 'ordercloud-javascript-sdk';
import { OrderCloudWebhookAuth } from '../OrderCloudWebhookAuth';
import { OrderCalculatePayload, MyCheckoutConfig } from '../types/OrderCalculatePayload';
import { RequestBody } from '../types/RequestBody';

var router = express.Router();

router.post('/shippingrates', function(
  req: RequestBody<OrderCalculatePayload<MyCheckoutConfig>>, 
  res, 
  next
) {
  OrderCloudWebhookAuth(req);
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
});

router.post('/ordercalculate', function(
  req: RequestBody<OrderCalculatePayload<MyCheckoutConfig>>, 
  res, 
  next
) {
  OrderCloudWebhookAuth(req);
  var orderCalculate: OrderCalculateResponse = {
    TaxTotal: 123.45
  }
  res.status(200).json(orderCalculate);
});

router.post('/ordersubmit', function(
  req: RequestBody<OrderCalculatePayload<MyCheckoutConfig>>, 
  res, 
  next
) {
  OrderCloudWebhookAuth(req);
  var orderSubmit: OrderSubmitResponse = {};
  res.status(200).json(orderSubmit);
});

export default router;
