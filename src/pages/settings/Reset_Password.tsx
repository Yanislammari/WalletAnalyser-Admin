import React from 'react';
import PageLayout from '../../components/Navbar/NavBarPageLayout';
import type { ChangePasswordPayload } from '../../payloads/LoginPayload';
import type { FormProps } from './Form_reset';
import ChangePassword from './Form_reset';
import { toast } from 'sonner';
import AuthService from '../../services/AuthService';
import { ConfirmDialog } from '../../components/Confirm/Confirm';
import { useAuth } from '../../providers/AuthProvider';


const SettingsPage : React.FC = () => {
  return (
    <PageLayout>
      <ResetPassword />
    </PageLayout>
  )
}

const ResetPassword = () => {
  const [loading , setLoading] = React.useState(false);
  const [form, setForm] = React.useState<FormProps>({password : "", newPassword : "", confirmPassword : ""})
  const { logout } = useAuth();


  const handleChangePassword = async () => {
    setLoading(true);
    try {
      if(form.newPassword !== form.confirmPassword){
        toast.error("New password and confirm password do not match");
        return;
      }
      const payload : ChangePasswordPayload = {
        password: form.password,
        newPassword: form.newPassword,
      }
      await AuthService.getInstance().changePassword(payload)
      toast.success("Password changed successfully");
      setForm({password : "", newPassword : "", confirmPassword : ""});
    }
    catch (err : any) {
      toast.error(err.message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
        <div className="dash-wrap">
          <p className="dash-title">Admin settings</p>
          <ChangePassword  form={form} setForm={setForm} handleSend={handleChangePassword} loading={loading}/>*
          <ConfirmDialog
            title="Log Out"
            description="This will change log you out, are you sure ?"
            confirmLabel= "Confirm"
            cancelLabel="Cancel"
            variant="info"
            onConfirm={logout}
          >
            <button className="accordion-send-btn" style={{width : "10%", marginTop : "25px" }}>Logout</button>
          </ConfirmDialog>
        </div>
  )
}

export default SettingsPage;