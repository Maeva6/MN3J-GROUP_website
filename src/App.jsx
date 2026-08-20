import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import StickyMobileCta from "./components/StickyMobileCta";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Services from "./pages/Services";
import PoleDetail from "./pages/PoleDetail";
import SubServiceDetail from "./pages/SubServiceDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import RequireAdminAuth from "./pages/admin/RequireAdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminChantiers from "./pages/admin/AdminChantiers";
import AdminDevis from "./pages/admin/AdminDevis";
import AdminClients from "./pages/admin/AdminClients";
import AdminParametres from "./pages/admin/AdminParametres";
import NotFound from "./pages/NotFound";
import { initAnalytics, trackPageview } from "./lib/analytics";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageview(pathname);
  }, [pathname]);

  return null;
}

function SiteLayout({ children }) {
  return (
    // pb mobile : laisse la place à la barre CTA fixée en bas (StickyMobileCta)
    // pour qu'elle ne recouvre jamais le bas du Footer.
    <div className="min-h-screen flex flex-col pb-[72px] md:pb-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyMobileCta />
    </div>
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
        <Route path="/merci" element={<SiteLayout><ThankYou /></SiteLayout>} />
        <Route path="/politique-de-confidentialite" element={<SiteLayout><PrivacyPolicy /></SiteLayout>} />
        {/* Back-office : accès protégé par mot de passe local, voir src/utils/adminAuth.js */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAdminAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="chantiers" element={<AdminChantiers />} />
            <Route path="devis" element={<AdminDevis />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="parametres" element={<AdminParametres />} />
          </Route>
        </Route>
        <Route path="*" element={<SiteLayout><NotFound /></SiteLayout>} />
      </Routes>
    </>
  );
}
