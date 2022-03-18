var crypto = require('crypto-js');
import getRawBody from 'raw-body';
import { WebhookUnauthorizedError } from '../Errors/ErrorExtensions';

// Defined globaly by the OrderCloud platform
const hashHeader = 'x-oc-hash';

// TODO - mess with the type signature, 2 vs 3 parameters.
export function withOCWebhookAuth(routeHandler: (req, res, next) => void | Promise<void>, hashKey: string | undefined) :
    (req, res, next) => void | Promise<void>
{
    return async function(req, res, next) {
        var isValid = await isOCHashValid(req, hashKey);
        if (isValid) {
            routeHandler(req, res, next);
        } else {
            var error = new WebhookUnauthorizedError();
            if (next) {
                // next will be defined in an express.js context, pass the error along.
                next(error);
            } else {
                // simply throwing will working in a next.js context where only 2 parameters are defined, req and res.
                throw error;
            }
        }
    }
}

export async function isOCHashValid(req, hashKey: string | undefined): Promise<boolean> {
  if (!req.rawBody) {
    const buffer = await getRawBody(req);
    req.rawBody = buffer.toString();
    req.body = JSON.parse(req.rawBody);
  }

  const sent = Array.isArray(req.headers[hashHeader])
    ? req.headers[hashHeader][0]
    : req.headers[hashHeader]


  if (!hashKey || !sent) {
    return false;
  }

  var sha256 = crypto.HmacSHA256(req.rawBody, hashKey);
  var hash = crypto.enc.Base64.stringify(sha256);
  
  return hash === sent;
}
