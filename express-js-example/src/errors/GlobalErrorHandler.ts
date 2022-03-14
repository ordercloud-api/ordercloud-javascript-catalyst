import { StatusCodes } from "http-status-codes";
import { CatalystBaseError } from "./CatalystErrors";

export function CatalystGlobalErrorHandler(err, req, res, next) {
    var body = {
        Errors: []
    };
    if (err instanceof CatalystBaseError) {
        body.Errors[0] = {
            ErrorCode: err.name,
            Message: err.message,
            data: err.data,
        };
    } else {
        body.Errors[0] = {
            ErrorCode: "InternalServerError",
            Message: "Unknown error has occured.",
            data: err.message,
        };
    }

    // return a json error response
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(body);
};