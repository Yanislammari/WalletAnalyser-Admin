import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import type { UsersWithDataResponseDto } from "../../responses/UserResponse";
import UserService from "../../services/UserService";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import type { BanUserPayload } from "../../payloads/UserPayload";
import { StatCard, UserRow } from "./User_components";
import ErrorContainer from "../../components/Error";
import { Pagination } from "../../components/Pagination/Pagination";
import { pageSize } from "../../constants/pageSize";
import SearchBar from "../../components/SearchBar/SearchBar";
import AccordionForm, { type FormProps } from "./AddSuperUser";
import "../../style/TableTitle.css";

const Users: React.FC = () => {
  return (
    <PageLayout>
      <AdminDashboard />
    </PageLayout>
  );
};

const AdminDashboard : React.FC = () => {
  const userService = UserService.getInstance();
  const [data , setData] = useState<UsersWithDataResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [pageError, setPageError] = useState<string | null>(null)
  const [search , setSearch] = useState<string>("")
  const [ form, setForm] = useState<FormProps>({firstName : "",lastName : "",email : ""})
  const [ formLoading, setFormLoading ] = useState(false);

  const stats = [
    { label: "Total users",     value: data?.numberOfUsers },
    { label: "Banned",          value: data?.numberOfBanUsers },
    { label: "New this month",  value: data?.numberOfNewMonthlyUsers },
    { label: "Paid users",      value: data?.numberOfPaidUsers },
  ];

  const handleBanToggle = async (userId : string, ban : boolean, setLoading : React.Dispatch<React.SetStateAction<boolean>>, setBan :  React.Dispatch<React.SetStateAction<boolean>>) => {
    try{
      setLoading(true)
      const response = await userService.banUser({ban} as BanUserPayload,userId)
      setBan(response.ban)
      if(response.ban){
        setData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            numberOfBanUsers: prev.numberOfBanUsers + 1,
          };
        });
      } else {
          setData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            numberOfBanUsers: prev.numberOfBanUsers - 1,
          };
        });
      }
      toast.success(`User is now ${ban ? "ban" : "active"}`)
    } catch(e : any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  };

  useEffect(()=>{
    const fetchUserInfo = async() => {
      setLoading(true)
      try{
        const response = await userService.getUsersIntro();
        setData(response)
      }
      catch(error : any){
        setHasError(true)
        toast.error(error.message);
      } finally {
        setLoading(false)
      }
    }
    fetchUserInfo()
  },[])

  const handleNext = async (direction : number) => {
    try {
      setPageError(null);
      setPageLoading(true);
      const nextPage = currentPage + direction;
      const response = await userService.getUsersIntroOffset(nextPage * pageSize - pageSize);
      setData((prev) => {
        if (!prev) return prev;
        return { ...prev, users: response };
      });
      setCurrentPage(nextPage);
    } catch (e: any) {
      toast.error(e.message);
      setPageError(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleGoTo = async (page: number) => {
    try {
      setPageLoading(true);
      setPageError(null);
      const response = await userService.getUsersIntroOffset(page * pageSize - pageSize);
      setData((prev) => prev ? { ...prev, users: response } : prev);
      setCurrentPage(page);
    } catch (e: any) {
      toast.error(e.message);
      setPageError(e.message);
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      if( form.firstName == "" || form.lastName == "" || form.email == ""){
        toast.error("All fields are required")
        return
      }
      setFormLoading(true)
      const response = await userService.addSuperUser(form)
      const user = response.user
      toast.success(`Super user ${user.email} added successfully`)
      setData((prev) => {
        if (!prev) return prev;
        const updated = [...prev.users, user].sort((a, b) =>
          a.email.localeCompare(b.email)
        );
        return {
          ...prev,
          numberOfUsers: prev.numberOfUsers + 1,
          numberOfNewMonthlyUsers: prev.numberOfNewMonthlyUsers + 1,
          users: updated,
        };
      });
    } catch(e : any) {
      toast.error(e.message)
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  if(data == null || hasError ) {
    return (
      <ErrorContainer errorMessage={"An error occured, try again later"} />
    );
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">User Dashboard</p>

        <AccordionForm  form={form} setForm={setForm} handleSend={handleAddUser} loading={formLoading}/>

        <div className="stats-bar">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
        
        <div className="table-wrap">
          <div className="table-header">
            <h2>User management</h2>
            <SearchBar value={search} onChange={(value) => setSearch(value)}/>
            <Pagination currentPage={currentPage} totalPages={Math.ceil(data.numberOfUsers / pageSize)} onPrev={()=>handleNext(-1)} onNext={()=>handleNext(1)} onGoTo={handleGoTo} disabled={pageLoading} />
          </div>
          {pageLoading ? (
            <Loading fullPage={false} spinnerSize={24} />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Subscribed</th>
                  <th>Ban</th>
                </tr>
              </thead>
              <tbody>
                {data.users.filter(value => value.email.toLowerCase().startsWith(search.toLowerCase())).map((user) => (
                  <UserRow key={user.id} user={user} onToggle={handleBanToggle} />
                ))}
              </tbody>
            </table> 
          )}
          {pageError && (
            <p className="page-error">{pageError}{currentPage}</p>
          )}
        </div>
      </div>
    </>
  );
}


export default Users;