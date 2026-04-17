import React from "react";
import { AuthProvider } from "./AuthProvider";
import { NavBarProvider } from "./NavBarProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = (props: ProvidersProps) => (
  <AuthProvider>
    <NavBarProvider>
          {props.children}
    </NavBarProvider>
  </AuthProvider>
)

export default Providers;
