import { useEffect, useState } from "react";

// Reproduit le `ready` de la maquette : les barres de progression, jauges et
// donuts montent d'abord à 0 (ou cercle vide), puis "poussent" vers leur
// valeur réelle ~200ms après le montage — sans ce décalage, le navigateur
// peint directement la valeur finale et la transition CSS n'a rien à animer.
export default function useMountReady(delay = 200) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}
