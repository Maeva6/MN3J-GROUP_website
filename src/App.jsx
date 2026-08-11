import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Services from "./pages/Services";
import PoleDetail from "./pages/PoleDetail";
import SubServiceDetail from "./pages/SubServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminChantiers from "./pages/admin/AdminChantiers";
import AdminDevis from "./pages/admin/AdminDevis";
import AdminClients from "./pages/admin/AdminClients";
import AdminParametres from "./pages/admin/AdminParametres";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SiteLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/chantiers" element={<SiteLayout><Projects /></SiteLayout>} />
        <Route path="/chantiers/:id" element={<SiteLayout><ProjectDetail /></SiteLayout>} />
        <Route path="/services" element={<SiteLayout><Services /></SiteLayout>} />
        <Route path="/services/:poleId" element={<SiteLayout><PoleDetail /></SiteLayout>} />
        <Route path="/services/:poleId/:subId" element={<SiteLayout><SubServiceDetail /></SiteLayout>} />
        <Route path="/a-propos" element={<SiteLayout><About /></SiteLayout>} />
        <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
        {/* Back-office : à protéger par une authentification avant mise en production */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="chantiers" element={<AdminChantiers />} />
          <Route path="devis" element={<AdminDevis />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="parametres" element={<AdminParametres />} />
        </Route>
      </Routes>
    </>
  );
}
