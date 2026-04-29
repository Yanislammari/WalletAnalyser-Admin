export interface SectorPayload {
  sector_name : string;
}

export interface SectorAlliasPayload {
  sector_allias_name : string;
}

export interface SectorsResponse {
  sectors : SectorResponse[];
}

export interface SectorNameResponse {
  uuid : string;
  sector_name : string;
}

export interface SectorResponse {
  uuid : string;
  sector_name : string;
  updated_at : string;
  created_at : string;
}

export interface SectorAllias {
  uuid : string;
  sector_allias_name : string;
  updated_at : string;
  created_at : string;
}

export interface SectorNameAlliasResponse {
  uuid : string;
  sector_allias_name : string;
}

export interface SectorAlliasResponse {
  sector : SectorResponse;
  sectors_allias : SectorNameAlliasResponse[];
}