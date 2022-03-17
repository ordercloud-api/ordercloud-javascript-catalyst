# ordercloud-javascript-catalyst
Node JS starter middleware, extensions, and tools to get developers running with OrderCloud faster.

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. 

#### Usage
```js
import { useOCWebhookAuth } from 'ordercloud-javascript-catalyst';

router.post('api/checkout/shippingRates', 
  // useOCWebhookAuth is a middleware that executes before the route handler.
  // It verifies the request header "x-oc-hash" matches the provided hashKey.
  useOCWebhookAuth(shippingRatesHandler, process.env.OC_HASH_KEY)
);

async function shippingRatesHandler(req, res, next) {  

}
```
#### Full next.js example
[./examples/next-js//pages/api/checkout/ordercalculate.ts](./examples/next-js/pages/api/checkout/ordercalculate.ts)

#### Full express.js example 
[./examples/express-js/src/checkoutIntegrationRoutes.ts](./examples/express-js/src/checkoutIntegrationRoutes.ts)

## User Authentication
Use Ordercloud's authentication scheme in your own APIs.

Coming soon...
