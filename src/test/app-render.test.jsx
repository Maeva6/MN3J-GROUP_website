import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { LanguageProvider } from "../i18n/LanguageContext";

// Une clé de traduction manquante (dans les deux langues) ne fait planter
// personne : LanguageContext.jsx retombe sur le chemin littéral de la clé
// (ex. "about.editoEyebrow"), qui s'affiche alors tel quel sur la page. C'est
// exactement le bug corrigé sur la page À propos (texte "ABOUT.EDITOEYEBROW"
// visible en prod). Un chemin de clé ressemble toujours à des segments en
// minuscules/camelCase séparés par des points — un texte normal du site n'a
// jamais cette forme.
const TRANSLATION_KEY_LEAK = /\b[a-z][a-zA-Z]*\.[a-z][a-zA-Z]*(?:\.[a-z][a-zA-Z]*)+\b/;

function renderRoute(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MemoryRouter>
  );
}

const routes = [
  "/",
  "/chantiers",
  "/chantiers/villa-les-palmiers",
  "/services",
  "/services/piscines",
  "/services/piscines/debordement-miroir",
  "/services/ingenierie",
  "/services/ingenierie/climatisation",
  "/services/entretien",
  "/a-propos",
  "/contact",
  "/faq",
  "/politique-de-confidentialite",
  "/merci",
  "/route-inexistante",
];

describe("rendu des pages (sans crash, sans clé de traduction manquante)", () => {
  for (const path of routes) {
    it(`"${path}" se rend sans laisser fuiter une clé de traduction`, () => {
      const { container } = renderRoute(path);
      const leak = container.textContent.match(TRANSLATION_KEY_LEAK);
      expect(leak, `texte suspect trouvé sur ${path}: "${leak?.[0]}"`).toBeNull();
    });
  }
});
