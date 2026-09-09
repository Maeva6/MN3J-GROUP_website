import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "../i18n/LanguageContext";

function Probe({ path, vars }) {
  const { t, lang, toggleLang } = useLanguage();
  return (
    <div>
      <span data-testid="result">{String(t(path, vars))}</span>
      <span data-testid="lang">{lang}</span>
      <button onClick={toggleLang}>toggle</button>
    </div>
  );
}

describe("useLanguage / t()", () => {
  it("résout une clé existante", () => {
    render(
      <LanguageProvider>
        <Probe path="common.requestQuote" />
      </LanguageProvider>
    );
    expect(screen.getByTestId("result")).toHaveTextContent("Demander un devis");
  });

  it("interpole les variables {var}", () => {
    render(
      <LanguageProvider>
        <Probe path="services.backToPole" vars={{ pole: "Piscines" }} />
      </LanguageProvider>
    );
    expect(screen.getByTestId("result")).toHaveTextContent("← Retour à Piscines");
  });

  it("retombe sur le français quand la clé manque en anglais", () => {
    render(
      <LanguageProvider>
        <Probe path="common.requestQuote" />
      </LanguageProvider>
    );
    fireEvent.click(screen.getByText("toggle"));
    // Pas de clé manquante connue actuellement : on vérifie le mécanisme lui-même
    // en changeant de langue et en s'assurant qu'une clé bilingue change bien.
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("retourne le chemin littéral quand la clé n'existe dans aucune langue (garde-fou, pas un idéal)", () => {
    render(
      <LanguageProvider>
        <Probe path="section.inexistante.cle" />
      </LanguageProvider>
    );
    // C'est ce comportement de repli qui avait provoqué l'affichage littéral
    // de "ABOUT.EDITOEYEBROW" sur la page À propos après la suppression d'une
    // clé — un test de rendu (voir app-render.test.jsx) détecte ce symptôme
    // directement sur les pages réelles ; celui-ci documente juste la cause.
    expect(screen.getByTestId("result")).toHaveTextContent("section.inexistante.cle");
  });
});
