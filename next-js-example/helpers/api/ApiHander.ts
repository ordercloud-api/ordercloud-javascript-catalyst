import { MethodNotAllowedError } from "../../lib/CatalystErrors";
import { CatalystGlobalErrorHandler } from "../../lib/GlobalErrorHandler";

export function apiHandler(handler) {
    return async (req, res) => {
        try {
            const method = req.method.toLowerCase();

            // check handler supports HTTP method
            if (!handler[method])
                throw new MethodNotAllowedError(req.method);

            // route handler
            await handler[method](req, res);
        } catch (err) {
            console.log("inside catch block")
            CatalystGlobalErrorHandler(err, res);
        }
    }
}