import { StatusCodes } from "http-status-codes";

export interface ApiErrorBody {
    Errors: ApiError[];
}

export interface ApiError {
    ErrorCode: string;
    Message: string,
    Data?: any
}

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
            "X-oc-hash header does not match the configured hash key. Endpoint can only be hit from a valid OrderCloud webhook.",
            StatusCodes.UNAUTHORIZED
        )
    }
}

export class UnauthorizedException extends CatalystBaseError {
    constructor() {
        super(
            "InvalidToken",
            `Access token is invalid or expired.`,
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

export class MethodNotAllowedError extends CatalystBaseError {
    constructor(method: string) {
        super(
            "MethodNotAllowed",
            `Method ${method} Not Allowed`,
            StatusCodes.METHOD_NOT_ALLOWED
        )
    }
}