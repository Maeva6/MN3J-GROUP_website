// PhotoFrame : emplacement photo réutilisable.
// Remplacez la prop `src` par le chemin d'une vraie photo de chantier
// (ex: src="/images/chantiers/villa-les-palmiers-1.jpg") dès qu'elle est disponible.
// Tant que `src` est vide, un dégradé de marque + légende s'affiche à la place.

const TONES = {
  navy: "from-[#12233D] via-navy to-blue",
  green: "from-[#2E5C22] via-green-dark to-green",
  dusk: "from-[#0B1A2E] via-[#1B3A63] to-[#3B6FB8]",
};

export default function PhotoFrame({
  src,
  alt = "",
  tone = "navy",
  label,
  className = "",
  children,
}) {
  if (src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
        {children}
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${TONES[tone]} ${className}`}
      role="img"
      aria-label={alt || label}
    >
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />
      {label && (
        <span className="absolute bottom-3 left-3 text-[10px] tracking-wider uppercase text-white/70 font-semibold bg-black/20 px-2 py-1 rounded">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
