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

export class UnauthorizedError extends CatalystBaseError {
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

export interface InsufficientRolesData
{
    SufficientRoles: string[];
    AssignedRoles: string[];
}

export class InsufficientRolesError extends CatalystBaseError {
    constructor(data: InsufficientRolesData) {
        super(
            "InsufficientRoles",
            "User does not have role(s) required to perform this action.",
            StatusCodes.FORBIDDEN,
            data
        )
    }
}

export interface InvalidUserTypeData {
    ThisUserType: string;
    UserTypesThatCanAccess: string[];
}

export class InvalidUserTypeError extends CatalystBaseError {
    constructor(data: InvalidUserTypeData) {
        super(
            "InvalidUserType",
            `Users of type ${data.ThisUserType} do not have permission to perform this action.`,
            StatusCodes.FORBIDDEN,
            data
        )
    }
}

export interface WrongEnvironmentData {
    TokenIssuerEnvironment: string;
    ExpectedEnvironment: string;
}

export class WrongEnvironmentError extends CatalystBaseError {
    constructor(data: WrongEnvironmentData) {
        super(
            "InvalidToken",
            `Environment mismatch. Token gives access to ${data.TokenIssuerEnvironment} while this API expects ${data.ExpectedEnvironment}`,
            StatusCodes.UNAUTHORIZED,
            data
        )
    }
}