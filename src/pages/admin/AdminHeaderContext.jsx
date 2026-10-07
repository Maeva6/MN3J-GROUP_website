import { createContext, useContext, useEffect, useState } from "react";

// Permet à chaque page admin de piloter l'en-tête commun (AdminLayout) :
// recherche globale + bouton "Nouveau X" contextuel, comme dans la maquette.
// Plus simple qu'une remontée d'état via props (l'en-tête est au-dessus des
// pages dans l'arbre) sans tomber dans une lib de gestion d'état dédiée.
const Ctx = createContext(null);

export function AdminHeaderProvider({ children }) {
  const [actions, setActions] = useState(null);
  return <Ctx.Provider value={{ actions, setActions }}>{children}</Ctx.Provider>;
}

export function useAdminHeaderState() {
  return useContext(Ctx)?.actions ?? null;
}

// Appelé par chaque page pour déclarer ce que l'en-tête doit afficher :
// { showSearch, searchValue, onSearchChange, searchPlaceholder, newLabel, onNew }
// Se nettoie automatiquement au démontage de la page.
export function useAdminHeaderActions(config) {
  const ctx = useContext(Ctx);
  useEffect(() => {
    ctx?.setActions(config);
  });
  useEffect(() => () => ctx?.setActions(null), [ctx]);
}
