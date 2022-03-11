import { StatusCodes } from "http-status-codes";

export class CatalystBaseError extends Error {
    status: StatusCodes;
    data: any;

    constructor(name: string, message: string, status: StatusCodes = StatusCodes.BAD_REQUEST, data: any = null) { 
        super(message);
        this.name = name;
        this.status = status;
        this.data = data;
    }
}

export class WebhookUnauthorizedError extends CatalystBaseError {
    constructor() {
        super(
            "Unauthorized",
            "X-oc-hash header does not align with process.env.OC_HASH_KEY. Endpoint can only be hit from a valid OrderCloud webhook.",
            StatusCodes.UNAUTHORIZED
        )
    }
}

export class NotFoundError extends CatalystBaseError {
    constructor() {
        super(
            "NotFound",
            "No matching route and method found.",
            StatusCodes.NOT_FOUND
        )
    }
}