import { useMemo } from "react";
import { toSelectOptions } from "../../components/SelectSearch/SelectSearchable";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import { AssetType, type MetaDataAssetShort } from "../../payloads/AssetPayload";
import { useNavigate } from "react-router-dom";

interface AssetRowProps {
  value: MetaDataAssetShort;
  sectors: SectorNameResponse[];
  countries: CountryNameResponse[];
  currencies : CurrencyNameResponse[];
  onClick?: () => void;
  type : AssetType
}

export function AssetRow( props :  AssetRowProps) {
  const navigate = useNavigate();
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
        <td>
          <button
            className="edit-btn-etf nav-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/etf/${props.value.asset.uuid}/concentration`);
            }}
            title="View Concentration"
          >
            <span>Concentration</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </td>
        </>
      )
      }
    </tr>
  );
}