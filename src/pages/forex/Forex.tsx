import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import ForexService from "../../services/ForexService";
import type { ForexMetaData } from "../../payloads/ForexPayload";
import AddForexForm, { type FormProps } from "./AddForex";
import { ForexRow } from "./ForexRow";
import type { CurrencyNameResponse } from "../../payloads/CurrencyPayload";
import CurrenciesService from "../../services/CurrenciesService";
import { useNavigate } from "react-router-dom";

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
  const [forexItems, setForexItems] = useState<ForexMetaData[] | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyNameResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<FormProps>({ file: null });
  const [formLoading] = useState(false);

  useEffect(() => {
    const fetchForexItems = async () => {
      setLoading(true);
      try {
        const [response, currenices ] = await Promise.all([
          forexService.getForexItems(),
          CurrenciesService.getInstance().getCurrencies()
        ]);
        setForexItems(response.forex_list);
        setCurrencies(currenices.currencies)
      } catch (error: any) {
        setHasError(true);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchForexItems();
  }, [forexService]);

  const handleAddForex = async () => {
    /**try {
      if (!form.file) {
        toast.error("Please choose an Excel file before sending.");
        return;
      }
      setFormLoading(true);
      const response = await forexService.postForex({ file: form.file });
      setForexItems(response.forex_items);
      setForm({ file: null });
      toast.success("Forex data imported successfully.");
    } catch (e: any) {
      if (e?.name === "TypeError") {
        toast.error("File upload was interrupted. Please reselect the file.");
        return;
      }
      toast.error(e.message);
    } finally {
      setFormLoading(false);
    }**/
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
        return prev.map((item) => (item.forex.uuid === response.forex.uuid ? response : item));
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
        setForexItems((prev) => prev?.filter((item) => item.forex.uuid !== uuid) ?? []);
        toast.success("Forex item deleted successfully.");
        return;
      }
      toast.error("Something went wrong while deleting this forex item.");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (forexItems == null || hasError) {
    return <ErrorContainer errorMessage={"An error occured, try again later"} />;
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">Forex Dashboard</p>

        <AddForexForm handleSend={handleAddForex} loading={formLoading} form={form} setForm={setForm} />

        <div className="table-wrap">
          <div className="table-header">
            <h2>Forex management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)} />
            <div style={{ color: "white" }}>{forexItems.length ?? 0} elements</div>
          </div>

          <table style={{ overflow: "visible" }}>
            <colgroup>
              <col style={{ width: "19%" }} />
              <col style={{width : "19%"}} />
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
              {forexItems.filter((item) =>item.forex.quoteCurrency.currency_name.toLowerCase().includes(search.toLowerCase())).map((item) => (
                <ForexRow
                  key={item.forex.uuid}
                  forexItem={item}
                  onSave={handleEditForex}
                  onDelete={handleDeleteForex}
                  options={currencies ?? []}
                  onClick={() => navigate(`/forex/${item.forex.uuid}`)}
                />
              ))}
              {forexItems.filter((item) => item.forex.quoteCurrency.currency_name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                <tr>
                  <td colSpan={3} style={{ color: "gray", textAlign: "center", padding: "15px" }}>
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
