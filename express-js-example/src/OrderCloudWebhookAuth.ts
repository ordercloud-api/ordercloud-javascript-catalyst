import { WebhookUnauthorizedError } from "./errors/CatalystErrors";
import crypto from 'crypto';

export function OrderCloudWebhookAuth(req, res) {
    // should match the "HashKey" property configured on the webhook object in OrderCloud. https://ordercloud.io/api-reference/seller/webhooks/create
    var hashKey = process.env.OC_HASH_KEY;
    var hashedMessage = req?.headers && req.headers["x-oc-hash"];
    var message = req.rawBody;

    if (!hashKey || !hashedMessage) {
        throw new WebhookUnauthorizedError();
    }

    var hashedMessageExpected = crypto
        .createHmac('sha256', hashKey)
        .update(message)
        .digest('base64');

    if (hashedMessage != hashedMessageExpected) {
        throw new WebhookUnauthorizedError();
    }
}