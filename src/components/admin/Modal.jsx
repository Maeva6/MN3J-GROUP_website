import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-dark/50" onClick={onClose} />
      <div
        className={`relative bg-white rounded-lg shadow-card w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 sticky top-0 bg-white">
          <h3 className="text-navy font-semibold text-sm">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
