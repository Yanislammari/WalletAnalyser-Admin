import React from "react";
import { AuthProvider } from "./AuthProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = (props: ProvidersProps) => (
  <AuthProvider>
    {props.children}
  </AuthProvider>
)

export default Providers;
