import type { RfrCountry } from "./RfrCountryPayload"

export interface RiskFreeRateShort {
  uuid : string
  rfr_date : Date
  rfr_percent_rate : number
}

export interface GetRfrRatePayload {
  offset : number
  size : number
}

export interface RfrRateMetaData {
  length : number
  rfr_rates : RiskFreeRateShort[]
  rfr_country : RfrCountry
}
