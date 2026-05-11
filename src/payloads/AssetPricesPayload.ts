import type { AssetShort } from "./AssetPayload";

export interface AssetPriceShort {
  uuid: string;
  asset_price_date: Date;
  asset_price: number;
}

export interface AssetPricePayload {
  asset_price_date: Date;
  asset_price: number;
}

export interface AssetPriceMetaData {
  length: number;
  asset_prices: AssetPriceShort[];
  asset: AssetShort;
}

export interface AssetPriceMetaDataWithMessage {
  response: AssetPriceMetaData;
  message : string
}
