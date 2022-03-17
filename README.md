# ordercloud-javascript-catalyst
Node JS starter middleware, extensions, and tools to get developers running with OrderCloud faster.

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. 

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

[See full express.js example](./express-js-example/src/checkoutIntegrationRoutes.ts)
[See full next.js example](./next-js-example/pages/api/checkout/ordercalculate.ts)

## User Authnetication
Use OrderCloud's user authnetication to protect routes in your own API.

Coming soon...
