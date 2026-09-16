import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
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
import Terms from "./pages/Terms";
import FaqPage from "./pages/FaqPage";
import NotFound from "./pages/NotFound";
import CookieConsentBanner from "./components/CookieConsentBanner";
import { initAnalytics, trackPageview } from "./lib/analytics";
import { getCookieConsent } from "./utils/cookieConsent";

// Back-office chargé à la demande : aucun visiteur public n'en a besoin,
// inutile d'alourdir le bundle initial envoyé à tout le monde avec les 7
// pages admin (~un tiers du JS total avant ce découpage).
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const RequireAdminAuth = lazy(() => import("./pages/admin/RequireAdminAuth"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminChantiers = lazy(() => import("./pages/admin/AdminChantiers"));
const AdminDevis = lazy(() => import("./pages/admin/AdminDevis"));
const AdminClients = lazy(() => import("./pages/admin/AdminClients"));
const AdminParametres = lazy(() => import("./pages/admin/AdminParametres"));

function AdminLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-9 h-9 rounded-full border-[3px] border-navy/15 border-t-navy animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // RGPD/ePrivacy : Analytics ne démarre que si l'utilisateur a déjà
    // accepté via le bandeau (voir CookieConsentBanner, qui déclenche
    // initAnalytics() lui-même au moment du clic "Accepter").
    if (getCookieConsent() === "accepted") initAnalytics();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageview(pathname);
  }, [pathname]);

  return null;
}

function SiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <StickyMobileCta />
      <CookieConsentBanner />
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
        <Route path="/conditions-generales-utilisation" element={<SiteLayout><Terms /></SiteLayout>} />
        <Route path="/faq" element={<SiteLayout><FaqPage /></SiteLayout>} />
        {/* Back-office : accès protégé par mot de passe local, voir src/utils/adminAuth.js */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminLoader />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminLoader />}>
              <RequireAdminAuth />
            </Suspense>
          }
        >
          <Route
            element={
              <Suspense fallback={<AdminLoader />}>
                <AdminLayout />
              </Suspense>
            }
          >
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
