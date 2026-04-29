export interface CountryPayload {
  country_name : string;
}

export interface CountryAlliasPayload {
  country_allias_name : string;
}

export interface CountriesResponse {
  countries : CountryResponse[];
}

export interface CountryNameResponse {
  uuid : string;
  country_name : string;
}

export interface CountryResponse {
  uuid : string;
  country_name : string;
  updated_at : string;
  created_at : string;
}

export interface CountryAllias {
  uuid : string;
  country_allias_name : string;
  updated_at : string;
  created_at : string;
}

export interface CountryNameAlliasResponse {
  uuid : string;
  country_allias_name : string;
}

export interface CountryAlliasResponse {
  country : CountryResponse;
  countries_allias : CountryNameAlliasResponse[];
}