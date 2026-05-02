export interface RfrCountry {
  uuid: string;
  country_uuid: string;
  created_at: string;
  updated_at: string;
  country_rfr: {
    country_name: string;
  };
}

export interface RfrCountryItemMetaData {
  rfr_country: RfrCountry;
  last_update: string;
  length : number;
}

export interface RfrCountryItem {
  rfr_country: RfrCountry;
  last_update: string;
}

export interface RfrCountriesResponse {
  rfr_countries: RfrCountryItem[];
}

export interface PatchRfrCountryPayload {
  country_uuid: string;
}

export interface PostRfrCountryPayload {
  file : File
  country_uuid : string
}