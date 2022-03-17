import { DecodedToken } from "ordercloud-javascript-sdk";
import { UnauthorizedException } from "../Errors/ErrorExtensions";
import { getHeader } from "./OCWebhookAuth";

export function getDecodedToken(req): DecodedToken {
    return parseJwt(getToken(req));
}

export function getToken(req): string {
    var authHeader = getHeader(req, "Authorization");
    if (!authHeader) return null;

    var parts = authHeader.split(" ");

    if (parts.length != 2 || parts[0] != "Bearer") {
        return null;
    }

    return parts[1];
}

// taken from https://github.com/ordercloud-api/ordercloud-javascript-sdk/blob/a72b0d0a86effcc3c26800d7ecd25beaffcc995b/src/utils/ParseJwt.ts
// would be nice to not have duplicate functionality if this could be public.
export function parseJwt(token: string): DecodedToken {
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
      throw new UnauthorizedException();
    }
  }

function decodeBase64(str) {
    // atob is defined on the browser, in node we must use buffer
    if (typeof atob !== 'undefined') {
      return atob(str)
    }
    return Buffer.from(str, 'base64').toString('binary')
  }