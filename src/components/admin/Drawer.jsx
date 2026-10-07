import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

// Panneau latéral (depuis la droite) — pour la fiche chantier détaillée
// (AdminChantiers). Différent de Modal (centré) : plus adapté à un contenu
// long et scrollable, à la manière d'un tiroir d'édition rapide.
export default function Drawer({ open, onClose, children }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-navy-dark/45"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative w-full max-w-[460px] h-full bg-white shadow-card overflow-y-auto"
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 rounded-full bg-white/90 text-navy flex items-center justify-center hover:bg-white transition-colors"
            >
              <X size={16} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
