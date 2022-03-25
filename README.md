# ordercloud-javascript-catalyst
Starter middleware, extensions, and tools for building APIs when working with OrderCloud.

## Installation
```
npm i @ordercloud/catalyst
```

## Webhook Verification
Protect your webhook API routes by blocking requests that are not from OrderCloud. [**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L10)  [**express.js** example](./examples/express-js/src/checkoutIntegrationRoutes.ts#L14)

#### Usage

```js
import { withOcWebhookAuth } from '@ordercloud/catalyst';

router.post('api/checkout/shippingRates', 
  // Verifies that the request header "x-oc-hash" is valid given the secret key.
  withOcWebhookAuth(shippingRatesHandler, 'my-secret-hash-key')
);

router.post('api/webhooks/shippingRates', 
  // If a hashKey parameter is not included, it defaults to process.env.OC_WEBHOOK_HASH_KEY. 
  withOcWebhookAuth(shippingRatesHandler)
);

function shippingRatesHandler(req, res, next) { ... }
```

## Error Handling
Create custom errors that will result in JSON responses matching OrderCloud's format. [**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L8)  [**express.js** example](./examples/express-js/src/app.ts#L33)

#### Usage

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



