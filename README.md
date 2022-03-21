# ordercloud-javascript-catalyst
Node JS starter middleware, extensions, and tools to get developers running with OrderCloud faster.

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. [**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts)  [**express.js** example](./examples/express-js/src/checkoutIntegrationRoutes.ts)

#### Usage
```js
import { withOCWebhookAuth } from 'ordercloud-javascript-catalyst';

router.post('api/checkout/shippingRates', 
  // withOCWebhookAuth is a middleware that executes before the route handler.
  // It verifies the request header "x-oc-hash" matches the provided hashKey.
  withOCWebhookAuth(shippingRatesHandler, process.env.OC_HASH_KEY)
);
```
## Error Repsonses
Standardize error response json to match ordercloud. [**next.js** example](./examples/next-js/helpers/ApiHander.ts#L16)  [**express.js** example](./examples/express-js/src/app.ts#L33)

#### Usage
```js
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



