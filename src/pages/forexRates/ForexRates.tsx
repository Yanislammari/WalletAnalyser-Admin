import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import type { ForexRateMetaData } from "../../payloads/ForexRatesPayload";
import Title from "../../components/Title";
import ForexRatesService from "../../services/ForexRatesService";
import { ForexRateRow } from "./ForexRates_component";
import { useParams } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination";
import { LimitPicker } from "../../components/Pagination/LimitPicker";
import DateRangeBar from "../../components/SearchBar/DateRangeBar";
import type { FormProps } from "./AddForexRates";
import AddForexRatesForm from "./AddForexRates";

const ForexRates: React.FC = () => {
  return (
    <PageLayout>
      <ForexRatesDashboard />
    </PageLayout>
  );
};

const ForexRatesDashboard: React.FC = () => {
  const forexRatesService = ForexRatesService.getInstance();
  const { forex_uuid } = useParams();
  const [forexRates, setForexRates] = useState<ForexRateMetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [form, setForm] = useState<FormProps>({ forex_rate_date: null, forex_rate: null });
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [pageLoading, setPageLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const isValidIso = (date: string) => {
    if (!date) return true;
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
  };

  useEffect(() => {
    const fetchFiltered = async () => {
      if (!forex_uuid) return;
      if (!isValidIso(from) || !isValidIso(to)) return;
      try {
        if (forexRates == null) {
          setLoading(true);
        }
        setPageLoading(true);
        setCurrentPage(1);
        const response = await forexRatesService.getForexRates(forex_uuid, 0, 100, from, to);
        setLimit(response.length < 100 ? response.length < 50 ? 25 : 50 : 100);
        setForexRates(response);
      } catch (error: any) {
        if(forexRates == null) {
          setHasError(true)
        }
        toast.error(error.message);
      } finally {
        setPageLoading(false);
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [from, to]);

  const handleNext = async (direction: number) => {
    if (!forex_uuid) return;
    try {
      setPageLoading(true);
      const nextPage = currentPage + direction;
      const response = await forexRatesService.getForexRates(forex_uuid, nextPage * limit - limit, limit, from, to);
      setForexRates(response);
      setCurrentPage(nextPage);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleLimit = async (newLimit: number) => {
    if (!forex_uuid) return;
    try {
      setPageLoading(true);
      const position = (currentPage - 1) * limit;
      const newPage = Math.floor(position / newLimit) + 1;
      const response = await forexRatesService.getForexRates(forex_uuid, newPage * newLimit - newLimit, newLimit, from, to);
      setForexRates(response);
      setLimit(newLimit);
      setCurrentPage(newPage);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleGoTo = async (page: number) => {
    if (!forex_uuid) return;
    try {
      setPageLoading(true);
      const response = await forexRatesService.getForexRates(forex_uuid, page * limit - limit, limit, from, to);
      setForexRates(response);
      setCurrentPage(page);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddForexRate = async () => {
    if (!forex_uuid) return;
    try {
      const { forex_rate_date, forex_rate } = form;
      if (forex_rate_date == null || forex_rate == null) {
        toast.error("All fields are required");
        return;
      }
      setFormLoading(true);
      const response = await forexRatesService.postForexRate({ forex_rate_date, forex_rate }, forex_uuid);
      setForexRates((prev) => {
        if (!prev) return prev;
        const updated = [...(prev.forex_rates ?? []), response].sort((a, b) => new Date(b.forex_rate_date).getTime() - new Date(a.forex_rate_date).getTime());
        return {
          ...prev,
          length: prev.length + 1,
          forex_rates: updated,
        };
      });
      toast.success("Forex rate added successfully");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditForexRate = async (uuid: string, forex_rate_date: Date | null, forex_rate: number | null) => {
    try {
      if (forex_rate_date == null || forex_rate == null) {
        toast.error("All fields are required");
        return;
      }
      const response = await forexRatesService.patchForexRate({ forex_rate_date, forex_rate }, uuid);
      setForexRates((prev) => {
        if (!prev) return prev;
        const updated = (prev.forex_rates ?? [])
          .map((item) => (item.uuid === response.uuid ? response : item))
          .sort((a, b) => new Date(b.forex_rate_date).getTime() - new Date(a.forex_rate_date).getTime());
        return {
          ...prev,
          forex_rates: updated,
        };
      });
      toast.success("Forex rate updated successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteForexRate = async (uuid: string) => {
    try {
      const response = await forexRatesService.delete(uuid);
      if (response.message === "Forex rate deleted successfully") {
        setForexRates((prev) => {
          if (!prev) return prev;
          const updated = prev.forex_rates?.filter((item) => item.uuid !== uuid) ?? [];
          return {
            ...prev,
            forex_rates: updated,
            length : prev.length - 1
          };
        });
        toast.success("Forex rate deleted successfully");
        return;
      }
      toast.error("Something went wrong while deleting this forex rate");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (hasError) {
    return <ErrorContainer errorMessage={"An error occurred, try again later"} />;
  }

  if (loading || forexRates == null) {
    return <Loading />;
  }

  return (
    <div className="dash-wrap">
      <Title title={`Forex Rates management : ${forexRates.forex.baseCurrency.currency_name}/${forexRates.forex.quoteCurrency.currency_name}`} />
      <AddForexRatesForm form={form} setForm={setForm} handleSend={handleAddForexRate} loading={formLoading} />

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
              <th className="email-cell">Forex date</th>
              <th className="email-cell">Forex rate</th>
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
                  totalPages={Math.ceil(forexRates.length / limit)}
                  onPrev={() => handleNext(-1)}
                  onNext={() => handleNext(1)}
                  onGoTo={handleGoTo}
                  disabled={pageLoading}
                  accentColor="#7c3fe8"
                />
              </th>
              <th>
                <LimitPicker limit={limit} total={forexRates.length} onGoTo={handleLimit} accentColor="#7c3fe8" />
              </th>
            </tr>
          </thead>
          {pageLoading ? (
            <Loading fullPage={false} spinnerSize={24} />
          ) : (
            <tbody>
              {forexRates.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ color: "gray", textAlign: "center", padding: "15px" }}>
                    No results found.
                  </td>
                </tr>
              ) : (
                forexRates.forex_rates.map((forex_rate) => (
                  <ForexRateRow
                    key={forex_rate.uuid}
                    forexRate={forex_rate}
                    onSave={handleEditForexRate}
                    onDelete={handleDeleteForexRate}
                  />
                ))
              )}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default ForexRates;
