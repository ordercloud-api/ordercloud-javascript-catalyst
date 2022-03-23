# ordercloud-javascript-catalyst
Starter middleware, extensions, and tools for building APIs when working with OrderCloud.

## Installation
```
npm i @ordercloud/catalyst
```

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. [**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L10)  [**express.js** example](./examples/express-js/src/checkoutIntegrationRoutes.ts#L14)

```js
import { withOCWebhookAuth } from '@ordercloud/catalyst';

router.post('api/checkout/shippingRates', 
  // Verifies that the request header "x-oc-hash" is valid given the secret key.
  withOCWebhookAuth(shippingRatesHandler, 'my-secret-hash-key')
);

router.post('api/webhooks/shippingRates', 
  // Key parameter is optional and defaults to process.env.OC_WEBHOOK_HASH_KEY. 
  withOCWebhookAuth(shippingRatesHandler, )
);

function shippingRatesHandler(req, res, next) { }
```
## Error Repsonses
Standardize error response json to match ordercloud. [**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts/ts#L8)  [**express.js** example](./examples/express-js/src/app.ts#L33)

```js
import { CatalystBaseError } from '@ordercloud/catalyst';

export class CardTypeNotAcceptedError extends CatalystBaseError {
    constructor(type: string) {
        super("CardTypeNotAccepted", `This merchant does not accept ${type} type credit cards`, 400)
    }
}
...

if (!acceptedCardTypes.includes(type)) {
  throw new CardTypeNotAcceptedError(type);
}
```



