import { WebhookUnauthorizedError } from "./errors/CatalystErrors";
import CryptoJS from 'crypto-js';

export function OrderCloudWebhookAuth(req, res) {
    // should match the "HashKey" property configured on the webhook object in OrderCloud. https://ordercloud.io/api-reference/seller/webhooks/create
    var hashKey = process.env.OC_HASH_KEY;
    var hashedMessage = req?.headers && req.headers["x-oc-hash"];
    var message = req.rawBody;

    if (!hashKey || !hashedMessage) {
        throw new WebhookUnauthorizedError();
    }

    var sha256 = CryptoJS.HmacSHA256(message, hashKey);
    var hashedMessageExpected = CryptoJS.enc.Base64.stringify(sha256);

    if (hashedMessage != hashedMessageExpected) {
        throw new WebhookUnauthorizedError();
    }
}