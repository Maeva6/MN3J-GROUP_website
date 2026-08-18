import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Diaporama plein cadre à transition fondu-enchaîné : chaque image reste
// affichée assez longtemps pour être appréciée (délai par défaut : 6.5s),
// puis se fond très progressivement dans la suivante (1.8s de recouvrement),
// avec un léger zoom continu pour un rendu premium plutôt qu'un simple cut.
export default function HeroSlideshow({ slides, interval = 6500, className = "", children }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(id);
  }, [slides.length, interval]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <AnimatePresence>
        <motion.img
          key={slides[index].src}
          src={slides[index].src}
          alt={slides[index].alt}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.8, ease: "easeInOut" },
            scale: { duration: (interval + 1800) / 1000, ease: "easeOut" },
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      {children}
    </div>
  );
}
