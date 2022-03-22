import { Configuration, DecodedToken, Me } from "ordercloud-javascript-sdk";
import { InsufficientRolesError, InvalidUserTypeError, UnauthorizedError, WrongEnvironmentError } from "../Errors/ErrorExtensions";
import { getHeader, throwError } from "./OCWebhookAuth";

export function withOCUserAuth(routeHandler: (req, res, next) => void | Promise<void>, requiredRoles: string[] = null): 
  (req, res, next) => void | Promise<void>
{ 
  return async function(req, res, next) {
    var token = getToken(req);
    console.log(token);
    var error = await verifyTokenAsync(token, requiredRoles);
    if (error instanceof Error) {
      throwError(error, next);  
    } else {
      routeHandler(req, res, next);
    }
  }
}

/**
 * @description Get the OrderCloud OAuth json web token from the request as a raw string.
 * @param {Function} req The request object.
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

export async function verifyTokenAsync(token: string, requiredRoles: string[] = null): Promise<Error | DecodedToken> {
  if (!token) {
      return new UnauthorizedError();
  }

  var decodedToken: DecodedToken = parseToken(token);
  if (!decodedToken) {
      return new UnauthorizedError();
  }

  var now = getTimestampUTC();

  if (decodedToken.nbf > now || now > decodedToken.exp) {
      return new UnauthorizedError();
  }

  console.log(3);


  var baseUrl = Configuration.Get().baseApiUrl;
  console.log("base", baseUrl);
  console.log("aud", decodedToken.aud);
  if (baseUrl !== decodedToken.aud) {
      return new WrongEnvironmentError({
        TokenIssuerEnvironment: decodedToken.aud,
        ExpectedEnvironment: baseUrl
      });
  }

  console.log(4);


  var isValid = await verifyTokenWithMeGet(token);
  if (!isValid) {
      return new UnauthorizedError();
  }

  console.log(5);;


  if (requiredRoles?.length && !requiredRoles.some(role => decodedToken.role.includes(role as any))) {
      return new InsufficientRolesError({
          SufficientRoles: requiredRoles,
          AssignedRoles: decodedToken.role as any
      })
  }

  console.log(6);


  return decodedToken; 
}

async function verifyTokenWithMeGet(accessToken: string): Promise<boolean> {
  try {
      var meUser = await Me.Get({ accessToken });
      return meUser && meUser.Active;
  } catch {
      return false;
  }
}

function getTimestampUTC(): number {
  return Math.round((new Date()).getTime() / 1000);
}



// taken from https://github.com/ordercloud-api/ordercloud-javascript-sdk/blob/a72b0d0a86effcc3c26800d7ecd25beaffcc995b/src/utils/ParseJwt.ts
// would be nice to not have duplicate functionality if this could be public.
// not exposed publically.
function parseToken(token: string, next = null): DecodedToken {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        decodeBase64(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    } catch (e) {
      return null;
    }
}

function decodeBase64(str) {
    // atob is defined on the browser, in node we must use buffer
    if (typeof atob !== 'undefined') {
      return atob(str)
    }
    return Buffer.from(str, 'base64').toString('binary')
}