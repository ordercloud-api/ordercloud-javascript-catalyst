import { OrderWorksheet } from 'ordercloud-javascript-sdk';

export interface OrderCalculatePayload<TConfig = any> {
    OrderWorksheet: OrderWorksheet;
    Environment: string;
    OrderCloudAccessToken: string;
    ConfigData: TConfig;
}