# ordercloud-javascript-catalyst
Starter middleware, extensions, and tools for building APIs when working with OrderCloud.

## Installation
```
npm i @ordercloud/catalyst
```

## Webhook Verification
Protect your webhook routes by blocking requests that are not from OrderCloud. 

[**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L10)  

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

function shippingRatesHandler(req, res, next) { }
```

## User Verification

Protect your API routes by using OrderCloud's user authentication - require an OrderCloud token with correct permissions. 

[**next.js** example](./examples/next-js/pages/api/user.ts#L14)  

[**express.js** example](./examples/express-js/src/getUser.ts#L10)

#### Usage 

```js
import { withOCUserAuth, FullDecodedToken } from '@ordercloud/catalyst';

router.post('api/checkout/payment',
  // Verifies the request contains an active OrderCloud bearer token with the "Shopper" role and user type "Buyer".
  withOcUserAuth(createPaymentHandler, ["Shopper"], ["Buyer"])
)

function createPaymentHandler(req, res, next) { 
  // req.ocToken property has been added by withOcUserAuth.
  var token: FullDecodedToken = req.ocToken;
  ...
}

// The permissions parameters are optional. This will give access to any active OC token. Not recommended for most routes.
router.get('api/me', withOcUserAuth(getMeHandler));
```

## Error Handling
Create custom errors that will result in JSON responses matching OrderCloud's format. 

[**next.js** example](./examples/next-js/pages/api/checkout/ordercalculate.ts#L8)  

[**express.js** example](./examples/express-js/src/app.ts#L33)

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



