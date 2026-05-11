export interface CurrencyPayload {
  currency_name: string;
  uuid : string;
}

export interface CurrenciesResponse {
  currencies: CurrencyNameResponse[];
}

export interface CurrencyNameResponse {
  uuid: string;
  currency_name: string;
}

export interface CurrencyPatchPayload {
  currency_name: string;
}
