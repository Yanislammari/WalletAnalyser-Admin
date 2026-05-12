import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import ErrorContainer from "../../components/Error";
import SearchBar from "../../components/SearchBar/SearchBar";
import type { SectorAlliasResponse } from "../../payloads/SectorPayload";
import { useParams } from "react-router-dom";
import Title from "../../components/Title";
import SectorAlliasesService from "../../services/SectorAlliasService";
import { SectorAlliasRow } from "./Sector_allias_component";
import type { FormProps } from "./AddSectorAllias";
import AddSectorAlliasForm from "./AddSectorAllias";

const SectorsAllias: React.FC = () => {
  return (
    <PageLayout>
      <SectorsAlliasDashboard />
    </PageLayout>
  );
};

const SectorsAlliasDashboard : React.FC = () => {
  const sectorsAlliasService = SectorAlliasesService.getInstance();
  const { sector_uuid } = useParams();
  const [sectorAllias , setSectorAllias] = useState<SectorAlliasResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [search , setSearch] = useState<string>("")
  const [ form, setForm] = useState<FormProps>({sector_allias_name : ""})
  const [ formLoading, setFormLoading ] = useState(false);

  useEffect(()=>{
    const fetchSectors = async() => {
      if(!sector_uuid) setHasError(true)
      setLoading(true)
      try{
        const response = await sectorsAlliasService.getSectorAllias(sector_uuid!);
        console.log(response)
        setSectorAllias(response)
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

  const handleAddSectorAllias = async () => {
    try {
      if( form.sector_allias_name == ""){
        toast.error("All fields are required")
        return
      }
      setFormLoading(true)
      const response = await sectorsAlliasService.postSectorAllias(form, sector_uuid!)
      const exists = sectorAllias?.sectors_allias?.some(item => item.uuid === response.uuid);
      if (!exists) {
        setSectorAllias((prev) => {
          if (!prev) return prev;

          const updated = [...(prev.sectors_allias ?? []), response].sort((a, b) =>
            a.sector_allias_name.localeCompare(b.sector_allias_name)
          );

          return {
            ...prev,
            sectors_allias: updated,
          };
        });
        toast.success(`Sector allias ${response.sector_allias_name} added successfully`)
        return
      };
      toast.error(`Sector allias ${response.sector_allias_name} already exists`)
    } catch(e : any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleEditSectorAllias = async (uuid: string, newName: string) => {
    try {
      if( newName == ""){
        toast.error("All fields are required")
        return
      }
      const response = await sectorsAlliasService.patchSectorAllias({sector_allias_name : newName}, uuid)
        setSectorAllias((prev) => {
          if (!prev) return prev;

          const updated = (prev.sectors_allias ?? [])
            .map((item) =>
              item.uuid === uuid ? response : item
            )
            .sort((a, b) =>
              a.sector_allias_name.localeCompare(b.sector_allias_name)
            );

          return {
            ...prev,
            sectors_allias: updated,
          };
        });
      toast.success(`Sector ${response.sector_allias_name} updated successfully`)
    } catch(e : any) {
      toast.error(e.message)
    }
  }

  const handleDeleteSectorAllias = async (uuid: string) => {
    try {
      const response = await sectorsAlliasService.delete(uuid)
      if(response.message === "Sector allias deleted successfully") {
        setSectorAllias((prev) => {
          if (!prev) return prev;

          const updated = prev.sectors_allias?.filter(item => item.uuid !== uuid) ?? []
          return {
            ...prev,
            sectors_allias: updated,
          };
        });
        toast.success(`Sector allias deleted successfully`)
        return
      }
      toast.error(`Something went wrong while deleting this sector`)
    } catch(e : any) {
      toast.error(e.message)
    }
  }

  if (hasError) {
    return (
      <ErrorContainer errorMessage={"An error occurred, try again later"} />
    );
  }

  if (loading || sectorAllias == null) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <div className="dash-wrap">
        <Title title={`Sectors alias management: ${sectorAllias.sector.sector_name}`} />
        <AddSectorAlliasForm  form={form} setForm={setForm} handleSend={handleAddSectorAllias} loading={formLoading}/>
        
        <div className="table-wrap">
            <table className="sector-table">
              <colgroup>
                <col style={{ width: "39%" }} />
                <col style={{ width: "39%" }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th className="email-cell">Sector allias name</th>
                  <th className="actions-cell"><SearchBar value={search} onChange={setSearch} style={{ color: "black", borderColor: "black" }}/></th>
                  <th className="count-cell">{sectorAllias.sectors_allias?.length ?? 0 } elements</th>
                </tr>
              </thead>
              <tbody>
                {sectorAllias.sectors_allias?.filter(value => value.sector_allias_name.toLowerCase().startsWith(search.toLowerCase())).map((sector_allias) => (
                  <SectorAlliasRow key={sector_allias.uuid} sector_allias={sector_allias} onSave={handleEditSectorAllias} onDelete={handleDeleteSectorAllias} />
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </>
  );
}

export default SectorsAllias;