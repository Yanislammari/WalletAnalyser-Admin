import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import SectorsService from "../../services/SectorsService";
import type { SectorNameResponse } from "../../payloads/SectorPayload";
import AddSectorForm, { type FormProps } from "./AddSector";
import { SectorRow } from "./Sector_components";
import { useNavigate } from "react-router-dom";
import "../../style/TableTitle.css"
import "../../style/edit_buttons.css"

const Sectors: React.FC = () => {
  return (
    <PageLayout>
      <SectorsDashboard />
    </PageLayout>
  );
};

const SectorsDashboard : React.FC = () => {
  const navigate = useNavigate();
  const sectorsService = SectorsService.getInstance();
  const [sectors , setSectors] = useState<SectorNameResponse[] | null>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search , setSearch] = useState<string>("")
  const [ form, setForm] = useState<FormProps>({sector_name : ""})
  const [ formLoading, setFormLoading ] = useState(false);

  useEffect(()=>{
    const fetchSectors = async() => {
      setLoading(true)
      try{
        const response = await sectorsService.getSectors();
        setSectors(response.sectors)
      }
      catch(error : any){
        setHasError(true)
        toast.error(error.message);
      } finally {
        setLoading(false)
      }
    }
    fetchSectors()
  },[])

  const handleAddSector = async () => {
    try {
      if( form.sector_name == ""){
        toast.error("All fields are required")
        return
      }
      setFormLoading(true)
      const response = await sectorsService.postSectors(form)
      const exists = sectors?.some(item => item.uuid === response.uuid);
      if (!exists) {
        setSectors((prev) =>
          [...prev ?? [], response].sort((a, b) =>
            a.sector_name.localeCompare(b.sector_name)
          )
        );
        toast.success(`Sector ${response.sector_name} added successfully`)
        return
      }
      toast.error(`Sector ${response.sector_name} already exists`)
    } catch(e : any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditSector = async (uuid: string, newName: string) => {
    try {
      if( newName == ""){
        toast.error("All fields are required")
        return
      }
      const response = await sectorsService.patchSector({sector_name : newName}, uuid)
      setSectors((prev) =>
        prev?.map(item => item.uuid === uuid ? response : item).sort((a, b) =>
          a.sector_name.localeCompare(b.sector_name)
        ) ?? []
      );
      toast.success(`Sector ${response.sector_name} updated successfully`)
    } catch(e : any) {
      toast.error(e.message)
    }
  }

  const handleDeleteSector = async (uuid: string) => {
    try {
      const response = await sectorsService.delete(uuid)
      if(response.message === "Sector deleted successfully") {
        toast.success(`Sector deleted successfully`)
        setSectors((prev) =>
          prev?.filter(item => item.uuid !== uuid) ?? []
        );
        return
      }
      toast.error(`Something went wrong while deleting this sector`)
    } catch(e : any) {
      toast.error(e.message)
    }
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  if(sectors == null || hasError ) {
    return (
      <ErrorContainer errorMessage={"An error occured, try again later"} />
    );
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">Sectors Dashboard</p>

        <AddSectorForm  form={form} setForm={setForm} handleSend={handleAddSector} loading={formLoading}/>
        
        <div className="table-wrap">
          <div className="table-header">
            <h2>Sectors management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)}/>
            <div style={{color : "white"}}>{sectors.length ?? 0} elements</div>
          </div>
            <table className="sector-table">
              <thead>
                <tr>
                  <th className="email-cell">Sector name</th>
                  <th className="actions-cell">Actions</th>
                </tr>
              </thead>
              <colgroup>
                <col style={{ width: "75%" }} />
                <col/>
              </colgroup>
              <tbody>
                {sectors.filter(value => value.sector_name.toLowerCase().startsWith(search.toLowerCase())).map((sector) => (
                  <SectorRow key={sector.uuid} sector={sector} onSave={handleEditSector} onDelete={handleDeleteSector} onClick={()=>navigate(`/sectors-allias/${sector.uuid}`)}/>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </>
  );
}

export default Sectors;