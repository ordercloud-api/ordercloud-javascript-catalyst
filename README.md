# ordercloud-javascript-catalyst
Starter middleware, extensions, and tools for building APIs when working with OrderCloud.

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. [**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L10)  [**express.js** example](./examples/express-js/src/checkoutIntegrationRoutes.ts#L14)

#### Usage
```js
import { withOCWebhookAuth } from 'ordercloud-javascript-catalyst';

router.post('api/checkout/shippingRates', 
  // Verifies that the request header "x-oc-hash" is valid given a key of process.env.OC_WEBHOOK_HASH_KEY.
  withOCWebhookAuth(shippingRatesHandler)
);

router.post('api/webhooks/createaddress', 
  // Can also provide a raw string here. 
  withOCWebhookAuth(createAddressHandler, 'my-secret-hash-key')
);
```
## Error Repsonses
Standardize error response json to match ordercloud. [**next.js** example](./examples/next-js/helpers/ApiHander.ts#L16)  [**express.js** example](./examples/express-js/src/app.ts#L33)

#### Usage
```js
import { CatalystBaseError } from 'ordercloud-javascript-catalyst';

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



