import { Address } from "ordercloud-javascript-sdk";
import { OCIntegrationConfig } from "../OCIntegrationConfig";

/**
 * @desc Get shipping price quotes. Typically used to determine what shipping price to pass along to the customer, although it may not match the price the supplier pays to actually ship. 
 */
export interface IShippingRatesCalculator {
    /**
     * @desc Calculates multiple price quotes for each package provided.
     */
    calculateShippingRatesAsync(packages: ShippingPackage[], overrideConfig?: OCIntegrationConfig): ShippingRate[][];
}

/**
 * @desc A price quote for shiping a package. 
 */
export interface ShippingRate {
    /**
     * @desc An ID for this price quote
     */
    id: string;
    /**
     * @desc A name for this price quote like "2 Day Priority"
     */
    name: string;
    /**
     * @desc The cost for this price quote
     */
    cost: number;
    /**
     * @desc Estimated transit days. Converting this to a guaranteed arrival date depends on many factors, some human.
     */
    estimatedTransitDays: number;
    /**
     * @desc Carrier, e.g. "Fedex", "UPS", "USPS"
     */
    carrier: string;
}

export interface ShippingPackage {
    length: number;
    width: number;
    height: number;
    shipFrom: Address;
    shipTo: Address;
    returnAddress: Address;
    signatureRequired: Boolean;
    insurance: ShippingInsuranceInfo;
    customs: ShippingCustomsInfo;
}

export interface ShippingCustomsInfo {
    descriptionOfGoods: string;
    unitPrice: number;
    quantity: number;
    /**
     * 3 Character ISO format, e.g. "USD"
     */
    currency: string;
    unitWeight: number;

}

export interface ShippingInsuranceInfo {
    amount:number;
    /**
     * 3 Character ISO format, e.g. "USD"
     */
    currency: string;
}