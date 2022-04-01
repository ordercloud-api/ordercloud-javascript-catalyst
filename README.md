# ordercloud-javascript-catalyst
Starter middleware, extensions, and tools for building APIs when working with OrderCloud.

:warning: This library should be considered in a beta version. Its feature set is complete, but is still in need of community feedback.

## Installation
```
npm i @ordercloud/catalyst
```

## Webhook Verification
Protect your webhook API routes by blocking requests that are not from OrderCloud. 

[**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L8)  

[**express.js** example](./examples/express-js/src/checkoutIntegrationRoutes.ts#L14)

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

## User Verification

Protect your API routes by using OrderCloud's user authentication - require an OrderCloud token with correct permissions. 

[**next.js** example](./examples/next-js/pages/api/user.ts#L14)  

[**express.js** example](./examples/express-js/src/GetUser.ts#L10)

#### Usage 

```js
import { withOcUserAuth, FullDecodedToken } from '@ordercloud/catalyst';

router.post('api/checkout/payment',
  // Verifies the request has an active OrderCloud bearer token with the "Shopper" role, the user type "Buyer"
  // and an api client ID of "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  withOcUserAuth(createPaymentHandler, ["Shopper"], ["Buyer"], ["xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"])
)

// Permission parameters are optional. A token with any roles and user type can access this. 
// However, process.env.OC_API_CLIENTS_WITH_ACCESS must be defined (comma-separated). 
router.post('api/checkout/payment', withOcUserAuth(createPaymentHandler)) 

// Same as above except the "*" character gives access to any client ID. 
// This can be a serious security hole, so only use if you understand the consequences. 
router.post('api/checkout/payment', withOcUserAuth(createPaymentHandler, [], [], ["*"])) 

function createPaymentHandler(req, res, next) { 
  // req.ocToken property has been added by withOcUserAuth.
  var token: FullDecodedToken = req.ocToken;
  ...
}
```

## Error Handling
Create custom errors that will result in JSON responses matching OrderCloud's format. 

[**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L8)  

[**express.js** example](./examples/express-js/src/app.ts#L40)

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



