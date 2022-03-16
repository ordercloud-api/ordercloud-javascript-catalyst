import { WebhookUnauthorizedError, isOCHashValid } from 'ordercloud-javascript-catalyst';

export async function OrderCloudWebhookAuth(req, res, next, hashKey: string | undefined) {
    if (!(await isOCHashValid(req, hashKey))) {
        next(new WebhookUnauthorizedError());
    }
}