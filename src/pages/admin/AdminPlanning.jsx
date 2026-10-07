import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { calendarEvents, eventTypeColors } from "../../data/adminData";
import Modal from "../../components/admin/Modal";
import { useAdminHeaderActions } from "./AdminHeaderContext";
import { useAdminToast } from "./AdminToastContext";

const inputClass =
  "w-full mt-1.5 border border-black/10 rounded-md px-3.5 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-green/25 focus:border-green";
const labelClass = "text-xs font-semibold text-muted";

// Les événements sont stockés en jours relatifs à aujourd'hui (voir
// src/data/adminData.js) : on calcule ici leur date absolue à chaque rendu,
// pour que le planning reste pertinent sans jamais devenir une suite de
// dates figées et obsolètes.
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function toIso(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
const capitalize = (s) => s.replace(/^./, (c) => c.toUpperCase());

const emptyForm = { title: "", type: "Interne", date: "", time: "09:00", place: "" };

export default function AdminPlanning() {
  const showToast = useAdminToast();
  const [calOffset, setCalOffset] = useState(0);
  const today = useMemo(() => new Date(), []);
  const todayIso = toIso(today);
  const [selDay, setSelDay] = useState(todayIso);
  const [userEvents, setUserEvents] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const seedEvents = useMemo(
    () => calendarEvents.map((e) => ({ ...e, date: addDays(today, e.offsetDays), iso: toIso(addDays(today, e.offsetDays)) })),
    [today]
  );
  const events = useMemo(
    () => [...seedEvents, ...userEvents.map((e) => ({ ...e, date: new Date(`${e.iso}T00:00`) }))],
    [seedEvents, userEvents]
  );

  const openAdd = () => {
    setForm({ ...emptyForm, date: selDay });
    setAddOpen(true);
  };

  // En-tête commun : bouton "Nouvel événement".
  useAdminHeaderActions({ newLabel: "Nouvel événement", onNew: openAdd });

  const submitAdd = (e) => {
    e.preventDefault();
    setUserEvents((prev) => [...prev, { title: form.title, type: form.type, time: form.time, place: form.place, iso: form.date }]);
    setSelDay(form.date);
    setAddOpen(false);
    showToast(`« ${form.title} » ajouté au planning.`);
  };

  const base = new Date(today.getFullYear(), today.getMonth() + calOffset, 1);
  const firstWeekday = (base.getDay() + 6) % 7;
  const daysInMonth = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const nCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < nCells; i++) {
    const dt = new Date(base.getFullYear(), base.getMonth(), 1 - firstWeekday + i);
    const iso = toIso(dt);
    const inMonth = dt.getMonth() === base.getMonth();
    const dayEvts = events.filter((e) => e.iso === iso);
    cells.push({ iso, num: dt.getDate(), inMonth, isToday: iso === todayIso, isSelected: iso === selDay, events: dayEvts });
  }

  const monthLabel = capitalize(base.toLocaleDateString("fr-FR", { month: "long", year: "numeric" }));
  const selDayLabel = capitalize(new Date(`${selDay}T00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
  const dayEvents = events.filter((e) => e.iso === selDay).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = events
    .filter((e) => e.iso > todayIso)
    .sort((a, b) => a.iso.localeCompare(b.iso))
    .slice(0, 5);

  return (
    <div className="flex flex-wrap items-start gap-6 admin-fade-up">
      <div className="flex-1 min-w-[520px] bg-white border border-black/5 rounded-lg p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCalOffset((o) => o - 1)}
              className="w-8 h-8 rounded-md border border-black/10 flex items-center justify-center text-navy hover:bg-surface"
              aria-label="Mois précédent"
            >
              <ChevronLeft size={16} />
            </button>
            <h2 className="font-display font-semibold text-navy text-lg min-w-[170px] text-center">{monthLabel}</h2>
            <button
              onClick={() => setCalOffset((o) => o + 1)}
              className="w-8 h-8 rounded-md border border-black/10 flex items-center justify-center text-navy hover:bg-surface"
              aria-label="Mois suivant"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => {
                setCalOffset(0);
                setSelDay(todayIso);
              }}
              className="border border-black/10 bg-surface rounded-md px-3 py-1.5 text-[12.5px] font-semibold text-navy hover:border-navy/30"
            >
              Aujourd'hui
            </button>
          </div>
          <div className="flex gap-3 flex-wrap text-[11.5px] text-muted">
            {Object.entries(eventTypeColors).map(([label, c]) => (
              <span key={label} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-sm" style={{ background: c.bar }} /> {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 text-[11px] font-semibold tracking-wide text-muted text-center pb-2">
          {["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-black/5 border border-black/5 rounded-md overflow-hidden">
          {cells.map((c) => (
            <button
              key={c.iso}
              onClick={() => setSelDay(c.iso)}
              className={`min-h-[92px] p-1.5 text-left flex flex-col gap-1 transition-colors ${
                c.inMonth ? "bg-white hover:bg-surface" : "bg-[#fafbfc] text-black/30"
              } ${c.isSelected ? "ring-2 ring-inset ring-green" : ""}`}
            >
              <span
                className={`self-start w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  c.isToday ? "bg-green text-[#12310F]" : c.inMonth ? "text-ink" : "text-black/30"
                }`}
              >
                {c.num}
              </span>
              {c.events.slice(0, 2).map((e, i) => (
                <span
                  key={i}
                  className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded truncate border-l-[3px]"
                  style={{ background: eventTypeColors[e.type]?.bg, color: eventTypeColors[e.type]?.text, borderColor: eventTypeColors[e.type]?.bar }}
                >
                  {e.title}
                </span>
              ))}
              {c.events.length > 2 && (
                <span className="text-[10.5px] font-bold text-muted pl-1">+{c.events.length - 2} autre{c.events.length > 3 ? "s" : ""}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-[260px] flex flex-col gap-5">
        <div className="bg-white border border-black/5 rounded-lg p-5">
          <div className="text-xs text-muted">Journée sélectionnée</div>
          <h3 className="font-display font-semibold text-navy text-base mt-1">{selDayLabel}</h3>
          <div className="flex flex-col gap-2.5 mt-4">
            {dayEvents.map((e, i) => (
              <div key={`${selDay}-${i}`} className="flex gap-3 p-3 rounded-md admin-fade-up" style={{ background: eventTypeColors[e.type]?.bg }}>
                <span className="w-1 rounded shrink-0" style={{ background: eventTypeColors[e.type]?.bar }} />
                <div className="min-w-0">
                  <div className="text-[11.5px] font-bold" style={{ color: eventTypeColors[e.type]?.text }}>
                    {e.time} · {e.type}
                  </div>
                  <div className="text-[13.5px] font-semibold text-ink mt-0.5">{e.title}</div>
                  <div className="text-xs text-muted mt-0.5 flex items-center gap-1">
                    <MapPin size={11} className="shrink-0" /> {e.place}
                  </div>
                </div>
              </div>
            ))}
            {dayEvents.length === 0 && (
              <div className="py-6 text-center text-[13px] text-muted border-2 border-dashed border-black/10 rounded-md">
                Aucun événement ce jour-là.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-black/5 rounded-lg p-5">
          <h3 className="font-display font-semibold text-navy text-base">Prochaines échéances</h3>
          <div className="flex flex-col gap-3.5 mt-4">
            {upcoming.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 text-center bg-surface rounded-md py-1.5 shrink-0">
                  <div className="font-display font-extrabold text-navy text-base leading-none">{e.date.getDate()}</div>
                  <div className="text-[10px] font-semibold text-muted uppercase mt-0.5">
                    {capitalize(e.date.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""))}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold text-ink truncate">{e.title}</div>
                  <div className="text-xs text-muted truncate">{e.place}</div>
                </div>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: eventTypeColors[e.type]?.bar }} />
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-xs text-muted">Aucune échéance à venir.</p>}
          </div>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nouvel événement" wide>
        <form onSubmit={submitAdd} className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Titre</label>
            <input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select className={`${inputClass} bg-white`} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {Object.keys(eventTypeColors).map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Lieu / chantier concerné</label>
            <input className={inputClass} value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input required type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Heure</label>
            <input required type="time" className={inputClass} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setAddOpen(false)} className="text-sm font-semibold text-muted px-4 py-2.5">
              Annuler
            </button>
            <button type="submit" className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-navy-dark transition-colors">
              Ajouter
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
