import React, { createContext, useContext, useState } from 'react';

interface NavBarContextType {
  isOpen : boolean
  setIsOpen : React.Dispatch<React.SetStateAction<boolean>>
}

const NavBarContext = createContext<NavBarContextType | undefined>(undefined);

interface NavBarContextProps {
  children: React.ReactNode;
}


export const NavBarProvider : React.FC<NavBarContextProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NavBarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </NavBarContext.Provider>
  );
};

export const useNavBar = (): NavBarContextType => {
  const context = useContext(NavBarContext);
  if (!context) throw new Error("useNavBarLayout must be used within an NavBarProvider");
  return context;
};