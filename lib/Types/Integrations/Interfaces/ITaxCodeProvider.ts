import { OCIntegrationConfig } from "../OCIntegrationConfig";

/**
 * @desc An interface to define tax categorization for products. Meant to be used as part of product create and edit.
 */
export interface ITaxCodeProvider {
    /**
     * @desc List the various tax categories a product could fall under
     */
    listTaxCodesAsync(filterTerm: string, overrideConfig?: OCIntegrationConfig): Promise<TaxCategorizationResponse>;
}

export interface TaxCategorizationResponse {
    categories: TaxCategorization[];
}

/**
 * @desc A Tax categorization for a product 
 */
export interface TaxCategorization {
    /**
     * @desc A code that represents this tax category
     */
    code: string;
    /**
     * @desc A reasonable short name for this tax category
     */
    description: string;
    /**
     * @descA full description for this tax category
     */
    longDescription: string;
}