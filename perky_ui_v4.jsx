import { useState, useEffect, useCallback, useReducer } from "react";

// ─── THEME ───────────────────────────────────────────────────────────
const LIGHT = {
  bg: "#FFFFFF", bgSecondary: "#F7F7F5", sidebar: "#FAFAF9",
  border: "#EEEEEE", borderStrong: "#D5D5D0",
  text: "#1A1A1A", textSec: "#888888", textTert: "#CCCCCC",
  card: "#FFFFFF", blue: "#185FA5", blueLighter: "#E6F1FB", blueMid: "#378ADD",
  green: "#1D9E75", greenLight: "#E1F5EE",
  amber: "#BA7517", amberLight: "#FAEEDA",
  red: "#E24B4A", redLight: "#FCEBEB",
};
const DARK = {
  bg: "#0F0F0F", bgSecondary: "#1A1A1A", sidebar: "#141414",
  border: "#2A2A2A", borderStrong: "#3A3A3A",
  text: "#F0F0F0", textSec: "#888888", textTert: "#444444",
  card: "#1E1E1E", blue: "#4A9BE8", blueLighter: "#1A2E45", blueMid: "#378ADD",
  green: "#2DC78F", greenLight: "#0D2E22",
  amber: "#E8A020", amberLight: "#2E1F05",
  red: "#E24B4A", redLight: "#2E1010",
};

const font = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
const fmt = (n) => Math.round(n).toLocaleString("fr-FR");

// ─── INITIAL EMPLOYEES ────────────────────────────────────────────────
const INIT_EMPLOYEES = [
  { id: 1, firstName: "Marie", lastName: "Lemaire", email: "marie.lemaire@optiquedupont.fr", phone: "06 12 34 56 78", role: "Opticienne — CDI", seniority: 36, initials: "ML", ppv: 1000, active: true },
  { id: 2, firstName: "Julien", lastName: "Renaud", email: "julien.renaud@optiquedupont.fr", phone: "06 98 76 54 32", role: "Opticien — CDI", seniority: 18, initials: "JR", ppv: 800, active: true },
  { id: 3, firstName: "Sofia", lastName: "Amrani", email: "sofia.amrani@optiquedupont.fr", phone: "07 11 22 33 44", role: "Alternante", seniority: 8, initials: "SA", ppv: 500, active: true },
];

// ─── SCANNER INITIAL STATE ────────────────────────────────────────────
const INIT_SCANNER = {
  navigo: { pct: 50, max: 75, done: false },
  cadeaux: { amount: 0, max: 193, done: false },
  vacances: { amount: 0, max: 550, done: false },
  resto: { amount: 10, max: 13, done: true },
  mutuelle: { amount: 0, max: 180, done: false },
};

const IMG = {
  ugc: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop",
  disney: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=400&h=250&fit=crop",
  parfum: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=250&fit=crop",
  fnac: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=250&fit=crop",
  sport: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
  travel: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop",
  hero: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&h=400&fit=crop",
  parc: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=250&fit=crop",
  beaute: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop",
  shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=250&fit=crop",
  food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
  cinema: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=250&fit=crop",
};

const OFFERS = [
  { id: 1, name: "Place UGC", cat: "Cinéma", price: 7.5, display: "7,50€", old: "14,20€", discount: "-47%", img: IMG.ugc, desc: "Valable dans tous les cinémas UGC de France.", conditions: "Valable 6 mois. Non remboursable.", stock: "Illimité" },
  { id: 2, name: "Disneyland Paris", cat: "Parc", price: 55, display: "55€", old: "85€", discount: "-30€", img: IMG.disney, desc: "Accès 1 jour aux 2 parcs Disneyland Paris.", conditions: "Billet daté, non modifiable.", stock: "Selon dispo" },
  { id: 3, name: "Parfumerie de l'Europe", cat: "Beauté", price: 0, display: "-35%", old: "sur la sélection", discount: "-35%", img: IMG.parfum, desc: "Grandes marques à tarifs exclusifs Perky.", conditions: "Non cumulable.", stock: "Selon dispo" },
  { id: 4, name: "Carte cadeau Fnac", cat: "Shopping", price: 47.5, display: "-5%", old: "sur tout le site", discount: "-5%", img: IMG.fnac, desc: "Utilisable en ligne et en magasin.", conditions: "Valable 1 an.", stock: "Illimité" },
  { id: 5, name: "Fitness Park", cat: "Sport", price: 0, display: "-20%", old: "abonnement annuel", discount: "-20%", img: IMG.sport, desc: "Tarif préférentiel Perky.", conditions: "Engagement 12 mois.", stock: "Illimité" },
  { id: 6, name: "Pierre & Vacances", cat: "Voyages", price: 0, display: "-25%", old: "séjours été", discount: "-25%", img: IMG.travel, desc: "Résidences Pierre & Vacances et Center Parcs.", conditions: "Selon dispo.", stock: "Selon dispo" },
];
const CATEGORIES = [
  { label: "Cinéma", count: 42, img: IMG.cinema },
  { label: "Parc", count: 38, img: IMG.parc },
  { label: "Shopping", count: 124, img: IMG.shopping },
  { label: "Voyages", count: 67, img: IMG.travel },
  { label: "Sport", count: 29, img: IMG.sport },
  { label: "Restauration", count: 56, img: IMG.food },
  { label: "Beauté", count: 31, img: IMG.beaute },
];

// ─── UTILS ────────────────────────────────────────────────────────────
function Icon({ name, size = 18, color }) {
  return <i className={`ti ti-${name}`} style={{ fontSize: size, color }} aria-hidden="true" />;
}
function Badge({ text, variant = "blue", t }) {
  const c = { blue: [t.blueLighter, t.blue], green: [t.greenLight, t.green], amber: [t.amberLight, t.amber], red: [t.redLight, t.red] }[variant] || [t.blueLighter, t.blue];
  return <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 10, background: c[0], color: c[1] }}>{text}</span>;
}
function Bar({ pct, color, h = 4 }) {
  return <div style={{ width: "100%", height: h, background: "#33333322", borderRadius: h / 2, overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: color, borderRadius: h / 2, transition: "width 0.5s ease" }} /></div>;
}
function Input({ label, value, onChange, type = "text", placeholder, t }) {
  return <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSec, marginBottom: 4 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "10px 12px", border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 14, fontFamily: font, outline: "none", background: t.bgSecondary, color: t.text, boxSizing: "border-box" }} />
  </div>;
}
function Modal({ open, onClose, title, children, t }) {
  if (!open) return null;
  return <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
    <div style={{ background: t.card, borderRadius: 16, padding: "24px", width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, color: t.text, margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: t.textSec, fontSize: 20 }}>×</button>
      </div>
      {children}
    </div>
  </div>;
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ items, active, onSelect, user, role, t, cartCount }) {
  return <div style={{ width: 220, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
    <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${t.border}` }}>
      <div style={{ fontSize: 20, fontWeight: 600, color: t.blue, letterSpacing: -0.5 }}>Perky</div>
      <div style={{ fontSize: 11, color: t.textSec, marginTop: 2 }}>{role}</div>
    </div>
    <div style={{ flex: 1, padding: "12px 10px" }}>
      {items.map(it => <button key={it.id} onClick={() => onSelect(it.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active === it.id ? t.blueLighter : "transparent", color: active === it.id ? t.blue : t.textSec, cursor: "pointer", fontSize: 13, fontWeight: active === it.id ? 500 : 400, fontFamily: font, marginBottom: 2, textAlign: "left" }}>
        <Icon name={it.icon} size={18} color={active === it.id ? t.blue : t.textSec} />
        {it.label}
        {it.id === "cart" && cartCount > 0 && <span style={{ marginLeft: "auto", background: t.blue, color: "#fff", fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 10 }}>{cartCount}</span>}
      </button>)}
    </div>
    <div style={{ padding: "14px 16px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: t.blue }}>{user.initials}</div>
      <div><div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{user.name}</div><div style={{ fontSize: 11, color: t.textSec }}>{user.sub}</div></div>
    </div>
  </div>;
}

// ─── BOSS SCANNER (PPV per employee) ─────────────────────────────────
function BossScanner({ employees, scannerState, setScannerState, onUpdateEmployeePPV, t }) {
  const [openItem, setOpenItem] = useState(null);
  const s = scannerState;
  const n = employees.filter(e => e.active).length;
  const activeEmp = employees.filter(e => e.active);

  const totalPPV = activeEmp.reduce((sum, e) => sum + (e.ppv || 0), 0);
  const totalNavigo = Math.round(((s.navigo.pct - 50) / 100) * 86.40 * 12 * n);
  const totalCadeaux = s.cadeaux.amount * n;
  const totalVacances = s.vacances.amount * n;
  const totalResto = Math.round(s.resto.amount * 0.55 * 220 * n);
  const grandTotal = totalPPV + totalNavigo + totalCadeaux + totalVacances;
  const globalPct = Math.round(([totalPPV, totalNavigo, totalCadeaux, totalVacances].filter(v => v > 0).length / 4) * 100);

  const update = (key, field, val) => setScannerState(prev => ({ ...prev, [key]: { ...prev[key], [field]: val } }));

  const items = [
    {
      id: "ppv", title: "PPV 2026 — par salarié", icon: "coin", color: "blue",
      loi: "Art. 1 loi n°2022-1158 — max 3 000€/salarié",
      total: totalPPV, pct: Math.round((totalPPV / (3000 * n)) * 100),
      perEmployee: true,
      savingsLabel: `${fmt(Math.round(totalPPV * 0.45))}€ économisés vs primes classiques chargées`,
    },
    {
      id: "navigo", title: "Navigo — taux uniforme", icon: "bus", color: "amber",
      loi: "Art. L3261-4 CT — exo jusqu'à 75%",
      total: totalNavigo, pct: Math.round(((s.navigo.pct - 50) / 25) * 100),
      perEmployee: false,
      savingsLabel: `+${fmt(Math.round(((s.navigo.pct - 50) / 100) * 86.40 * 12))}€/an net par salarié`,
    },
    {
      id: "cadeaux", title: "Chèques cadeaux Noël", icon: "gift", color: "amber",
      loi: "Circ. URSSAF — plafond ~193€/événement",
      total: totalCadeaux, pct: Math.round((s.cadeaux.amount / 193) * 100),
      perEmployee: false,
      savingsLabel: `${fmt(Math.round(s.cadeaux.amount * n * 0.45))}€ économisés vs primes cash`,
    },
    {
      id: "vacances", title: "Chèques vacances", icon: "beach", color: "amber",
      loi: "Art. L411-9 Code tourisme — 30% SMIC",
      total: totalVacances, pct: Math.round((s.vacances.amount / 550) * 100),
      perEmployee: false,
      savingsLabel: `${fmt(Math.round(s.vacances.amount * n * 0.22))}€ de CSG/CRDS économisés`,
    },
    {
      id: "resto", title: "Titres-restaurant", icon: "tools-kitchen-2", color: "green",
      loi: "Art. L3262-1 CT — exo 50-60% jusqu'à ~7,26€/j",
      total: totalResto, pct: Math.round((s.resto.amount / s.resto.max) * 100),
      perEmployee: false, done: true,
      savingsLabel: `${fmt(totalResto)}€/an de pouvoir d'achat pour l'équipe`,
    },
  ];

  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 4px" }}>Scanner avantages</h1>
    <p style={{ fontSize: 14, color: t.textSec, margin: "0 0 20px" }}>Configurez chaque dispositif — le calcul se met à jour en temps réel</p>

    <div style={{ background: `linear-gradient(135deg, ${t.blue} 0%, #0C447C 100%)`, borderRadius: 14, padding: "20px 24px", color: "#fff", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Pouvoir d'achat total configuré</div>
        <div style={{ fontSize: 36, fontWeight: 600 }}>{fmt(grandTotal)} €</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>pour {n} salarié{n > 1 ? "s" : ""} — ~{fmt(Math.round(grandTotal / Math.max(n, 1)))}€/pers.</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 40, fontWeight: 600 }}>{globalPct}%</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>optimisé</div>
        <Bar pct={globalPct} color="rgba(255,255,255,0.4)" h={4} />
      </div>
    </div>

    {items.map(item => {
      const colorMap = { blue: t.blue, green: t.green, amber: t.amber };
      const lightMap = { blue: t.blueLighter, green: t.greenLight, amber: t.amberLight };
      const c = colorMap[item.color]; const cl = lightMap[item.color];
      const isOpen = openItem === item.id;
      const sv = s[item.id];

      return <div key={item.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, marginBottom: 10, borderLeft: `3px solid ${c}`, overflow: "hidden" }}>
        <div onClick={() => setOpenItem(isOpen ? null : item.id)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: cl, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={item.icon} size={16} color={c} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{item.title}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {item.total > 0 && <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{fmt(item.total)}€ équipe</span>}
                <Badge text={item.done ? "Activé" : item.total > 0 ? "Configuré" : "À activer"} variant={item.done ? "green" : item.total > 0 ? "blue" : "amber"} t={t} />
                <Icon name={isOpen ? "chevron-up" : "chevron-down"} size={16} color={t.textSec} />
              </div>
            </div>
            <Bar pct={item.pct} color={c} h={3} />
          </div>
        </div>

        {isOpen && <div style={{ borderTop: `1px solid ${t.border}`, padding: "16px 18px" }}>
          <div style={{ fontSize: 11, color: t.textSec, fontFamily: "monospace", background: t.bgSecondary, padding: "4px 10px", borderRadius: 6, display: "inline-block", marginBottom: 12 }}>{item.loi}</div>

          {item.perEmployee ? (
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>Montant par salarié (modulable selon ancienneté ou classification)</div>
              {activeEmp.map(emp => (
                <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 12, background: t.bgSecondary, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: t.blue, flexShrink: 0 }}>{emp.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 2 }}>{emp.firstName} {emp.lastName}</div>
                    <div style={{ fontSize: 11, color: t.textSec }}>{emp.role} — {emp.seniority} mois d'ancienneté</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="range" min={0} max={3000} step={100} value={emp.ppv || 0}
                      onChange={e => onUpdateEmployeePPV(emp.id, parseInt(e.target.value))}
                      style={{ width: 120, accentColor: c }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: c, minWidth: 60, textAlign: "right" }}>{fmt(emp.ppv || 0)}€</span>
                  </div>
                </div>
              ))}
              <div style={{ background: cl, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div><div style={{ fontSize: 11, color: c }}>Total PPV équipe</div><div style={{ fontSize: 20, fontWeight: 600, color: c }}>{fmt(totalPPV)} €</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: c }}>Plafond disponible</div><div style={{ fontSize: 16, fontWeight: 500, color: c }}>{fmt(3000 * n - totalPPV)}€ restants</div></div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>
                  {item.id === "navigo" ? `${sv.pct}% remboursés` : `${fmt(sv.amount || 0)}€/salarié`}
                </span>
                <span style={{ fontSize: 12, color: t.textSec }}>Plafond : {item.id === "navigo" ? "75%" : `${fmt(s[item.id].max || 0)}€`}</span>
              </div>
              <input type="range"
                min={item.id === "navigo" ? 50 : 0}
                max={item.id === "navigo" ? 75 : (s[item.id].max || 500)}
                step={item.id === "navigo" ? 5 : item.id === "vacances" ? 50 : 10}
                value={item.id === "navigo" ? sv.pct : (sv.amount || 0)}
                onChange={e => update(item.id, item.id === "navigo" ? "pct" : "amount", parseInt(e.target.value))}
                style={{ width: "100%", accentColor: c, cursor: "pointer", marginBottom: 8 }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.textTert, marginBottom: 12 }}>
                <span>{item.id === "navigo" ? "50% (min légal)" : "0"}</span>
                <span>{item.id === "navigo" ? "75% (max exo)" : `${fmt(s[item.id].max || 0)}€`}</span>
              </div>
              {item.total > 0 && <div style={{ background: cl, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 11, color: c }}>{item.savingsLabel}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: c }}>Total équipe</div><div style={{ fontSize: 20, fontWeight: 600, color: c }}>{fmt(item.total)}€</div></div>
              </div>}
            </div>
          )}
        </div>}
      </div>;
    })}

    <div style={{ background: t.bgSecondary, borderRadius: 12, padding: "12px 16px", fontSize: 12, color: t.textSec, lineHeight: 1.6, borderLeft: `3px solid ${t.blue}`, marginTop: 4 }}>
      ⚠️ Estimations indicatives basées sur les plafonds légaux 2026. Valider avec votre expert-comptable avant mise en œuvre.
    </div>
  </div>;
}

// ─── BOSS TEAM ────────────────────────────────────────────────────────
function BossTeam({ employees, setEmployees, t }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "", seniority: 0 });

  const active = employees.filter(e => e.active);

  const addEmployee = () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    const initials = (form.firstName[0] + form.lastName[0]).toUpperCase();
    setEmployees(prev => [...prev, { ...form, id: Date.now(), initials, seniority: parseInt(form.seniority) || 0, ppv: 0, active: true }]);
    setForm({ firstName: "", lastName: "", email: "", phone: "", role: "", seniority: 0 });
    setShowAdd(false);
  };

  const removeEmployee = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, active: false } : e));
    setShowConfirmDelete(null);
    setShowDetail(null);
  };

  const updateEmployee = (id, field, val) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const emp = showDetail ? employees.find(e => e.id === showDetail) : null;

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: 0 }}>Équipe</h1>
      <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: t.blue, color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="plus" size={16} color="#fff" /> Ajouter un salarié
      </button>
    </div>

    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "10px 18px", background: t.bgSecondary, fontSize: 12, color: t.textSec, fontWeight: 500, borderBottom: `1px solid ${t.border}` }}>
        <span>Salarié</span><span>Ancienneté</span><span>Dernière activité</span><span>Abonnement</span><span></span>
      </div>
      {active.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: t.textSec, fontSize: 14 }}>Aucun salarié actif. Cliquez sur "Ajouter" pour commencer.</div>}
      {active.map((emp, i) => (
        <div key={emp.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "14px 18px", alignItems: "center", borderBottom: i < active.length - 1 ? `1px solid ${t.border}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: t.blue }}>{emp.initials}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{emp.firstName} {emp.lastName}</div>
              <div style={{ fontSize: 12, color: t.textSec }}>{emp.role || "—"}</div>
            </div>
          </div>
          <span style={{ fontSize: 13, color: t.textSec }}>{emp.seniority} mois</span>
          <Badge text="Actif" variant="green" t={t} />
          <span style={{ fontSize: 12, color: t.textSec }}>5€/mois</span>
          <button onClick={() => setShowDetail(emp.id)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${t.border}`, background: "none", fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec }}>Gérer</button>
        </div>
      ))}
    </div>

    <div style={{ marginTop: 10, padding: "12px 16px", background: t.bgSecondary, borderRadius: 10, display: "flex", justifyContent: "space-between", fontSize: 13, color: t.textSec }}>
      <span>Total : {active.length} salarié{active.length > 1 ? "s" : ""} × 5€ = <span style={{ color: t.text, fontWeight: 500 }}>{active.length * 5}€/mois</span></span>
      <span>Prochaine facture : 01/06/2026</span>
    </div>

    {/* MODAL ADD */}
    <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Ajouter un salarié" t={t}>
      <Input label="Prénom *" value={form.firstName} onChange={v => setForm(p => ({ ...p, firstName: v }))} placeholder="Marie" t={t} />
      <Input label="Nom *" value={form.lastName} onChange={v => setForm(p => ({ ...p, lastName: v }))} placeholder="Lemaire" t={t} />
      <Input label="Email *" type="email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="marie@entreprise.fr" t={t} />
      <Input label="Téléphone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} placeholder="06 12 34 56 78" t={t} />
      <Input label="Poste / Contrat" value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} placeholder="Opticienne — CDI" t={t} />
      <Input label="Ancienneté (mois)" type="number" value={form.seniority} onChange={v => setForm(p => ({ ...p, seniority: v }))} placeholder="12" t={t} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${t.border}`, background: "none", color: t.textSec, cursor: "pointer", fontFamily: font, fontSize: 14 }}>Annuler</button>
        <button onClick={addEmployee} disabled={!form.firstName || !form.lastName || !form.email} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: !form.firstName || !form.lastName || !form.email ? t.border : t.blue, color: "#fff", cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 500 }}>Ajouter</button>
      </div>
    </Modal>

    {/* MODAL DETAIL */}
    {emp && <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title={`${emp.firstName} ${emp.lastName}`} t={t}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 500, color: t.blue }}>{emp.initials}</div>
        <div><div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>{emp.firstName} {emp.lastName}</div><div style={{ fontSize: 13, color: t.textSec }}>{emp.role || "—"}</div></div>
      </div>
      <Input label="Prénom" value={emp.firstName} onChange={v => updateEmployee(emp.id, "firstName", v)} t={t} />
      <Input label="Nom" value={emp.lastName} onChange={v => updateEmployee(emp.id, "lastName", v)} t={t} />
      <Input label="Email" type="email" value={emp.email} onChange={v => updateEmployee(emp.id, "email", v)} t={t} />
      <Input label="Téléphone" value={emp.phone || ""} onChange={v => updateEmployee(emp.id, "phone", v)} t={t} />
      <Input label="Poste / Contrat" value={emp.role || ""} onChange={v => updateEmployee(emp.id, "role", v)} t={t} />
      <Input label="Ancienneté (mois)" type="number" value={emp.seniority || 0} onChange={v => updateEmployee(emp.id, "seniority", parseInt(v))} t={t} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={() => setShowConfirmDelete(emp.id)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${t.redLight}`, background: t.redLight, color: t.red, cursor: "pointer", fontFamily: font, fontSize: 14 }}>Retirer de l'équipe</button>
        <button onClick={() => setShowDetail(null)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: t.blue, color: "#fff", cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 500 }}>Enregistrer</button>
      </div>
    </Modal>}

    {/* MODAL CONFIRM DELETE */}
    <Modal open={!!showConfirmDelete} onClose={() => setShowConfirmDelete(null)} title="Confirmer le retrait" t={t}>
      <p style={{ fontSize: 14, color: t.textSec, lineHeight: 1.6, marginBottom: 20 }}>
        Êtes-vous sûr de vouloir retirer ce salarié ? Son accès à Perky sera désactivé immédiatement et l'abonnement ajusté.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => setShowConfirmDelete(null)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${t.border}`, background: "none", color: t.textSec, cursor: "pointer", fontFamily: font }}>Annuler</button>
        <button onClick={() => removeEmployee(showConfirmDelete)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: t.red, color: "#fff", cursor: "pointer", fontFamily: font, fontWeight: 500 }}>Confirmer le retrait</button>
      </div>
    </Modal>
  </div>;
}

// ─── BOSS HOME (linked to scanner) ───────────────────────────────────
function BossHome({ employees, scannerState, t, onNav }) {
  const active = employees.filter(e => e.active);
  const n = active.length;
  const s = scannerState;
  const totalPPV = active.reduce((sum, e) => sum + (e.ppv || 0), 0);
  const totalNavigo = Math.round(((s.navigo.pct - 50) / 100) * 86.40 * 12 * n);
  const totalCadeaux = s.cadeaux.amount * n;
  const totalVacances = s.vacances.amount * n;
  const grandTotal = totalPPV + totalNavigo + totalCadeaux + totalVacances;
  const globalPct = Math.round(([totalPPV, totalNavigo, totalCadeaux, totalVacances].filter(v => v > 0).length / 4) * 100);

  return <div>
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 4px" }}>Tableau de bord</h1>
      <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Optique Dupont — {n} bénéficiaire{n > 1 ? "s" : ""}</p>
    </div>
    <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, position: "relative", height: 180 }}>
      <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(24,95,165,0.92) 0%, rgba(12,68,124,0.88) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Pouvoir d'achat récupérable</div>
          <div style={{ fontSize: 36, fontWeight: 600, margin: "4px 0" }}>{fmt(grandTotal)} €</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>soit ~{fmt(Math.round(grandTotal / Math.max(n, 1)))}€ par salarié/an</div>
        </div>
        <div style={{ textAlign: "right", color: "#fff" }}>
          <div style={{ fontSize: 40, fontWeight: 600 }}>{globalPct}%</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>optimisé</div>
          <Bar pct={globalPct} color="rgba(255,255,255,0.4)" h={4} />
        </div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {[
        { icon: "users", v: `${n}`, l: "Salariés actifs", c: t.blue },
        { icon: "chart-bar", v: "67%", l: "Utilisent Perky", c: t.green },
        { icon: "coin", v: `${fmt(grandTotal)}€`, l: "Avantages configurés", c: t.amber },
      ].map((s2, i) => <div key={i} style={{ flex: 1, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}><Icon name={s2.icon} size={16} color={s2.c} /><span style={{ fontSize: 12, color: t.textSec }}>{s2.l}</span></div>
        <div style={{ fontSize: 22, fontWeight: 500, color: t.text }}>{s2.v}</div>
      </div>)}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: t.text, display: "flex", alignItems: "center", gap: 8 }}><Icon name="chart-bar" size={18} color={t.blue} /> Aperçu du scanner</div>
      <button onClick={() => onNav("scanner")} style={{ fontSize: 13, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Tout configurer →</button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { title: "PPV 2026", val: `${fmt(totalPPV)}€`, pct: Math.round((totalPPV / (3000 * n)) * 100), c: t.blue, badge: totalPPV > 0 ? "blue" : "amber", status: totalPPV > 0 ? "Configuré" : "À activer" },
        { title: "Navigo", val: `${s.navigo.pct}%`, pct: Math.round(((s.navigo.pct - 50) / 25) * 100), c: t.amber, badge: s.navigo.pct > 50 ? "blue" : "amber", status: s.navigo.pct > 50 ? "Optimisé" : "Optimiser → 75%" },
        { title: "Chèques cadeaux Noël", val: s.cadeaux.amount > 0 ? `${fmt(totalCadeaux)}€` : "—", pct: Math.round((s.cadeaux.amount / 193) * 100), c: t.amber, badge: s.cadeaux.amount > 0 ? "blue" : "amber", status: s.cadeaux.amount > 0 ? "Configuré" : "À activer" },
        { title: "Titres-restaurant", val: `${s.resto.amount}€/billet`, pct: Math.round((s.resto.amount / s.resto.max) * 100), c: t.green, badge: "green", status: "Activé" },
      ].map((it, i) => <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${it.c}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{it.title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: it.c }}>{it.val}</span>
            <Badge text={it.status} variant={it.badge} t={t} />
          </div>
        </div>
        <Bar pct={it.pct} color={it.c} h={4} />
      </div>)}
    </div>
  </div>;
}

// ─── EMPLOYEE HOME (with salary breakdown) ────────────────────────────
function EmpHome({ employee, scannerState, t, onGoToCatalogue }) {
  const ppv = employee.ppv || 0;
  const navigoExtra = Math.round(((scannerState.navigo.pct - 50) / 100) * 86.40 * 12);
  const cadeau = scannerState.cadeaux.amount;
  const vacances = scannerState.vacances.amount;
  const restoYear = Math.round(scannerState.resto.amount * 0.55 * 220);
  const cashPerks = ppv + cadeau;
  const naturePerks = navigoExtra + restoYear + vacances;
  const totalPerks = cashPerks + naturePerks;

  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 4px" }}>Bonjour {employee.firstName}</h1>
    <p style={{ fontSize: 14, color: t.textSec, margin: "0 0 20px" }}>Bienvenue sur votre espace avantages Perky</p>

    <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 20, position: "relative", height: 190 }}>
      <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(24,95,165,0.92) 0%, rgba(12,68,124,0.88) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Votre entreprise fait partie des</div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>Top 12% des TPE</div>
          <div style={{ fontSize: 14, opacity: 0.8, marginTop: 6 }}>en matière d'avantages salariés</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "18px 24px", textAlign: "center", color: "#fff", backdropFilter: "blur(4px)" }}>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{fmt(totalPerks)} €</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>d'avantages actifs / an</div>
        </div>
      </div>
    </div>

    {/* SALARY BREAKDOWN */}
    {totalPerks > 0 && <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 4 }}>Votre rémunération globale</div>
      <div style={{ fontSize: 13, color: t.textSec, marginBottom: 16 }}>Ce que votre employeur vous apporte au-delà de votre salaire</div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <div style={{ flex: 1, background: t.bgSecondary, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: t.textSec, marginBottom: 4 }}>Votre salaire</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: t.textSec }}>●●●●●</div>
          <div style={{ fontSize: 11, color: t.textTert, marginTop: 4 }}>Connu de vous</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: t.textTert, fontWeight: 300 }}>+</div>
        <div style={{ flex: 1, background: t.greenLight, borderRadius: 10, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.green}22` }}>
          <div style={{ fontSize: 11, color: t.green, marginBottom: 4 }}>Avantages en espèces</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: t.green }}>{fmt(cashPerks)} €</div>
          <div style={{ fontSize: 11, color: t.green, marginTop: 4 }}>PPV + chèques cadeaux</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 20, color: t.textTert, fontWeight: 300 }}>+</div>
        <div style={{ flex: 1, background: t.blueLighter, borderRadius: 10, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.blue}22` }}>
          <div style={{ fontSize: 11, color: t.blue, marginBottom: 4 }}>Avantages en nature</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: t.blue }}>{fmt(naturePerks)} €</div>
          <div style={{ fontSize: 11, color: t.blue, marginTop: 4 }}>Transport + resto + vacances</div>
        </div>
      </div>

      <div style={{ background: `linear-gradient(90deg, ${t.green}22, ${t.blue}22)`, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: t.text }}>Avantages totaux offerts par votre employeur</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: t.text }}>{fmt(totalPerks)} €/an</div>
      </div>
    </div>}

    {/* ACTIVE PERKS */}
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon name="gift" size={18} color={t.blue} /> Ce que votre employeur vous offre</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          ppv > 0 && { title: "PPV 2026", sub: `${fmt(ppv)}€ nets versés`, icon: "coin", type: "cash" },
          navigoExtra > 0 && { title: `Transport ${scannerState.navigo.pct}%`, sub: `${fmt(navigoExtra)}€/an supplémentaires`, icon: "bus", type: "nature" },
          scannerState.resto.amount > 0 && { title: "Titres-restaurant", sub: `Pluxee — ${scannerState.resto.amount}€/jour`, icon: "tools-kitchen-2", type: "nature" },
          cadeau > 0 && { title: "Chèques cadeaux", sub: `${fmt(cadeau)}€ à Noël`, icon: "gift", type: "cash" },
          vacances > 0 && { title: "Chèques vacances", sub: `${fmt(vacances)}€/an`, icon: "beach", type: "nature" },
        ].filter(Boolean).slice(0, 3).map((it, i) => {
          const isCash = it.type === "cash";
          return <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${isCash ? t.green : t.blue}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: isCash ? t.greenLight : t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={it.icon} size={16} color={isCash ? t.green : t.blue} /></div>
              <Badge text={isCash ? "Espèces" : "Nature"} variant={isCash ? "green" : "blue"} t={t} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 2 }}>{it.title}</div>
            <div style={{ fontSize: 12, color: t.textSec }}>{it.sub}</div>
          </div>;
        })}
      </div>
    </div>

    {/* FLASH OFFERS */}
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: t.text, display: "flex", alignItems: "center", gap: 8 }}><Icon name="flame" size={18} color={t.amber} /> Offres du moment</div>
        <button onClick={onGoToCatalogue} style={{ fontSize: 13, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Voir tout →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        {OFFERS.slice(0, 4).map(o => <div key={o.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
          <img src={o.img} alt="" style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
          <div style={{ padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: t.textSec }}>{o.cat}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: t.text, margin: "2px 0 4px" }}>{o.name}</div>
            <span style={{ fontSize: 15, fontWeight: 500, color: t.blue }}>{o.display}</span>
          </div>
        </div>)}
      </div>
    </div>
  </div>;
}

// ─── EMPLOYEE CATALOGUE ───────────────────────────────────────────────
function EmpCatalogue({ onOfferClick, onAddToCart, selectedCat, setSelectedCat, t }) {
  const filtered = selectedCat ? OFFERS.filter(o => o.cat === selectedCat) : OFFERS;
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 16px" }}>Catalogue</h1>
    <div style={{ position: "relative", marginBottom: 20 }}>
      <input placeholder="Rechercher une enseigne, un parc, une marque..." style={{ width: "100%", padding: "12px 16px 12px 42px", fontSize: 14, border: `1px solid ${t.border}`, borderRadius: 12, outline: "none", boxSizing: "border-box", fontFamily: font, background: t.bgSecondary, color: t.text }} />
      <div style={{ position: "absolute", left: 14, top: 13 }}><Icon name="search" size={18} color={t.textTert} /></div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
      {CATEGORIES.map((c, i) => <div key={i} onClick={() => setSelectedCat(selectedCat === c.label ? null : c.label)} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", height: 90, border: selectedCat === c.label ? `2px solid ${t.blue}` : `1px solid ${t.border}` }}>
        <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.1))", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "10px 12px" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{c.label}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{c.count} offres</div>
        </div>
      </div>)}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>{selectedCat || "Toutes les offres"}</div>
      {selectedCat && <button onClick={() => setSelectedCat(null)} style={{ fontSize: 12, color: t.blue, border: "none", background: t.blueLighter, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontFamily: font }}>Tout afficher</button>}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
      {filtered.map(o => <div key={o.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
        <div onClick={() => onOfferClick(o)} style={{ position: "relative" }}>
          <img src={o.img} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
          <span style={{ position: "absolute", top: 10, right: 10, background: t.blue, color: "#fff", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 8 }}>{o.discount}</span>
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <div onClick={() => onOfferClick(o)}>
            <div style={{ fontSize: 11, color: t.textSec, marginBottom: 2 }}>{o.cat}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 6 }}>{o.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 500, color: t.blue }}>{o.display}</span>
              <span style={{ fontSize: 12, color: t.textSec, textDecoration: "line-through" }}>{o.old}</span>
            </div>
          </div>
          {o.price > 0 && <button onClick={() => onAddToCart(o)} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "none", background: t.blueLighter, color: t.blue, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font }}>+ Ajouter au panier</button>}
        </div>
      </div>)}
    </div>
  </div>;
}

// ─── CART ─────────────────────────────────────────────────────────────
function CartPage({ cart, onRemove, t }) {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  if (!cart.length) return <div style={{ textAlign: "center", padding: "80px 0" }}>
    <Icon name="shopping-cart" size={48} color={t.textTert} />
    <div style={{ fontSize: 18, fontWeight: 500, color: t.text, marginTop: 16, marginBottom: 8 }}>Votre panier est vide</div>
    <div style={{ fontSize: 14, color: t.textSec }}>Parcourez le catalogue pour ajouter des offres</div>
  </div>;
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 20px" }}>Mon panier</h1>
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        {cart.map((item, i) => <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 16 }}>
          <img src={item.img} alt="" style={{ width: 70, height: 52, borderRadius: 8, objectFit: "cover" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{item.name}</div>
            <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>{item.cat}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: t.blue }}>{item.display}</div>
            <button onClick={() => onRemove(item.id)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${t.border}`, background: "none", cursor: "pointer", color: t.textSec }}><Icon name="trash" size={14} color={t.textSec} /></button>
          </div>
        </div>)}
      </div>
      <div style={{ width: 260 }}>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "20px" }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 14 }}>Résumé</div>
          {cart.map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: t.textSec, marginBottom: 8 }}><span>{item.name}</span><span>{item.display}</span></div>)}
          <div style={{ borderTop: `1px solid ${t.border}`, marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 16 }}>
            <span>Total</span><span>{total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
          </div>
          <button style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: font }}>Procéder au paiement</button>
          <div style={{ fontSize: 11, color: t.textSec, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>Billet envoyé immédiatement dans votre wallet</div>
        </div>
      </div>
    </div>
  </div>;
}

// ─── WALLET ───────────────────────────────────────────────────────────
function EmpWallet({ t }) {
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 16px" }}>Mon wallet</h1>
    <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 10 }}>Billets actifs</div>
    {[{ name: "2x Places UGC", date: "Valable jusqu'au 30/06/2026", img: IMG.ugc }, { name: "Disneyland Paris — 28/05", date: "Billet pour 2 personnes", img: IMG.disney }].map((it, i) => <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={it.img} alt="" style={{ width: 54, height: 40, borderRadius: 8, objectFit: "cover" }} />
        <div><div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{it.name}</div><div style={{ fontSize: 12, color: t.textSec }}>{it.date}</div></div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge text="Actif" variant="green" t={t} />
        <button style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: "none", fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec }}>Renvoyer</button>
      </div>
    </div>)}
    <div style={{ fontSize: 14, fontWeight: 500, color: t.text, margin: "20px 0 10px" }}>Historique</div>
    {[{ n: "Place Pathé — 12/03/2026", p: "8,20€" }, { n: "Carte Fnac 50€ — 25/12/2025", p: "47,50€" }].map((h, i) => <div key={i} style={{ background: t.bgSecondary, borderRadius: 10, padding: "10px 16px", marginBottom: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: t.textSec }}>{h.n}</span>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: t.textSec }}>{h.p}</span>
        <span style={{ fontSize: 11, color: t.textSec, background: t.border, padding: "2px 8px", borderRadius: 8 }}>Utilisé</span>
      </div>
    </div>)}
  </div>;
}

// ─── OFFER DETAIL ─────────────────────────────────────────────────────
function OfferDetail({ offer, onBack, onAddToCart, t }) {
  return <div>
    <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: t.blue, fontFamily: font, marginBottom: 16 }}>
      <Icon name="arrow-left" size={16} color={t.blue} /> Retour au catalogue
    </button>
    <div style={{ display: "flex", gap: 28 }}>
      <div style={{ flex: 1 }}><img src={offer.img} alt="" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 14, display: "block" }} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: t.textSec, marginBottom: 4 }}>{offer.cat}</div>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: t.text, margin: "0 0 10px" }}>{offer.name}</h1>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 28, fontWeight: 500, color: t.blue }}>{offer.display}</span>
          <span style={{ fontSize: 15, color: t.textSec, textDecoration: "line-through" }}>{offer.old}</span>
          <span style={{ background: t.blueLighter, color: t.blue, fontSize: 13, fontWeight: 500, padding: "4px 12px", borderRadius: 8 }}>{offer.discount}</span>
        </div>
        <p style={{ fontSize: 14, color: t.textSec, lineHeight: 1.7, margin: "0 0 16px" }}>{offer.desc}</p>
        <div style={{ background: t.bgSecondary, borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 6 }}>Conditions</div>
          <p style={{ fontSize: 13, color: t.textSec, lineHeight: 1.6, margin: 0 }}>{offer.conditions}</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {offer.price > 0
            ? <button onClick={() => onAddToCart(offer)} style={{ flex: 1, padding: "14px 24px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: font }}>Ajouter au panier</button>
            : <button style={{ flex: 1, padding: "14px 24px", borderRadius: 10, border: "none", background: t.greenLight, color: t.green, fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: font }}>Accéder à l'offre</button>}
          <button style={{ padding: "14px 18px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.card, cursor: "pointer" }}><Icon name="heart" size={18} color={t.textSec} /></button>
        </div>
      </div>
    </div>
  </div>;
}

// ─── SETTINGS ────────────────────────────────────────────────────────
function Settings({ dark, setDark, t }) {
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 20px" }}>Paramètres</h1>
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 0 }}>Apparence</div>
      </div>
      <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Mode sombre</div>
          <div style={{ fontSize: 12, color: t.textSec, marginTop: 2 }}>S'adapte aussi automatiquement à votre système</div>
        </div>
        <button onClick={() => setDark(d => !d)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: dark ? t.blue : t.border, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: dark ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
        </button>
      </div>
    </div>
  </div>;
}

// ─── BOSS FACTURES ────────────────────────────────────────────────────
function BossFactures({ t }) {
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 16px" }}>Factures</h1>
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px", padding: "10px 18px", background: t.bgSecondary, fontSize: 12, color: t.textSec, fontWeight: 500, borderBottom: `1px solid ${t.border}` }}>
        <span>Période</span><span>Montant</span><span>Salariés</span><span>Statut</span><span></span>
      </div>
      {[{ p: "Mai 2026", a: "15,00€", c: "3", s: "En cours" }, { p: "Avril 2026", a: "15,00€", c: "3", s: "Payée" }, { p: "Mars 2026", a: "15,00€", c: "3", s: "Payée" }, { p: "Setup initial", a: "150,00€", c: "—", s: "Payée" }].map((f, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px", padding: "12px 18px", alignItems: "center", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 13, color: t.text }}>{f.p}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{f.a}</span>
        <span style={{ fontSize: 13, color: t.textSec }}>{f.c}</span>
        <Badge text={f.s} variant={f.s === "Payée" ? "green" : "blue"} t={t} />
        <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: "none", fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec }}>PDF</button>
      </div>)}
    </div>
  </div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
const empNav = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "catalogue", label: "Catalogue", icon: "tag" },
  { id: "cart", label: "Mon panier", icon: "shopping-cart" },
  { id: "wallet", label: "Mon wallet", icon: "wallet" },
  { id: "settings", label: "Paramètres", icon: "settings" },
];
const bossNav = [
  { id: "home", label: "Tableau de bord", icon: "home" },
  { id: "scanner", label: "Scanner", icon: "chart-bar" },
  { id: "team", label: "Équipe", icon: "users" },
  { id: "factures", label: "Factures", icon: "file-invoice" },
  { id: "offres", label: "Catalogue", icon: "tag" },
  { id: "settings", label: "Paramètres", icon: "settings" },
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [mode, setMode] = useState("employee");
  const [empPage, setEmpPage] = useState("home");
  const [bossPage, setBossPage] = useState("home");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [cart, setCart] = useState([]);
  const [employees, setEmployees] = useState(INIT_EMPLOYEES);
  const [scannerState, setScannerState] = useState(INIT_SCANNER);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const h = e => setDark(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const t = dark ? DARK : LIGHT;

  const updateEmployeePPV = useCallback((id, val) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ppv: val } : e));
  }, []);

  const addToCart = useCallback((offer) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === offer.id);
      return exists ? prev.map(i => i.id === offer.id ? { ...i, qty: (i.qty || 1) + 1 } : i) : [...prev, { ...offer, qty: 1 }];
    });
    setEmpPage("cart");
  }, []);

  const activeEmployee = employees.find(e => e.id === 1) || employees.find(e => e.active) || INIT_EMPLOYEES[0];

  const empViews = {
    home: <EmpHome employee={activeEmployee} scannerState={scannerState} t={t} onGoToCatalogue={() => setEmpPage("catalogue")} />,
    catalogue: <EmpCatalogue onOfferClick={o => { setSelectedOffer(o); setEmpPage("detail"); }} onAddToCart={addToCart} selectedCat={selectedCat} setSelectedCat={setSelectedCat} t={t} />,
    detail: selectedOffer ? <OfferDetail offer={selectedOffer} onBack={() => { setSelectedOffer(null); setEmpPage("catalogue"); }} onAddToCart={addToCart} t={t} /> : null,
    cart: <CartPage cart={cart} onRemove={id => setCart(prev => prev.filter(i => i.id !== id))} t={t} />,
    wallet: <EmpWallet t={t} />,
    settings: <Settings dark={dark} setDark={setDark} t={t} />,
  };

  const bossViews = {
    home: <BossHome employees={employees} scannerState={scannerState} t={t} onNav={setBossPage} />,
    scanner: <BossScanner employees={employees} scannerState={scannerState} setScannerState={setScannerState} onUpdateEmployeePPV={updateEmployeePPV} t={t} />,
    team: <BossTeam employees={employees} setEmployees={setEmployees} t={t} />,
    factures: <BossFactures t={t} />,
    offres: <EmpCatalogue onOfferClick={o => { setSelectedOffer(o); setBossPage("offres-detail"); }} onAddToCart={addToCart} selectedCat={selectedCat} setSelectedCat={setSelectedCat} t={t} />,
    settings: <Settings dark={dark} setDark={setDark} t={t} />,
  };

  return (
    <div style={{ fontFamily: font, background: t.bg, minHeight: "100vh", color: t.text }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0", borderBottom: `1px solid ${t.border}`, background: t.sidebar }}>
        {[{ id: "employee", icon: "user", label: "Espace salarié" }, { id: "employer", icon: "briefcase", label: "Espace patron" }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "8px 20px", borderRadius: 8, border: mode === m.id ? "none" : `1px solid ${t.border}`, fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500, background: mode === m.id ? t.blue : "transparent", color: mode === m.id ? "#fff" : t.textSec, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name={m.icon} size={14} color={mode === m.id ? "#fff" : t.textSec} /> {m.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {mode === "employee" ? <>
          <Sidebar items={empNav} active={empPage === "detail" ? "catalogue" : empPage} onSelect={id => { setEmpPage(id); setSelectedOffer(null); }} user={{ initials: activeEmployee.initials, name: `${activeEmployee.firstName} ${activeEmployee.lastName}`, sub: "Optique Dupont" }} role="Espace salarié" t={t} cartCount={cart.length} />
          <div style={{ flex: 1, padding: "24px 32px", background: t.bg, overflowY: "auto", minHeight: "calc(100vh - 45px)" }}>{empViews[empPage]}</div>
        </> : <>
          <Sidebar items={bossNav} active={bossPage} onSelect={setBossPage} user={{ initials: "PD", name: "M. Dupont", sub: "Dirigeant" }} role="Espace dirigeant" t={t} cartCount={0} />
          <div style={{ flex: 1, padding: "24px 32px", background: t.bg, overflowY: "auto", minHeight: "calc(100vh - 45px)" }}>{bossViews[bossPage] || bossViews.home}</div>
        </>}
      </div>
    </div>
  );
}
