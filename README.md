# ordercloud-javascript-catalyst
Starter middleware, extensions, and tools for building APIs when working with OrderCloud.

## Installation
```
npm install @ordercloud/catalyst
```

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. [**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L10)  [**express.js** example](./examples/express-js/src/checkoutIntegrationRoutes.ts#L14)

```js
import { withOCWebhookAuth } from '@ordercloud/catalyst';

router.post('api/checkout/shippingRates', 
  // Verifies that the request header "x-oc-hash" is valid given a key of process.env.OC_WEBHOOK_HASH_KEY.
  withOCWebhookAuth(shippingRatesHandler)
);

router.post('api/webhooks/shippingRates', 
  // Can also provide a raw string here. 
  withOCWebhookAuth(shippingRatesHandler, 'my-secret-hash-key')
);

function shippingRatesHandler(req, res, next) { }
```
## Error Responses
Standardize error response json to match ordercloud. 

First, install the API handler. Implementation varies based on framework:
* In Next.js - [wrap your handler logic](https://github.com/ordercloud-api/ordercloud-javascript-catalyst/blob/main/examples/next-js/pages/api/checkout/ordercalculate.ts#L7) with our higher level function
* In Express - [add our middleware](https://github.com/ordercloud-api/ordercloud-javascript-catalyst/blob/main/examples/express-js/src/app.ts#L33)

Then, in your endpoint you can throw the `CatalystBaseError` error:
```js
if (!acceptedCardTypes.includes(type)) {
  throw new CatalystBaseError("CardTypeNotAccepted", `This merchant does not accept ${type} type credit cards`, 400);
}
```

Or, extend the base error to make it even easier to use. This is useful for common errors:
```js
import { CatalystBaseError } from '@ordercloud/catalyst';

export class CardTypeNotAcceptedError extends CatalystBaseError {
    constructor(type: string) {
        super("CardTypeNotAccepted", `This merchant does not accept ${type} type credit cards`, 400)
    }
}

if (!acceptedCardTypes.includes(type)) {
  throw new CardTypeNotAcceptedError(type);
}
```



