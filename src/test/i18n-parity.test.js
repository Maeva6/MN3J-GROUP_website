import { describe, expect, it } from "vitest";
import { fr } from "../i18n/fr";
import { en } from "../i18n/en";
import { services, maintenanceService } from "../data/services";

// Compare uniquement la FORME (les clés), jamais le contenu : fr.js et en.js
// ont légitimement des textes différents, mais doivent exposer les mêmes
// clés — sinon la version manquante retombe silencieusement sur le français
// (voir LanguageContext.jsx), ce qui passe facilement inaperçu.
function collectKeyPaths(value, prefix = "") {
  if (Array.isArray(value)) {
    // Un tableau (ex. subItems) n'a pas de clés nommées : on compare sa
    // longueur au niveau du parent, pas ici.
    return [];
  }
  if (value !== null && typeof value === "object") {
    return Object.keys(value).flatMap((key) => {
      const path = prefix ? `${prefix}.${key}` : key;
      return [path, ...collectKeyPaths(value[key], path)];
    });
  }
  return [];
}

describe("parité des clés de traduction fr/en", () => {
  it("expose exactement les mêmes clés dans fr.js et en.js", () => {
    const frKeys = collectKeyPaths(fr).sort();
    const enKeys = collectKeyPaths(en).sort();

    const missingInEn = frKeys.filter((k) => !enKeys.includes(k));
    const missingInFr = enKeys.filter((k) => !frKeys.includes(k));

    expect(missingInEn, "clés présentes en français mais absentes en anglais").toEqual([]);
    expect(missingInFr, "clés présentes en anglais mais absentes en français").toEqual([]);
  });

  it("a le même nombre de déclinaisons (subItems) par pôle dans fr.js et en.js", () => {
    for (const pole of services) {
      const frCount = fr.data.services[pole.id]?.subItems?.length ?? 0;
      const enCount = en.data.services[pole.id]?.subItems?.length ?? 0;
      expect(enCount, `pôle "${pole.id}" : nombre de déclinaisons EN`).toBe(frCount);
    }
  });
});

// Régression directe du pôle Ingénierie (et de tout futur pôle) : chaque
// image déclarée dans services.js doit correspondre à une déclinaison qui
// existe réellement côté texte, dans les deux langues — sinon on obtient soit
// une image sans page, soit une page sans image.
describe("cohérence images ↔ déclinaisons (services.js ↔ fr.js/en.js)", () => {
  for (const pole of services) {
    it(`pôle "${pole.id}" : les clés de subImages correspondent aux id des subItems`, () => {
      const imageIds = Object.keys(pole.subImages ?? {}).sort();
      const frIds = (fr.data.services[pole.id]?.subItems ?? []).map((s) => s.id).sort();
      const enIds = (en.data.services[pole.id]?.subItems ?? []).map((s) => s.id).sort();

      expect(imageIds, `subImages vs subItems FR pour "${pole.id}"`).toEqual(frIds);
      expect(imageIds, `subImages vs subItems EN pour "${pole.id}"`).toEqual(enIds);
    });
  }

  it("le pôle entretien (hors grille) a un titre et une description en fr et en", () => {
    for (const dict of [fr, en]) {
      expect(dict.data.services[maintenanceService.id]?.title).toBeTruthy();
      expect(dict.data.services[maintenanceService.id]?.description).toBeTruthy();
    }
  });
});
