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
import type { EtfconcentrationMetaData, EtfPatchAssetPayload } from "../../payloads/EtfConcentrationPayload";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import CountriesService from "../../services/CountriesService";
import SectorsService from "../../services/SectorsService";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import { ModifyConcentrationRow } from "./EtfConcentrationRow";

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
  const [form, setForm] = useState<EtfPatchAssetPayload>({asset_percentage_concentration_in_etf : 0, sector_uuid : "", country_uuid : "", asset_uuid : ""});
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

  /**const handleAddEtfConcentration = async () => {
    if (!etf_uuid) return;
    try {
      const { name, sector, country, percentage } = form;
      if (name === "" || sector === "" || country === "" || percentage === 0) {
        toast.error("All fields are required");
        return;
      }
      setFormLoading(true);
      const response = await etfConcentrationService.postEtfConcentration(form, etf_uuid);
      setEtfConcentrations((prev) => {
        if (!prev) return prev;
        const updated = [...(prev.concentrations ?? []), response].sort((a, b) => a.name.localeCompare(b.name));
        return {
          ...prev,
          length: prev.length + 1,
          concentrations: updated,
        };
      });
      toast.success("ETF concentration added successfully");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setFormLoading(false);
    }
  };**/

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
          .map((item) => (item.uuid === response.uuid ? response : item))
          .sort((a, b) => b.asset_percentage_concentration_in_etf - a.asset_percentage_concentration_in_etf);
        return {
          ...prev,
          etf_asset: updated,
        };
      });
      toast.success("ETF concentration updated successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  /**const handleDeleteEtfConcentration = async (uuid: string) => {
    try {
      const response = await etfConcentrationService.delete(uuid);
      if (response.message === "Concentration deleted successfully") {
        setEtfConcentrations((prev) => {
          if (!prev) return prev;
          const updated = prev.concentrations?.filter((item) => item.uuid !== uuid) ?? [];
          return {
            ...prev,
            concentrations: updated,
            length: prev.length - 1,
          };
        });
        toast.success("ETF concentration deleted successfully");
        return;
      }
      toast.error("Something went wrong while deleting this concentration");
    } catch (e: any) {
      toast.error(e.message);
    }
  };**/

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
                    countries={countries ?? []} sectors={sectors ?? []} onSave={handleEditEtfConcentration}
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