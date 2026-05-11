import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import AssetsService from "../../services/AssetsService";
import { AssetType, type AssetPatch, type MetaDataAssets, type MetaDataAssetShort } from "../../payloads/AssetPayload";
import { AssetRow } from "../assets/AssetRow";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import CurrenciesService from "../../services/CurrenciesService";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination";
import { LimitPicker } from "../../components/Pagination/LimitPicker";
import AddAssetForm from "../assets/AddAsset";

const Assets: React.FC = () => {
  return (
    <PageLayout>
      <EtfDashboard />
    </PageLayout>
  );
};

const EtfDashboard: React.FC = () => {
  const etfType = AssetType.ETF
  const navigate = useNavigate();
  const assetsService = AssetsService.getInstance();
  const [assets, setAssets] = useState<MetaDataAssets | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyNameResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [form, setForm] = useState<AssetPatch>({country_uuid : null, base_currency_uuid : null, sector_uuid : null, ticker_name : "", type : etfType, official_name : ""});
  const [formLoading, setFormLoading] = useState(false);

  useEffect(()=>{
    const fetchOthers = async () => {
      setLoading(true);
      try {
        const [ currenciesResponse ] = await Promise.all([
          CurrenciesService.getInstance().getCurrencies(),
        ]);
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
        const response = await assetsService.getAssets(etfType, search, limit, (currentPage-1) * limit)
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
      if( form.base_currency_uuid == null || form.official_name == "" || form.ticker_name == "") {
        toast.error("All fields are required")
        return
      }
      const exist = assets?.assets.find((value)=>value.asset.ticker_name.toLowerCase() == form.ticker_name.toLowerCase() || value.asset.official_name.toLowerCase() == form.official_name.toLowerCase())
      if(exist) {
        toast.error("An etf already exist")
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

  if (hasError) {
    return <ErrorContainer errorMessage={"An error occurred, try again later"} />;
  }

  if (loading || assets == null) {
    return <Loading />;
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">ETF Dashboard</p>

        <AddAssetForm handleSend={handleAddAsset} loading={formLoading} form={form} setForm={setForm} currencies={currencies ?? []} sectors={[]} countries={[]} 
          type={etfType} title="Add a new etf"/>

        <div className="table-wrap">
          <div className="table-header">
            <h2>ETF management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)} />
            <LimitPicker limit={limit} total={assets.length} onGoTo={handleLimitChange} />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(assets!.length / limit)} onPrev={handlePrev} onNext={handleNext} onGoTo={handlePageChange} disabled={pageLoading}/>
          </div>

          <table style={{ overflow: "visible" }}>
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col/>
            </colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Currency</th>
                <th>Last update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.assets.map((item) => (
                <AssetRow key={item.asset.uuid} value={item}
                  sectors={[]} countries={[]} currencies={currencies ?? []}
                  onClick={() => navigate(`/etf/${item.asset.uuid}`)} type={etfType}
                />
              ))}
              {assets.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: "gray", textAlign: "center", padding: "15px" }}>
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
