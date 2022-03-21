# ordercloud-javascript-catalyst
Node JS starter middleware, extensions, and tools to get developers running with OrderCloud faster.

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. [**next.js example**](./examples/next-js/pages/api/checkout/ordercalculate.ts). [**express.js example**](./examples/express-js/src/checkoutIntegrationRoutes.ts)

#### Usage
```js
import { withOCWebhookAuth } from 'ordercloud-javascript-catalyst';

router.post('api/checkout/shippingRates', 
  // withOCWebhookAuth is a middleware that executes before the route handler.
  // It verifies the request header "x-oc-hash" matches the provided hashKey.
  withOCWebhookAuth(shippingRatesHandler, process.env.OC_HASH_KEY)
);


