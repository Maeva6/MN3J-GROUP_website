import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Permet à chaque page admin de piloter l'en-tête commun (AdminLayout) :
// recherche globale + bouton "Nouveau X" contextuel, comme dans la maquette.
// Plus simple qu'une remontée d'état via props (l'en-tête est au-dessus des
// pages dans l'arbre) sans tomber dans une lib de gestion d'état dédiée.
const Ctx = createContext(null);

// Champs "visibles" comparés pour décider si l'en-tête doit vraiment se
// re-rendre — les fonctions (onSearchChange, onNew) sont volontairement
// exclues : elles sont recréées à chaque rendu de la page mais, dans cette
// appli, ferment uniquement sur des setters React (stables) ou des actions
// sans état propre, donc les garder "légèrement obsolètes" entre deux
// changements de contenu est sans conséquence — et c'est ce qui casse la
// boucle de mise à jour infinie (page → contexte → page → …).
function sameVisibleContent(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.showSearch === b.showSearch &&
    a.searchValue === b.searchValue &&
    a.searchPlaceholder === b.searchPlaceholder &&
    a.newLabel === b.newLabel
  );
}

export function AdminHeaderProvider({ children }) {
  const [actions, setActionsRaw] = useState(null);
  const setActions = useCallback((next) => {
    setActionsRaw((prev) => (sameVisibleContent(prev, next) ? prev : next));
  }, []);
  // Mémoïsé sur `actions` uniquement : sans ça, la valeur du Provider change
  // de référence à chaque rendu, ce qui re-déclenche les pages consommatrices.
  const value = useMemo(() => ({ actions, setActions }), [actions, setActions]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAdminHeaderState() {
  return useContext(Ctx)?.actions ?? null;
}

// Appelé par chaque page pour déclarer ce que l'en-tête doit afficher :
// { showSearch, searchValue, onSearchChange, searchPlaceholder, newLabel, onNew }
// (ou `null` pour ne rien afficher). Se nettoie automatiquement au démontage.
export function useAdminHeaderActions(config) {
  const ctx = useContext(Ctx);
  useEffect(() => {
    ctx?.setActions(config);
  });
  useEffect(() => {
    return () => ctx?.setActions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
