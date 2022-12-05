import { Address } from "ordercloud-javascript-sdk";
import { OCIntegrationConfig } from "../OCIntegrationConfig";

/**
 * @desc An interface to define expected responses from tax calculation. Meant to be used in OrderCloud ecommerce checkout. 
 */
export interface ITaxCalculator {
    /**
     * @desc Calculates tax for an order without creating any records. Use this to display tax amount to user prior to order submit.
     */
    calculateEstimateAsync(order: OrderSummaryForTax, overrideConfig?: OCIntegrationConfig) : Promise<OrderTaxCalculation>;
    /**
     * @desc Creates a tax transaction record in the calculating system. Use this once per order - on order submit, payment capture, or fulfillment.
     */
    commitTransactionAsync(order: OrderSummaryForTax, overrideConfig?: OCIntegrationConfig) : Promise<OrderTaxCalculation>;
} 

/**
 * @desc Represents the details of the tax costs calculated for one Order
 */
export interface OrderTaxCalculation {
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    orderID: string;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    externalTransactionID: string;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    totalTax: number;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    lineItems: LineItemTaxCalculation[];
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    orderLevelTaxes: TaxDetails;
}

/**
 * @desc Represents the details of the tax costs calculated for one Order
 */
export interface LineItemTaxCalculation {
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    lineItemID: string;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    lineItemTotalTax: number;
    /**
    * @desc Represents the details of the tax costs calculated for one Order
    */
    lineItemLevelTaxes: TaxDetails[];
}

/**
 * @desc Represents the details of the tax costs calculated for one Order
 */
export interface TaxDetails {
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    tax: number;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    taxable: number;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    exempt: number;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    taxDescription: string;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    jurisdictionLevel: string;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    jurisdictionValue: string;
    /**
     * @desc Represents the details of the tax costs calculated for one Order
     */
    shipEstimateID: string;
}

export interface OrderSummaryForTax {
    orderID: string;
    customerCode: string;
    promotionDiscount: number;
    lineItems: LineItemSummaryForTax[];
    shippingCosts: ShipEstimateSummaryForTax[]
}

export interface LineItemSummaryForTax {
    lineItemID: string;
    productID: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    promotionDiscount: number;
    /**
     * @desc (UnitPrice * Quantity) - PromotionDiscount
     */
    lineItemTotal: number;
    taxCode: string;
    shipTo: Address;
    shipFrom: Address;
}

export interface ShipEstimateSummaryForTax {
    shipEstimateID: string;
    /**
     * @desc E.G. "Fedex 2-day priority" 
     */
    description: string;
    cost: number;
    shipTo: Address;
    shipFrom: Address;
}