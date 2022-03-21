var crypto = require('crypto-js');
import getRawBody from 'raw-body';
import { WebhookUnauthorizedError } from '../Errors/ErrorExtensions';

// Defined globaly by the OrderCloud platform
const hashHeader = 'x-oc-hash';
// A convention defined by this project.
const defaultConfigName = 'OC_WEBHOOK_HASH_KEY';

/**
 * @description A middleware that executes before a route handler. Verifies the request header "x-oc-hash" matches the configured hash key.
 * @param {Function} routeHandler A function to handle the request and response.
 * @param {string} hashKey Optional. If not provided, defaults to process.env.OC_WEBHOOK_HASH_KEY.
 * @returns {Function} A function to handle the request and response.
 */
export function withOCWebhookAuth(routeHandler: (req, res, next) => void | Promise<void>, hashKey: string | undefined = process.env[defaultConfigName]) :
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

/**
 * @description Does the request header "x-oc-hash" match the configured hash key?
 * @param {Function} req The request object, including body and headers.
 * @param {string} hashKey Optional. If not provided, defaults to process.env.OC_WEBHOOK_HASH_KEY.
 */
export async function isOCHashValid(req, hashKey: string | undefined = process.env[defaultConfigName]): Promise<boolean> {
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
