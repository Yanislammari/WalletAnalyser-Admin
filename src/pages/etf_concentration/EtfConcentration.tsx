import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import Title from "../../components/Title";
import EtfConcentrationService from "../../services/EtfConcentrationService";
import { useParams } from "react-router-dom";
import { Pagination } from "../../components/Pagination/Pagination";
import { LimitPicker } from "../../components/Pagination/LimitPicker";
import SearchBar from "../../components/SearchBar/SearchBar";
import type { EtfconcentrationMetaData, EtfPatchEtfHoldingPayload } from "../../payloads/EtfConcentrationPayload";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import CountriesService from "../../services/CountriesService";
import SectorsService from "../../services/SectorsService";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import { ModifyConcentrationRow } from "./EtfConcentrationRow";
import UpdateEtfHoldings from "./UpdateEtfHoldings";
import AddEtfHolding from "./AddEtfConcentration";

const EtfConcentration: React.FC = () => {
  return (
    <PageLayout>
      <EtfConcentrationDashboard/>
    </PageLayout>
  );
};

const EtfConcentrationDashboard: React.FC = () => {
  const etfConcentrationService = EtfConcentrationService.getInstance();
  const { etf_uuid } = useParams();
  const [etfConcentrations, setEtfConcentrations] = useState<EtfconcentrationMetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [countries, setCountries] = useState<CountryNameResponse[] | null>(null);
  const [sectors, setSectors] = useState<SectorNameResponse[] | null>(null);
  const [form, setForm] = useState<EtfPatchEtfHoldingPayload>({asset_percentage_concentration_in_etf : "", asset_name : "", asset_uuid : ""});
  const [updateForm, setUpdateForm] = useState<string>("")
  const [formLoading, setFormLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [pageLoading, setPageLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        setLoading(true);
        setCurrentPage(1);
        const [response, countriesResponse, sectorsResponse] = await Promise.all([
          etfConcentrationService.getEtfDefault(etf_uuid!),
          CountriesService.getInstance().getCountries(),
          SectorsService.getInstance().getSectors(),
        ]);
        setSectors(sectorsResponse.sectors);
        setCountries(countriesResponse.countries);
        setEtfConcentrations(response);
      } catch (error: any) {
        setHasError(true)
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (etf_uuid) {
      fetchFiltered();
    }
  }, []);

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        if (etfConcentrations == null) {
          setLoading(true);
        } else {
          setPageLoading(true);
        }
        const response = await etfConcentrationService.getEtfOffset(etf_uuid!, search, (currentPage - 1) * limit, limit);
        setEtfConcentrations((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            length: response.length,
            etf_asset: response.etf_asset
          };
        });
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };

    fetchFiltered();
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

  const handleAddEtfConcentration = async () => {
    try {
      const { asset_uuid, asset_percentage_concentration_in_etf } = form;
      const percent = Number(asset_percentage_concentration_in_etf)
      if (asset_uuid === "" || asset_percentage_concentration_in_etf  == "") {
        toast.error("All fields are required");
        return;
      }
      setFormLoading(true);
      const response = await etfConcentrationService.postEtfConcentration({asset_uuid, asset_percentage_concentration_in_etf : percent}, etf_uuid!);
      setEtfConcentrations((prev) => {
        if (!prev) return prev;
        const updated = [...(prev.etf_asset ?? []), response.etf_holding]
          .sort((a, b) => b.asset_percentage_concentration_in_etf - a.asset_percentage_concentration_in_etf);
        return {
          ...prev,
          etf_asset: updated,
          sector_concentrations : response.sector_concentrations,
          country_concentrations : response.country_concentrations,
          length : prev.length + 1
        };
      });
      toast.success("ETF concentration added successfully");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditEtfConcentration = async (asset_uuid: string, sector_uuid: string, country_uuid: string, asset_percentage_concentration_in_etf : number) => {
    try {
      if (sector_uuid === "" || country_uuid === "" || isNaN(asset_percentage_concentration_in_etf) || asset_percentage_concentration_in_etf === 0) {
        toast.error("All fields are required");
        return;
      }
      const response = await etfConcentrationService.patchEtfConcentration({ asset_uuid, sector_uuid, country_uuid, asset_percentage_concentration_in_etf}, etf_uuid!);
      setEtfConcentrations((prev) => {
        if (!prev) return prev;
        const updated = (prev.etf_asset ?? [])
          .map((item) => (item.uuid === response.etf_holding.uuid ? response.etf_holding : item))
          .sort((a, b) => b.asset_percentage_concentration_in_etf - a.asset_percentage_concentration_in_etf);
        return {
          ...prev,
          etf_asset: updated,
          sector_concentrations : response.sector_concentrations,
          country_concentrations : response.country_concentrations
        };
      });
      toast.success("ETF concentration updated successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleUpdateHoldings = async () => {
    const toastId = toast.loading(`Uploading concentration etf data. This can take a while ...`);
    setLoading(true)
    try {
      const response = await etfConcentrationService.patchAllEtfConcentration(updateForm, etf_uuid!);
      setEtfConcentrations(response);
      toast.success("Update of etf concentration done successfully", { id: toastId });
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    } finally {
      setLoading(false)
    }
  };

  const handleDeleteEtfConcentration = async (uuid: string) => {
    try {
      const response = await etfConcentrationService.delete(uuid);
      if (response.message === "Holding deleted successfully") {
        const holding = etfConcentrations?.etf_asset.find((v) => v.uuid === uuid);
        const amount = holding?.asset_percentage_concentration_in_etf ?? 0;
        setEtfConcentrations((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            etf_asset: prev.etf_asset.filter((item) => item.uuid !== uuid) ?? prev.etf_asset,

            country_concentrations: prev.country_concentrations.map((country) => {
              if ( country.country_uuid === holding?.asset.country?.uuid) {
                return {
                  ...country,
                  percentage_in_country:
                  country.percentage_in_country - amount,
                };
              }
              return country;
            }) ?? [],

            sector_concentrations: prev.sector_concentrations?.map((sector) => {
              if ( sector.sector_uuid === holding?.asset.sector?.uuid) {
                return {
                  ...sector,
                  percentage_in_sector:
                  sector.percentage_in_sector - amount,
                };
              }

              return sector;
            }) ?? [],

            length: prev.length - 1,
          };
        });

        return toast.success(response.message);
      }
      toast.error("Something went wrong while deleting this concentration");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (hasError) {
    return <ErrorContainer errorMessage={"An error occurred, try again later"} />;
  }

  if (loading || etfConcentrations == null) {
    return <Loading />;
  }

  return (
    <>
      <div className="dash-wrap">
        <Title title={`ETF Concentration management : ${etfConcentrations.etf.official_name}`} />

        <UpdateEtfHoldings handleSend={handleUpdateHoldings} loading={formLoading} form={updateForm} setForm={setUpdateForm} 
          sectors={etfConcentrations.sector_concentrations} countries={etfConcentrations.country_concentrations}
        />

        <AddEtfHolding handleSend={handleAddEtfConcentration} form={form} setForm={setForm} loading={formLoading} />

        <div className="table-wrap">
          <div className="table-header">
            <h2>ETF Concentrations</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)} />
            <LimitPicker limit={limit} total={etfConcentrations.length} onGoTo={handleLimitChange} />
            <Pagination currentPage={currentPage} totalPages={Math.ceil(etfConcentrations.length / limit)} onPrev={handlePrev} onNext={handleNext} onGoTo={handlePageChange} disabled={pageLoading}/>
          </div>

          <table style={{ overflow: "visible" }}>
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "15%" }} />
              <col />
            </colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th>Sector</th>
                <th>Country</th>
                <th>Percentage</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {etfConcentrations.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ color: "gray", textAlign: "center", padding: "15px" }}>
                    No results found.
                  </td>
                </tr>
              ) : (
                etfConcentrations.etf_asset.map((concentration) => (
                  <ModifyConcentrationRow key={concentration.uuid} value={concentration}
                    countries={countries ?? []} sectors={sectors ?? []} onSave={handleEditEtfConcentration} onDelete={handleDeleteEtfConcentration}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EtfConcentration;