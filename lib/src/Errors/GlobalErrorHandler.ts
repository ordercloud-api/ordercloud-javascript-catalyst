import { StatusCodes } from "http-status-codes";
import { ApiErrorBody, CatalystBaseError } from "./ErrorExtensions";

export function catalystGlobalErrorHandler(err, res) {
    var body: ApiErrorBody = {
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