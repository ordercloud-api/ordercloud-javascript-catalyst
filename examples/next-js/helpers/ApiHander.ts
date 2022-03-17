import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { CatalystGlobalErrorHandler, MethodNotAllowedError } from "ordercloud-javascript-catalyst";

export function apiHandler(handler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            const method = req?.method?.toLowerCase() ?? "null";

            // check handler supports HTTP method
            if (!handler[method])
                throw new MethodNotAllowedError(method);

            // route handler
            await handler[method](req, res);
        } catch (err) {
            CatalystGlobalErrorHandler(err, res);
        }
    }
}

export interface NextApiRequestTyped<T> extends NextApiRequest {
    body: T;
}