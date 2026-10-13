import { motion, useReducedMotion } from "framer-motion";

// Fondu + glissement vers le haut au passage dans le viewport, réutilisable
// sur toutes les pages publiques (contrairement aux animations "au montage"
// existantes — initial/animate sans viewport — qui jouent une seule fois au
// chargement de la page et jamais au scroll). `once: true` : chaque section
// n'apparaît qu'une fois, pas à chaque passage, pour rester sobre et ne pas
// distraire en scrollant de haut en bas. Respecte prefers-reduced-motion en
// affichant le contenu directement, sans translation ni fondu.
//
// `as` accepte soit un nom de balise ("div", "section"…), soit un composant
// déjà enveloppé par motion() (ex. `const MotionLink = motion(Link)` défini
// une fois au niveau du module). Ne JAMAIS passer motion(Component) en ligne
// ici : ça créerait un nouveau type de composant à chaque rendu et forcerait
// un démontage/remontage (donc une animation qui rejoue sans cesse).
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = 28,
  duration = 0.6,
  amount = 0.2,
  className = "",
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const isTagName = typeof as === "string";
  const MotionTag = isTagName ? motion[as] || motion.div : as;

  if (reduceMotion) {
    // JSX exige une majuscule pour référencer une variable comme élément
    // (sinon "as" serait lu comme la balise HTML littérale <as>).
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
