import axios from "axios";
var jwt = require('jsonwebtoken');
var getPem = require('rsa-pem-from-mod-exp');
import { CommerceRole, MeUser, PublicKey } from "ordercloud-javascript-sdk";
import { InsufficientRolesError, InvalidUserTypeError, UnauthorizedError } from "../Errors/ErrorExtensions";
import { throwError, withOcErrorHandler } from "../Errors/OCErrorResponse";
import { ApiHandler } from "../Types/ApiHandler";
import { FullDecodedToken } from "../Types/ExtendedToken";
import { getHeader } from "./OCWebhookAuth";

/**
 * @description A middleware that executes before a route handler. Same as withOCUserAuth except sends error responses instead of throwing.
 * @param {Function} routeHandler A function to handle the request and response.
 * @param {string[]} rolesWithAccess Optional list of OrderCloud security roles. If provided, a JWT without any of these roles is not permited.
 * @param {CommerceRole[]} typesWithAccess Optional list of OrderCloud user types (Buyer, Seller, Supplier). If provided, a JWT without any of these roles is not permited.
 * @returns {Function} A function to handle the request and response.
 */
 export function withErrorHandledOcUserAuth(routeHandler: ApiHandler, rolesWithAccess: string[] = null, typesWithAccess: CommerceRole[] = null): ApiHandler {
  return withOcErrorHandler(
    withOCUserAuth(routeHandler, rolesWithAccess, typesWithAccess)
  );
}

/**
 * @description A middleware that executes before a route handler. Verifies the request includes an OrderCloud bearer token with correct permissions.
 * @param {Function} req The request object.
 * @param {string[]} rolesWithAccess Optional list of OrderCloud security roles. If provided, a JWT without any of these roles is not permited.
 * @param {CommerceRole[]} typesWithAccess Optional list of OrderCloud user types (Buyer, Seller, Supplier). If provided, a JWT without any of these roles is not permited.
 * @returns {Function} A function to handle the request and response.
 */
export function withOCUserAuth(routeHandler: ApiHandler, rolesWithAccess: string[] = null, typesWithAccess: CommerceRole[] = null): ApiHandler
{ 
  return async function(req, res, next) {
    var token = getToken(req);
    var verficationResult = await verifyTokenAsync(token, rolesWithAccess, typesWithAccess);
    if (verficationResult instanceof Error) {
      throwError(verficationResult, next);  
    } else {
      req.ocToken = verficationResult;
      await routeHandler(req, res, next);
    }
  }
}

/**
 * @description Verifies an OrderCloud JWT is valid, unexpired, active, and has correct permissions. 
 * @param {Function} token The raw OrderCloud JWT
 * @param {string[]} rolesWithAccess Optional list of OrderCloud security roles. If provided, a JWT without any of these roles is not permited.
 * @param {CommerceRole[]} typesWithAccess Optional list of OrderCloud user types (Buyer, Seller, Supplier). If provided, a JWT without any of these roles is not permited.
 * @returns {boolean} Is valid JWT?
 */
export async function verifyTokenAsync(token: string, rolesWithAccess: string[] = null, typesWithAccess: CommerceRole[] = null): Promise<Error | FullDecodedToken> {
  if (!token) {
      return new UnauthorizedError();
  }
  const decodedToken: FullDecodedToken = decodeToken(token);
  if (!decodedToken?.payload) {
      return new UnauthorizedError();
  }
  const now = getNowTimestampUTC();
  if (decodedToken.payload.nbf > now || now > decodedToken.payload.exp) {
      return new UnauthorizedError();
  }
  var isValid = false;
  if (decodedToken?.headers?.kid) {
    isValid = await verifyTokenWithKeyID(decodedToken);
  } else {
    isValid = await verifyTokenWithMeGet(decodedToken);
  }
  if (!isValid) {
      return new UnauthorizedError();
  }
  if (typesWithAccess?.length && !typesWithAccess.some(role => (decodedToken.payload.usrtype as CommerceRole).includes(role))) {
    return new InvalidUserTypeError({
        UserType: decodedToken.payload.usrtype,
        UserTypesWithAccess: typesWithAccess
    })
  }
  if (rolesWithAccess?.length && !rolesWithAccess.some(role => decodedToken.payload.role.includes(role as any))) {
    return new InsufficientRolesError({
        RolesWithAccess: rolesWithAccess,
        AssignedRoles: decodedToken.payload.role as any
    })
  }
  return decodedToken; 
}

/**
 * @description Get the authorization Bearer token from the request headers as a string
 * @param {Function} req The request object.
 * @returns {string | null} The JWT Bearer token
 */
 export function getToken(req): string | null {
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

async function verifyTokenWithMeGet(decodedToken: FullDecodedToken): Promise<boolean> {
  try {
      var url = `${decodedToken.payload.aud}/v1/me`;
      var response = await axios.get<MeUser>(url, { headers: { authorization: `Bearer ${decodedToken.raw}` } });
      return !!(response?.data?.Active);
  } catch (err) {
      return false;
  }
}

async function verifyTokenWithKeyID(decodedToken: FullDecodedToken): Promise<boolean> {
  try {
      var url = `${decodedToken.payload.aud}/oauth/certs/${decodedToken.headers.kid}`;
      var response = await axios.get<PublicKey>(url, { headers: { authorization: `Bearer ${decodedToken.raw}` } });
      return verifyTokenWithPublicKey(decodedToken.raw, response?.data)
  } catch (err) {
      return false;
  }
}

function verifyTokenWithPublicKey(accessToken: string, publicKey: PublicKey): boolean {
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

function getNowTimestampUTC(): number {
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