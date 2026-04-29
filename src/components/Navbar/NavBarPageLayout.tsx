import Navbar from "./Navbar";
import { useNavBar } from "../../providers/NavBarProvider";

type PageLayoutProps = {
  children: React.ReactNode;
};


const PageLayout : React.FC<PageLayoutProps> = ({ children }) => {
  const { isOpen } = useNavBar();

  return (
    <div
      className={`page transition-all duration-300 ease-in-out ${
        isOpen ? "ml-61" : "ml-15"
    }`}
    >
      <Navbar />
      {children}
    </div>
  );
};

export default PageLayout;