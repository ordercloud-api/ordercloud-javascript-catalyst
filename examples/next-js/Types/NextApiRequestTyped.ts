import { NextApiRequest } from "next";

export interface NextApiRequestTyped<T> extends NextApiRequest {
    body: T;
}