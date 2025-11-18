import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;