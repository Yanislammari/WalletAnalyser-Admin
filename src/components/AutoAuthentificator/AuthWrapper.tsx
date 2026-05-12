import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import Loading from "../Loading";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { checkAuth, isAuthentificated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {await checkAuth()};
    verify();
  }, []);

  if (isAuthentificated === null) {
    return <Loading />;
  }

  if (!isAuthentificated) {
    return (
      <Navigate
        to={`/`}
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default AuthWrapper;