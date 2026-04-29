import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import type { CountryAlliasResponse } from "../../payloads/CountryPayload";
import { useParams } from "react-router-dom";
import Title from "../../components/Title";
import CountryAlliasesService from "../../services/CountryAlliasService";
import { CountryAlliasRow } from "./Country_allias_component";
import type { FormProps } from "./AddCountryAllias";
import AddCountryAlliasForm from "./AddCountryAllias";


const CountriesAllias: React.FC = () => {
  return (
    <PageLayout>
      <CountriesAlliasDashboard />
    </PageLayout>
  );
};

const CountriesAlliasDashboard : React.FC = () => {
  const countriesAlliasService = CountryAlliasesService.getInstance();
  const { country_uuid } = useParams();
  const [countryAllias , setCountryAllias] = useState<CountryAlliasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search , setSearch] = useState<string>("")
  const [ form, setForm] = useState<FormProps>({country_allias_name : ""})
  const [ formLoading, setFormLoading ] = useState(false);

  useEffect(()=>{
    const fetchCountries = async() => {
      if(!country_uuid) setHasError(true)
      setLoading(true)
      try{
        const response = await countriesAlliasService.getCountryAllias(country_uuid!);
        console.log(response)
        setCountryAllias(response)
      }
      catch(error : any){
        setHasError(true)
        toast.error(error.message);
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  },[])

  const handleAddCountryAllias = async () => {
    try {
      if( form.country_allias_name == ""){
        toast.error("All fields are required")
        return
      }
      setFormLoading(true)
      const response = await countriesAlliasService.postCountryAllias(form, country_uuid!)
      const exists = countryAllias?.countries_allias?.some(item => item.uuid === response.uuid);
      if (!exists) {
        setCountryAllias((prev) => {
          if (!prev) return prev;

          const updated = [...(prev.countries_allias ?? []), response].sort((a, b) =>
            a.country_allias_name.localeCompare(b.country_allias_name)
          );

          return {
            ...prev,
            countries_allias: updated,
          };
        });
        toast.success(`Country allias ${response.country_allias_name} added successfully`)
        return
      };
      toast.error(`Country allias ${response.country_allias_name} already exists`)
    } catch(e : any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditCountryAllias = async (uuid: string, newName: string) => {
    try {
      if( newName == ""){
        toast.error("All fields are required")
        return
      }
      const response = await countriesAlliasService.patchCountryAllias({country_allias_name : newName}, uuid)
        setCountryAllias((prev) => {
          if (!prev) return prev;

          const updated = (prev.countries_allias ?? [])
            .map((item) =>
              item.uuid === uuid ? response : item
            )
            .sort((a, b) =>
              a.country_allias_name.localeCompare(b.country_allias_name)
            );

          return {
            ...prev,
            countries_allias: updated,
          };
        });
      toast.success(`Country ${response.country_allias_name} updated successfully`)
    } catch(e : any) {
      toast.error(e.message)
    }
  }

  const handleDeleteCountryAllias = async (uuid: string) => {
    try {
      const response = await countriesAlliasService.delete(uuid)
      if(response.message === "Country allias deleted successfully") {
        setCountryAllias((prev) => {
          if (!prev) return prev;

          const updated = prev.countries_allias?.filter(item => item.uuid !== uuid) ?? []
          return {
            ...prev,
            countries_allias: updated,
          };
        });
        toast.success(`Country allias deleted successfully`)
        return
      }
      toast.error(`Something went wrong while deleting this country`)
    } catch(e : any) {
      toast.error(e.message)
    }
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  if(countryAllias == null || hasError ) {
    return (
      <ErrorContainer errorMessage={"An error occured, try again later"} />
    );
  }

  return (
    <>
      <div className="dash-wrap">
      <Title title={`Country alias management: ${countryAllias.country.country_name}`} />
      <AddCountryAlliasForm  form={form} setForm={setForm} handleSend={handleAddCountryAllias} loading={formLoading}/>
        
        <div className="table-wrap">
            <table className="country-table">
                <colgroup>
                  <col style={{ width: "39%" }} />
                  <col style={{ width: "39%" }} />
                  <col />
                </colgroup>
              <thead>
                <tr>
                  <th className="email-cell">Country allias name</th>
                  <th className="actions-cell"><SearchBar value={search} onChange={setSearch} style={{ color: "black", borderColor: "black" }}/></th>
                  <th className="count-cell">{countryAllias.countries_allias?.length ?? 0 } elements</th>
                </tr>
              </thead>
              <tbody>
                {countryAllias.countries_allias?.filter(value => value.country_allias_name.toLowerCase().startsWith(search.toLowerCase())).map((country_allias) => (
                  <CountryAlliasRow key={country_allias.uuid} country_allias={country_allias} onSave={handleEditCountryAllias} onDelete={handleDeleteCountryAllias} />
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </>
  );
}

export default CountriesAllias;