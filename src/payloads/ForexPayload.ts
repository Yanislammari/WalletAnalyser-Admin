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
  length  : number
}

export interface PostForexPayload {
  file: File;
  base_currency_uuid : string
}

export interface PatchForexPayload {
  quote_currency_uuid: string;
  base_currency_uuid: string;
}

export interface ForexListMessage {
  forex_list: ForexMetaData[];
  message : string
}
