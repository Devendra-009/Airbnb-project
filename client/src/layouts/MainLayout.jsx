import Navbar from "../components/Navbar";
export default function MainLayout({ children }) {
  return <><Navbar/><main>{children}</main><footer className="footer">© {new Date().getFullYear()} ExploreLust · Built with React, Express & MongoDB</footer></>;
}
