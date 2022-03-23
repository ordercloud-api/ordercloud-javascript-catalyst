import { StatusCodes } from "http-status-codes";
import { OrderCloudError } from "ordercloud-javascript-sdk";
import { ApiHander } from "../Types/ApiHandler";
import { ApiErrorBody, CatalystBaseError } from "./ErrorExtensions";

/**
 * @description A middleware that executes before a route handler. Catches thrown errors executes a JSON response matching OrderCloud's format.
 * @param {Function} routeHandler A function to handle the request and response.
 * @returns {Function} A function to handle the request and response.
 */
export function withOcErrorHandler(routeHandler: ApiHander): ApiHander {
  return async (req, res, next) => { 
    try {
      await routeHandler(req, res, next);  
    } catch (err) {
      ocErrorResponse(err, res);
    } 
  };
}

/**
 * @description Converts an error object to a JSON response matching OrderCloud's format 
 * @param {Function} err An error object.
 * @param {Function} res A response object
 */
export function ocErrorResponse(err, res): void {
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