import { Sora } from "@next/font/google";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weights: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

//? Importing the components
import Nav from "./Nav";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div
      className={`page bg-primary text-white bg-cover bg-no-repeat ${sora.variable} font-sora relative`}
    >
      <Nav />
      <Header />
      {children}
    </div>
  );
};

export default Layout;
