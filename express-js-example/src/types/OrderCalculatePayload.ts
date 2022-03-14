import { OrderWorksheet } from 'ordercloud-javascript-sdk';

export interface OrderCalculatePayload<TConfig> {
    OrderWorksheet: OrderWorksheet;
    Environment: string;
    OrderCloudAccessToken: string;
    ConfigData: TConfig;
}

export interface MyCheckoutConfig {
    MyProperty: string;
}