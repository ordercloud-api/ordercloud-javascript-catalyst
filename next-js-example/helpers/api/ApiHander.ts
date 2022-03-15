import { MethodNotAllowedError } from "../../types/CatalystErrors";
import { CatalystGlobalErrorHandler } from "../../types/GlobalErrorHandler";

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
            CatalystGlobalErrorHandler(err, res);
        }
    }
}