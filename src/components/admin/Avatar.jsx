// Avatar rond à initiales, couleur déterministe par nom — pas de vraie photo
// de profil côté admin, donc un identifiant visuel stable et coloré plutôt
// qu'un simple texte, comme sur les tableaux de bord inspirés (voir demande).

const PALETTE = [
  { bg: "bg-navy", text: "text-white" },
  { bg: "bg-green", text: "text-[#12310F]" },
  { bg: "bg-blue", text: "text-white" },
  { bg: "bg-navy-light", text: "text-white" },
];

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return Math.abs(hash);
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZES = {
  sm: "w-8 h-8 text-[11px]",
  md: "w-10 h-10 text-xs",
};

export default function Avatar({ name, size = "sm", className = "" }) {
  const safeName = name || "?";
  const { bg, text } = PALETTE[hashString(safeName) % PALETTE.length];
  return (
    <span
      className={`${SIZES[size]} ${bg} ${text} rounded-full flex items-center justify-center font-semibold shrink-0 ${className}`}
      aria-hidden="true"
    >
      {getInitials(safeName)}
    </span>
  );
}
