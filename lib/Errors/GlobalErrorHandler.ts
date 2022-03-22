import { StatusCodes } from "http-status-codes";
import { OrderCloudError } from "ordercloud-javascript-sdk";
import { ApiErrorBody, CatalystBaseError } from "./ErrorExtensions";

export function catalystGlobalErrorHandler(err, res) {
    var body: ApiErrorBody = {
        Errors: []
    };
    if (err instanceof CatalystBaseError) {
        body.Errors[0] = {
            ErrorCode: err.name,
            Message: err.message,
            Data: err.data,
        };
    } else if (err instanceof OrderCloudError || err.isOrderCloudError) {
        body = err.errors;
    } else {
        body.Errors[0] = {
            ErrorCode: "InternalServerError",
            Message: "Unknown error has occured.",
            Data: err.message,
        };
    }

    // return a json error response. 500 is considered a bug in your api.
    res.status(err.status || StatusCodes.INTERNAL_SERVER_ERROR).json(body);
};