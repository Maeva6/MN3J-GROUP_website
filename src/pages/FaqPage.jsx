import Seo from "../components/Seo";
import Faq from "../components/Faq";
import { useLanguage } from "../i18n/LanguageContext";

export default function FaqPage() {
  const { t } = useLanguage();

  return (
    <div>
      <Seo title={t("seo.faq.title")} description={t("seo.faq.description")} />
      <Faq />
    </div>
  );
}
