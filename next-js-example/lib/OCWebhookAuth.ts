import CryptoJS from 'crypto-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { WebhookUnauthorizedError } from './CatalystErrors'
import getRawBody from 'raw-body';

// Defined globaly by the OrderCloud platform
const hashHeader = 'x-oc-hash';

export function useOCWebhookAuth(routeHandler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>, hashKey?: string): any {
  return async function(req: NextApiRequest, res: NextApiResponse) {
    var isValid = await isOCHashValid(req, hashKey);
    if (isValid) {
      routeHandler(req, res);
    } else {
      throw new WebhookUnauthorizedError();
    } 
  }
}

export async function isOCHashValid(req: NextApiRequest, hashKey: string | undefined): Promise<boolean> {
  let buffer = await getRawBody(req);
  let rawBody = buffer.toString();
  const sent = Array.isArray(req.headers[hashHeader])
    ? req.headers[hashHeader][0]
    : req.headers[hashHeader]


  if (!hashKey || !sent) {
    return false;
  }

  var sha256 = CryptoJS.HmacSHA256(rawBody, hashKey);
  var hash = CryptoJS.enc.Base64.stringify(sha256);
  
  return hash === sent;
}
