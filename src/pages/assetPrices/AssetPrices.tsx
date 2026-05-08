import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import type { AssetPriceMetaData } from "../../payloads/AssetPricesPayload";
import Title from "../../components/Title";
import AssetPricesService from "../../services/AssetPricesService";
import { AssetPriceRow } from "./AssetPrices_component";
import { useNavigate, useParams } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination";
import { LimitPicker } from "../../components/Pagination/LimitPicker";
import DateRangeBar from "../../components/SearchBar/DateRangeBar";
import type { FormProps } from "./AddAssetPrices";
import AddAssetPricesForm from "./AddAssetPrices";
import SectorsService from "../../services/SectorsService";
import CountriesService from "../../services/CountriesService";
import CurrenciesService from "../../services/CurrenciesService";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import AddAssetForm from "../assets/AddAsset";
import { AssetType, type AssetPatch } from "../../payloads/AssetPayload";
import AssetsService from "../../services/AssetsService";
import DeleteAsset from "./ButtonAsset";
import ButtonForm from "./ButtonAsset";

const AssetPrices: React.FC = () => {
  return (
    <PageLayout>
      <AssetPricesDashboard />
    </PageLayout>
  );
};

const AssetPricesDashboard: React.FC = () => {
  const assetPricesService = AssetPricesService.getInstance();
  const navigate = useNavigate();
  const { asset_uuid } = useParams();
  const [assetPrices, setAssetPrices] = useState<AssetPriceMetaData | null>(null);
  const [sectors, setSectors] = useState<SectorNameResponse[] | null>(null);
  const [countries, setCountries] = useState<CountryNameResponse[] | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyNameResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [form, setForm] = useState<FormProps>({ asset_price_date: null, asset_price: null });
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [pageLoading, setPageLoading] = useState(false);
  const [patchForm, setPatchForm] = useState<AssetPatch>({country_uuid : null, base_currency_uuid : null, sector_uuid : null, ticker_name : "", type : AssetType.STOCKS, official_name : ""});
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");

  const isValidIso = (date: string) => {
    if (!date) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
  };

  useEffect(()=>{
    const fetchOthers = async () => {
      setLoading(true);
      try {
        const [sectorsResponse, countriesResponse, currenciesResponse] = await Promise.all([
          SectorsService.getInstance().getSectors(),
          CountriesService.getInstance().getCountries(),
          CurrenciesService.getInstance().getCurrencies(),
        ]);
        setSectors(sectorsResponse.sectors);
        setCountries(countriesResponse.countries);
        setCurrencies(currenciesResponse.currencies);
      } catch (error: any) {
        setHasError(true);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOthers()
  },[])

  useEffect(() => {
    const fetchFiltered = async () => {
      if (!asset_uuid) return;
      if (!isValidIso(from) || !isValidIso(to)) return;
      try {
        if (assetPrices == null) {
          setLoading(true);
        }
        setPageLoading(true);
        setCurrentPage(1);
        const response = await assetPricesService.getAssetPrices(asset_uuid, 0, 100, from, to);
        setPatchForm({...response.asset, type : AssetType.STOCKS})
        setLimit(response.length < 100 ? (response.length < 50 ? 25 : 50) : 100);
        setAssetPrices(response);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setPageLoading(false);
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [asset_uuid, from, to]);

  const handleNext = async (direction: number) => {
    if (!asset_uuid) return;
    try {
      setPageLoading(true);
      const nextPage = currentPage + direction;
      const response = await assetPricesService.getAssetPrices(asset_uuid, nextPage * limit - limit, limit, from, to);
      setAssetPrices(response);
      setCurrentPage(nextPage);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleLimit = async (newLimit: number) => {
    if (!asset_uuid) return;
    try {
      setPageLoading(true);
      const position = (currentPage - 1) * limit;
      const newPage = Math.floor(position / newLimit) + 1;
      const response = await assetPricesService.getAssetPrices(asset_uuid, newPage * newLimit - newLimit, newLimit, from, to);
      setAssetPrices(response);
      setLimit(newLimit);
      setCurrentPage(newPage);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleGoTo = async (page: number) => {
    if (!asset_uuid) return;
    try {
      setPageLoading(true);
      const response = await assetPricesService.getAssetPrices(asset_uuid, page * limit - limit, limit, from, to);
      setAssetPrices(response);
      setCurrentPage(page);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddAssetPrice = async () => {
    if (!asset_uuid) return;
    try {
      const { asset_price_date, asset_price } = form;
      if (asset_price_date == null || asset_price == null) {
        toast.error("All fields are required");
        return;
      }
      setFormLoading(true);
      const response = await assetPricesService.postAssetPrice({ asset_price_date, asset_price }, asset_uuid);
      setAssetPrices((prev) => {
        if (!prev) return prev;
        const updated = [...(prev.asset_prices ?? []), response].sort(
          (a, b) => new Date(b.asset_price_date).getTime() - new Date(a.asset_price_date).getTime()
        );
        return {
          ...prev,
          length: prev.length + 1,
          asset_prices: updated,
        };
      });
      toast.success("Asset price added successfully");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditAssetPrice = async (uuid: string, asset_price_date: Date | null, asset_price: number | null) => {
    try {
      if (asset_price_date == null || asset_price == null) {
        toast.error("All fields are required");
        return;
      }
      const response = await assetPricesService.patchAssetPrice({ asset_price_date, asset_price }, uuid);
      setAssetPrices((prev) => {
        if (!prev) return prev;
        const updated = (prev.asset_prices ?? [])
          .map((item) => (item.uuid === response.uuid ? response : item))
          .sort((a, b) => new Date(b.asset_price_date).getTime() - new Date(a.asset_price_date).getTime());
        return {
          ...prev,
          asset_prices: updated,
        };
      });
      toast.success("Asset price updated successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteAssetPrice = async (uuid: string) => {
    try {
      const response = await assetPricesService.delete(uuid);
      if (response.message === "Asset price deleted successfully") {
        setAssetPrices((prev) => {
          if (!prev) return prev;
          const updated = prev.asset_prices?.filter((item) => item.uuid !== uuid) ?? [];
          return {
            ...prev,
            asset_prices: updated,
            length: prev.length - 1,
          };
        });
        toast.success("Asset price deleted successfully");
        return;
      }
      toast.error("Something went wrong while deleting this asset price");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEditAsset = async () => {
    try {
      if( patchForm.base_currency_uuid == null || patchForm.country_uuid == null || patchForm.sector_uuid == null || patchForm.official_name == "" || patchForm.ticker_name == "") {
        toast.error("All fields are required")
        return
      }
      setFormLoading(true)
      const response = await AssetsService.getInstance().patchAsset(patchForm, asset_uuid!)
      setAssetPrices((prev)=>{
        if(!prev) return null
        return { ...prev, asset : response}
      });
      toast.success(`Asset ${patchForm.official_name} modified successfully`)
    } catch(e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false)
    }
  };

  const handleDeleteAsset = async () => {
    try {
      setFormLoading(true)
      await AssetsService.getInstance().delete(asset_uuid!);
      toast.success("Asset deleted successfully.");
      navigate("/assets", { replace : true })
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false)
    }
  };

  const updateStockPrice = async () => {
    toast.promise(
      assetPricesService.updatePricesFromExternalApi(asset_uuid!, currentPage * limit - limit, limit, from, to ),
      {
        loading: "Uploading prices data...",
        success: async (response) => {
          setAssetPrices(response.response)
          return (
            <span style={{ whiteSpace: "pre-line" }}>{response.message}</span>
          );
        },
        error: (e) => e?.name === e.message,
      }
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (assetPrices == null || hasError) {
    return <ErrorContainer errorMessage={"An error occured, try again later"} />;
  }

  return (
    <>
      <div className="dash-wrap">
        <Title title={`Asset Price management : ${assetPrices.asset.official_name} (${assetPrices.asset.ticker_name})`} />
        <AddAssetForm form={patchForm} setForm={setPatchForm} handleSend={handleEditAsset} loading={formLoading} 
          currencies={ currencies ?? [] } countries={ countries ?? [] } sectors={ sectors ?? [] } title={"Modify this stock"}/>
        <ButtonForm handleSend={handleDeleteAsset} loading={formLoading} title="Delete the stock" buttonName="Delete the stock" titleDialog="Delete the stock" textDialog="This will delete a stock and all his prices, this cannot be undone"/>
        <ButtonForm handleSend={updateStockPrice} loading={formLoading} title="Update stock price" buttonName="Get all prices" titleDialog="Fetch all prices from api" textDialog="This will fetch all prices from the external API. This can take quite some times and is hard to undone."/>
        <AddAssetPricesForm form={form} setForm={setForm} handleSend={handleAddAssetPrice} loading={formLoading} />

        <div className="table-wrap">
          <table className="country-table">
            <colgroup>
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "25%" }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th className="email-cell">Asset price date</th>
                <th className="email-cell">Asset price</th>
                <th>
                  <DateRangeBar
                    from={from}
                    to={to}
                    onFromChange={setFrom}
                    onToChange={setTo}
                    disabled={loading}
                    style={{ color: "#7c3fe8", borderColor: "#7c3fe8" }}
                  />
                </th>
                <th>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(assetPrices.length / limit)}
                    onPrev={() => handleNext(-1)}
                    onNext={() => handleNext(1)}
                    onGoTo={handleGoTo}
                    disabled={pageLoading}
                    accentColor="#7c3fe8"
                  />
                </th>
                <th>
                  <LimitPicker limit={limit} total={assetPrices.length} onGoTo={handleLimit} accentColor="#7c3fe8" />
                </th>
              </tr>
            </thead>
            {pageLoading ? (
              <Loading fullPage={false} spinnerSize={24} />
            ) : (
              <tbody>
                {assetPrices.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ color: "gray", textAlign: "center", padding: "15px" }}>
                      No results found.
                    </td>
                  </tr>
                ) : (
                  assetPrices.asset_prices.map((assetPrice) => (
                    <AssetPriceRow
                      key={assetPrice.uuid}
                      assetPrice={assetPrice}
                      onSave={handleEditAssetPrice}
                      onDelete={handleDeleteAssetPrice}
                    />
                  ))
                )}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default AssetPrices;
