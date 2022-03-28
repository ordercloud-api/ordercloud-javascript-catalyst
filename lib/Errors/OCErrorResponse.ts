import { StatusCodes } from "http-status-codes";
import { ApiHandler } from "../Types/ApiHandler";
import { ApiErrorBody } from "./ErrorExtensions";

/**
 * @description A middleware that executes before a route handler. Catches thrown errors executes a JSON response matching OrderCloud's format.
 * @param {Function} routeHandler A function to handle the request and response.
 * @returns {Function} A function to handle the request and response.
 */
export function withOcErrorHandler(routeHandler: ApiHandler): ApiHandler {
  return async (req, res, next) => { 
    try {
      await routeHandler(req, res, next);  
    } catch (err) {
      respondWithOcFormatError(err, res);
    } 
  };
}

/**
 * @description Converts an error object to a JSON response matching OrderCloud's format 
 * @param {Error} err An error object.
 * @param {Function} res A response object
 */
export function respondWithOcFormatError(err, res): void {
  var body: ApiErrorBody = {
    Errors: []
  };
  if (err.isCatalystBaseError) {
      body.Errors[0] = {
          ErrorCode: err.name,
          Message: err.message,
          Data: err.data,
      };
  } else if (err.isOrderCloudError) {
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