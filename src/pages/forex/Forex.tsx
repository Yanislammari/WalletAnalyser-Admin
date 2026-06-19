import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import ForexService from "../../services/ForexService";
import type { ForexListMetaData } from "../../payloads/ForexPayload";
import AddForexForm, { type FormProps } from "./AddForex";
import { ForexRow } from "./ForexRow";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import CurrenciesService from "../../services/CurrenciesService";
import { useNavigate } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination";
import { LimitPicker } from "../../components/Pagination/LimitPicker";

const Forex: React.FC = () => {
  return (
    <PageLayout>
      <ForexDashboard />
    </PageLayout>
  );
};

const ForexDashboard: React.FC = () => {
  const navigate = useNavigate();
  const forexService = ForexService.getInstance();
  const [forexItems, setForexItems] = useState<ForexListMetaData | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyNameResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [form, setForm] = useState<FormProps>({ file: null, base_currency_uuid: "" });
  const [formLoading] = useState(false);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const currenciesResponse = await CurrenciesService.getInstance().getCurrencies();
        setCurrencies(currenciesResponse.currencies);
      } catch (error: any) {
        setHasError(true);
        toast.error(error.message);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchForexItems = async () => {
      try {
        if (forexItems == null) {
          setLoading(true);
        } else {
          setPageLoading(true);
        }
        const response = await forexService.getForexItems(search, limit, (currentPage - 1) * limit);
        setForexItems(response);
      } catch (error: any) {
        setHasError(true);
        toast.error(error.message);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchForexItems();
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

  const handleAddForex = async () => {
    const { file, base_currency_uuid } = form;
    if (!file || base_currency_uuid === "") {
      toast.error("All fields required");
      return;
    }

    toast.promise(
      forexService.postForex({ file, base_currency_uuid }),
      {
        loading: "Uploading forex data...",
        success: async (response) => {
          const newData = await forexService.getForexItems(search, limit, (currentPage - 1) * limit);
          setForexItems(newData);
          return (
            <span style={{ whiteSpace: "pre-line" }}>{response.message}</span>
          );
        },
        error: (e) =>
          e?.name === "TypeError"
            ? "File upload was interrupted. Please reselect the file."
            : e.message,
      }
    );
  };

  const handleEditForex = async (uuid: string, base_currency_uuid: string, quote_currency_uuid: string) => {
    try {
      if (!base_currency_uuid || !quote_currency_uuid) {
        toast.error("Both name and last update are required.");
        return;
      } else if (base_currency_uuid === quote_currency_uuid) {
        toast.error("Must be different currency");
        return;
      }
      const response = await forexService.patchForex({ base_currency_uuid, quote_currency_uuid }, uuid);
      setForexItems((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          forex_list: prev.forex_list.map((item) => (item.forex.uuid === response.forex.uuid ? response : item))
        }
      });
      toast.success("Forex item updated successfully.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteForex = async (uuid: string) => {
    try {
      const response = await forexService.delete(uuid);
      if (response.message === "Forex item deleted successfully" || response.message) {
        setForexItems((prev) => {
          if (!prev) return prev;
          return {
            length: prev.length - 1,
            forex_list: prev.forex_list.filter((item) => item.forex.uuid !== uuid) ?? []
          }
        });
        toast.success("Forex item deleted successfully.");
        return;
      }
      toast.error("Something went wrong while deleting this forex item.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (hasError) {
    return <ErrorContainer errorMessage={"An error occurred, try again later"} />;
  }

  if (loading || forexItems == null) {
    return <Loading />;
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">Forex Dashboard</p>

        <AddForexForm handleSend={handleAddForex} loading={formLoading} form={form} setForm={setForm} currencies={currencies ?? []} />

        <div className="table-wrap">
          <div className="table-header">
            <h2>Forex management</h2>
            <SearchBar value={search} onChange={(value) => { setSearch(value); setCurrentPage(1); }} />
            <LimitPicker limit={limit} total={forexItems.length} onGoTo={handleLimitChange} />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(forexItems.length / limit)} onPrev={handlePrev} onNext={handleNext} onGoTo={handlePageChange} disabled={pageLoading} />
          </div>

          <table style={{ overflow: "visible" }}>
            <colgroup>
              <col style={{ width: "19%" }} />
              <col style={{ width: "19%" }} />
              <col style={{ width: "35%" }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Base currency</th>
                <th>Quote currency</th>
                <th>Last update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forexItems.forex_list.map((item) => (
                <ForexRow
                  key={item.forex.uuid}
                  forexItem={item}
                  onSave={handleEditForex}
                  onDelete={handleDeleteForex}
                  options={currencies ?? []}
                  onClick={() => navigate(`/forex/${item.forex.uuid}`)}
                />
              ))}
              {forexItems.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ color: "gray", textAlign: "center", padding: "15px" }}>
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

export default Forex;