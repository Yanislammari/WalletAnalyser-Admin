export const AssetType = {
  STOCKS: "equity",
  ETF: "etf",
} as const;

export type AssetType =
  (typeof AssetType)[keyof typeof AssetType];

export interface AssetShort {
  uuid: string;
  display_name : string
  base_currency_uuid: string;
  ticker_name: string;
  official_name: string;
  sector_uuid: string;
  country_uuid: string;
}

export interface MetaDataAssetShort {
  last_update : Date | undefined
  asset : AssetShort
}

export interface MetaDataAssets {
  assets : MetaDataAssetShort[]
  length : number
}

export interface AssetDatabaseModel {
  official_name: string | null;
  ticker_name: string | null;
  sector_uuid: string | null;
  country_uuid: string | null;
  base_currency_uuid: string | null;
}

export interface AssetPatch {
  display_name : string;
  base_currency_uuid: string | null;
  ticker_name: string;
  type : AssetType;
  official_name: string;
  sector_uuid: string | null;
  country_uuid: string | null;
}