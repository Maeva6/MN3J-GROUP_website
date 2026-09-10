// Export CSV 100% côté navigateur (Blob + lien de téléchargement) : fonctionne
// dès maintenant même sans back-end, puisque les données admin vivent déjà
// entièrement en mémoire côté front (voir src/data/adminData.js, projects.js).

function escapeCsvValue(value) {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

// columns: [{ key, label }]
export function exportToCsv(filename, rows, columns) {
  const header = columns.map((c) => escapeCsvValue(c.label)).join(",");
  const lines = rows.map((row) => columns.map((c) => escapeCsvValue(row[c.key])).join(","));
  // ﻿ (BOM) : Excel affiche correctement les accents sans ça sur Windows.
  const csv = "﻿" + [header, ...lines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
