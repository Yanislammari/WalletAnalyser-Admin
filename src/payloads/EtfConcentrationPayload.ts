interface AssetFull {
  uuid: string
  base_currency_uuid: string
  asset_type: string
  ticker_name: string
  official_name: string
  sector_uuid: string | null
  country_uuid: string | null
  created_at: string
  updated_at: string
}

export interface EtfHoldingsAsset {
  uuid: string
  asset_percentage_concentration_in_etf: number
  asset: Asset
}

interface Asset {
  uuid: string
  official_name: string
  sector?: Sector | null
  country?: Country | null
}

interface Sector {
  uuid: string
  sector_name: string
}

interface Country {
  uuid: string
  country_name: string
}

export interface SectorConcentrationEtf {
  sector_uuid : string
  sector_name : string
  percentage_in_sector : number
}

export interface CountryConcentrationEtf {
  country_uuid : string
  country_name : string
  percentage_in_country : number
}


export interface EtfconcentrationMetaData {
  etf: AssetFull
  etf_asset : EtfHoldingsAsset[]
  length : number
  sector_concentrations : SectorConcentrationEtf[]
  country_concentrations : CountryConcentrationEtf[]
}

export interface EtfAssetMetaData {
  etf_asset : EtfHoldingsAsset[]
  length : number
}

export interface EtfPatchAssetPayload {
  asset_percentage_concentration_in_etf : number
  sector_uuid : string
  country_uuid : string
  asset_uuid : string
}

export interface EtfUpdateHolding {
  etf_holding : EtfHoldingsAsset
  sector_concentrations : SectorConcentrationEtf[]
  country_concentrations : CountryConcentrationEtf[]
}

export interface EtfPatchEtfHoldingPayload {
  asset_percentage_concentration_in_etf : string
  asset_uuid : string
  asset_name : string
}

export interface EtfPatchHoldingApi {
  asset_percentage_concentration_in_etf : number
  asset_uuid : string
}