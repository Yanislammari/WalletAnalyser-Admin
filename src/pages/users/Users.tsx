import "./User.css"
import PageLayout from "../../components/Navbar/NavBarPageLayout";
import { useEffect, useState } from "react";
import type { UsersWithDataResponseDto } from "../../responses/UserResponse";
import UserService from "../../services/UserService";
import { toast } from "sonner";
import Loading from "../../components/Loading";
import type { BanUserPayload } from "../../payloads/UserPayload";
import { StatCard, UserRow } from "./User_components";

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

  const handleBanToggle = async (userId : string, ban : boolean) => {
    try{
      const response = await userService.banUser({ban} as BanUserPayload,userId)
      toast.success(`User is now ${ban ? "ban" : "unban"}`)
    } catch(e : any) {
      toast.error(e.message)
    } finally {

    }
  };

  const stats = [
    { label: "Total users",     value: data?.numberOfUsers },
    { label: "Banned",          value: data?.numberOfBanUsers },
    { label: "New this month",  value: data?.numberOfNewMonthlyUsers },
    { label: "Paid users",      value: data?.numberOfPaidUsers },
  ];


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

  if (loading) {
    return (
      <Loading />
    );
  }

  if(data == null || hasError ) {
    return (
      <div>An error occured</div>
    );
  }

  return (
    <>
      <div className="dash-wrap">
        <p className="dash-title">User Dashboard</p>

        <div className="stats-bar">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>

        <div className="table-wrap">
          <div className="table-header">
            <h2>User management</h2>
          </div>
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
              {data.users.map((user) => (
                <UserRow key={user.id} user={user} onToggle={handleBanToggle} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}


export default Users;