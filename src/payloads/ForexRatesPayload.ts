import type { Forex } from "./ForexPayload";

export interface ForexRateShort {
  uuid: string;
  forex_rate_date: Date;
  forex_rate: number;
}

export interface ForexRatePayload {
  forex_rate_date: Date;
  forex_rate: number;
}

export interface ForexRateMetaData {
  length: number;
  forex_rates: ForexRateShort[];
  forex : Forex
}