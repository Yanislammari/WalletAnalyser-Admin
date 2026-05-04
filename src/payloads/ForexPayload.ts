import type { CurrencyPayload } from "./CurrencyPayload";

export interface Forex {
  uuid : string
  baseCurrency : CurrencyPayload
  quoteCurrency : CurrencyPayload
}

export interface ForexMetaData {
  forex: Forex;
  last_update: Date | null;
}

export interface ForexListMetaData {
  forex_list: ForexMetaData[];
}

export interface PostForexPayload {
  file: File;
}

export interface PatchForexPayload {
  quote_currency_uuid: string;
  base_currency_uuid: string;
}
