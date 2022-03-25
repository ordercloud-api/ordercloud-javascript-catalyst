import { DecodedToken } from "ordercloud-javascript-sdk";

export interface FullDecodedToken {
    headers: JWTHeaders,
    payload: DecodedToken,
    raw: string,
}

export interface JWTHeaders {
    alg: string;
    typ: string;
    kid: string;
}