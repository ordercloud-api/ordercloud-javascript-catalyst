# ordercloud-javascript-catalyst
Node JS starter middleware, extensions, and tools to get developers running with OrderCloud faster.

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. 

#### Usage
```js
import { useOCWebhookAuth } from 'ordercloud-javascript-catalyst';

router.post('/shippingRates', 
  // useOCWebhookAuth is a middleware that executes before the route handler.
  // It verifies the request header "x-oc-hash" matches the provided hashKey.
  useOCWebhookAuth(shippingRatesHandler, process.env.OC_HASH_KEY)
);

async function shippingRatesHandler(req, res, next) {  

}
```
#### next.js example
[./next-js-example/pages/api/checkout/ordercalculate.ts](./next-js-example/pages/api/checkout/ordercalculate.ts)

#### express.js example 
[./express-js-example/src/checkoutIntegrationRoutes.ts](./express-js-example/src/checkoutIntegrationRoutes.ts)


## User Authnetication
Use OrderCloud's user authnetication to protect routes in your own API.

Coming soon...
