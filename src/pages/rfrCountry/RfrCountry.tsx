import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import type { RfrCountryItem } from "../../payloads/RfrCountryPayload";
import RfrCountryService from "../../services/RfrCountryService";
import { RfrCountryRow } from "./RfrCountryRow";
import CountriesService from "../../services/CountriesService";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import AddRfrCountry, { type FormProps } from "./AddRfrCountry";
import { useNavigate } from "react-router";

const RfrCountry: React.FC = () => {
  return (
    <PageLayout>
      <RfrCountryDashboard />
    </PageLayout>
  );
};

const RfrCountryDashboard: React.FC = () => {
  const rfrCountryService = RfrCountryService.getInstance();
  const countriesService = CountriesService.getInstance();
  const navigate = useNavigate();
  const [rfrCountries, setRfrCountries] = useState<RfrCountryItem[] | null>(null);
  const [countries , setCountries] = useState<CountryNameResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [formLoading, setFormLoading] = useState(false);
  const [form , setForm] = useState<FormProps>({country_uuid : "", file : null})

  useEffect(() => {
    const fetchRfrCountries = async () => {
      setLoading(true);
      try {
        const [response, countries] = await Promise.all([
          rfrCountryService.getRfrCountries(),
          countriesService.getCountries()
        ]);
        setCountries(countries.countries);
        setRfrCountries(response.rfr_countries);
      } catch (error: any) {
        setHasError(true);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRfrCountries();
  }, []);

  const handleEditRfrCountry = async ( uuid: string, newCountryUuid: string, newCountryName: string ) => {
    try {
      await rfrCountryService.patchRfrCountry({ country_uuid: newCountryUuid },uuid);

      setRfrCountries((prev) => {
        if (!prev) return prev;
        const updated = prev.map((item) => {
            if (item.rfr_country.uuid !== uuid) return item;
            return {
              ...item,
              rfr_country: {
                ...item.rfr_country,
                country_rfr: {
                  ...item.rfr_country.country_rfr,
                  country_name: newCountryName
                }
              }
            };
          })
          .sort((a, b) =>a.rfr_country.country_rfr.country_name.localeCompare(b.rfr_country.country_rfr.country_name));

        return updated;
      });
      toast.success(`RFR Country updated successfully`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDeleteRfrCountry = async (uuid: string) => {
    try {
      const response = await rfrCountryService.delete(uuid);
      if (response.message === "RFR Country deleted successfully") {
        setRfrCountries((prev) => {
          if (!prev) return prev;
          const updated = prev?.filter(item => item.rfr_country.uuid !== uuid) ?? [];
          return updated;
        });
        toast.success(`RFR country deleted successfully`);
        return;
      }
      toast.error(`Something went wrong while deleting this country`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleAddRfrCountry = async () => {
    try {
      const { country_uuid, file } = form;
      if (!country_uuid || !file) {
        toast.error("All fields are required");
        return;
      }

      setFormLoading(true);
      const response = await rfrCountryService.postRfrCountry({ country_uuid, file });
      const exists = rfrCountries?.some(item => item.rfr_country.uuid === response.rfr_country.uuid);
      if (!exists) {
        setRfrCountries((prev) => {
          if (!prev) return prev;
          const updated = [...(prev ?? []), response].sort((a, b) =>
            a.rfr_country.country_rfr.country_name.localeCompare(b.rfr_country.country_rfr.country_name)
          );
          return updated
        });
      } else {
        toast.info("This entry already exist so only the rate will be changed")
      }
      toast.success(`We added ${response.length} rates in the db`);
    } catch (e: any) {
      if (e?.name === "TypeError") {
        toast.error("File upload was interrupted. Please reselect the file.");
        return;
      }
      toast.error(e.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (rfrCountries == null || hasError) {
    return <ErrorContainer errorMessage={"An error occured, try again later"} />;
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">RiskFreeRate Dashboard</p>

        <AddRfrCountry handleSend={handleAddRfrCountry} loading={formLoading} form={form} setForm={setForm} countries={countries}/>
        
        <div className="table-wrap">
          <div className="table-header">
            <h2>Rfr management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)}/>
            <div style={{color : "white"}}>{rfrCountries.length ?? 0} elements</div>
          </div>
            <table style={{ overflow: "visible" }}>
              <colgroup>
                <col style={{ width: "39%" }} />
                <col style={{ width: "39%" }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Last update</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rfrCountries.filter(value => value.rfr_country.country_rfr.country_name.toLowerCase().startsWith(search.toLowerCase())).map((rfrCountry) => (
                  <RfrCountryRow 
                    key={rfrCountry.rfr_country.uuid} 
                    rfr_country={rfrCountry} countryOptions={countries} 
                    onSave={handleEditRfrCountry} onDelete={handleDeleteRfrCountry} onClick={()=>navigate("/rfr/"+rfrCountry.rfr_country.uuid)}
                  />
                ))}
              </tbody>
            </table> 
        </div>
      </div>
    </>
  );
};

export default RfrCountry;