import { OCIntegrationConfig } from "../OCIntegrationConfig";

/**
 * @desc An interface to define the behavior of a system that can store saved credit cards. Full CC details are never passed to it, as that would put it in PCI compliance scope. Instead, it accepts iframe generated tokens.
 */
export interface ICreditCardSaver {
    listSavedCardsAsync(customerID: string, overrideConfig?: OCIntegrationConfig): Promise<PCISafeCardDetails[]>;
    getSavedCardAsync(customerID: string, cardID: string, overrideConfig?: OCIntegrationConfig): Promise<PCISafeCardDetails>;
    createSavedCardAsync(customer: PaymentSystemCustomer, card: PCISafeCardDetails, overrideConfig?: OCIntegrationConfig): Promise<CardSavedResponse>;
    deleteSavedCardAsync(customerID: string, cardID: string, overrideConfig?: OCIntegrationConfig) : Promise<null>;
}

/**
 * @desc In a payment processing system, saved cards are usually stored under a customer record.
 */
export interface PaymentSystemCustomer {
    /**
     * @desc The ID of an existing customer, or the ID to set for a newly created customer.
     */
    id: string;
    /**
     * @desc Email of a new customer. Ignored if CustomerAlreadyExists is true. 
     */
    email: string;
    /**
     * @desc First name of a new customer. Ignored if CustomerAlreadyExists is true. 
     */
    firstName: string;
    /**
     * @desc Last name of a new customer. Ignored if CustomerAlreadyExists is true. 
     */
    lastName: string;
    /**
     * @desc Should this customer already exist or is it being created? Use to determine whether to attempt to create a new customer. If unsure default to false.
     */
    customerAlreadyExists: Boolean; 
}

/**
 * @desc Partial credit card details that do not put the solution under PCI compliance. Only the last 4 digits of the number and no CVV. Includes a token from the processor system representing the full card details.
 */
export interface PCISafeCardDetails {
    /**
     * @desc Left null if card is not saved in processor. During authorization if it is non-empty, it will be prefered over Token. 
     */
    savedCardID: string;
    /**
     * @desc A token from the processor system representing the full card details. During authorization, it will be used only if SavedCardID is empty.
     */
    token: string;
    /**
     * @descCard Holder First and Last Name
     */
    cardHolderName: string;
    /**
     * @desc Last 4 digits of the card number
     */
    numberLast4Digits: string;
    /**
     * @desc Expiration month in the form MM. Length exactly 2.
     */
    expirationMonth: string;
    /**
     * @desc Expiration year in the form YYYY. Length exactly 4.
     */
    expirationYear: string;
    /**
     * @desc Card Issuer Type, e.g. "Visa", "MasterCard", ect.
     */
    cardType: string;
}

export interface CardSavedResponse {
    pciSafeCardDetails: PCISafeCardDetails;
    customerID: string;
}