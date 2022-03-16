import CryptoJS from 'crypto-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookUnauthorizedError } from './CatalystErrors';

// Defined globaly by the OrderCloud platform
const hashHeader = "x-oc-hash";

export function useOCWebhookAuth(next: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>, hashKey: string | undefined) {
    return async function(req: NextApiRequest, res: NextApiResponse) { 
        addRawBody(req);
        if (isOCHashValid(req)) {
            next(req, res);
        } else {
            throw new WebhookUnauthorizedError();
        }
    }
}

function isOCHashValid(req): boolean {
    var hashedMessage = req?.headers && req.headers[hashHeader];
    var message = req.body;

    if (!hashKey || !hashedMessage) {
        return false;
    }

    var sha256 = CryptoJS.HmacSHA256(message, hashKey);
    var hashedMessageExpected = CryptoJS.enc.Base64.stringify(sha256);

    return hashedMessage == hashedMessageExpected;
}

function addRawBody(req): void {
    let buf = ''
    req.setEncoding('utf8')
    req.on('data', (chunk) => {
        buf += chunk
    })
    req.on('end', () => {
        req.rawBody = buf
        req.body = JSON.parse(Buffer.from(req.rawBody).toString())
    })
}