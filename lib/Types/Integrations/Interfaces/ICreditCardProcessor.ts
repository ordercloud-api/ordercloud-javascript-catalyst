import { Address } from "ordercloud-javascript-sdk";
import { OrderWorksheet } from "ordercloud-javascript-sdk";
import { OCIntegrationConfig } from "../OCIntegrationConfig";
import { PCISafeCardDetails } from "./ICreditCardSaver";

/**
 * @desc An interface to define the behavior of a credit card processor. Full CC details are never passed to it, as that would put it in PCI compliance scope. Instead, it accepts iframe generated tokens or saved card IDs.
 */
export interface ICreditCardProcessor {
    /**
     * @desc Get a string credential needed for the client-side Iframe. This may mean slightly different things for different processors, so consult the documentation.
     */
    getIframeCredentialAsync(): Promise<string>;
    /**
     * @desc Attempt to verify the user can pay by placing a hold on a credit card. Funds will be captured later. Typically used as a verification step directly before order submit.
     */
    authorizeOnlyAsync(transaction: AuthorizeCCTransaction, overrideConfig?: OCIntegrationConfig): Promise<CCTransactionResult>;
    /**
     * @desc Attempt to capture funds from a credit card. A prior authorization is required. Typically used when a shipment is created, at the end of the day, or a defined time period after submit.
     */
    capturePriorAuthorizationAsync(transaction: FollowUpCCTransaction, overrideConfig?: OCIntegrationConfig): Promise<CCTransactionResult>;
    /**
     * @desc Remove an authorization hold previously placed on a credit card. Use if order submit fails, or if order is canceled/returned before capture. 
     */
    voidAuthorizationAsync(transaction: FollowUpCCTransaction, overrideConfig?: OCIntegrationConfig): Promise<CCTransactionResult>;
    /**
     * @desc Refund a previously captured amount. Used if an order is canceled/returned after capture. Refunding generally incures extra processing fees, whereas voiding does not.
     */
    refundCaptureAsync(transaction: FollowUpCCTransaction, overrideConfig?: OCIntegrationConfig): Promise<CCTransactionResult>;
}

/**
 * @desc Model to represent a credit card authorization transaction. Authorization checks that enough balance is available and places a hold on funds matching that amount. Does not capture funds.   
 */
export interface AuthorizeCCTransaction {
    /**
     * @desc The OrderCloud Order ID that this card transaction applies to.
     */
    orderID: string;
    /**
     * @desc The amount that will be authorized on the credit card.
     */
    amount: number;
    /**
     * @desc The currency to authorize in - three letter ISO format. 
     */
    currency: string;
    /**
     * @desc Card details. cardDetails.Token or cardDetails.SavedCardID actually identifies the card.
     */
    cardDetails: PCISafeCardDetails;
    /**
     * @desc The ID of a customer record in the processor system. Needed if paying with a saved credit card, otherwise optional.
     */
    processorCustomerID: string;
    /**
     * @desc ddress verification (AVS) is an optional layer of security for payments. It checks a customer-provided street and zip code against the records on file with the card issuer.
     */
    addressVerification: Address;
    /**
     * @desc The customer's IP address is typically not required by processors, but it provides a layer of insurance on disputed or fraudulent payments. 
     */
    customerIPAddress: string;
    /**
     * @desc Included for flexibility. Implementations of this interface may choose to ignore this or use it as they choose. Never use XP properties.
     */
    orderWorkSheet: OrderWorksheet;
}

/**
 * A modification of a credit card transaction that follows after a successfull authorization. Current types are capture, void, and refund.
 */
export interface FollowUpCCTransaction {
    /**
     * The processor-generated ID of the original authorize transaction.
     */
    transactionID: string;
    /**
     * The amount to capture, void, or refund. If null, will default to the full amount of the existing transaction.
     */
    amount: number;
}

/**
 * The result of a credit card transaction. Types of transactions are authorize, capture, void, and refund.
 */
export interface CCTransactionResult {
    /**
     * Did the transaction succeed?
     */
    succeeded: Boolean;
    /**
     * The amount of the transaction   
     */
    amount: number;
    /**
     * The processor-generated ID for this action. Null if a create attempt failed. 
     */
    transactionID: string;
    /**
     * The raw processor-specific response code. Depending on the processor, typical meaninings include Approved, Declined, Held For Review, Retry, Error.
     */
    responseCode: string;
    /**
     * The authorization code granted by the card issuing bank for this transaction. Should be 6 characters, e.g. "HH5414".
     */
    authorizationCode: string;
    /**
     * A code explaining the result of address verification (AVS). Whether to perform AVS is typically configured at the processor level. Standard 1 character result codes, see https://www.merchantmaverick.com/what-is-avs-for-credit-card-processing/.
     */
    avsResponseCode: string;
    /**
     * User readable text explaining the result.
     */
    message: string;
}

