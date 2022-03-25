var crypto = require('crypto-js');
import getRawBody from 'raw-body';
import { WebhookUnauthorizedError } from '../Errors/ErrorExtensions';
import { throwError, withOcErrorHandler } from '../Errors/OCErrorResponse';
import { ApiHandler } from '../Types/ApiHandler';

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
export function withOcWebhookAuth(routeHandler: ApiHandler, hashKey: string = null) : ApiHandler
{
    hashKey = hashKey || process.env[defaultConfigName];
    return async function(req, res, next) {
        var isValid = await isOcHashValid(req, hashKey);
        if (isValid) {
            await routeHandler(req, res, next);
        } else {
            throwError(new WebhookUnauthorizedError(), next);  
        }
    }
}

/**
 * @description Does the request header "x-oc-hash" match the configured hash key?
 * @param {Function} req The request object, including body and headers.
 * @param {string} hashKey Optional. If not provided, defaults to process.env.OC_WEBHOOK_HASH_KEY.
 */
export async function isOcHashValid(req, hashKey: string | undefined = process.env[defaultConfigName]): Promise<boolean> {
  if (!req.rawBody) {
    // TODO - is there a way to get the body without using promises? 
    // Because making this function syncronous would mean many other downstream functions could be synchronous,
    // including middleware's clients want to use.
    const buffer = await getRawBody(req);
    req.rawBody = buffer.toString();
    req.body = JSON.parse(req.rawBody);
  }

  const expectedHash = getHeader(req, hashHeader)

  if (!hashKey || !expectedHash) {
    return false;
  }

  var sha256 = crypto.HmacSHA256(req.rawBody, hashKey);
  var hash = crypto.enc.Base64.stringify(sha256);
  
  return hash === expectedHash;
}

export function getHeader(req, headerName: string): string | null {
  return Array.isArray(req.headers[headerName])
    ? req.headers[headerName][0]
    : req.headers[headerName];
}

/**
 * @description A middleware that executes before a route handler. Same as withOcWebhookAuth except sends error responses instead of throwing.
 * @param {Function} routeHandler A function to handle the request and response.
 * @param {string} hashKey Optional. If not provided, defaults to process.env.OC_WEBHOOK_HASH_KEY.
 * @returns {Function} A function to handle the request and response.
 */
 export function withErrorHandledOcWebhookAuth(routeHandler: ApiHandler, hashKey: string = null): ApiHandler {
  return withOcErrorHandler(
    withOcWebhookAuth(routeHandler, hashKey)
  );
}
