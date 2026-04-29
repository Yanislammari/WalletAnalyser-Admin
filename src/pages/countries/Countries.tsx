import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import CountriesService from "../../services/CountriesService";
import type { CountryNameResponse } from "../../payloads/CountryPayload";
import AddCountryForm, { type FormProps } from "./AddCountry";
import { CountryRow } from "./Country_components";
import { useNavigate } from "react-router-dom";

const Countries: React.FC = () => {
  return (
    <PageLayout>
      <CountriesDashboard />
    </PageLayout>
  );
};

const CountriesDashboard : React.FC = () => {
  const navigate = useNavigate();
  const countriesService = CountriesService.getInstance();
  const [countries , setCountries] = useState<CountryNameResponse[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search , setSearch] = useState<string>("")
  const [ form, setForm] = useState<FormProps>({country_name : ""})
  const [ formLoading, setFormLoading ] = useState(false);

  useEffect(()=>{
    const fetchCountries = async() => {
      setLoading(true)
      try{
        const response = await countriesService.getCountries();
        setCountries(response.countries)
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

  const handleAddCountry = async () => {
    try {
      if( form.country_name == ""){
        toast.error("All fields are required")
        return
      }
      setFormLoading(true)
      const response = await countriesService.postCountries(form)
      const exists = countries?.some(item => item.uuid === response.uuid);
      if (!exists) {
        setCountries((prev) =>
          [...prev ?? [], response].sort((a, b) =>
            a.country_name.localeCompare(b.country_name)
          )
        );
        toast.success(`Country ${response.country_name} added successfully`)
        return
      }
      toast.error(`Country ${response.country_name} already exists`)
    } catch(e : any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditCountry = async (uuid: string, newName: string) => {
    try {
      if( newName == ""){
        toast.error("All fields are required")
        return
      }
      const response = await countriesService.patchCountry({country_name : newName}, uuid)
      setCountries((prev) =>
        prev?.map(item => item.uuid === uuid ? response : item).sort((a, b) =>
          a.country_name.localeCompare(b.country_name)
        ) ?? []
      );
      toast.success(`Country ${response.country_name} updated successfully`)
    } catch(e : any) {
      toast.error(e.message)
    }
  }

  const handleDeleteCountry = async (uuid: string) => {
    try {
      const response = await countriesService.delete(uuid)
      if(response.message === "Country deleted successfully") {
        toast.success(`Country deleted successfully`)
        setCountries((prev) =>
          prev?.filter(item => item.uuid !== uuid) ?? []
        );
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

  if(countries == null || hasError ) {
    return (
      <ErrorContainer errorMessage={"An error occured, try again later"} />
    );
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">Countries Dashboard</p>

        <AddCountryForm  form={form} setForm={setForm} handleSend={handleAddCountry} loading={formLoading}/>
        
        <div className="table-wrap">
          <div className="table-header">
            <h2>Countries management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)}/>
            <div style={{color : "white"}}>{countries.length ?? 0} elements</div>
          </div>
            <table className="country-table">
              <thead>
                <tr>
                  <th className="email-cell">Country name</th>
                  <th className="actions-cell">Actions</th>
                </tr>
              </thead>
              <colgroup>
                <col style={{ width: "75%" }} />
                <col/>
              </colgroup>
              <tbody>
                {countries.filter(value => value.country_name.toLowerCase().startsWith(search.toLowerCase())).map((country) => (
                  <CountryRow key={country.uuid} country={country} onSave={handleEditCountry} onDelete={handleDeleteCountry} onClick={()=>navigate(`/countries-allias/${country.uuid}`)}/>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </>
  );
}

export default Countries;