import axios, { AxiosRequestConfig } from "axios";
var jwt = require('jsonwebtoken');
var getPem = require('rsa-pem-from-mod-exp');
import { CommerceRole, MeUser, PublicKey } from "ordercloud-javascript-sdk";
import { InsufficientRolesError, InvalidUserTypeError, UnauthorizedError } from "../Errors/ErrorExtensions";
import { withOcErrorHandler } from "../Errors/OCErrorResponse";
import { getHeader, GetOrAddToCache, throwError } from "../Helpers";
import { ApiHandler } from "../Types/ApiHandler";
import { FullDecodedToken } from "../Types/ExtendedToken";

// OAuth convention;
const bearer = "Bearer ";
// OAuth convention;
const authorization = "authorization";
// OrderCloud defined role
const fullAccess = "FullAccess"
// A environment variable defined by this project.
const apiClientsWithAccessEnvVar = 'OC_API_CLIENTS_WITH_ACCESS';
// Use this explict code to indicate that any client ID can access a route.
const allowAnyClientIDCode = "*";
// Cache time to live for get Me reqests. 1 hour.  
const getMeCacheTTLSeconds = 60 * 60;
// Cache time to live for get public key requests. 30 days.
const getPublicKeyTTLSeconds = 60 * 60 * 24 * 30

/**
 * @description A middleware that executes before a route handler. Same as `withOcUserAuth()` except sends error responses instead of throwing.
 * @param {Function} routeHandler A function to handle the request and response.
 * @param {string[]} rolesWithAccess Optional list of OrderCloud security roles. If there are elements in the list, a JWT without any of these roles is not permited.
 * @param {CommerceRole[]} typesWithAccess Optional list of OrderCloud user types (Buyer, Seller, Supplier). If there are elements in the list, a JWT without one of these user types is not permited.
 * @param {string[]} clientIDsWithAccess Optional list of OrderCloud API Client IDs that have permission to access. If null or empty, process.env.OC_API_CLIENTS_WITH_ACCESS must be defined as a comma-separated list of client ids. 
 * @returns {Function} A function to handle the request and response.
 */
 export function withErrorHandledOcUserAuth(routeHandler: ApiHandler, rolesWithAccess: string[] = [], typesWithAccess: CommerceRole[] = [], clientIDsWithAccess: string[] = []): ApiHandler {
  clientIDsWithAccess = getGlobalApiClients(clientIDsWithAccess);
  return withOcErrorHandler(
    withOcUserAuth(routeHandler, rolesWithAccess, typesWithAccess, clientIDsWithAccess)
  );
}

/**
 * @description A middleware that executes before a route handler. Verifies the request includes an OrderCloud bearer token with correct permissions.
 * @param {Function} req The request object.
 * @param {string[]} rolesWithAccess Optional list of OrderCloud security roles. If provided, a JWT without any of these roles is not permited.
 * @param {CommerceRole[]} typesWithAccess Optional list of OrderCloud user types (Buyer, Seller, Supplier). If provided, a JWT without any of these roles is not permited.
 * @param {string[]} clientIDsWithAccess Optional list of OrderCloud API Client IDs that have permission to access. If null or empty, process.env.OC_API_CLIENTS_WITH_ACCESS must be a comma-separated list of client ids. 
 * @returns {Function} A function to handle the request and response.
 */
export function withOcUserAuth(routeHandler: ApiHandler, rolesWithAccess: string[] = [], typesWithAccess: CommerceRole[] = null, clientIDsWithAccess: string[] = []): ApiHandler
{ 
  return async function(req, res, next) {
    clientIDsWithAccess = getGlobalApiClients(clientIDsWithAccess);
    var token = getToken(req);
    try {
      var verficationResult = await verifyTokenAsync(token, rolesWithAccess, typesWithAccess, clientIDsWithAccess);
      req.ocToken = verficationResult;
      await routeHandler(req, res, next);
    } catch (err) {
      throwError(err, next);  
    }
  }
}

/**
 * @description Verifies an OrderCloud JWT is valid, unexpired, active, and has correct permissions. 
 * @param {Function} token The raw OrderCloud JWT
 * @param {string[]} rolesWithAccess Optional list of OrderCloud security roles. If provided, a JWT without any of these roles is not permited.
 * @param {CommerceRole[]} typesWithAccess Optional list of OrderCloud user types (Buyer, Seller, Supplier). If provided, a JWT without any of these roles is not permited.
 * @param {string[]} clientIDsWithAccess Optional list of OrderCloud API Client IDs that have permission to access. If null or empty, process.env.OC_API_CLIENTS_WITH_ACCESS must be a comma-separated list of client ids. 
 * @returns {boolean} Is valid JWT?
 */
export async function verifyTokenAsync(token: string, rolesWithAccess: string[] = [], typesWithAccess: CommerceRole[] = [], clientIDsWithAccess: string[] = []): Promise<FullDecodedToken> {
  clientIDsWithAccess = getGlobalApiClients(clientIDsWithAccess);
  if (!token) {
    throw new UnauthorizedError();
  }
  const decodedToken: FullDecodedToken = decodeToken(token);
  if (!decodedToken?.payload) {
    throw new UnauthorizedError();
  }
  if (!clientIDsWithAccess.some(id => id === decodedToken.payload.cid || id.trim() === allowAnyClientIDCode)) {
    throw new UnauthorizedError();
  }
  const now = getNowTimestampUTC();
  if (decodedToken.payload.nbf > now || now > decodedToken.payload.exp) {
    throw new UnauthorizedError();
  }
  var isValid = false;
  if (decodedToken?.headers?.kid) {
    isValid = await verifyTokenWithKeyID(decodedToken);
  } else {
    isValid = await verifyTokenWithMeGet(decodedToken);
  }
  if (!isValid) {
    throw new UnauthorizedError();
  }
  if (decodedToken.payload.usrtype === "admin") {
      decodedToken.payload.usrtype = "Seller" as any;
  }
  if (
    typesWithAccess?.length && 
    !typesWithAccess.some(role => (decodedToken.payload.usrtype as CommerceRole).includes(role))
  ) {
    throw new InvalidUserTypeError({
        UserType: decodedToken.payload.usrtype,
        UserTypesWithAccess: typesWithAccess
    })
  }
  const assignedRoles = decodedToken.payload.role as unknown as string[];
  if (
    rolesWithAccess?.length && 
    !assignedRoles.includes(fullAccess) && 
    !rolesWithAccess.some(role => assignedRoles.includes(role))
  ) {
    throw new InsufficientRolesError({
        RolesWithAccess: rolesWithAccess,
        AssignedRoles: assignedRoles
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
  var authHeader = getHeader(req, authorization);
  if (!authHeader) {
    return null;
  }
  var parts = authHeader.split(" ");
  if (parts.length != 2 || parts[0] != bearer.trim()) {
    return null;
  }
  return parts[1];
}

async function verifyTokenWithMeGet(decodedToken: FullDecodedToken): Promise<boolean> {
  try {
      var cacheKey = decodedToken.raw;
      var me = await GetOrAddToCache<MeUser>(cacheKey, getMeCacheTTLSeconds, async () => {
        var url = `${decodedToken.payload.aud}/v1/me`;
        var response = await axios.get<MeUser>(url, setTokenHeader(decodedToken));
        return response?.data; 
      });
      return !!(me?.Active);
  } catch (err) {
      return false;
  }
}

async function verifyTokenWithKeyID(decodedToken: FullDecodedToken): Promise<boolean> {
  try {
      var cacheKey = `${decodedToken.payload.aud}-${decodedToken.headers.kid}`;
      var publicKey = await GetOrAddToCache<PublicKey>(cacheKey, getPublicKeyTTLSeconds, async () => {
        var url = `${decodedToken.payload.aud}/oauth/certs/${decodedToken.headers.kid}`;
        var response = await axios.get<PublicKey>(url, setTokenHeader(decodedToken));
        return response?.data; 
      });
      return verifyTokenWithPublicKey(decodedToken.raw, publicKey)
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

function getGlobalApiClients(apiClients: string[]): string[] {
  if (apiClients.length && apiClients[0]) {
    return apiClients;
  }
  var envVar = process.env[apiClientsWithAccessEnvVar];
  if (!envVar) {
    throw Error(`No value found for parameter "apiClientsWithAccess" in function withOcUserAuth(). Provide a value or define process.env.${apiClientsWithAccessEnvVar} as a comma-separated list.`)
  }
  return envVar.split(",")
}

function getNowTimestampUTC(): number {
  return Math.round((new Date()).getTime() / 1000);
}

function setTokenHeader(token: FullDecodedToken): AxiosRequestConfig {
  return { headers: { [authorization]: bearer + token.raw } };
}

function decodeToken(token: string): FullDecodedToken {
  var decoded = jwt.decode(token, {complete: true});
  var extendedToken: FullDecodedToken = {
    payload: decoded?.payload,
    headers: decoded?.header,
    raw: token
  };
  return extendedToken;
}