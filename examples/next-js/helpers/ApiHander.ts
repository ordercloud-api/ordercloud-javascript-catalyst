import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { catalystGlobalErrorHandler, MethodNotAllowedError } from "@ordercloud/catalyst";

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
            catalystGlobalErrorHandler(err, res);
        }
    }
}

export interface NextApiRequestTyped<T> extends NextApiRequest {
    body: T;
}