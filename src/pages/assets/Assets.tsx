import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import AssetsService from "../../services/AssetsService";
import { AssetType, type AssetPatch, type MetaDataAssets, type MetaDataAssetShort } from "../../payloads/AssetPayload";
import AddAssetForm from "./AddAsset";
import { AssetRow } from "./AssetRow";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import SectorsService from "../../services/SectorsService";
import CountriesService from "../../services/CountriesService";
import CurrenciesService from "../../services/CurrenciesService";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination";
import { LimitPicker } from "../../components/Pagination/LimitPicker";

const Assets: React.FC = () => {
  return (
    <PageLayout>
      <AssetsDashboard />
    </PageLayout>
  );
};

const AssetsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const assetsService = AssetsService.getInstance();
  const [assets, setAssets] = useState<MetaDataAssets | null>(null);
  const [sectors, setSectors] = useState<SectorNameResponse[] | null>(null);
  const [countries, setCountries] = useState<CountryNameResponse[] | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyNameResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [form, setForm] = useState<AssetPatch>({country_uuid : null, base_currency_uuid : null, sector_uuid : null, ticker_name : "", type : AssetType.STOCKS, official_name : ""});
  const [formLoading, setFormLoading] = useState(false);

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
    const fetchAssets = async () => {
      try {
        if(assets == null){
          setLoading(true)
        } else {
          setPageLoading(true)
        }
        const response = await assetsService.getAssets(search, limit, (currentPage-1) * limit)
        setAssets(response);
      } catch (error: any) {
        setHasError(true);
        toast.error(error.message);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchAssets();
  }, [search, limit, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1);
  };

  const handleAddAsset = async () => {
    try {
      if( form.base_currency_uuid == null || form.country_uuid == null || form.sector_uuid == null || form.official_name == "" || form.ticker_name == "") {
        toast.error("All fields are required")
      }
      const exist = assets?.assets.find((value)=>value.asset.ticker_name == form.ticker_name || value.asset.official_name == form.official_name)
      if(exist) {
        toast.error("An asset already exist")
        return
      }
      setFormLoading(true)
      const response = await assetsService.postAsset(form)
      const assetsMetaData : MetaDataAssetShort = {
        asset : response,
        last_update : undefined
      }
      setAssets((prev) => {
        if (!prev) return prev;
        const updated = [...prev.assets, assetsMetaData].sort((a, b) => {
          const startsWithDigitA = /^[0-9]/.test(a.asset.official_name) ? 1 : 0;
          const startsWithDigitB = /^[0-9]/.test(b.asset.official_name) ? 1 : 0;

          if (startsWithDigitA !== startsWithDigitB) {
            return startsWithDigitA - startsWithDigitB; // digits-first entries go last
          }

          return a.asset.official_name.localeCompare(b.asset.official_name);
        })
        return {
          ...prev,
          assets : updated,
          length : prev.length + 1
        };
      });
      toast.success(`Asset ${form.official_name} added successfully`)
    } catch(e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false)
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (assets == null || hasError) {
    return <ErrorContainer errorMessage={"An error occurred, try again later"} />;
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">Assets Dashboard</p>

        <AddAssetForm handleSend={handleAddAsset} loading={formLoading} form={form} setForm={setForm} currencies={currencies ?? []} sectors={sectors ?? []} countries={countries ?? []} />

        <div className="table-wrap">
          <div className="table-header">
            <h2>Assets management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)} />
            <LimitPicker limit={limit} total={assets.length} onGoTo={handleLimitChange} />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(assets!.length / limit)} onPrev={handlePrev} onNext={handleNext} onGoTo={handlePageChange} disabled={pageLoading}/>
          </div>

          <table style={{ overflow: "visible" }}>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Sector</th>
                <th>Country</th>
                <th>Currency</th>
                <th>Last update</th>
              </tr>
            </thead>
            <tbody>
              {assets.assets.map((item) => (
                <AssetRow
                  key={item.asset.uuid}
                  asset={item}
                  sectors={sectors ?? []}
                  countries={countries ?? []}
                  currencies={currencies ?? []}
                  onClick={() => navigate(`/assets/${item.asset.uuid}`)}
                />
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ color: "gray", textAlign: "center", padding: "15px" }}>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Assets;
