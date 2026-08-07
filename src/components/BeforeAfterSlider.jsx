import { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";
import PhotoFrame from "./PhotoFrame";
import { useLanguage } from "../i18n/LanguageContext";

// Slider avant/après. Passez `beforeSrc` / `afterSrc` (vraies photos) dès
// qu'elles sont disponibles ; en attendant, deux tons de dégradé distincts
// illustrent la transformation du chantier.
export default function BeforeAfterSlider({ beforeSrc, afterSrc }) {
  const { t } = useLanguage();
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);

  const updateFromClientX = (clientX) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  };

  return (
    <div
      ref={ref}
      className="relative h-[420px] rounded-lg overflow-hidden select-none cursor-ew-resize"
      onMouseDown={(e) => {
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && updateFromClientX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      <PhotoFrame src={afterSrc} tone="green" label={t("common.after")} className="absolute inset-0 h-full" />

      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <PhotoFrame src={beforeSrc} tone="navy" label={t("common.before")} className="absolute inset-0 h-full" />
      </div>

      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-9 h-9 rounded-full bg-white shadow-card flex items-center justify-center text-navy">
          <MoveHorizontal size={16} />
        </div>
      </div>
    </div>
  );
}
