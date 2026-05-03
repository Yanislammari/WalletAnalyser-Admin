import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import type { RfrRateMetaData } from "../../payloads/RfrRatesPayload";
import Title from "../../components/Title";
import RfrRatesService from "../../services/RfrRatesService";
import { RfrRateRow } from "./RfrRates_component";
import type { FormProps } from "./AddRfrRates";
import AddRfrRatesForm from "./AddRfrRates";
import { useParams } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination";
import { LimitPicker } from "../../components/Pagination/LimitPicker";
import DateRangeBar from "../../components/SearchBar/DateRangeBar";


const RfrRates: React.FC = () => {
  return (
    <PageLayout>
      <RfrRatesDashboard />
    </PageLayout>
  );
};

const RfrRatesDashboard : React.FC = () => {
  const rfrRatesService = RfrRatesService.getInstance();
  const { rfr_country_uuid } = useParams();
  const [rfrRates , setRfrRates] = useState<RfrRateMetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ form, setForm] = useState<FormProps>({rfr_rate_name : ""})
  const [ formLoading, setFormLoading ] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit , setLimit] = useState(100);
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const isValidIso = (date: string) => {
    if (!date) return true; // empty is allowed (means "no filter")
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(new Date(date).getTime());
  };

  useEffect(() => {
    const fetchFiltered = async () => {
      if (!rfr_country_uuid) return;
      if (!isValidIso(from) || !isValidIso(to)) return;
      try {
        if(rfrRates == null) {
          setLoading(true)
        }
        setPageLoading(true);
        setCurrentPage(1);
        const response = await rfrRatesService.getRfrRates(rfr_country_uuid, 0, 100, from, to);
        setRfrRates(response);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setPageLoading(false);
        setLoading(false)
      }
    };

    fetchFiltered();
  }, [from, to]);

  const handleNext = async (direction : number) => {
    try {
      setPageLoading(true);
      const nextPage = currentPage + direction;
      const response = await rfrRatesService.getRfrRates(rfr_country_uuid!, nextPage *  limit - limit, limit, from, to);
      setRfrRates(response);
      setCurrentPage(nextPage);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleLimit = async (newLimit: number) => {
    try {
      setPageLoading(true);
      const position = (currentPage - 1) * limit;          // current scroll position (0-based offset)
      const newPage = Math.floor(position / newLimit) + 1; // which page contains that position
      const response = await rfrRatesService.getRfrRates(rfr_country_uuid!, newPage * newLimit - newLimit, newLimit, from, to);
      setRfrRates(response);
      setLimit(newLimit);
      setCurrentPage(newPage);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  }
  
  const handleGoTo = async (page: number) => {
    try {
      setPageLoading(true);
      const response = await rfrRatesService.getRfrRates(rfr_country_uuid!, page *  limit - limit, limit, from, to);
      setRfrRates(response);
      setCurrentPage(page);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddRfrRate = async () => {
    /**try {
      if( form.rfr_rate_name == ""){
        toast.error("All fields are required")
        return
      }
      setFormLoading(true)
      const response = await rfrRatesService.postRfrRate(form)
      const exists = rfrRates?.rfr_rates?.some(item => item.uuid === response.uuid);
      if (!exists) {
        setRfrRates((prev) => {
          if (!prev) return prev;

          const updated = [...(prev.rfr_rates ?? []), response].sort((a, b) =>
            a.rfr_rate_name.localeCompare(b.rfr_rate_name)
          );

          return {
            ...prev,
            rfr_rates: updated,
          };
        });
        toast.success(`RFR rate ${response.rfr_rate_name} added successfully`)
        return
      };
      toast.error(`RFR rate ${response.rfr_rate_name} already exists`)
    } catch(e : any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }**/
  }

  const handleEditRfrRate = async (uuid: string, newName: string) => {
    /**try {
      if( newName == ""){
        toast.error("All fields are required")
        return
      }
      const response = await rfrRatesService.patchRfrRate({rfr_rate_name : newName}, uuid)
        setRfrRates((prev) => {
          if (!prev) return prev;

          const updated = (prev.rfr_rates ?? [])
            .map((item) =>
              item.uuid === uuid ? response : item
            )
            .sort((a, b) =>
              a.rfr_rate_name.localeCompare(b.rfr_rate_name)
            );

          return {
            ...prev,
            rfr_rates: updated,
          };
        });
      toast.success(`RFR rate ${response.rfr_rate_name} updated successfully`)
    } catch(e : any) {
      toast.error(e.message)
    }**/
  }

  const handleDeleteRfrRate = async (uuid: string) => {
    /**try {
      const response = await rfrRatesService.delete(uuid)
      if(response.message === "RFR rate deleted successfully") {
        setRfrRates((prev) => {
          if (!prev) return prev;

          const updated = prev.rfr_rates?.filter(item => item.uuid !== uuid) ?? []
          return {
            ...prev,
            rfr_rates: updated,
          };
        });
        toast.success(`RFR rate deleted successfully`)
        return
      }
      toast.error(`Something went wrong while deleting this RFR rate`)
    } catch(e : any) {
      toast.error(e.message)
    }**/
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  if(rfrRates == null || hasError ) {
    return (
      <ErrorContainer errorMessage={"An error occured, try again later"} />
    );
  }

  return (
    <>
      <div className="dash-wrap">
      <Title title={`RFR Rates management : ${rfrRates.rfr_country.country_rfr.country_name}`} />
      <AddRfrRatesForm  form={form} setForm={setForm} handleSend={handleAddRfrRate} loading={formLoading}/>
        
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
                  <th className="email-cell">RFR date</th>
                  <th className="email-cell">RFR rate</th>
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
                      currentPage={currentPage} totalPages={Math.ceil(rfrRates.length / limit)} onPrev={()=>handleNext(-1)} onNext={()=>handleNext(1)} 
                      onGoTo={handleGoTo} disabled={pageLoading} accentColor={"#7c3fe8"}
                    />
                  </th>
                  <th><LimitPicker limit={limit} total={rfrRates.length} onGoTo={handleLimit} accentColor={"#7c3fe8"} /></th>
                </tr>
              </thead>
              {pageLoading ? (
                <Loading fullPage={false} spinnerSize={24} />
              ) : (
              <tbody>
                {(() => {
                  if (rfrRates.length === 0) {
                    return <p style={{ color: "gray", textAlign: "center", margin : "15px" }}>Aucun résultat trouvé.</p>;
                  }

                  return rfrRates.rfr_rates.map((rfr_rate) => (
                    <RfrRateRow key={rfr_rate.uuid} rfr_rate={rfr_rate} onSave={handleEditRfrRate} onDelete={handleDeleteRfrRate} />
                  ));
                })()}
              </tbody>
              )}
            </table>
        </div>
      </div>
    </>
  );
}

export default RfrRates;