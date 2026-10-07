import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

// Petite notification de confirmation partagée par toutes les pages admin
// (ajout/modification/suppression, import de photos…) — évite de dupliquer
// la même UI de toast dans chaque page.
const Ctx = createContext(null);

export function AdminToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback((message) => {
    clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <Ctx.Provider value={showToast}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.3, 1.3, 0.5, 1] }}
            className="fixed right-7 bottom-7 z-[60] flex items-center gap-3 bg-navy-dark text-white px-5 py-3.5 rounded-lg shadow-card text-[13.5px] max-w-sm"
          >
            <span className="w-6 h-6 rounded-full bg-green flex items-center justify-center shrink-0">
              <Check size={13} className="text-[#12310F]" />
            </span>
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function useAdminToast() {
  const showToast = useContext(Ctx);
  return showToast || (() => {});
}
