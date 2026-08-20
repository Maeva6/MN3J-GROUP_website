import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

export default function Faq() {
  const { t } = useLanguage();
  const items = t("faqPage.items");
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="section container-page py-24">
      <div className="max-w-xl mx-auto text-center mb-14">
        <span className="eyebrow">{t("faqPage.eyebrow")}</span>
        <h2 className="text-3xl text-navy mt-3">{t("faqPage.title")}</h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.question} className="border border-black/5 rounded-lg bg-white overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 text-left px-6 py-4"
              >
                <span className="text-navy font-semibold text-sm">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <p className="text-muted text-sm leading-relaxed px-6 pb-5">{item.answer}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
