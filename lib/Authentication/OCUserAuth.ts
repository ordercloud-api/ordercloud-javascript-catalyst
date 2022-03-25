import axios from "axios";
var jwt = require('jsonwebtoken');
var getPem = require('rsa-pem-from-mod-exp');
import { MeUser, PublicKey } from "ordercloud-javascript-sdk";
import { InsufficientRolesError, UnauthorizedError } from "../Errors/ErrorExtensions";
import { throwError, withOcErrorHandler } from "../Errors/OCErrorResponse";
import { ApiHandler } from "../Types/ApiHandler";
import { FullDecodedToken } from "../Types/ExtendedToken";
import { getHeader } from "./OCWebhookAuth";

/**
 * @description A middleware that executes before a route handler. Same as withOCUserAuth except sends error responses instead of throwing.
 * @param {Function} routeHandler A function to handle the request and response.
 * @param {string[]} requiredRoles Optional list of OrderCloud roles. If provided, a JWT without any of these roles is not permited.
 * @returns {Function} A function to handle the request and response.
 */
 export function withErrorHandledOcUserAuth(routeHandler: ApiHandler, requiredRoles: string[] = null): ApiHandler {
  return withOcErrorHandler(
    withOCUserAuth(routeHandler, requiredRoles)
  );
}


/**
 * @description A middleware that executes before a route handler. Verifies the request includes an OrderCloud bearer token with correct permissions.
 * @param {Function} req The request object.
 * @param {string[]} requiredRoles Optional list of OrderCloud roles. If provided, a JWT without any of these roles is not permited.
 * @returns {Function} A function to handle the request and response.
 */
export function withOCUserAuth(routeHandler: ApiHandler, requiredRoles: string[] = null): ApiHandler
{ 
  return async function(req, res, next) {
    var token = getToken(req);
    var error = await verifyTokenAsync(token, requiredRoles);
    if (error instanceof Error) {
      throwError(error, next);  
    } else {
      await routeHandler(req, res, next);
    }
  }
}

/**
 * @description Get the authorization Bearer token from the request headers as a string
 * @param {Function} req The request object.
 * @returns {string} The JWT Bearer token
 */
export function getToken(req): string {
    var authHeader = getHeader(req, "authorization");

    if (!authHeader) {
      return null;
    }

    var parts = authHeader.split(" ");

    if (parts.length != 2 || parts[0] != "Bearer") {
      return null;
    }

    return parts[1];
}

export async function verifyTokenAsync(token: string, requiredRoles: string[] = null): Promise<Error | FullDecodedToken> {
  console.log(1);

  if (!token) {
      return new UnauthorizedError();
  }
  console.log(2);
  var decodedToken: FullDecodedToken = decodeToken(token);
  if (!decodedToken?.payload) {
      return new UnauthorizedError();
  }
  console.log(3);

  var now = getTimestampUTC();
  if (decodedToken.payload.nbf > now || now > decodedToken.payload.exp) {
      return new UnauthorizedError();
  }
  console.log(4);

  var isValid = false;
  if (decodedToken?.headers?.kid) {
    isValid = await verifyTokenWithKeyID(decodedToken);
  } else {
    isValid = await verifyTokenWithMeGet(decodedToken);
  }
  console.log(5);

  if (!isValid) {
      return new UnauthorizedError();
  }
  console.log(6);

  if (requiredRoles?.length && !requiredRoles.some(role => decodedToken.payload.role.includes(role as any))) {
      return new InsufficientRolesError({
          SufficientRoles: requiredRoles,
          AssignedRoles: decodedToken.payload.role as any
      })
  }
  console.log(7);

  return decodedToken; 
}

async function verifyTokenWithMeGet(decodedToken: FullDecodedToken): Promise<boolean> {
  try {
      var url = `${decodedToken.payload.aud}/v1/me`;
      var response = await axios.get<MeUser>(url, { headers: { authorization: `Bearer ${decodedToken.raw}` } });
      console.log(response.data);
      return !!(response?.data?.Active);
  } catch (err) {
    console.log(err);

      return false;
  }
}

async function verifyTokenWithKeyID(decodedToken: FullDecodedToken): Promise<boolean> {
  try {
      var url = `${decodedToken.payload.aud}/oauth/certs/${decodedToken.headers.kid}`;
      var response = await axios.get<PublicKey>(url, { headers: { authorization: `Bearer ${decodedToken.raw}` } });
      console.log(response.data);
      return verifyTokenWithPublicKey(decodedToken.raw, response?.data)
  } catch (err) {
    console.log(err);

      return false;
  }
}

export function verifyTokenWithPublicKey(accessToken: string, publicKey: PublicKey): boolean {
  if (!accessToken || !publicKey?.n || !publicKey?.e) {
    return false;
  }
  try {
    var pem = getPem(publicKey.n, publicKey.e);
    jwt.verify(accessToken, pem, { algorithms: ['RS256'] })
    return true;
  } catch (err) {
    return false;
  }
}

function getTimestampUTC(): number {
  return Math.round((new Date()).getTime() / 1000);
}

function decodeToken(token: string): FullDecodedToken {
  var decoded = jwt.decode(token, {complete: true});
  var extendedToken: FullDecodedToken = {
    payload: decoded.payload,
    headers: decoded.header,
    raw: token
  };
  return extendedToken;
}