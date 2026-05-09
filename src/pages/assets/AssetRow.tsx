import { useMemo } from "react";
import { toSelectOptions } from "../../components/SelectSearch/SelectSearchable";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import { AssetType, type MetaDataAssetShort } from "../../payloads/AssetPayload";

interface AssetRowProps {
  value: MetaDataAssetShort;
  sectors: SectorNameResponse[];
  countries: CountryNameResponse[];
  currencies : CurrencyNameResponse[];
  onClick?: () => void;
  type : AssetType
}

export function AssetRow( props :  AssetRowProps) {
  const sectorOptions = useMemo(
    () => toSelectOptions(props.sectors, (s) => s.uuid, (s) => s.sector_name),
    [props.sectors]
  );

  const countryOptions = useMemo(
    () => toSelectOptions(props.countries, (c) => c.uuid, (c) => c.country_name),
    [props.countries]
  );

  const currenciesOptions = useMemo(
    () => toSelectOptions(props.currencies, (s) => s.uuid, (s) => s.currency_name),
    [props.currencies]
  );

  const selectedSector = sectorOptions.find((value) => value.uuid === props.value.asset.sector_uuid)?.label ?? ""
  const selectedCountry = countryOptions.find((value) => value.uuid === props.value.asset.country_uuid)?.label ?? ""
  const selectedCurrency = currenciesOptions.find((value) => value.uuid === props.value.asset.base_currency_uuid)?.label ?? ""

  return (
    <tr onClick={() => {
        props.onClick?.();
    }} style={{ cursor: "pointer"}}>
      { props.type == AssetType.STOCKS && (
        <>
        <td>{props.value.asset.official_name}</td>
        <td>{props.value.asset.ticker_name}</td>
        <td>{selectedSector}</td>
        <td>{selectedCountry}</td>
        <td>{selectedCurrency}</td>
        <td>
          {props.value.last_update
            ? new Date(props.value.last_update).toLocaleDateString("fr-FR")
            : "No date"}
        </td>
        </>
      )}
      { props.type == AssetType.ETF && (
        <>
        <td>{props.value.asset.official_name}</td>
        <td>{props.value.asset.ticker_name}</td>
        <td>{selectedCurrency}</td>
        <td>
          {props.value.last_update
            ? new Date(props.value.last_update).toLocaleDateString("fr-FR")
            : "No date"}
        </td>
        </>
      )
        
      }
    </tr>
  );
}