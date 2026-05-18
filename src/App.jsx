import { useState, useEffect, useCallback } from "react";

// ─── RESPONSIVE HOOK ─────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = e => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return isMobile;
}

// ─── THEME ───────────────────────────────────────────────────────────
const LIGHT = {
  bg: "#F4F5F7",           // fond gris-bleu doux, à la Pennylane
  bgSecondary: "#EDEEF1",  // sections secondaires
  bgTint: "#FBFBFC",       // surface très légère pour zébrures
  sidebar: "#FFFFFF",      // sidebar blanche
  appGrad: "radial-gradient(1200px 600px at 12% -5%, #EAF1FB 0%, rgba(234,241,251,0) 60%), radial-gradient(900px 500px at 100% 0%, #EDEBFA 0%, rgba(237,235,250,0) 55%), #F4F5F7",
  border: "#E5E7EB",       // bordures neutres nettes
  borderSoft: "#EEF0F3",
  borderStrong: "#D3D6DC",
  text: "#10131A",         // presque noir
  textSec: "#5C6270",
  textTert: "#9AA0AC",
  card: "#FFFFFF",
  // ombres en couches — relief premium, douceur Swile
  cardShadow: "0 0 0 1px rgba(16,19,26,0.04), 0 1px 2px rgba(16,19,26,0.04), 0 8px 24px -8px rgba(16,19,26,0.10)",
  cardShadowHover: "0 0 0 1px rgba(16,19,26,0.05), 0 4px 8px rgba(16,19,26,0.06), 0 20px 40px -12px rgba(16,19,26,0.16)",
  cardShadowSoft: "0 1px 2px rgba(16,19,26,0.04), 0 4px 12px -4px rgba(16,19,26,0.06)",
  popShadow: "0 0 0 1px rgba(16,19,26,0.05), 0 18px 48px -12px rgba(16,19,26,0.24)",
  blue: "#2563EB",         // bleu vif et confiant
  blueDeep: "#1D4FCB",
  blueLighter: "#EAF1FE",
  blueMid: "#5B8DEF",
  blueGrad: "linear-gradient(135deg, #3B82F6 0%, #2563EB 55%, #1E40AF 100%)",
  blueGradSoft: "linear-gradient(135deg, #EFF5FF 0%, #E4EDFE 100%)",
  green: "#0EA371",
  greenDeep: "#0A7E58",
  greenLight: "#E3F7EF",
  greenGrad: "linear-gradient(135deg, #14B981 0%, #0EA371 55%, #0A7E58 100%)",
  amber: "#B26A07",
  amberDeep: "#92560A",
  amberLight: "#FCF1DD",
  amberGrad: "linear-gradient(135deg, #F1A732 0%, #D88712 100%)",
  red: "#DC2F36",
  redLight: "#FDEBEC",
  purple: "#7C3AED",
  purpleLight: "#EFEAFD",
  ring: "rgba(37,99,235,0.16)",
  glass: "rgba(255,255,255,0.72)",
};
const DARK = {
  bg: "#0C0E14",
  bgSecondary: "#161922",
  bgTint: "#12141C",
  sidebar: "#10131B",
  appGrad: "radial-gradient(1200px 600px at 12% -5%, #16203A 0%, rgba(22,32,58,0) 60%), radial-gradient(900px 500px at 100% 0%, #1E1A38 0%, rgba(30,26,56,0) 55%), #0C0E14",
  border: "#252934",
  borderSoft: "#1E222C",
  borderStrong: "#363B49",
  text: "#EEF0F4",
  textSec: "#8B91A0",
  textTert: "#565C6B",
  card: "#161922",
  cardShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 1px 2px rgba(0,0,0,0.4), 0 12px 32px -10px rgba(0,0,0,0.6)",
  cardShadowHover: "0 0 0 1px rgba(255,255,255,0.07), 0 4px 8px rgba(0,0,0,0.5), 0 24px 48px -12px rgba(0,0,0,0.7)",
  cardShadowSoft: "0 1px 2px rgba(0,0,0,0.4), 0 6px 16px -6px rgba(0,0,0,0.5)",
  popShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 20px 52px -12px rgba(0,0,0,0.8)",
  blue: "#5B92F5",
  blueDeep: "#3B82F6",
  blueLighter: "#16213B",
  blueMid: "#4C84EE",
  blueGrad: "linear-gradient(135deg, #5B92F5 0%, #3B82F6 55%, #2563EB 100%)",
  blueGradSoft: "linear-gradient(135deg, #16213B 0%, #1A2748 100%)",
  green: "#2DCB92",
  greenDeep: "#1FB07C",
  greenLight: "#0D2A20",
  greenGrad: "linear-gradient(135deg, #2DCB92 0%, #1FB07C 55%, #14935F 100%)",
  amber: "#E8A93C",
  amberDeep: "#CE8E1F",
  amberLight: "#2A2008",
  amberGrad: "linear-gradient(135deg, #EFB44E 0%, #D2901C 100%)",
  red: "#E8534F",
  redLight: "#2E1212",
  purple: "#A179FF",
  purpleLight: "#201746",
  ring: "rgba(91,146,245,0.22)",
  glass: "rgba(22,25,34,0.72)",
};

const font = "'DM Sans', 'Inter', 'Segoe UI', system-ui, sans-serif";
const fmt = (n) => Math.round(n).toLocaleString("fr-FR");

// ─── STYLE HELPERS ────────────────────────────────────────────────────
const card = (t, extra = {}) => ({
  background: t.card,
  borderRadius: 18,
  boxShadow: t.cardShadow,
  ...extra,
});
const cardHover = (t) => ({
  ...card(t),
  cursor: "pointer",
  transition: "box-shadow 0.22s ease, transform 0.18s ease",
});
// élévation animée — relief Swile/Pennylane
const lift = (t) => ({
  onMouseEnter: e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = t.cardShadowHover; },
  onMouseLeave: e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = t.cardShadow; },
});
// en-tête de section aéré
function SectionTitle({ icon, iconColor, title, sub, action, t }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        {icon && (
          <div style={{ width: 32, height: 32, borderRadius: 10, background: (iconColor || t.blue) + "1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name={icon} size={17} color={iconColor || t.blue} />
          </div>
        )}
        <div>
          <div style={{ fontSize: 15.5, fontWeight: 700, color: t.text, letterSpacing: -0.3, lineHeight: 1.2 }}>{title}</div>
          {sub && <div style={{ fontSize: 12.5, color: t.textSec, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}
// petit éclat lumineux décoratif pour les héros
const glowDot = (color, size, opacity = 0.5) => ({
  position: "absolute", width: size, height: size, borderRadius: "50%",
  background: color, filter: "blur(60px)", opacity, pointerEvents: "none",
});


// ─── FAKE ACCOUNTS ────────────────────────────────────────────────────
const ACCOUNTS = [
  { email: "patron@alphaoptique.fr", password: "perky2026", role: "patron", firstLogin: true },
  { email: "benjamin@alphaoptique.fr", password: "perky2026", role: "employee", firstLogin: true },
];

// ─── INITIAL DATA ─────────────────────────────────────────────────────
const INIT_EMPLOYEES = [
  { id: 1, firstName: "Benjamin", lastName: "Martin", email: "benjamin@alphaoptique.fr", phone: "06 12 34 56 78", role: "Opticien — CDI", seniority: 36, initials: "BM", ppv: 1000, active: true },
  { id: 2, firstName: "Julien", lastName: "Renaud", email: "julien@alphaoptique.fr", phone: "06 98 76 54 32", role: "Opticien — CDI", seniority: 18, initials: "JR", ppv: 800, active: true },
  { id: 3, firstName: "Sofia", lastName: "Amrani", email: "sofia@alphaoptique.fr", phone: "07 11 22 33 44", role: "Alternante", seniority: 8, initials: "SA", ppv: 500, active: true },
];

const INIT_SCANNER = {
  navigo: { pct: 50, max: 75, done: false },
  cadeaux: { amount: 0, max: 193, done: false },
  vacances: { amount: 0, max: 550, done: false },
  resto: { amount: 10, pct: 55, max: 15, done: false },
  mutuelle: { amount: 0, max: 180, done: false },
  ppv_type: { value: "Premier versement" },
  ppv_already: {},  // { [empId]: montant déjà versé }
};

// ─── TOOLTIP INFO TEXTS ───────────────────────────────────────────────
const INFO_TEXTS = {
  ppv: "La Prime de Partage de la Valeur remplace la prime Macron. Elle est versée librement par l'employeur, sans charges sociales ni impôt pour les salariés gagnant moins de 3 SMIC. Le montant peut être différent selon l'ancienneté ou la classification.",
  navigo: "L'employeur est obligé de rembourser 50% du Navigo. Il peut monter jusqu'à 75% en restant exonéré de cotisations sociales. Ce taux s'applique de manière uniforme à tous les salariés utilisant les transports en commun.",
  cadeaux: "Les bons d'achat sont exonérés de charges sociales jusqu'à ~193€ par événement (Noël, rentrée, mariage...). Ils doivent être attribués à l'occasion d'un événement précis et utilisés en lien avec cet événement.",
  vacances: "Les TPE sans CSE peuvent attribuer des chèques vacances directement. La contribution patronale (jusqu'à 80%) est exonérée de cotisations sociales. Le salarié co-finance au minimum 20% du montant total.",
  resto: "La part patronale du titre-restaurant est exonérée entre 50% et 60% du montant facial du billet. En dehors de cette fourchette, la part excédentaire est soumise à cotisations. Le montant facial peut aller jusqu'à ~15€.",
};

// ─── KIT PDF GENERATORS ───────────────────────────────────────────────
function downloadKit(kitId, { company, employees, scannerState }) {
  const companyName = company?.name || "Votre entreprise";
  const siret = company?.siret || "[Numéro SIRET]";
  const activeEmp = (employees || []).filter(e => e.active);
  const n = activeEmp.length;
  const date = new Date().toLocaleDateString("fr-FR");

  const css = `
    body { font-family: Arial, sans-serif; max-width: 720px; margin: 40px auto; color: #1a1a1a; font-size: 14px; line-height: 1.6; }
    .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 3px solid #185FA5; padding-bottom: 12px; margin-bottom: 28px; }
    .logo { font-size: 22px; font-weight: 700; color: #185FA5; letter-spacing: -0.5px; }
    .kit-tag { font-size: 12px; color: #888; }
    h1 { font-size: 22px; font-weight: 600; color: #185FA5; margin: 0 0 6px; }
    h2 { font-size: 15px; font-weight: 600; color: #185FA5; margin: 24px 0 10px; border-bottom: 1px solid #eee; padding-bottom: 6px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 14px 0; }
    .info-table td { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; }
    .info-table td:first-child { background: #E6F1FB; font-weight: 600; width: 35%; }
    .data-table { width: 100%; border-collapse: collapse; margin: 14px 0; }
    .data-table th { padding: 8px 12px; background: #185FA5; color: #fff; font-size: 12px; font-weight: 600; text-align: left; }
    .data-table td { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; }
    .data-table tr:nth-child(even) td { background: #f9f9f7; }
    ul { padding-left: 20px; margin: 8px 0; }
    li { margin-bottom: 4px; font-size: 13px; }
    .disclaimer { margin-top: 32px; padding: 12px 16px; background: #f9f9f7; border-left: 3px solid #185FA5; font-size: 12px; color: #888; font-style: italic; line-height: 1.6; }
    .highlight { background: #E1F5EE; border-radius: 8px; padding: 14px 18px; margin: 14px 0; }
    .signature-line { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; }
    @media print { body { margin: 20px; } }
  `;

  let html = "";

  if (kitId === "ppv") {
    const totalPPV = activeEmp.reduce((s, e) => s + (e.ppv || 0), 0);
    const savings = Math.round(totalPPV * 0.45);
    html = `
      <div class="header"><span class="logo">PERKY</span><span class="kit-tag">Kit Niveau 3 — PPV</span></div>
      <h1>Kit PPV — Prime de Partage de la Valeur</h1>
      <p style="color:#888;font-size:13px;margin-top:4px">Modèle de Décision Unilatérale de l'Employeur + Mémo Comptable</p>
      <div class="highlight">
        <strong>Contexte :</strong> La PPV permet de verser jusqu'à 3 000€/salarié/an, totalement exonérés de cotisations sociales, CSG/CRDS et impôt sur le revenu pour les entreprises &lt; 50 salariés. <strong>Exonération maximale jusqu'au 31/12/2026.</strong>
      </div>
      <h2>Montants configurés par salarié</h2>
      <table class="data-table">
        <thead><tr><th>Salarié</th><th>Poste</th><th>Ancienneté</th><th>PPV</th></tr></thead>
        <tbody>
          ${activeEmp.map(e => `<tr><td>${e.firstName} ${e.lastName}</td><td>${e.role || "—"}</td><td>${e.seniority} mois</td><td><strong>${(e.ppv || 0).toLocaleString("fr-FR")} €</strong></td></tr>`).join("")}
          <tr><td colspan="3"><strong>Total équipe</strong></td><td><strong style="color:#185FA5">${totalPPV.toLocaleString("fr-FR")} €</strong></td></tr>
        </tbody>
      </table>
      <div class="highlight">💰 Économie vs primes classiques chargées : <strong>~${savings.toLocaleString("fr-FR")} €</strong></div>
      <h2>Décision Unilatérale de l'Employeur (DUE)</h2>
      <p><strong>DÉCISION UNILATÉRALE DE L'EMPLOYEUR</strong><br><em>Relative au versement d'une Prime de Partage de la Valeur</em></p>
      <table class="info-table">
        <tr><td>Société</td><td>${companyName}</td></tr>
        <tr><td>SIRET</td><td>${siret}</td></tr>
        <tr><td>Effectif</td><td>${n} salarié${n > 1 ? "s" : ""}</td></tr>
        <tr><td>Base légale</td><td>Art. 1er loi n°2022-1158 du 16 août 2022</td></tr>
      </table>
      <p><strong>Article 1 — Bénéficiaires :</strong> L'ensemble des salariés liés par un contrat de travail à la date de versement, y compris alternants et apprentis.</p>
      <p><strong>Article 2 — Montants :</strong> Modulés par salarié selon l'ancienneté (voir tableau ci-dessus).</p>
      <p><strong>Article 3 — Date de versement :</strong> Avec la paie du mois de [mois] 2026.</p>
      <p><strong>Article 4 — Régime fiscal :</strong> Exonération totale (cotisations + CSG/CRDS + IR) pour les salariés &lt; 3 SMIC, entreprise &lt; 50 salariés.</p>
      <div class="signature-line">Fait à ________________, le ${date}<br><br>Signature du dirigeant : _______________________</div>
      <h2>Mémo pour l'expert-comptable (Effigest)</h2>
      <table class="info-table">
        <tr><td>Client</td><td>${companyName}</td></tr>
        <tr><td>Objet</td><td>Versement PPV au titre de 2026 — ${totalPPV.toLocaleString("fr-FR")}€ total équipe</td></tr>
        <tr><td>Pièce jointe</td><td>DUE signée</td></tr>
      </table>
      <p><strong>Ce que nous vous demandons :</strong></p>
      <ul>
        <li>Intégrer les versements sur les bulletins de paie du mois de [mois]</li>
        <li>Déclarer en DSN avec le <strong>CTP 510</strong></li>
        <li>Vérifier que chaque bénéficiaire est sous le seuil de 3 SMIC annuels</li>
      </ul>
    `;
  } else if (kitId === "cadeaux") {
    const amount = scannerState?.cadeaux?.amount || 0;
    html = `
      <div class="header"><span class="logo">PERKY</span><span class="kit-tag">Kit Niveau 3 — Chèques Cadeaux</span></div>
      <h1>Kit Chèques Cadeaux URSSAF</h1>
      <p style="color:#888;font-size:13px;margin-top:4px">Entreprise : ${companyName} — ${n} salarié${n > 1 ? "s" : ""}</p>
      <div class="highlight">
        Montant configuré : <strong>${amount} €/salarié/événement</strong> — Total équipe : <strong>${(amount * n).toLocaleString("fr-FR")} €</strong><br>
        Économie estimée vs prime cash : <strong>~${Math.round(amount * n * 0.45).toLocaleString("fr-FR")} €</strong> de charges
      </div>
      <h2>Les 3 règles à respecter</h2>
      <ul>
        <li>Attribué à l'occasion d'un <strong>événement URSSAF listé</strong> ci-dessous</li>
        <li>Montant ≤ <strong>~193€/événement/salarié</strong> (5% du plafond mensuel SS 2026)</li>
        <li>Utilisation en lien avec l'événement (jouets, culture, alimentaire pour Noël...)</li>
      </ul>
      <h2>Événements éligibles & calendrier 2026</h2>
      <table class="data-table">
        <thead><tr><th>Période</th><th>Événement</th><th>Montant max/salarié</th></tr></thead>
        <tbody>
          <tr><td>Juin</td><td>Fête des mères / Fête des pères</td><td>~193€</td></tr>
          <tr><td>Septembre</td><td>Rentrée scolaire (enfants jusqu'à 26 ans)</td><td>~193€</td></tr>
          <tr><td>Décembre</td><td>Noël du salarié</td><td>~193€</td></tr>
          <tr><td>Décembre</td><td>Noël des enfants (&lt;16 ans)</td><td>~193€/enfant</td></tr>
          <tr><td>Ponctuel</td><td>Mariage / PACS / Naissance / Retraite</td><td>~193€</td></tr>
        </tbody>
      </table>
      <h2>Plan d'action</h2>
      <ul>
        <li>Choisir un fournisseur dématérialisé : <strong>Wedoogift, Glady, Swile, Perky</strong></li>
        <li>Commander ${amount}€ × ${n} salarié${n > 1 ? "s" : ""} = <strong>${(amount * n).toLocaleString("fr-FR")} €</strong></li>
        <li>Conserver la preuve d'achat et la liste des bénéficiaires</li>
        <li>Transmettre le récapitulatif à votre expert-comptable</li>
      </ul>
      <h2>Mémo pour l'expert-comptable</h2>
      <table class="info-table">
        <tr><td>Client</td><td>${companyName}</td></tr>
        <tr><td>Montant total</td><td>${(amount * n).toLocaleString("fr-FR")} € (${amount}€ × ${n} salariés)</td></tr>
        <tr><td>Nature</td><td>Bons d'achat exonérés URSSAF — non soumis à cotisations</td></tr>
        <tr><td>Action</td><td>Enregistrement comptable + vérification plafonds</td></tr>
      </table>
    `;
  } else if (kitId === "navigo") {
    const pct = scannerState?.navigo?.pct || 50;
    const extra = Math.round(((pct - 50) / 100) * 86.40 * 12);
    const totalExtra = extra * n;
    html = `
      <div class="header"><span class="logo">PERKY</span><span class="kit-tag">Kit Niveau 3 — Transport</span></div>
      <h1>Kit Navigo ${pct}%</h1>
      <p style="color:#888;font-size:13px;margin-top:4px">Entreprise : ${companyName} — ${n} salarié${n > 1 ? "s" : ""}</p>
      <div class="highlight">
        Passage de <strong>50% → ${pct}%</strong> : gain de <strong>+~${extra.toLocaleString("fr-FR")} €/an net</strong> par salarié<br>
        Gain total équipe : <strong>+~${totalExtra.toLocaleString("fr-FR")} €/an</strong> — 100% exonéré et déductible
      </div>
      <h2>Impact chiffré</h2>
      <table class="data-table">
        <thead><tr><th>Élément</th><th>Montant</th></tr></thead>
        <tbody>
          <tr><td>Navigo mensuel</td><td>~86,40€</td></tr>
          <tr><td>Remboursement actuel (50%)</td><td>~43,20€/mois</td></tr>
          <tr><td>Remboursement à ${pct}%</td><td>~${(86.40 * pct / 100).toFixed(2)}€/mois</td></tr>
          <tr><td>Gain net par salarié</td><td>~${extra.toLocaleString("fr-FR")} €/an</td></tr>
          <tr><td>Gain total équipe (${n} pers.)</td><td>~${totalExtra.toLocaleString("fr-FR")} €/an</td></tr>
          <tr><td>Coût patron</td><td>Déductible + exonéré de cotisations</td></tr>
        </tbody>
      </table>
      <h2>Mémo pour l'expert-comptable</h2>
      <table class="info-table">
        <tr><td>Client</td><td>${companyName}</td></tr>
        <tr><td>Objet</td><td>Passage remboursement transport 50% → ${pct}%</td></tr>
        <tr><td>Action</td><td>Ajuster le taux sur les bulletins de paie</td></tr>
        <tr><td>Base légale</td><td>Art. L3261-4 CT — exonération jusqu'à 75%</td></tr>
      </table>
      <p>✅ <strong>Aucune démarche administrative supplémentaire.</strong> Simple ajustement sur les bulletins de paie, décision unilatérale de l'employeur.</p>
    `;
  } else if (kitId === "vacances") {
    const amount = scannerState?.vacances?.amount || 0;
    const patronPart = Math.round(amount * 0.8);
    const salariePart = Math.round(amount * 0.2);
    html = `
      <div class="header"><span class="logo">PERKY</span><span class="kit-tag">Kit Niveau 3 — Chèques Vacances</span></div>
      <h1>Kit Chèques Vacances sans CSE</h1>
      <p style="color:#888;font-size:13px;margin-top:4px">Entreprise : ${companyName} — ${n} salarié${n > 1 ? "s" : ""}</p>
      <div class="highlight">
        Montant configuré : <strong>${amount} €/salarié</strong> — Total patron exonéré : <strong>${(patronPart * n).toLocaleString("fr-FR")} €</strong><br>
        Économie CSG/CRDS estimée : <strong>~${Math.round(patronPart * n * 0.22).toLocaleString("fr-FR")} €</strong>
      </div>
      <h2>Conditions d'exonération</h2>
      <ul>
        <li>Contribution patronale ≤ 30% du SMIC mensuel brut (~550€/an par salarié en 2026)</li>
        <li>Ouvert à <strong>l'ensemble des salariés</strong> (égalité de traitement)</li>
        <li>Le salarié co-finance <strong>minimum 20%</strong> du montant total</li>
      </ul>
      <h2>Répartition pour ${companyName}</h2>
      <table class="data-table">
        <thead><tr><th>Élément</th><th>Montant</th></tr></thead>
        <tbody>
          <tr><td>Valeur totale du chèque vacances</td><td><strong>${amount} €/salarié</strong></td></tr>
          <tr><td>Contribution patronale (80%)</td><td>${patronPart} € — <strong>exonérée de cotisations</strong></td></tr>
          <tr><td>Contribution salarié (20%)</td><td>${salariePart} € (prélevé sur salaire)</td></tr>
          <tr><td>Total patron (${n} salariés)</td><td><strong>${(patronPart * n).toLocaleString("fr-FR")} €</strong></td></tr>
        </tbody>
      </table>
      <h2>Plan d'action</h2>
      <ul>
        <li>Ouvrir un compte employeur sur <strong>ancv.com</strong> (seul organisme habilité)</li>
        <li>Commander ${amount}€ × ${n} salarié${n > 1 ? "s" : ""} en format dématérialisé</li>
        <li>Organiser la contribution salarié (${salariePart}€/personne)</li>
        <li>Transmettre le récapitulatif à votre expert-comptable</li>
      </ul>
      <h2>Base légale</h2>
      <ul>
        <li>Art. L411-1 et suivants du Code du tourisme</li>
        <li>Art. L411-9 : règles spécifiques entreprises &lt; 50 salariés sans CSE</li>
      </ul>
    `;
  }

  const full = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Kit Perky — ${kitId.toUpperCase()}</title><style>${css}</style></head><body>${html}<div class="disclaimer">⚠️ Ce document est un modèle indicatif généré par Perky. Sa mise en œuvre doit être validée par votre expert-comptable ou conseil juridique avant toute application. Perky informe et facilite — Perky ne certifie pas.</div></body></html>`;

  const win = window.open("", "_blank");
  win.document.write(full);
  win.document.close();
  setTimeout(() => win.print(), 500);
}

const SECTORS = ["Commerce / Retail", "Optique / Santé", "Hôtellerie-Restauration", "BTP / Artisanat", "Services aux entreprises", "Beauté / Bien-être", "Transport / Logistique", "Autre"];

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
  login: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=900&fit=crop",
};

const OFFERS = [
  { id: 1, name: "Place UGC", cat: "Cinéma", price: 7.5, display: "7,50€", old: "14,20€", discount: "-47%", img: IMG.ugc, desc: "Valable dans tous les cinémas UGC de France.", conditions: "Valable 6 mois. Non remboursable.", stock: "Illimité" },
  { id: 2, name: "Disneyland Paris", cat: "Parc", price: 55, display: "55€", old: "85€", discount: "-30€", img: IMG.disney, desc: "Accès 1 jour aux 2 parcs.", conditions: "Billet daté, non modifiable.", stock: "Selon dispo" },
  { id: 3, name: "Parfumerie de l'Europe", cat: "Beauté", price: 0, display: "-35%", old: "sélection premium", discount: "-35%", img: IMG.parfum, desc: "Grandes marques à tarifs exclusifs.", conditions: "Non cumulable.", stock: "Selon dispo" },
  { id: 4, name: "Carte cadeau Fnac", cat: "Shopping", price: 47.5, display: "-5%", old: "sur tout le site", discount: "-5%", img: IMG.fnac, desc: "Utilisable en ligne et en magasin.", conditions: "Valable 1 an.", stock: "Illimité" },
  { id: 5, name: "Fitness Park", cat: "Sport", price: 0, display: "-20%", old: "abonnement annuel", discount: "-20%", img: IMG.sport, desc: "Tarif préférentiel Perky.", conditions: "Engagement 12 mois.", stock: "Illimité" },
  { id: 6, name: "Pierre & Vacances", cat: "Voyages", price: 0, display: "-25%", old: "séjours été", discount: "-25%", img: IMG.travel, desc: "Résidences Pierre & Vacances.", conditions: "Selon dispo.", stock: "Selon dispo" },
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
function BellIcon({ size = 18, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function Badge({ text, variant = "blue", t, dot }) {
  const c = {
    blue: [t.blueLighter, t.blue],
    green: [t.greenLight, t.green],
    amber: [t.amberLight, t.amber],
    red: [t.redLight, t.red],
    purple: [t.purpleLight, t.purple],
  }[variant] || [t.blueLighter, t.blue];
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: dot ? "4px 11px 4px 8px" : "4px 11px", borderRadius: 20, background: c[0], color: c[1], letterSpacing: 0.1, display: "inline-flex", alignItems: "center", gap: 6, lineHeight: 1, whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: c[1] }} />}
      {text}
    </span>
  );
}
function Bar({ pct, color, h = 5 }) {
  return (
    <div style={{ width: "100%", height: h, background: color + "1F", borderRadius: h, overflow: "hidden" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: `linear-gradient(90deg, ${color}CC, ${color})`, borderRadius: h, transition: "width 0.7s cubic-bezier(0.34, 1.2, 0.64, 1)", boxShadow: `0 0 8px ${color}55` }} />
    </div>
  );
}
function Tooltip({ text, t }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ width: 18, height: 18, borderRadius: "50%", background: t.bgSecondary, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "help", flexShrink: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: t.textSec }}>i</span>
      </div>
      {show && (
        <div style={{ position: "absolute", left: 24, top: -6, width: 280, background: t.card, borderRadius: 14, boxShadow: t.cardShadow, padding: "12px 16px", fontSize: 12, color: t.textSec, lineHeight: 1.7, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
          {text}
        </div>
      )}
    </div>
  );
}
function Inp({ label, value, onChange, type = "text", placeholder, t, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: t.textSec, marginBottom: 7, letterSpacing: 0.2 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${focused ? t.blue : t.border}`, borderRadius: 12, fontSize: 14, fontFamily: font, outline: "none", background: focused ? t.card : t.bgTint, color: t.text, boxSizing: "border-box", transition: "border-color 0.16s, box-shadow 0.16s, background 0.16s", boxShadow: focused ? `0 0 0 4px ${t.ring}` : "none" }} />
      {hint && <div style={{ fontSize: 11, color: t.textSec, marginTop: 6, lineHeight: 1.5 }}>{hint}</div>}
    </div>
  );
}
function Btn({ children, onClick, variant = "primary", disabled, t, full }) {
  const styles = {
    primary: { background: t.blueGrad, color: "#fff", border: "1px solid transparent", shadow: `0 2px 6px ${t.blue}33, 0 8px 20px -6px ${t.blue}66` },
    ghost: { background: t.card, color: t.text, border: `1.5px solid ${t.border}`, shadow: t.cardShadowSoft },
    danger: { background: t.red, color: "#fff", border: "1px solid transparent", shadow: `0 6px 16px -6px ${t.red}88` },
  };
  const s = styles[variant] || styles.primary;
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
      style={{ width: full ? "100%" : "auto", padding: "11px 22px", borderRadius: 12, border: s.border, background: disabled ? t.bgSecondary : s.background, color: disabled ? t.textTert : s.color, fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: font, transition: "transform 0.14s ease, box-shadow 0.16s ease", boxShadow: disabled ? "none" : s.shadow }}>
      {children}
    </button>
  );
}
function Modal({ open, onClose, title, children, t }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(8,10,16,0.52)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", animation: "pkFade 0.18s ease" }} onClick={onClose}>
      <div style={{ background: t.card, borderRadius: 22, padding: "28px", width: 480, maxWidth: "90vw", boxShadow: t.popShadow, border: `1px solid ${t.borderSoft}`, animation: "pkPop 0.24s cubic-bezier(0.34,1.3,0.64,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0, letterSpacing: -0.3 }}>{title}</h2>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${t.border}`, background: t.bgSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textSec, fontSize: 18, transition: "background 0.14s" }}
            onMouseEnter={e => e.currentTarget.style.background = t.bgTint}
            onMouseLeave={e => e.currentTarget.style.background = t.bgSecondary}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────
function LoginPage({ onLogin, t }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const isMobile = useIsMobile();

  const handleLogin = () => {
    const acc = ACCOUNTS.find(a => a.email === email && a.password === password);
    if (!acc) { setError("Email ou mot de passe incorrect."); return; }
    setError("");
    onLogin(acc);
  };

  const hints = [
    { role: "Patron", email: "patron@alphaoptique.fr", pass: "perky2026", icon: "briefcase" },
    { role: "Salarié", email: "benjamin@alphaoptique.fr", pass: "perky2026", icon: "user" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh", background: t.bg, fontFamily: font }}>
      <style>{`
        @keyframes pkFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pkPop { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pkRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pkFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes pkDrift { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.12); } 100% { transform: translate(0,0) scale(1); } }
        @keyframes pkShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html { -webkit-text-size-adjust: 100%; }
        body { margin: 0; }
        input, button, select { -webkit-appearance: none; appearance: none; font-family: inherit; }
      `}</style>

      {/* LEFT — branding (hidden on mobile, shown as compact header instead) */}
      {isMobile ? (
        /* Mobile top hero strip */
        <div style={{ position: "relative", overflow: "hidden", background: "#0A1A3A", padding: "36px 24px 32px" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, #0A1A3A 0%, #122B5E 100%)" }} />
          <div style={{ ...glowDot("#3B82F6", 260, 0.38), top: "-30%", left: "-10%", animation: "pkDrift 18s ease-in-out infinite" }} />
          <div style={{ ...glowDot("#7C3AED", 200, 0.28), bottom: "-40%", right: "-5%", animation: "pkDrift 22s ease-in-out infinite reverse" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>Perky</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.2, letterSpacing: -0.6, marginBottom: 8 }}>
              Les avantages des grands groupes,{" "}
              <span style={{ background: "linear-gradient(110deg, #60A5FA, #A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>enfin accessibles.</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 12px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 8px #34D399" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>La plateforme avantages des TPE</span>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop left panel */
        <div style={{ flex: 1.15, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A1A3A" }}>
          <img src={IMG.login} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(150deg, #0A1A3A 0%, #122B5E 45%, #0D2350 100%)" }} />
          <div style={{ ...glowDot("#3B82F6", 420, 0.42), top: "-8%", left: "-6%", animation: "pkDrift 18s ease-in-out infinite" }} />
          <div style={{ ...glowDot("#7C3AED", 360, 0.32), bottom: "-12%", right: "-4%", animation: "pkDrift 22s ease-in-out infinite reverse" }} />
          <div style={{ ...glowDot("#14B981", 280, 0.20), top: "44%", left: "52%", animation: "pkFloat 14s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "52px 52px", maskImage: "radial-gradient(circle at 40% 40%, #000 0%, transparent 75%)", WebkitMaskImage: "radial-gradient(circle at 40% 40%, #000 0%, transparent 75%)" }} />

          <div style={{ position: "relative", zIndex: 1, padding: "60px", maxWidth: 540, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 56, animation: "pkRise 0.6s ease both" }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: "linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(0,0,0,0.35)" }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontSize: 25, fontWeight: 800, color: "#fff", letterSpacing: -0.6 }}>Perky</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 30, padding: "6px 14px", marginBottom: 22, animation: "pkRise 0.6s ease 0.05s both" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34D399", boxShadow: "0 0 10px #34D399" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: 0.2 }}>La plateforme avantages des TPE</span>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1.14, marginBottom: 18, letterSpacing: -1.2, animation: "pkRise 0.6s ease 0.12s both" }}>
              Les avantages des<br />grands groupes,{" "}
              <span style={{ background: "linear-gradient(110deg, #60A5FA, #A78BFA 55%, #34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                enfin accessibles<br />aux TPE.
              </span>
            </div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.62)", lineHeight: 1.7, marginBottom: 44, maxWidth: 420, animation: "pkRise 0.6s ease 0.2s both" }}>
              PPV, chèques vacances, titres-restaurant, réductions exclusives — tout en un seul endroit.
            </div>
            <div style={{ display: "flex", gap: 12, animation: "pkRise 0.6s ease 0.28s both" }}>
              {[
                { label: "5€ / salarié / mois", icon: "coin", c: "#60A5FA" },
                { label: "100% conforme URSSAF", icon: "shield-check", c: "#34D399" },
                { label: "Résiliable à tout moment", icon: "lock-open", c: "#A78BFA" },
              ].map((f, i) => (
                <div key={i} style={{ flex: 1, background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, padding: "15px 14px", backdropFilter: "blur(8px)" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: f.c + "26", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 9 }}>
                    <Icon name={f.icon} size={15} color={f.c} />
                  </div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.82)", lineHeight: 1.4, fontWeight: 500 }}>{f.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, animation: "pkRise 0.6s ease 0.36s both" }}>
              <div style={{ display: "flex" }}>
                {["#3B82F6", "#14B981", "#F59E0B", "#7C3AED"].map((c, i) => (
                  <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: c, border: "2.5px solid #122B5E", marginLeft: i ? -10 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="user" size={13} color="#fff" />
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>
                Déjà adopté par des dizaines<br />de TPE françaises
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT — form */}
      <div style={{ width: isMobile ? "100%" : 500, flex: isMobile ? 1 : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isMobile ? "32px 20px 40px" : "48px", background: t.sidebar, position: "relative" }}>
        <div style={{ width: "100%", maxWidth: 372, animation: "pkRise 0.5s ease 0.1s both" }}>
          <div style={{ fontSize: isMobile ? 24 : 28, fontWeight: 800, color: t.text, marginBottom: 6, letterSpacing: -0.6 }}>Bon retour 👋</div>
          <div style={{ fontSize: 14.5, color: t.textSec, marginBottom: 28, lineHeight: 1.5 }}>Connectez-vous à votre espace Perky</div>

          <Inp label="Adresse email" value={email} onChange={setEmail} type="email" placeholder="vous@entreprise.fr" t={t} />

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: t.textSec, marginBottom: 7, letterSpacing: 0.2 }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ width: "100%", padding: "12px 44px 12px 14px", border: `1.5px solid ${t.border}`, borderRadius: 12, fontSize: 16, fontFamily: font, outline: "none", background: t.bgTint, color: t.text, boxSizing: "border-box", transition: "border-color 0.16s, box-shadow 0.16s, background 0.16s" }}
                onFocus={e => { e.target.style.borderColor = t.blue; e.target.style.boxShadow = `0 0 0 4px ${t.ring}`; e.target.style.background = t.card; }}
                onBlur={e => { e.target.style.borderColor = t.border; e.target.style.boxShadow = "none"; e.target.style.background = t.bgTint; }} />
              <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", display: "flex", padding: 4 }}>
                <Icon name={showPass ? "eye-off" : "eye"} size={18} color={t.textSec} />
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: t.redLight, color: t.red, padding: "11px 14px", borderRadius: 12, fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontWeight: 500, animation: "pkPop 0.2s ease" }}>
              <Icon name="alert-circle" size={15} color={t.red} /> {error}
            </div>
          )}

          <button onClick={handleLogin} disabled={!email || !password}
            style={{ width: "100%", padding: "15px", borderRadius: 13, border: "none", background: !email || !password ? t.bgSecondary : t.blueGrad, color: !email || !password ? t.textTert : "#fff", fontSize: 16, fontWeight: 700, cursor: !email || !password ? "default" : "pointer", fontFamily: font, marginBottom: 14, boxShadow: !email || !password ? "none" : `0 4px 12px ${t.blue}40`, transition: "transform 0.14s ease" }}>
            Se connecter →
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: t.textSec, marginBottom: 24 }}>
            <span style={{ color: t.blue, cursor: "pointer", fontWeight: 600 }}>Mot de passe oublié ?</span>
          </div>

          <div style={{ position: "relative", textAlign: "center", marginBottom: 16 }}>
            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: t.border }} />
            <span style={{ position: "relative", background: t.sidebar, padding: "0 12px", fontSize: 11, fontWeight: 700, color: t.textTert, textTransform: "uppercase", letterSpacing: 0.8 }}>Comptes de démo</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {hints.map((h, i) => (
              <button key={i} onClick={() => { setEmail(h.email); setPassword(h.pass); setError(""); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "12px 14px", borderRadius: 13, border: `1.5px solid ${t.border}`, background: t.card, cursor: "pointer", fontFamily: font }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: t.blueGradSoft, border: `1px solid ${t.blue}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={h.icon} size={16} color={t.blue} />
                </div>
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{h.role}</div>
                  <div style={{ fontSize: 11.5, color: t.textSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.email}</div>
                </div>
                <Icon name="arrow-right" size={15} color={t.textTert} />
              </button>
            ))}
          </div>
        </div>
        {!isMobile && <div style={{ position: "absolute", bottom: 28, fontSize: 11.5, color: t.textTert }}>© 2026 Perky · Solution conforme URSSAF</div>}
        {isMobile && <div style={{ marginTop: 28, fontSize: 11.5, color: t.textTert, textAlign: "center" }}>© 2026 Perky · Solution conforme URSSAF</div>}
      </div>
    </div>
  );
}

// ─── EMPLOYEE ACTIVATION ──────────────────────────────────────────────
function EmployeeActivation({ onComplete, t }) {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const match = password.length >= 6 && password === confirm;

  if (step === 1) return (
    <div style={{ minHeight: "100vh", background: t.appGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 460, padding: "48px", background: t.card, borderRadius: 24, boxShadow: t.popShadow, border: `1px solid ${t.borderSoft}` }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${t.blue}55` }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: t.text, letterSpacing: -0.5 }}>Perky</div>
        </div>

        {/* Invitation banner */}
        <div style={{ background: t.greenGrad, borderRadius: 14, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 12, alignItems: "center", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>
          <Icon name="mail-check" size={20} color="#fff" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Invitation reçue</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>Alpha Optique vous a invité à rejoindre Perky</div>
          </div>
        </div>

        <div style={{ fontSize: 24, fontWeight: 800, color: t.text, marginBottom: 6, letterSpacing: -0.6 }}>Bienvenue, Benjamin 👋</div>
        <div style={{ fontSize: 14, color: t.textSec, marginBottom: 28, lineHeight: 1.65 }}>
          Votre employeur vous offre accès à la plateforme d'avantages Perky. Créez votre mot de passe pour activer votre compte.
        </div>
        <Inp label="Mot de passe (6 caractères min.)" value={password} onChange={setPassword} type="password" placeholder="••••••••" t={t} />
        <Inp label="Confirmer le mot de passe" value={confirm} onChange={setConfirm} type="password" placeholder="••••••••" t={t}
          hint={confirm.length > 0 && !match ? "Les mots de passe ne correspondent pas." : ""} />
        <button onClick={() => setStep(2)} disabled={!match}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: match ? t.blueGrad : t.borderSoft, color: match ? "#fff" : t.textSec, fontSize: 15, fontWeight: 700, cursor: match ? "pointer" : "default", fontFamily: font, boxShadow: match ? "0 4px 14px rgba(37,99,235,0.4)" : "none", transition: "transform 0.15s" }}
          onMouseEnter={e => { if (match) e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}>
          Activer mon compte
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.appGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 460, padding: "48px", background: t.card, borderRadius: 24, boxShadow: t.popShadow, border: `1px solid ${t.borderSoft}`, textAlign: "center", animation: "pkPop 0.4s ease" }}>
        {/* Success icon */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: t.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
          <Icon name="check" size={36} color="#fff" />
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: t.text, marginBottom: 8, letterSpacing: -0.6 }}>Compte activé !</div>
        <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.65, marginBottom: 28 }}>
          Votre compte Perky est prêt. Vous avez accès au catalogue d'avantages et aux informations partagées par votre employeur.
        </div>

        {/* What awaits */}
        <div style={{ background: t.bgTint, borderRadius: 14, padding: "18px 20px", marginBottom: 28, textAlign: "left", border: `1px solid ${t.borderSoft}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>Ce qui vous attend</div>
          {[
            { icon: "gift", text: "Les avantages activés par Alpha Optique", color: t.green },
            { icon: "tag", text: "+2 000 offres en billetterie et réductions", color: t.blue },
            { icon: "wallet", text: "Votre wallet pour stocker vos billets", color: t.amber },
          ].map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: it.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={it.icon} size={15} color={it.color} />
              </div>
              <span style={{ fontSize: 13, color: t.textSec }}>{it.text}</span>
            </div>
          ))}
        </div>

        <button onClick={onComplete}
          style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: t.blueGrad, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(37,99,235,0.4)", transition: "transform 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}>
          Accéder à mon espace →
        </button>
      </div>
    </div>
  );
}

// ─── PATRON ONBOARDING WIZARD ─────────────────────────────────────────
function PatronOnboarding({ onComplete, t }) {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState({ name: "Alpha Optique", sector: "Optique / Santé", siret: "" });
  const [invites, setInvites] = useState([
    { id: 1, firstName: "Benjamin", lastName: "Martin", email: "benjamin@alphaoptique.fr", role: "Opticien — CDI" },
    { id: 2, firstName: "Julien", lastName: "Renaud", email: "julien@alphaoptique.fr", role: "Opticien — CDI" },
    { id: 3, firstName: "Sofia", lastName: "Amrani", email: "sofia@alphaoptique.fr", role: "Alternante" },
  ]);
  const [newInvite, setNewInvite] = useState({ firstName: "", lastName: "", email: "", role: "" });
  const [showAddInvite, setShowAddInvite] = useState(false);

  const SETUP = 150;
  const monthly = invites.length * 5;

  const addInvite = () => {
    if (!newInvite.firstName || !newInvite.email) return;
    setInvites(prev => [...prev, { ...newInvite, id: Date.now() }]);
    setNewInvite({ firstName: "", lastName: "", email: "", role: "" });
    setShowAddInvite(false);
  };

  const steps = ["Votre entreprise", "Votre équipe", "Récapitulatif"];

  return (
    <div style={{ minHeight: "100vh", background: t.appGrad, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: 600, maxWidth: "100%" }}>
        {/* Header with logo + steps */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40, gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 10px ${t.blue}55` }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: t.text, letterSpacing: -0.5 }}>Perky</div>
          </div>
          {/* Stepper */}
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, background: i + 1 <= step ? t.blueGrad : t.bgTint, color: i + 1 <= step ? "#fff" : t.textTert, boxShadow: i + 1 <= step ? `0 2px 8px ${t.blue}44` : "none", border: `1.5px solid ${i + 1 === step ? t.blue : t.borderSoft}`, transition: "all 0.3s" }}>
                    {i + 1 < step ? <Icon name="check" size={14} color="#fff" /> : i + 1}
                  </div>
                  <span style={{ fontSize: 13, color: i + 1 === step ? t.text : t.textTert, fontWeight: i + 1 === step ? 700 : 400 }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 36, height: 1.5, background: i + 1 < step ? t.blue : t.borderSoft, margin: "0 10px", borderRadius: 2, transition: "background 0.3s" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Card wrapper for all steps */}
        <div style={{ background: t.card, borderRadius: 24, boxShadow: t.popShadow, border: `1px solid ${t.borderSoft}`, padding: "36px 40px" }}>

        {/* STEP 1 — COMPANY */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 6 }}>Votre entreprise</div>
            <div style={{ fontSize: 14, color: t.textSec, marginBottom: 28 }}>Ces informations apparaîtront sur vos factures et dans votre espace.</div>
            <Inp label="Nom de l'entreprise *" value={company.name} onChange={v => setCompany(p => ({ ...p, name: v }))} placeholder="Alpha Optique" t={t} />
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSec, marginBottom: 4 }}>Secteur d'activité *</label>
              <select value={company.sector} onChange={e => setCompany(p => ({ ...p, sector: e.target.value }))}
                style={{ width: "100%", padding: "11px 14px", border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 14, fontFamily: font, outline: "none", background: t.bgSecondary, color: t.text, boxSizing: "border-box", cursor: "pointer" }}>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Inp label="SIRET (optionnel)" value={company.siret} onChange={v => setCompany(p => ({ ...p, siret: v }))} placeholder="123 456 789 00012" t={t} hint="Utilisé pour préremplir vos kits URSSAF." />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <Btn onClick={() => setStep(2)} disabled={!company.name || !company.sector} t={t}>Continuer →</Btn>
            </div>
          </div>
        )}

        {/* STEP 2 — TEAM */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 6 }}>Votre équipe</div>
            <div style={{ fontSize: 14, color: t.textSec, marginBottom: 20 }}>
              Chaque salarié recevra un email d'invitation pour activer son compte Perky.
            </div>
            <div style={{ background: t.card, borderRadius: 14, boxShadow: t.cardShadow, overflow: "hidden", marginBottom: 12 }}>
              {invites.map((inv, i) => (
                <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < invites.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: t.blue, flexShrink: 0 }}>
                    {(inv.firstName[0] + (inv.lastName?.[0] || "")).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{inv.firstName} {inv.lastName}</div>
                    <div style={{ fontSize: 12, color: t.textSec }}>{inv.email} {inv.role && `— ${inv.role}`}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Badge text="Invitation en attente" variant="amber" t={t} />
                    <button onClick={() => setInvites(p => p.filter(x => x.id !== inv.id))} style={{ border: "none", background: "none", cursor: "pointer", color: t.textSec, padding: "2px" }}>
                      <Icon name="x" size={16} color={t.textSec} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showAddInvite ? (
              <div style={{ background: t.bgSecondary, borderRadius: 12, padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <Inp label="Prénom *" value={newInvite.firstName} onChange={v => setNewInvite(p => ({ ...p, firstName: v }))} placeholder="Marie" t={t} />
                  <Inp label="Nom" value={newInvite.lastName} onChange={v => setNewInvite(p => ({ ...p, lastName: v }))} placeholder="Dupont" t={t} />
                </div>
                <Inp label="Email *" type="email" value={newInvite.email} onChange={v => setNewInvite(p => ({ ...p, email: v }))} placeholder="marie@entreprise.fr" t={t} />
                <Inp label="Poste / Contrat" value={newInvite.role} onChange={v => setNewInvite(p => ({ ...p, role: v }))} placeholder="CDI, Alternant..." t={t} />
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn onClick={() => setShowAddInvite(false)} variant="ghost" t={t}>Annuler</Btn>
                  <Btn onClick={addInvite} disabled={!newInvite.firstName || !newInvite.email} t={t}>Ajouter</Btn>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddInvite(true)} style={{ width: "100%", padding: "11px", borderRadius: 10, border: `1px dashed ${t.border}`, background: "none", color: t.blue, fontSize: 14, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 12 }}>
                <Icon name="plus" size={16} color={t.blue} /> Ajouter un salarié
              </button>
            )}

            <div style={{ background: t.blueLighter, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: t.blue, lineHeight: 1.5, marginBottom: 20, display: "flex", gap: 8 }}>
              <Icon name="mail" size={16} color={t.blue} />
              Les invitations seront envoyées par email à l'étape suivante.
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Btn onClick={() => setStep(1)} variant="ghost" t={t}>← Retour</Btn>
              <Btn onClick={() => setStep(3)} disabled={invites.length === 0} t={t}>Continuer →</Btn>
            </div>
          </div>
        )}

        {/* STEP 3 — RECAP */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 6 }}>Récapitulatif</div>
            <div style={{ fontSize: 14, color: t.textSec, marginBottom: 24 }}>Vérifiez les informations avant d'activer Perky pour votre équipe.</div>

            <div style={{ background: t.card, borderRadius: 16, boxShadow: t.cardShadow, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Entreprise</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{company.name}</div>
                  <div style={{ fontSize: 13, color: t.textSec }}>{company.sector}</div>
                </div>
                <button onClick={() => setStep(1)} style={{ fontSize: 12, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Modifier</button>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Équipe</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{invites.length} salarié{invites.length > 1 ? "s" : ""} à inviter</div>
                  <div style={{ fontSize: 13, color: t.textSec }}>{invites.map(i => i.firstName).join(", ")}</div>
                </div>
                <button onClick={() => setStep(2)} style={{ fontSize: 12, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Modifier</button>
              </div>
            </div>

            {/* PRICING */}
            <div style={{ background: t.bgTint, borderRadius: 16, padding: "20px", marginBottom: 20, border: `1px solid ${t.borderSoft}` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 14, letterSpacing: -0.3 }}>Détail de la facturation</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: t.textSec, marginBottom: 8 }}>
                <span>Frais d'implantation (une fois)</span>
                <span style={{ fontWeight: 700, color: t.text }}>{SETUP} €</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: t.textSec, marginBottom: 8 }}>
                <span>{invites.length} salarié{invites.length > 1 ? "s" : ""} × 5€/mois</span>
                <span style={{ fontWeight: 700, color: t.text }}>{monthly} €/mois</span>
              </div>
              <div style={{ borderTop: `1px solid ${t.borderSoft}`, paddingTop: 14, marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Total aujourd'hui</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: t.blue, letterSpacing: -0.5 }}>{SETUP + monthly} € HT</span>
              </div>
              <div style={{ fontSize: 11, color: t.textTert, marginTop: 6 }}>puis {monthly}€/mois — résiliable à tout moment</div>
            </div>

            <div style={{ background: t.greenGrad, borderRadius: 12, padding: "14px 18px", fontSize: 13, color: "#fff", lineHeight: 1.55, marginBottom: 24, display: "flex", gap: 10, boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>
              <Icon name="shield-check" size={16} color="#fff" />
              Solution 100% conforme URSSAF. Les invitations seront envoyées immédiatement après activation.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setStep(2)} variant="ghost" t={t}>← Retour</Btn>
              <button onClick={() => onComplete({ name: company.name, sector: company.sector, siret: company.siret })}
                style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: t.blueGrad, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(37,99,235,0.4)", transition: "transform 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                Activer Perky — {SETUP + monthly}€
              </button>
            </div>
          </div>
        )}
        </div>{/* end card wrapper */}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────
function Sidebar({ items, active, onSelect, user, role, t, cartCount }) {
  return (
    <div style={{ width: 248, background: t.sidebar, borderRight: `1px solid ${t.border}`, display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0, position: "relative" }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px -2px ${t.blue}66`, position: "relative" }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 800, color: t.text, letterSpacing: -0.6, lineHeight: 1 }}>Perky</div>
            <div style={{ fontSize: 10, color: t.textTert, marginTop: 3, letterSpacing: 0.3, fontWeight: 600, textTransform: "uppercase" }}>{role}</div>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: t.borderSoft, margin: "0 16px 8px" }} />

      {/* Nav */}
      <div style={{ flex: 1, padding: "6px 12px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: t.textTert, letterSpacing: 0.9, textTransform: "uppercase", padding: "8px 12px 6px" }}>Menu</div>
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <button key={it.id} onClick={() => onSelect(it.id)} style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "10px 12px", borderRadius: 12, border: "none", background: isActive ? t.blueGradSoft : "transparent", color: isActive ? t.blue : t.textSec, cursor: "pointer", fontSize: 13.5, fontWeight: isActive ? 700 : 500, fontFamily: font, marginBottom: 3, textAlign: "left", transition: "background 0.14s, color 0.14s", position: "relative" }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.bgSecondary; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
              {isActive && <div style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 4, height: 22, borderRadius: "0 4px 4px 0", background: t.blueGrad }} />}
              <div style={{ width: 30, height: 30, borderRadius: 9, background: isActive ? t.blue + "1F" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.14s" }}>
                <Icon name={it.icon} size={17} color={isActive ? t.blue : t.textTert} />
              </div>
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.id === "cart" && cartCount > 0 && (
                <span style={{ background: t.blueGrad, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20, boxShadow: `0 2px 6px ${t.blue}55` }}>{cartCount}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Encart aide */}
      <div style={{ padding: "0 14px 10px" }}>
        <div style={{ background: t.blueGradSoft, border: `1px solid ${t.blue}1F`, borderRadius: 14, padding: "13px 14px", position: "relative", overflow: "hidden" }}>
          <div style={{ ...glowDot(t.blue, 90, 0.25), top: -30, right: -20 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, position: "relative" }}>
            <Icon name="sparkles" size={14} color={t.blue} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: t.text }}>Besoin d'aide ?</span>
          </div>
          <div style={{ fontSize: 11.5, color: t.textSec, lineHeight: 1.5, position: "relative" }}>Notre équipe répond sous 24h à support@perky.fr</div>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: "10px 14px 16px", borderTop: `1px solid ${t.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 10px", borderRadius: 13, background: t.bgSecondary, border: `1px solid ${t.borderSoft}` }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0, boxShadow: `0 3px 8px -2px ${t.blue}66` }}>{user.initials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: t.textSec }}>{user.sub}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOSS SCANNER ─────────────────────────────────────────────────────
function BossScanner({ employees, scannerState, setScannerState, onUpdateEmployeePPV, t, company }) {
  const isMobile = useIsMobile();
  const [openItem, setOpenItem] = useState(null);
  const s = scannerState;
  const activeEmp = employees.filter(e => e.active);
  const n = activeEmp.length;
  const isComplement = s.ppv_type?.value === "Versement complémentaire";
  const totalPPVNew = activeEmp.reduce((sum, e) => {
    const already = isComplement ? (s.ppv_already?.[e.id] || 0) : 0;
    return sum + Math.min(e.ppv || 0, Math.max(0, 3000 - already));
  }, 0);
  const totalPPVAlready = isComplement ? activeEmp.reduce((sum, e) => sum + (s.ppv_already?.[e.id] || 0), 0) : 0;
  const totalPPV = totalPPVNew;
  const totalNavigo = Math.round(((s.navigo.pct - 50) / 100) * 86.40 * 12 * n);
  const totalCadeaux = s.cadeaux.amount * n;
  const totalVacances = s.vacances.amount * n;
  const grandTotal = totalPPV + totalNavigo + totalCadeaux + totalVacances;
  const globalPct = Math.round([totalPPV > 0, totalNavigo > 0, totalCadeaux > 0, totalVacances > 0].filter(Boolean).length / 4 * 100);
  const update = (key, field, val) => setScannerState(p => ({ ...p, [key]: { ...p[key], [field]: val } }));

  const restoTotal = Math.round(s.resto.amount * (s.resto.pct / 100) * 220 * n);
  const items = [
    { id: "ppv", title: "PPV 2026 — par salarié", icon: "coin", color: "blue", loi: "Art. 1 loi n°2022-1158 — max 3 000€/salarié", total: totalPPV, pct: Math.round((totalPPV / (3000 * n)) * 100), perEmployee: true, savingsLabel: `${fmt(Math.round(totalPPV * 0.45))}€ économisés vs primes classiques` },
    { id: "navigo", title: "Navigo — taux uniforme", icon: "bus", color: "amber", loi: "Art. L3261-4 CT — exo jusqu'à 75%", total: totalNavigo, pct: Math.round(((s.navigo.pct - 50) / 25) * 100), perEmployee: false },
    { id: "cadeaux", title: "Chèques cadeaux Noël", icon: "gift", color: "amber", loi: "Circ. URSSAF — plafond ~193€/événement", total: totalCadeaux, pct: Math.round((s.cadeaux.amount / 193) * 100), perEmployee: false },
    { id: "vacances", title: "Chèques vacances", icon: "beach", color: "amber", loi: "Art. L411-9 Code tourisme — 30% SMIC", total: totalVacances, pct: Math.round((s.vacances.amount / 550) * 100), perEmployee: false },
    { id: "resto", title: "Titres-restaurant", icon: "tools-kitchen-2", color: "green", loi: "Art. L3262-1 CT — exo part patronale 50-60%", total: restoTotal, pct: Math.round((s.resto.amount / s.resto.max) * 100), perEmployee: false, isResto: true },
  ];

  return <div style={{ maxWidth: 880, animation: "pkRise 0.4s ease both" }}>
    <div style={{ marginBottom: 18 }}>
      <Badge text="Configuration" variant="blue" t={t} dot />
      <h1 style={{ fontSize: 27, fontWeight: 800, color: t.text, margin: "8px 0 4px", letterSpacing: -0.8 }}>Scanner avantages</h1>
      <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Configurez chaque dispositif — le calcul se met à jour en temps réel</p>
    </div>
    <div style={{ background: "linear-gradient(135deg, #1D4FCB 0%, #2563EB 50%, #1E3A8A 100%)", borderRadius: 20, padding: isMobile ? "20px" : "24px 28px", color: "#fff", marginBottom: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden", boxShadow: `0 12px 32px -10px ${t.blue}77` }}>
      <div style={{ ...glowDot("#60A5FA", 280, 0.45), top: "-50%", right: "16%" }} />
      <div style={{ ...glowDot("#A78BFA", 200, 0.3), bottom: "-60%", left: "8%" }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 12.5, opacity: 0.82, fontWeight: 600, marginBottom: 6 }}>Pouvoir d'achat total configuré</div>
        <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: -1.4, lineHeight: 1 }}>{fmt(grandTotal)} €</div>
        <div style={{ fontSize: 12.5, opacity: 0.72, marginTop: 7 }}>pour {n} salarié{n > 1 ? "s" : ""} — ~{fmt(Math.round(grandTotal / Math.max(n, 1)))} €/pers.</div>
      </div>
      <div style={{ position: "relative", width: 120, height: 120 }}>
        <svg width={120} height={120} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={60} cy={60} r={52} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={9} />
          <circle cx={60} cy={60} r={52} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - globalPct / 100)}
            style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.34,1.2,0.64,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{globalPct}%</div>
          <div style={{ fontSize: 10.5, opacity: 0.75, marginTop: 3, fontWeight: 600 }}>optimisé</div>
        </div>
      </div>
    </div>

    {items.map(item => {
      const colorMap = { blue: t.blue, green: t.green, amber: t.amber };
      const lightMap = { blue: t.blueLighter, green: t.greenLight, amber: t.amberLight };
      const c = colorMap[item.color]; const cl = lightMap[item.color];
      const isOpen = openItem === item.id;
      const sv = s[item.id];

      return <div key={item.id} {...lift(t)} style={{ background: t.card, borderRadius: 16, boxShadow: isOpen ? t.cardShadowHover : t.cardShadow, marginBottom: 12, overflow: "hidden", transition: "box-shadow 0.18s, transform 0.18s" }}>
        <div onClick={() => setOpenItem(isOpen ? null : item.id)} style={{ padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 13, borderLeft: `3px solid ${c}` }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `linear-gradient(135deg, ${c}26, ${c}12)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${c}26` }}><Icon name={item.icon} size={18} color={c} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14.5, fontWeight: 700, color: t.text }}>{item.title}</span>
                <Tooltip text={INFO_TEXTS[item.id]} t={t} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                {item.total > 0 && <span style={{ fontSize: 13, fontWeight: 800, color: c }}>{fmt(item.total)} € équipe</span>}
                <Badge text={item.done ? "Activé" : item.total > 0 ? "Configuré" : "À activer"} variant={item.done ? "green" : item.total > 0 ? "blue" : "amber"} t={t} dot />
                <div style={{ width: 26, height: 26, borderRadius: 8, background: t.bgSecondary, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>
                  <Icon name="chevron-down" size={15} color={t.textSec} />
                </div>
              </div>
            </div>
            <Bar pct={item.pct} color={c} h={5} />
          </div>
        </div>
        {isOpen && <div style={{ borderTop: `1px solid ${t.borderSoft}`, padding: "18px 18px" }}>
          <span style={{ fontSize: 11, color: t.textSec, fontFamily: "monospace", background: t.bgSecondary, padding: "4px 11px", borderRadius: 7, display: "inline-block", marginBottom: 14, border: `1px solid ${t.borderSoft}` }}>{item.loi}</span>

          {item.perEmployee ? (
            <div>
              {/* PPV — type versement */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {["Premier versement", "Versement complémentaire"].map(type => {
                  const sel = (s.ppv_type?.value || "Premier versement") === type;
                  return <button key={type} onClick={() => update("ppv_type", "value", type)}
                    style={{ padding: "6px 14px", borderRadius: 8, border: `1px solid ${sel ? c : t.border}`, background: sel ? cl : "transparent", color: sel ? c : t.textSec, fontSize: 12, fontWeight: sel ? 500 : 400, cursor: "pointer", fontFamily: font }}>
                    {type}
                  </button>;
                })}
              </div>

              {(s.ppv_type?.value || "Premier versement") === "Versement complémentaire" && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ background: t.amberLight, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: t.amber, marginBottom: 14, lineHeight: 1.5 }}>
                    ⚠️ Un versement complémentaire nécessite une <strong>DUE modificative</strong> faisant référence à la DUE initiale. Renseignez les montants déjà versés pour calculer le reliquat disponible.
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>Montants déjà versés cette année par salarié</div>
                  {activeEmp.map(emp => {
                    const already = s.ppv_already?.[emp.id] || 0;
                    const reliquat = Math.max(0, 3000 - already);
                    return (
                      <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 12, background: t.bgSecondary, borderRadius: 10, padding: "10px 14px", marginBottom: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.amberLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: t.amber, flexShrink: 0 }}>{emp.initials}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{emp.firstName} {emp.lastName}</div>
                          <div style={{ fontSize: 11, color: t.textSec }}>Reliquat : <strong style={{ color: reliquat > 0 ? t.green : t.red }}>{fmt(reliquat)}€</strong> disponibles</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <input type="range" min={0} max={3000} step={100} value={already}
                            onChange={e => setScannerState(p => ({ ...p, ppv_already: { ...p.ppv_already, [emp.id]: parseInt(e.target.value) } }))}
                            style={{ width: 100, accentColor: t.amber }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: t.amber, minWidth: 52, textAlign: "right" }}>{fmt(already)}€</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 10 }}>
                {(s.ppv_type?.value || "Premier versement") === "Versement complémentaire" ? "Nouveau versement à configurer" : "Montant par salarié"}
                <span style={{ fontSize: 12, color: t.textSec, fontWeight: 400, marginLeft: 6 }}>(modulable par ancienneté ou classification)</span>
              </div>

              {activeEmp.map(emp => {
                const already = (s.ppv_type?.value === "Versement complémentaire") ? (s.ppv_already?.[emp.id] || 0) : 0;
                const maxAllowed = Math.max(0, 3000 - already);
                const currentPPV = Math.min(emp.ppv || 0, maxAllowed);
                const totalAnnual = already + currentPPV;
                return (
                  <div key={emp.id} style={{ background: t.bgSecondary, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: t.blue, flexShrink: 0 }}>{emp.initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{emp.firstName} {emp.lastName}</div>
                        <div style={{ fontSize: 11, color: t.textSec }}>{emp.seniority} mois d'ancienneté</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <input type="range" min={0} max={maxAllowed} step={100} value={currentPPV}
                          onChange={e => onUpdateEmployeePPV(emp.id, parseInt(e.target.value))}
                          style={{ width: 110, accentColor: c }} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: c, minWidth: 56, textAlign: "right" }}>{fmt(currentPPV)}€</span>
                      </div>
                    </div>
                    {already > 0 && (
                      <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
                        <div style={{ flex: 1, background: t.amberLight, borderRadius: 6, padding: "5px 8px", fontSize: 11, color: t.amber, textAlign: "center" }}>Déjà versé : {fmt(already)}€</div>
                        <div style={{ flex: 1, background: cl, borderRadius: 6, padding: "5px 8px", fontSize: 11, color: c, textAlign: "center" }}>Ce versement : {fmt(currentPPV)}€</div>
                        <div style={{ flex: 1, background: t.card, borderRadius: 6, padding: "5px 8px", fontSize: 11, color: t.text, textAlign: "center", fontWeight: 600, border: `1px solid ${t.border}` }}>Total annuel : {fmt(totalAnnual)}€</div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Récap global */}
              {(() => {
                const isComplement = s.ppv_type?.value === "Versement complémentaire";
                const totalAlready = activeEmp.reduce((sum, e) => sum + (s.ppv_already?.[e.id] || 0), 0);
                const totalNew = activeEmp.reduce((sum, e) => {
                  const already = isComplement ? (s.ppv_already?.[e.id] || 0) : 0;
                  return sum + Math.min(e.ppv || 0, Math.max(0, 3000 - already));
                }, 0);
                const totalAnnual = totalAlready + totalNew;
                return (
                  <div style={{ background: cl, borderRadius: 10, padding: "12px 16px", marginTop: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : (isComplement ? "1fr 1fr 1fr" : "1fr 1fr"), gap: 12 }}>
                      {isComplement && (
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 11, color: c, marginBottom: 2 }}>Déjà versé (année)</div>
                          <div style={{ fontSize: 18, fontWeight: 600, color: t.amber }}>{fmt(totalAlready)} €</div>
                        </div>
                      )}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: c, marginBottom: 2 }}>{isComplement ? "Ce versement" : "Total équipe"}</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: c }}>{fmt(totalNew)} €</div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: c, marginBottom: 2 }}>{isComplement ? "Total annuel équipe" : "Plafond restant"}</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: c }}>{isComplement ? fmt(totalAnnual) : fmt(3000 * n - totalNew)} €</div>
                      </div>
                    </div>
                    {isComplement && totalAnnual > 0 && (
                      <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${c}22`, fontSize: 12, color: c, textAlign: "center" }}>
                        Économie totale vs primes classiques : <strong>~{fmt(Math.round(totalAnnual * 0.45))} €</strong> de charges
                      </div>
                    )}
                  </div>
                );
              })()}

              <div style={{ marginTop: 12, background: t.bgSecondary, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 12, color: t.textSec }}>📄 {(s.ppv_type?.value || "Premier versement") === "Versement complémentaire" ? "DUE modificative" : "DUE initiale"} pré-remplie + mémo comptable</div>
                <button onClick={() => downloadKit("ppv", { company, employees, scannerState, ppvType: s.ppv_type?.value || "Premier versement" })}
                  style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${t.blue}`, background: t.blueLighter, color: t.blue, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="download" size={14} color={t.blue} /> Télécharger le kit Perky
                </button>
              </div>
            </div>

          ) : item.isResto ? (
            <div>
              {/* RESTO — double slider */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Montant facial du billet</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{sv.amount}€</span>
                </div>
                <input type="range" min={8} max={15} step={0.5} value={sv.amount}
                  onChange={e => update("resto", "amount", parseFloat(e.target.value))}
                  style={{ width: "100%", accentColor: c, cursor: "pointer", marginBottom: 4 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.textTert }}>
                  <span>8€ (min recommandé)</span><span>15€</span>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Part prise en charge par l'entreprise</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c }}>{sv.pct}%</span>
                    <span style={{ fontSize: 12, color: t.textSec }}>({(sv.amount * sv.pct / 100).toFixed(2)}€/billet)</span>
                    {(sv.pct < 50 || sv.pct > 60) && <span style={{ fontSize: 11, color: t.red, background: t.redLight, padding: "2px 8px", borderRadius: 6 }}>⚠️ Hors zone exo</span>}
                    {sv.pct >= 50 && sv.pct <= 60 && <span style={{ fontSize: 11, color: t.green, background: t.greenLight, padding: "2px 8px", borderRadius: 6 }}>✓ Exonéré</span>}
                  </div>
                </div>
                <input type="range" min={40} max={70} step={1} value={sv.pct}
                  onChange={e => update("resto", "pct", parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: sv.pct >= 50 && sv.pct <= 60 ? c : t.red, cursor: "pointer", marginBottom: 4 }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: t.textTert }}>
                  <span>40%</span>
                  <span style={{ color: t.green, fontWeight: 500 }}>Zone exonérée : 50% → 60%</span>
                  <span>70%</span>
                </div>
              </div>
              {sv.amount > 0 && (
                <div style={{ background: cl, borderRadius: 10, padding: "12px 16px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12 }}>
                    <div><div style={{ fontSize: 11, color: c }}>Part patronale/billet</div><div style={{ fontSize: 16, fontWeight: 600, color: c }}>{(sv.amount * sv.pct / 100).toFixed(2)}€</div></div>
                    <div><div style={{ fontSize: 11, color: c }}>Part salarié/billet</div><div style={{ fontSize: 16, fontWeight: 600, color: c }}>{(sv.amount * (1 - sv.pct / 100)).toFixed(2)}€</div></div>
                    <div><div style={{ fontSize: 11, color: c }}>Pouvoir d'achat équipe/an</div><div style={{ fontSize: 16, fontWeight: 600, color: c }}>{fmt(restoTotal)}€</div></div>
                  </div>
                </div>
              )}
            </div>

          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{item.id === "navigo" ? `${sv.pct}% remboursés` : `${fmt(sv.amount || 0)}€/salarié`}</span>
                <span style={{ fontSize: 12, color: t.textSec }}>Plafond : {item.id === "navigo" ? "75%" : `${fmt(s[item.id]?.max || 0)}€`}</span>
              </div>
              <input type="range" min={item.id === "navigo" ? 50 : 0} max={item.id === "navigo" ? 75 : (s[item.id]?.max || 500)} step={item.id === "navigo" ? 5 : item.id === "vacances" ? 50 : 10}
                value={item.id === "navigo" ? sv.pct : (sv.amount || 0)}
                onChange={e => update(item.id, item.id === "navigo" ? "pct" : "amount", parseInt(e.target.value))}
                style={{ width: "100%", accentColor: c, cursor: "pointer", marginBottom: 8 }} />
              {item.total > 0 && <div style={{ background: cl, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, color: c, flex: 1 }}>{item.savingsLabel || `Total équipe`}</div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: c }}>Total</div><div style={{ fontSize: 20, fontWeight: 600, color: c }}>{fmt(item.total)}€</div></div>
              </div>}
              {!item.done && item.total > 0 && (
                <button onClick={() => downloadKit(item.id, { company, employees, scannerState })}
                  style={{ marginTop: 10, padding: "7px 16px", borderRadius: 8, border: `1px solid ${t.blue}`, background: t.blueLighter, color: t.blue, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="download" size={14} color={t.blue} /> Télécharger le kit Perky
                </button>
              )}
            </div>
          )}
        </div>}
      </div>;
    })}
    <div style={{ background: t.amberLight, borderRadius: 14, padding: "14px 16px", fontSize: 12.5, color: t.amberDeep, lineHeight: 1.6, display: "flex", gap: 9, alignItems: "flex-start", border: `1px solid ${t.amber}26`, marginTop: 4 }}>
      <Icon name="alert-triangle" size={16} color={t.amber} />
      <span>Estimations indicatives basées sur les plafonds légaux 2026. À valider avec votre expert-comptable.</span>
    </div>
  </div>;
}

// ─── BOSS HOME ────────────────────────────────────────────────────────
// ─── TEAM CALENDAR ────────────────────────────────────────────────────
function TeamCalendar({ employees, t }) {
  const today = new Date(2026, 4, 17); // 17 mai 2026
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState({
    "2026-05-20": [{ empId: 2, type: "absent" }],
    "2026-05-21": [{ empId: 2, type: "absent" }],
    "2026-05-22": [{ empId: 3, type: "ecole" }],
    "2026-05-26": [{ empId: 1, type: "absent" }],
    "2026-06-02": [{ empId: 3, type: "ecole" }],
    "2026-06-09": [{ empId: 3, type: "ecole" }],
    "2026-06-15": [{ empId: 1, type: "absent" }, { empId: 2, type: "absent" }],
  });
  const [popover, setPopover] = useState(null); // { dateKey, x, y }

  const active = employees.filter(e => e.active);

  const PERKY_EVENTS = [
    { dateKey: "2026-06-15", label: "Fête des pères — chèques cadeaux", color: "#185FA5" },
    { dateKey: "2026-09-01", label: "Rentrée scolaire — chèques cadeaux", color: "#185FA5" },
    { dateKey: "2026-11-30", label: "PPV 2026 — deadline versement", color: "#E24B4A" },
    { dateKey: "2026-12-10", label: "Chèques cadeaux Noël — commander avant", color: "#BA7517" },
    { dateKey: "2026-12-31", label: "Dernière exonération PPV max", color: "#E24B4A" },
  ];

  const TYPE_COLORS = { absent: "#E24B4A", ecole: "#8B5CF6" };
  const TYPE_LABELS = { absent: "Absent", ecole: "École" };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Lundi = 0
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const prevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); };
  const nextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); };

  const getDateKey = (day) => `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const toggleEvent = (dateKey, empId, type) => {
    setEvents(prev => {
      const current = prev[dateKey] || [];
      const exists = current.find(e => e.empId === empId && e.type === type);
      if (exists) return { ...prev, [dateKey]: current.filter(e => !(e.empId === empId && e.type === type)) };
      return { ...prev, [dateKey]: [...current, { empId, type }] };
    });
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* Header nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.text }}>{monthNames[currentMonth]} {currentYear}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={prevMonth} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${t.border}`, background: "none", cursor: "pointer", color: t.textSec, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={nextMonth} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${t.border}`, background: "none", cursor: "pointer", color: t.textSec, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>
      </div>

      {/* Légende */}
      <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#E24B4A" }} /><span style={{ fontSize: 11, color: t.textSec }}>Absent</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#8B5CF6" }} /><span style={{ fontSize: 11, color: t.textSec }}>École</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 3, background: "#185FA5" }} /><span style={{ fontSize: 11, color: t.textSec }}>Échéance Perky</span></div>
      </div>

      {/* Jours semaine */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 500, color: t.textSec, padding: "4px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grille jours */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateKey = getDateKey(day);
          const dayEvents = events[dateKey] || [];
          const perkyEvent = PERKY_EVENTS.find(e => e.dateKey === dateKey);
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const isWeekend = (i % 7) >= 5;

          return (
            <div key={i} onClick={(e) => { if (isWeekend) return; setPopover(popover?.dateKey === dateKey ? null : { dateKey, day }); e.stopPropagation(); }}
              style={{ position: "relative", minHeight: 52, borderRadius: 6, padding: "4px 5px", background: isToday ? t.blueLighter : isWeekend ? t.bgSecondary : t.card, border: `1px solid ${isToday ? t.blue : t.border}`, cursor: isWeekend ? "default" : "pointer", transition: "background 0.1s" }}
              onMouseEnter={e => { if (!isWeekend) e.currentTarget.style.background = t.bgSecondary; }}
              onMouseLeave={e => { if (!isWeekend) e.currentTarget.style.background = isToday ? t.blueLighter : t.card; }}>
              <div style={{ fontSize: 11, fontWeight: isToday ? 600 : 400, color: isToday ? t.blue : isWeekend ? t.textTert : t.text, marginBottom: 3 }}>{day}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {dayEvents.map((ev, j) => {
                  const emp = active.find(e => e.id === ev.empId);
                  return emp ? (
                    <div key={j} title={`${emp.initials} — ${TYPE_LABELS[ev.type]}`} style={{ width: 14, height: 14, borderRadius: "50%", background: TYPE_COLORS[ev.type], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 600 }}>
                      {emp.initials[0]}
                    </div>
                  ) : null;
                })}
                {perkyEvent && <div style={{ width: "100%", height: 3, borderRadius: 2, background: perkyEvent.color, marginTop: 1 }} title={perkyEvent.label} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popover saisie */}
      {popover && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400 }} onClick={() => setPopover(null)}>
          <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: t.card, borderRadius: 14, boxShadow: t.cardShadow, padding: "16px 18px", width: 240, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 401 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>
              {monthNames[currentMonth].slice(0, 3)} {popover.day}
            </div>
            {(() => {
              const pk = PERKY_EVENTS.find(e => e.dateKey === popover.dateKey);
              return pk ? <div style={{ background: t.blueLighter, borderRadius: 8, padding: "8px 10px", fontSize: 12, color: t.blue, marginBottom: 10 }}>📅 {pk.label}</div> : null;
            })()}
            {active.map(emp => {
              const dayEvents = events[popover.dateKey] || [];
              const absent = dayEvents.find(e => e.empId === emp.id && e.type === "absent");
              const ecole = dayEvents.find(e => e.empId === emp.id && e.type === "ecole");
              return (
                <div key={emp.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 500, color: t.blue }}>{emp.initials}</div>
                    <span style={{ fontSize: 12, color: t.text }}>{emp.firstName}</span>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => toggleEvent(popover.dateKey, emp.id, "absent")} style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${absent ? "#E24B4A" : t.border}`, background: absent ? "#FCEBEB" : "none", color: absent ? "#E24B4A" : t.textSec, fontSize: 11, cursor: "pointer", fontFamily: font }}>Abs.</button>
                    {emp.role?.includes("lternan") && (
                      <button onClick={() => toggleEvent(popover.dateKey, emp.id, "ecole")} style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${ecole ? "#8B5CF6" : t.border}`, background: ecole ? "#EDE9FE" : "none", color: ecole ? "#8B5CF6" : t.textSec, fontSize: 11, cursor: "pointer", fontFamily: font }}>École</button>
                    )}
                  </div>
                </div>
              );
            })}
            <button onClick={() => setPopover(null)} style={{ width: "100%", marginTop: 6, padding: "7px", borderRadius: 8, border: "none", background: t.bgSecondary, color: t.textSec, fontSize: 12, cursor: "pointer", fontFamily: font }}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PERKY DEADLINES ──────────────────────────────────────────────────
function PerkyDeadlines({ t, onNav }) {
  const today = new Date(2026, 4, 17);
  const deadlines = [
    { date: new Date(2026, 5, 15), label: "Fête des pères", desc: "Commandez vos chèques cadeaux avant le 15 juin", action: "cadeaux", icon: "gift" },
    { date: new Date(2026, 8, 1), label: "Rentrée scolaire", desc: "Chèques cadeaux rentrée — pensez aux enfants de l'équipe", action: "cadeaux", icon: "school" },
    { date: new Date(2026, 10, 30), label: "PPV 2026 — deadline", desc: "Dernier versement de l'année avant le 30 novembre conseillé", action: "ppv", icon: "coin" },
    { date: new Date(2026, 11, 10), label: "Chèques cadeaux Noël", desc: "Commander avant le 10 décembre pour livraison garantie", action: "cadeaux", icon: "christmas-tree" },
    { date: new Date(2026, 11, 31), label: "Exonération PPV max", desc: "Dernière année à 3 000€/salarié exonérés — ne pas passer à côté", action: "ppv", icon: "alert-triangle" },
  ].filter(d => d.date >= today).slice(0, 4);

  const daysUntil = (date) => Math.ceil((date - today) / (1000 * 60 * 60 * 24));

  const urgencyColor = (days) => {
    if (days <= 30) return { bg: "#FCEBEB", color: "#E24B4A", label: `${days}j` };
    if (days <= 60) return { bg: "#FAEEDA", color: "#BA7517", label: `${days}j` };
    return { bg: "#E6F1FB", color: "#185FA5", label: `${days}j` };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {deadlines.map((d, i) => {
        const days = daysUntil(d.date);
        const u = urgencyColor(days);
        return (
          <div key={i} onClick={() => onNav("scanner")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 13px", background: t.bgTint, borderRadius: 13, border: `1px solid ${t.borderSoft}`, cursor: "pointer", transition: "background 0.14s, transform 0.14s" }}
            onMouseEnter={e => { e.currentTarget.style.background = t.bgSecondary; e.currentTarget.style.transform = "translateX(2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = t.bgTint; e.currentTarget.style.transform = "translateX(0)"; }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: u.color + "1A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={d.icon} size={17} color={u.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: t.text }}>{d.label}</div>
              <div style={{ fontSize: 11.5, color: t.textSec, lineHeight: 1.4, marginTop: 1 }}>{d.desc}</div>
            </div>
            <div style={{ background: u.color, color: "#fff", fontSize: 11.5, fontWeight: 800, padding: "5px 10px", borderRadius: 9, flexShrink: 0, boxShadow: `0 3px 8px -3px ${u.color}` }}>
              {u.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BossHome({ employees, scannerState, t, onNav }) {
  const isMobile = useIsMobile();
  const active = employees.filter(e => e.active);
  const n = active.length;
  const s = scannerState;
  const totalPPV = active.reduce((sum, e) => sum + (e.ppv || 0), 0);
  const totalNavigo = Math.round(((s.navigo.pct - 50) / 100) * 86.40 * 12 * n);
  const totalCadeaux = s.cadeaux.amount * n;
  const totalVacances = s.vacances.amount * n;
  const grandTotal = totalPPV + totalNavigo + totalCadeaux + totalVacances;
  const globalPct = Math.round([totalPPV > 0, totalNavigo > 0, totalCadeaux > 0, totalVacances > 0].filter(Boolean).length / 4 * 100);

  return <div style={{ maxWidth: 1180, animation: "pkRise 0.4s ease both" }}>
    {/* En-tête de page */}
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
        <Badge text="Espace dirigeant" variant="blue" t={t} dot />
        <span style={{ fontSize: 12.5, color: t.textTert }}>17 mai 2026</span>
      </div>
      <h1 style={{ fontSize: 27, fontWeight: 800, color: t.text, margin: "0 0 4px", letterSpacing: -0.8 }}>Tableau de bord</h1>
      <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Alpha Optique — {n} bénéficiaire{n > 1 ? "s" : ""} actif{n > 1 ? "s" : ""}</p>
    </div>

    {/* HERO — pouvoir d'achat */}
    <div style={{ borderRadius: 22, overflow: "hidden", marginBottom: 16, position: "relative", background: "linear-gradient(135deg, #1D4FCB 0%, #2563EB 48%, #1E3A8A 100%)", boxShadow: `0 12px 36px -10px ${t.blue}77` }}>
      <div style={{ ...glowDot("#60A5FA", 320, 0.5), top: "-40%", right: "8%" }} />
      <div style={{ ...glowDot("#A78BFA", 240, 0.35), bottom: "-50%", left: "12%" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.6 }} />
      <div style={{ position: "relative", padding: isMobile ? "20px" : "26px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ color: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, opacity: 0.85, marginBottom: 8, fontWeight: 600 }}>
            <Icon name="trending-up" size={15} color="#fff" /> Pouvoir d'achat récupérable
          </div>
          <div style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1.5, lineHeight: 1, marginBottom: 8 }}>{fmt(grandTotal)} €</div>
          <div style={{ fontSize: 13, opacity: 0.78 }}>~{fmt(Math.round(grandTotal / Math.max(n, 1)))} € par salarié et par an</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* anneau de progression */}
          <div style={{ position: "relative", width: 116, height: 116 }}>
            <svg width={116} height={116} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={58} cy={58} r={50} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={9} />
              <circle cx={58} cy={58} r={50} fill="none" stroke="#fff" strokeWidth={9} strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 50} strokeDashoffset={2 * Math.PI * 50 * (1 - globalPct / 100)}
                style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.34,1.2,0.64,1)" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{globalPct}%</div>
              <div style={{ fontSize: 10, opacity: 0.75, marginTop: 3, fontWeight: 600 }}>optimisé</div>
            </div>
          </div>
          <button onClick={() => onNav("scanner")} style={{ padding: "11px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.14)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font, backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 7, transition: "background 0.14s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.24)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}>
            Configurer <Icon name="arrow-right" size={14} color="#fff" />
          </button>
        </div>
      </div>
    </div>

    {/* Stats — cartes en relief */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
      {[
        { icon: "users", v: `${n}`, l: "Salariés actifs", c: t.blue, sub: "bénéficiaires Perky" },
        { icon: "chart-bar", v: "67%", l: "Taux d'usage", c: t.green, sub: "utilisent la plateforme" },
        { icon: "coin", v: `${fmt(grandTotal)} €`, l: "Avantages activés", c: t.amber, sub: "valeur annuelle totale" },
      ].map((s2, i) => (
        <div key={i} {...lift(t)} style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, padding: "18px 20px", transition: "transform 0.18s, box-shadow 0.18s", cursor: "default", position: "relative", overflow: "hidden" }}>
          <div style={{ ...glowDot(s2.c, 70, 0.16), top: -28, right: -16 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12, position: "relative" }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: s2.c + "1A", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={s2.icon} size={17} color={s2.c} />
            </div>
            <span style={{ fontSize: 12.5, color: t.textSec, fontWeight: 600 }}>{s2.l}</span>
          </div>
          <div style={{ fontSize: 27, fontWeight: 800, color: t.text, letterSpacing: -0.7, position: "relative" }}>{s2.v}</div>
          <div style={{ fontSize: 11.5, color: t.textTert, marginTop: 3, position: "relative" }}>{s2.sub}</div>
        </div>
      ))}
    </div>

    {/* SECTION — Ce que vous offrez */}
    {grandTotal > 0 && <div style={{ marginBottom: 28 }}>
      <SectionTitle icon="gift" iconColor={t.green} title="Ce que vous offrez à votre équipe" sub="Décomposition des avantages activés cette année" t={t} />
      <div style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, padding: "22px 24px" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, marginBottom: 16, alignItems: isMobile ? "stretch" : "stretch" }}>
          <div style={{ flex: 1, background: t.greenLight, borderRadius: 14, padding: "16px 18px", textAlign: "center", border: `1px solid ${t.green}26` }}>
            <div style={{ fontSize: 11.5, color: t.green, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>En espèces</div>
            <div style={{ fontSize: 25, fontWeight: 800, color: t.green, letterSpacing: -0.6 }}>{fmt(totalPPV + totalCadeaux)} €</div>
            <div style={{ fontSize: 11.5, color: t.green, opacity: 0.78, marginTop: 5 }}>PPV + chèques cadeaux</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: t.textTert, fontWeight: 300 }}>+</div>
          <div style={{ flex: 1, background: t.blueLighter, borderRadius: 14, padding: "16px 18px", textAlign: "center", border: `1px solid ${t.blue}26` }}>
            <div style={{ fontSize: 11.5, color: t.blue, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>En nature</div>
            <div style={{ fontSize: 25, fontWeight: 800, color: t.blue, letterSpacing: -0.6 }}>{fmt(totalNavigo + totalVacances + Math.round(s.resto.amount * (s.resto.pct / 100) * 220 * n))} €</div>
            <div style={{ fontSize: 11.5, color: t.blue, opacity: 0.78, marginTop: 5 }}>Transport + resto + vacances</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: t.textTert, fontWeight: 300 }}>=</div>
          <div style={{ flex: 1.25, background: t.blueGrad, borderRadius: 14, padding: "16px 18px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: `0 8px 20px -8px ${t.blue}88` }}>
            <div style={{ ...glowDot("#fff", 80, 0.2), top: -30, right: -10 }} />
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.85)", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, position: "relative" }}>Total équipe / an</div>
            <div style={{ fontSize: 25, fontWeight: 800, color: "#fff", letterSpacing: -0.6, position: "relative" }}>{fmt(grandTotal)} €</div>
            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.78)", marginTop: 5, position: "relative" }}>soit {fmt(Math.round(grandTotal / Math.max(n, 1)))} € / pers.</div>
          </div>
        </div>
        <div style={{ background: t.amberLight, borderRadius: 12, padding: "13px 16px", fontSize: 12.5, color: t.amberDeep, lineHeight: 1.6, display: "flex", gap: 9, alignItems: "flex-start", border: `1px solid ${t.amber}22` }}>
          <Icon name="bulb" size={16} color={t.amber} />
          <span>Ces avantages représentent <strong style={{ color: t.text }}>{fmt(Math.round(grandTotal * 0.45))} €</strong> d'économies vs primes classiques chargées — pour un coût net Perky de <strong style={{ color: t.text }}>{n * 5 * 12 + 150} €/an</strong>.</span>
        </div>
      </div>
    </div>}

    {/* SECTION — Agenda + Scanner + Échéances */}
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.45fr 1fr", gap: 16, alignItems: "start" }}>

      <div>
        <SectionTitle icon="calendar" iconColor={t.blue} title="Agenda de l'équipe" sub="Absences et événements à venir" t={t} />
        <div style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, padding: "20px 22px" }}>
          <TeamCalendar employees={active.length > 0 ? active : employees} t={t} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

        <div>
          <SectionTitle icon="chart-bar" iconColor={t.blue} title="Scanner" t={t}
            action={<button onClick={() => onNav("scanner")} style={{ fontSize: 12.5, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>Configurer →</button>} />
          <div style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, padding: "18px 18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { title: "PPV 2026", val: totalPPV > 0 ? `${fmt(totalPPV)} €` : "—", pct: Math.round((totalPPV / Math.max(3000 * n, 1)) * 100), c: t.blue },
                { title: "Navigo", val: `${s.navigo.pct}%`, pct: Math.round(((s.navigo.pct - 50) / 25) * 100), c: t.amber },
                { title: "Chèques cadeaux", val: totalCadeaux > 0 ? `${fmt(totalCadeaux)} €` : "—", pct: Math.round((s.cadeaux.amount / 193) * 100), c: t.amber },
                { title: "Titres-restaurant", val: `${s.resto.amount} €/billet`, pct: Math.round((s.resto.amount / s.resto.max) * 100), c: t.green },
              ].map((it, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: t.text, fontWeight: 600 }}>{it.title}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: it.c }}>{it.val}</span>
                  </div>
                  <Bar pct={it.pct} color={it.c} h={6} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionTitle icon="bell" iconColor={t.amber} title="Échéances Perky" t={t} />
          <div style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, padding: "16px 16px" }}>
            <PerkyDeadlines t={t} onNav={onNav} />
          </div>
        </div>

      </div>
    </div>
  </div>;
}

// ─── BOSS TEAM ────────────────────────────────────────────────────────
function BossTeam({ employees, setEmployees, t }) {
  const isMobile = useIsMobile();
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(null); // slide-over
  const [showEdit, setShowEdit] = useState(null);     // modal édition
  const [showConfirm, setShowConfirm] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "", seniority: 0 });
  const active = employees.filter(e => e.active);
  const empDetail = showDetail ? employees.find(e => e.id === showDetail) : null;
  const empEdit = showEdit ? employees.find(e => e.id === showEdit) : null;

  const addEmp = () => {
    if (!form.firstName || !form.email) return;
    const initials = (form.firstName[0] + (form.lastName?.[0] || "")).toUpperCase();
    setEmployees(p => [...p, { ...form, id: Date.now(), initials, seniority: parseInt(form.seniority) || 0, ppv: 0, active: true }]);
    setForm({ firstName: "", lastName: "", email: "", phone: "", role: "", seniority: 0 });
    setShowAdd(false);
  };
  const updateEmp = (id, field, val) => setEmployees(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));
  const removeEmp = (id) => { setEmployees(p => p.map(e => e.id === id ? { ...e, active: false } : e)); setShowConfirm(null); setShowDetail(null); setShowEdit(null); };

  return <div style={{ maxWidth: 900, animation: "pkRise 0.4s ease both" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
      <div>
        <Badge text="Gestion" variant="blue" t={t} dot />
        <h1 style={{ fontSize: 27, fontWeight: 800, color: t.text, margin: "8px 0 4px", letterSpacing: -0.8 }}>Équipe</h1>
        <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>{active.length} salarié{active.length > 1 ? "s" : ""} bénéficiaire{active.length > 1 ? "s" : ""}</p>
      </div>
      <button onClick={() => setShowAdd(true)} style={{ padding: "11px 18px", borderRadius: 12, border: "none", background: t.blueGrad, color: "#fff", fontSize: 13.5, cursor: "pointer", fontFamily: font, fontWeight: 700, display: "flex", alignItems: "center", gap: 7, boxShadow: `0 4px 12px -3px ${t.blue}88` }}>
        <Icon name="plus" size={16} color="#fff" /> Ajouter un salarié
      </button>
    </div>

    {/* Desktop: table — Mobile: cards */}
    {isMobile ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
        {active.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: t.textSec, background: t.card, borderRadius: 16, boxShadow: t.cardShadow }}>Aucun salarié actif.</div>}
        {active.map((emp) => (
          <div key={emp.id} style={{ background: t.card, borderRadius: 16, boxShadow: t.cardShadow, padding: "16px 18px", border: `1px solid ${t.borderSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", boxShadow: `0 3px 8px -3px ${t.blue}88`, flexShrink: 0 }}>{emp.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{emp.firstName} {emp.lastName}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{emp.role || "—"} · {emp.seniority} mois</div>
              </div>
              <Badge text="Actif" variant="green" t={t} dot />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setShowDetail(emp.id); setShowEdit(null); }}
                style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1px solid ${t.blue}33`, background: t.blueLighter, fontSize: 13, cursor: "pointer", fontFamily: font, color: t.blue, fontWeight: 700 }}>
                Avantages
              </button>
              <button onClick={() => { setShowEdit(emp.id); setShowDetail(null); }}
                style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.card, fontSize: 13, cursor: "pointer", fontFamily: font, color: t.textSec, fontWeight: 600 }}>
                Gérer
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 90px 90px 150px", padding: "12px 20px", background: t.bgSecondary, fontSize: 11, color: t.textSec, fontWeight: 700, borderBottom: `1px solid ${t.borderSoft}`, textTransform: "uppercase", letterSpacing: 0.4 }}>
          <span>Salarié</span><span>Ancienneté</span><span style={{ textAlign: "center" }}>Statut</span><span style={{ textAlign: "right" }}>Actions</span>
        </div>
        {active.length === 0 && <div style={{ padding: "40px", textAlign: "center", color: t.textSec }}>Aucun salarié actif.</div>}
        {active.map((emp, i) => (
          <div key={emp.id} style={{ display: "grid", gridTemplateColumns: "2fr 90px 90px 150px", padding: "15px 20px", alignItems: "center", borderBottom: i < active.length - 1 ? `1px solid ${t.borderSoft}` : "none", transition: "background 0.12s" }}
            onMouseEnter={e => e.currentTarget.style.background = t.bgTint}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 800, color: "#fff", boxShadow: `0 3px 8px -3px ${t.blue}88` }}>{emp.initials}</div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: t.text }}>{emp.firstName} {emp.lastName}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{emp.role || "—"}</div>
              </div>
            </div>
            <span style={{ fontSize: 13, color: t.textSec }}>{emp.seniority} mois</span>
            <span style={{ display: "flex", justifyContent: "center" }}><Badge text="Actif" variant="green" t={t} dot /></span>
            <div style={{ display: "flex", gap: 7, justifyContent: "flex-end" }}>
              <button onClick={() => { setShowDetail(emp.id); setShowEdit(null); }}
                style={{ padding: "6px 12px", borderRadius: 9, border: `1px solid ${t.blue}33`, background: t.blueLighter, fontSize: 12, cursor: "pointer", fontFamily: font, color: t.blue, fontWeight: 600 }}>
                Avantages
              </button>
              <button onClick={() => { setShowEdit(emp.id); setShowDetail(null); }}
                style={{ padding: "6px 12px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.card, fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec, fontWeight: 600 }}>
                Gérer
              </button>
            </div>
          </div>
        ))}
      </div>
    )}

    <div style={{ marginTop: 12, padding: "14px 18px", background: t.card, borderRadius: 14, boxShadow: t.cardShadowSoft, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", gap: 8, fontSize: 13, color: t.textSec, border: `1px solid ${t.borderSoft}` }}>
      <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="receipt" size={15} color={t.textSec} />{active.length} salarié{active.length > 1 ? "s" : ""} × 5 € = <span style={{ color: t.text, fontWeight: 700 }}>{active.length * 5} €/mois</span></span>
      <span style={{ display: "flex", alignItems: "center", gap: 7 }}><Icon name="calendar" size={15} color={t.textSec} />Prochaine facture : 01/06/2026</span>
    </div>

    {/* SLIDE-OVER — avantages uniquement */}
    {empDetail && (
      <div style={{ position: "fixed", inset: 0, zIndex: 500 }} onClick={() => setShowDetail(null)}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: isMobile ? "100%" : 400, background: t.card, boxShadow: "-8px 0 32px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
          <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 500, color: t.blue }}>{empDetail.initials}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 500, color: t.text }}>{empDetail.firstName} {empDetail.lastName}</div>
                <div style={{ fontSize: 13, color: t.textSec }}>{empDetail.role || "—"}</div>
              </div>
            </div>
            <button onClick={() => setShowDetail(null)} style={{ border: "none", background: "none", cursor: "pointer", fontSize: 22, color: t.textSec, lineHeight: 1 }}>×</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Informations</div>
            <div style={{ background: t.bgSecondary, borderRadius: 12, marginBottom: 24 }}>
              {[
                { label: "Email", value: empDetail.email, icon: "mail" },
                { label: "Téléphone", value: empDetail.phone || "—", icon: "phone" },
                { label: "Ancienneté", value: `${empDetail.seniority} mois`, icon: "calendar" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < 2 ? `1px solid ${t.border}` : "none" }}>
                  <Icon name={row.icon} size={15} color={t.textSec} />
                  <span style={{ fontSize: 12, color: t.textSec, minWidth: 74 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: t.text }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 500, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Avantages activés par vous</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                empDetail.ppv > 0 && { icon: "coin", label: "PPV 2026", value: `${empDetail.ppv.toLocaleString("fr-FR")} €`, color: t.blue, bg: t.blueLighter, desc: "Prime de partage de la valeur" },
                { icon: "bus", label: "Transport", value: "75% du Navigo", color: t.amber, bg: t.amberLight, desc: "Remboursement mensuel" },
                { icon: "tools-kitchen-2", label: "Titres-restaurant", value: "10€/jour", color: t.green, bg: t.greenLight, desc: "Pluxee — ~220 jours/an" },
              ].filter(Boolean).map((a, i) => (
                <div key={i} style={{ background: t.bgSecondary, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={a.icon} size={16} color={a.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{a.label}</div>
                    <div style={{ fontSize: 11, color: t.textSec }}>{a.desc}</div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px 24px", borderTop: `1px solid ${t.border}` }}>
            <button onClick={() => { setShowEdit(empDetail.id); setShowDetail(null); }}
              style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", cursor: "pointer", fontFamily: font, fontSize: 14, fontWeight: 500 }}>
              Gérer ce salarié →
            </button>
          </div>
        </div>
      </div>
    )}

    {/* MODAL ÉDITION — gérer */}
    {empEdit && <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title={`Gérer — ${empEdit.firstName} ${empEdit.lastName}`} t={t}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Inp label="Prénom" value={empEdit.firstName} onChange={v => updateEmp(empEdit.id, "firstName", v)} t={t} />
        <Inp label="Nom" value={empEdit.lastName} onChange={v => updateEmp(empEdit.id, "lastName", v)} t={t} />
      </div>
      <Inp label="Email" type="email" value={empEdit.email} onChange={v => updateEmp(empEdit.id, "email", v)} t={t} />
      <Inp label="Téléphone" value={empEdit.phone || ""} onChange={v => updateEmp(empEdit.id, "phone", v)} t={t} />
      <Inp label="Poste / Contrat" value={empEdit.role || ""} onChange={v => updateEmp(empEdit.id, "role", v)} t={t} />
      <Inp label="Ancienneté (mois)" type="number" value={empEdit.seniority || 0} onChange={v => updateEmp(empEdit.id, "seniority", parseInt(v))} t={t} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={() => setShowConfirm(empEdit.id)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${t.redLight}`, background: t.redLight, color: t.red, cursor: "pointer", fontFamily: font, fontSize: 13 }}>Retirer</button>
        <Btn onClick={() => setShowEdit(null)} t={t} full>Enregistrer</Btn>
      </div>
    </Modal>}

    {/* MODAL AJOUT */}
    <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Inviter un salarié" t={t}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Inp label="Prénom *" value={form.firstName} onChange={v => setForm(p => ({ ...p, firstName: v }))} placeholder="Marie" t={t} />
        <Inp label="Nom" value={form.lastName} onChange={v => setForm(p => ({ ...p, lastName: v }))} placeholder="Dupont" t={t} />
      </div>
      <Inp label="Email *" type="email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="marie@entreprise.fr" t={t} hint="Un email d'invitation sera envoyé à cette adresse." />
      <Inp label="Téléphone" value={form.phone} onChange={v => setForm(p => ({ ...p, phone: v }))} placeholder="06 12 34 56 78" t={t} />
      <Inp label="Poste / Contrat" value={form.role} onChange={v => setForm(p => ({ ...p, role: v }))} placeholder="Opticienne — CDI" t={t} />
      <Inp label="Ancienneté (mois)" type="number" value={form.seniority} onChange={v => setForm(p => ({ ...p, seniority: v }))} placeholder="12" t={t} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <Btn onClick={() => setShowAdd(false)} variant="ghost" t={t}>Annuler</Btn>
        <Btn onClick={addEmp} disabled={!form.firstName || !form.email} t={t} full>Envoyer l'invitation</Btn>
      </div>
    </Modal>

    <Modal open={!!showConfirm} onClose={() => setShowConfirm(null)} title="Confirmer le retrait" t={t}>
      <p style={{ fontSize: 14, color: t.textSec, lineHeight: 1.6, marginBottom: 20 }}>L'accès Perky de ce salarié sera désactivé immédiatement. L'abonnement sera ajusté dès le prochain cycle.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={() => setShowConfirm(null)} variant="ghost" t={t}>Annuler</Btn>
        <button onClick={() => removeEmp(showConfirm)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: t.red, color: "#fff", cursor: "pointer", fontFamily: font, fontWeight: 500 }}>Confirmer</button>
      </div>
    </Modal>
  </div>;
}

// ─── BOSS FACTURES ────────────────────────────────────────────────────
function BossFactures({ t }) {
  const isMobile = useIsMobile();
  const factures = [
    { p: "Mai 2026", a: "15,00 €", c: "3", s: "En cours", ic: "calendar" },
    { p: "Avril 2026", a: "15,00 €", c: "3", s: "Payée", ic: "calendar" },
    { p: "Setup initial", a: "150,00 €", c: "—", s: "Payée", ic: "rocket" }
  ];
  return <div style={{ maxWidth: 820, animation: "pkRise 0.4s ease both" }}>
    <div style={{ marginBottom: 20 }}>
      <Badge text="Facturation" variant="blue" t={t} dot />
      <h1 style={{ fontSize: 27, fontWeight: 800, color: t.text, margin: "8px 0 4px", letterSpacing: -0.8 }}>Factures</h1>
      <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Historique de vos paiements Perky</p>
    </div>

    {isMobile ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {factures.map((f, i) => (
          <div key={i} style={{ background: t.card, borderRadius: 16, boxShadow: t.cardShadow, padding: "16px 18px", border: `1px solid ${t.borderSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={f.ic} size={16} color={t.blue} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{f.p}</div>
                  <div style={{ fontSize: 12, color: t.textSec }}>{f.c !== "—" ? `${f.c} salariés` : "Frais fixes"}</div>
                </div>
              </div>
              <Badge text={f.s} variant={f.s === "Payée" ? "green" : "amber"} t={t} dot />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: t.text }}>{f.a}</span>
              <button style={{ padding: "7px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.card, fontSize: 13, cursor: "pointer", fontFamily: font, color: t.textSec, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                <Icon name="download" size={14} color={t.textSec} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 90px", padding: "12px 20px", background: t.bgSecondary, fontSize: 11, color: t.textSec, fontWeight: 700, borderBottom: `1px solid ${t.borderSoft}`, textTransform: "uppercase", letterSpacing: 0.4 }}>
          <span>Période</span><span>Montant</span><span>Salariés</span><span>Statut</span><span></span>
        </div>
        {factures.map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 90px", padding: "15px 20px", alignItems: "center", borderBottom: i < factures.length - 1 ? `1px solid ${t.borderSoft}` : "none", transition: "background 0.12s" }}
            onMouseEnter={e => e.currentTarget.style.background = t.bgTint}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ fontSize: 13.5, color: t.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={f.ic} size={15} color={t.blue} /></div>
              {f.p}
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: t.text }}>{f.a}</span>
            <span style={{ fontSize: 13, color: t.textSec }}>{f.c}</span>
            <Badge text={f.s} variant={f.s === "Payée" ? "green" : "amber"} t={t} dot />
            <button style={{ padding: "6px 12px", borderRadius: 9, border: `1px solid ${t.border}`, background: t.card, fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="download" size={13} color={t.textSec} /> PDF
            </button>
          </div>
        ))}
      </div>
    )}
  </div>;
}

// ─── EMPLOYEE HOME ────────────────────────────────────────────────────
// ─── CALENDAR EMP (sans échéances Perky) ─────────────────────────────
function TeamCalendarEmp({ employees, currentEmployee, t }) {
  const today = new Date(2026, 4, 17);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [events, setEvents] = useState({
    "2026-05-20": [{ empId: 2, type: "absent" }],
    "2026-05-21": [{ empId: 2, type: "absent" }],
    "2026-05-22": [{ empId: 3, type: "ecole" }],
    "2026-05-26": [{ empId: 1, type: "absent" }],
    "2026-06-09": [{ empId: 3, type: "ecole" }],
    "2026-06-15": [{ empId: 1, type: "absent" }],
  });
  const [popover, setPopover] = useState(null);

  const TYPE_COLORS = { absent: "#E24B4A", ecole: "#8B5CF6" };
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
  const getDateKey = (day) => `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const toggleEvent = (dateKey, empId, type) => {
    setEvents(prev => {
      const current = prev[dateKey] || [];
      const exists = current.find(e => e.empId === empId && e.type === type);
      if (exists) return { ...prev, [dateKey]: current.filter(e => !(e.empId === empId && e.type === type)) };
      return { ...prev, [dateKey]: [...current, { empId, type }] };
    });
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{monthNames[currentMonth]} {currentYear}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${t.border}`, background: "none", cursor: "pointer", color: t.textSec }}>‹</button>
          <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }} style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${t.border}`, background: "none", cursor: "pointer", color: t.textSec }}>›</button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 9, height: 9, borderRadius: 2, background: "#E24B4A" }} /><span style={{ fontSize: 11, color: t.textSec }}>Absent</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 9, height: 9, borderRadius: 2, background: "#8B5CF6" }} /><span style={{ fontSize: 11, color: t.textSec }}>École</span></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: 11, color: t.textSec, padding: "3px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateKey = getDateKey(day);
          const dayEvents = events[dateKey] || [];
          const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
          const isWeekend = (i % 7) >= 5;
          return (
            <div key={i} onClick={(e) => { if (isWeekend) return; setPopover(popover?.dateKey === dateKey ? null : { dateKey, day }); e.stopPropagation(); }}
              style={{ minHeight: 44, borderRadius: 6, padding: "3px 4px", background: isToday ? t.blueLighter : isWeekend ? t.bgSecondary : t.card, border: `1px solid ${isToday ? t.blue : t.border}`, cursor: isWeekend ? "default" : "pointer" }}>
              <div style={{ fontSize: 11, fontWeight: isToday ? 600 : 400, color: isToday ? t.blue : isWeekend ? t.textTert : t.text, marginBottom: 2 }}>{day}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {dayEvents.map((ev, j) => {
                  const emp = employees.find(e => e.id === ev.empId);
                  return emp ? <div key={j} style={{ width: 13, height: 13, borderRadius: "50%", background: TYPE_COLORS[ev.type], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: "#fff", fontWeight: 600 }}>{emp.initials[0]}</div> : null;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {popover && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400 }} onClick={() => setPopover(null)}>
          <div onClick={e => e.stopPropagation()} style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: t.card, borderRadius: 14, boxShadow: t.cardShadow, padding: "16px 18px", width: 220, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 401 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 12 }}>{monthNames[currentMonth].slice(0, 3)} {popover.day}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 500, color: t.blue }}>{currentEmployee.initials}</div>
                <span style={{ fontSize: 12, color: t.text }}>Moi</span>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {(() => {
                  const dayEvents = events[popover.dateKey] || [];
                  const absent = dayEvents.find(e => e.empId === currentEmployee.id && e.type === "absent");
                  const ecole = dayEvents.find(e => e.empId === currentEmployee.id && e.type === "ecole");
                  return <>
                    <button onClick={() => toggleEvent(popover.dateKey, currentEmployee.id, "absent")} style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${absent ? "#E24B4A" : t.border}`, background: absent ? "#FCEBEB" : "none", color: absent ? "#E24B4A" : t.textSec, fontSize: 11, cursor: "pointer", fontFamily: font }}>Absent</button>
                    {currentEmployee.role?.includes("lternan") && (
                      <button onClick={() => toggleEvent(popover.dateKey, currentEmployee.id, "ecole")} style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${ecole ? "#8B5CF6" : t.border}`, background: ecole ? "#EDE9FE" : "none", color: ecole ? "#8B5CF6" : t.textSec, fontSize: 11, cursor: "pointer", fontFamily: font }}>École</button>
                    )}
                  </>;
                })()}
              </div>
            </div>
            {/* Voir les autres */}
            {(events[popover.dateKey] || []).filter(e => e.empId !== currentEmployee.id).length > 0 && (
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 8, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: t.textSec, marginBottom: 6 }}>Équipe ce jour</div>
                {(events[popover.dateKey] || []).filter(e => e.empId !== currentEmployee.id).map((ev, j) => {
                  const emp = employees.find(e => e.id === ev.empId);
                  return emp ? (
                    <div key={j} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 16, height: 16, borderRadius: "50%", background: TYPE_COLORS[ev.type] }} />
                      <span style={{ fontSize: 12, color: t.textSec }}>{emp.firstName} — {ev.type === "absent" ? "Absent" : "École"}</span>
                    </div>
                  ) : null;
                })}
              </div>
            )}
            <button onClick={() => setPopover(null)} style={{ width: "100%", marginTop: 8, padding: "7px", borderRadius: 8, border: "none", background: t.bgSecondary, color: t.textSec, fontSize: 12, cursor: "pointer", fontFamily: font }}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmpHome({ employee, employees, scannerState, t, onGoToCatalogue }) {
  const isMobile = useIsMobile();
  const ppvNew = employee.ppv || 0;
  const ppvAlready = (scannerState.ppv_type?.value === "Versement complémentaire") ? (scannerState.ppv_already?.[employee.id] || 0) : 0;
  const ppv = ppvNew + ppvAlready;
  const navigoExtra = Math.round(((scannerState.navigo.pct - 50) / 100) * 86.40 * 12);
  const cadeau = scannerState.cadeaux.amount;
  const vacances = scannerState.vacances.amount;
  const restoYear = Math.round(scannerState.resto.amount * (scannerState.resto.pct / 100) * 220);
  const cashPerks = ppv + cadeau;
  const naturePerks = navigoExtra + restoYear + vacances;
  const totalPerks = cashPerks + naturePerks;

  return <div style={{ maxWidth: 1080, animation: "pkRise 0.4s ease both" }}>
    <div style={{ marginBottom: 20 }}>
      <Badge text="Espace salarié" variant="blue" t={t} dot />
      <h1 style={{ fontSize: 27, fontWeight: 800, color: t.text, margin: "8px 0 4px", letterSpacing: -0.8 }}>Bonjour {employee.firstName} 👋</h1>
      <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Bienvenue sur votre espace avantages — Alpha Optique</p>
    </div>
    <div style={{ borderRadius: 22, overflow: "hidden", marginBottom: 24, position: "relative", background: "linear-gradient(135deg, #1D4FCB 0%, #2563EB 48%, #1E3A8A 100%)", boxShadow: `0 12px 36px -10px ${t.blue}77` }}>
      <div style={{ ...glowDot("#60A5FA", 320, 0.5), top: "-40%", right: "20%" }} />
      <div style={{ ...glowDot("#34D399", 220, 0.3), bottom: "-50%", left: "10%" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "22px 22px", opacity: 0.6 }} />
      <div style={{ position: "relative", padding: "30px 34px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
        <div style={{ color: "#fff" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 20, padding: "5px 12px", marginBottom: 14, fontSize: 11.5, fontWeight: 600 }}>
            <Icon name="award" size={13} color="#fff" /> Performance entreprise
          </div>
          <div style={{ fontSize: 13, opacity: 0.82, marginBottom: 4 }}>Votre entreprise fait partie des</div>
          <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1 }}>Top 12% des TPE</div>
          <div style={{ fontSize: 13.5, opacity: 0.78, marginTop: 8 }}>en matière d'avantages salariés</div>
        </div>
        <div style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 18, padding: "22px 28px", textAlign: "center", color: "#fff", backdropFilter: "blur(8px)" }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1 }}>{fmt(totalPerks)} €</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>d'avantages actifs / an</div>
        </div>
      </div>
    </div>

    {totalPerks > 0 && <div style={{ marginBottom: 28 }}>
      <SectionTitle icon="wallet" iconColor={t.green} title="Votre rémunération globale" sub="Ce que votre employeur vous apporte au-delà de votre salaire net" t={t} />
      <div style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, padding: "22px 24px" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, marginBottom: 14, alignItems: "stretch" }}>
          <div style={{ flex: 1.2, background: t.bgSecondary, borderRadius: 14, padding: "16px 18px", textAlign: "center", border: `1px dashed ${t.borderStrong}` }}>
            <div style={{ fontSize: 11.5, color: t.textSec, marginBottom: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Votre salaire</div>
            <div style={{ fontSize: 22, letterSpacing: 5, color: t.textTert }}>●●●●</div>
            <div style={{ fontSize: 11, color: t.textTert, marginTop: 8 }}>Connu de vous</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: t.textTert, fontWeight: 300 }}>+</div>
          <div style={{ flex: 1, background: t.greenLight, borderRadius: 14, padding: "16px 18px", textAlign: "center", border: `1px solid ${t.green}26` }}>
            <div style={{ fontSize: 11.5, color: t.green, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>En espèces</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.green, letterSpacing: -0.6 }}>{fmt(cashPerks)} €</div>
            <div style={{ fontSize: 11.5, color: t.green, opacity: 0.78, marginTop: 5 }}>PPV + chèques</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 22, color: t.textTert, fontWeight: 300 }}>+</div>
          <div style={{ flex: 1, background: t.blueLighter, borderRadius: 14, padding: "16px 18px", textAlign: "center", border: `1px solid ${t.blue}26` }}>
            <div style={{ fontSize: 11.5, color: t.blue, marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>En nature</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: t.blue, letterSpacing: -0.6 }}>{fmt(naturePerks)} €</div>
            <div style={{ fontSize: 11.5, color: t.blue, opacity: 0.78, marginTop: 5 }}>Transport + resto</div>
          </div>
        </div>
        <div style={{ background: t.blueGrad, borderRadius: 13, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", overflow: "hidden", boxShadow: `0 8px 20px -8px ${t.blue}88` }}>
          <div style={{ ...glowDot("#fff", 70, 0.18), top: -26, right: 40 }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", fontWeight: 600, position: "relative" }}>Total avantages offerts par votre employeur</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: -0.5, position: "relative" }}>{fmt(totalPerks)} €/an</span>
        </div>
      </div>
    </div>}

    <div style={{ marginBottom: 28 }}>
      <SectionTitle icon="gift" iconColor={t.blue} title="Ce que Alpha Optique vous offre" t={t} />
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 14 }}>
        {[
          ppv > 0 && { title: "PPV 2026", sub: ppvAlready > 0 ? `${fmt(ppv)}€ au total (${fmt(ppvAlready)}€ + ${fmt(ppvNew)}€)` : `${fmt(ppv)}€ nets versés`, icon: "coin", type: "cash" },
          navigoExtra > 0 && { title: `Transport ${scannerState.navigo.pct}%`, sub: `+${fmt(navigoExtra)}€/an`, icon: "bus", type: "nature" },
          scannerState.resto.amount > 0 && { title: "Titres-restaurant", sub: `${scannerState.resto.amount}€/jour`, icon: "tools-kitchen-2", type: "nature" },
        ].filter(Boolean).map((it, i) => {
          const isCash = it.type === "cash";
          return <div key={i} style={{ background: t.card, borderRadius: 14, boxShadow: t.cardShadow, padding: "16px 18px", borderTop: `3px solid ${isCash ? t.green : t.blue}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: isCash ? t.greenLight : t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={it.icon} size={16} color={isCash ? t.green : t.blue} /></div>
              <Badge text={isCash ? "Espèces" : "Nature"} variant={isCash ? "green" : "blue"} t={t} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 2 }}>{it.title}</div>
            <div style={{ fontSize: 12, color: t.textSec }}>{it.sub}</div>
          </div>;
        })}
      </div>
    </div>

    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="calendar" size={18} color={t.blue} /> Planning équipe
      </div>
      <div style={{ background: t.card, borderRadius: 16, boxShadow: t.cardShadow, padding: "16px 18px" }}>
        <TeamCalendarEmp employees={employees} currentEmployee={employee} t={t} />
      </div>
    </div>

    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: t.text, display: "flex", alignItems: "center", gap: 8 }}><Icon name="flame" size={18} color={t.amber} /> Offres du moment</div>
        <button onClick={onGoToCatalogue} style={{ fontSize: 13, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Voir tout →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 12 }}>
        {OFFERS.slice(0, 4).map(o => <div key={o.id} style={{ background: t.card, borderRadius: 16, boxShadow: t.cardShadow, overflow: "hidden" }}>
          <img src={o.img} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
          <div style={{ padding: "10px 12px" }}>
            <div style={{ fontSize: 11, color: t.textSec }}>{o.cat}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.text, margin: "2px 0 4px" }}>{o.name}</div>
            <span style={{ fontSize: 15, fontWeight: 500, color: t.blue }}>{o.display}</span>
          </div>
        </div>)}
      </div>
    </div>
  </div>;
}

// ─── EMP CATALOGUE ────────────────────────────────────────────────────
function EmpCatalogue({ onOfferClick, onAddToCart, selectedCat, setSelectedCat, t }) {
  const isMobile = useIsMobile();
  const filtered = selectedCat ? OFFERS.filter(o => o.cat === selectedCat) : OFFERS;
  return (
    <div style={{ maxWidth: 1100, animation: "pkRise 0.4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Badge text="Catalogue" variant="blue" t={t} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "8px 0 4px", letterSpacing: -0.8 }}>Vos offres exclusives</h1>
        <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>+2 000 enseignes — cinéma, parcs, voyages, shopping, sport</p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <input placeholder="Rechercher une enseigne, un parc, une marque..." style={{ width: "100%", padding: "14px 18px 14px 48px", fontSize: 14, border: `1.5px solid ${t.borderSoft}`, borderRadius: 16, outline: "none", boxSizing: "border-box", fontFamily: font, background: t.bgTint, color: t.text, boxShadow: t.cardShadowSoft, transition: "border-color 0.2s, box-shadow 0.2s" }}
          onFocus={e => { e.target.style.borderColor = t.blue; e.target.style.boxShadow = `0 0 0 4px ${t.ring}`; }}
          onBlur={e => { e.target.style.borderColor = t.borderSoft; e.target.style.boxShadow = t.cardShadowSoft; }} />
        <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}><Icon name="search" size={18} color={t.textTert} /></div>
      </div>

      {/* Categories */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {CATEGORIES.map((c, i) => (
          <div key={i} onClick={() => setSelectedCat(selectedCat === c.label ? null : c.label)}
            style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer", position: "relative", height: 100, border: selectedCat === c.label ? `2.5px solid ${t.blue}` : `1.5px solid ${t.borderSoft}`, boxShadow: selectedCat === c.label ? `0 0 0 4px ${t.ring}` : t.cardShadowSoft, transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = t.cardShadow; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = selectedCat === c.label ? `0 0 0 4px ${t.ring}` : t.cardShadowSoft; }}>
            <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 60%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "10px 14px" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: -0.2 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{c.count} offres</div>
            </div>
            {selectedCat === c.label && (
              <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: t.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={12} color="#fff" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Section header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: t.text, letterSpacing: -0.4 }}>{selectedCat || "Toutes les offres"}</div>
        {selectedCat && (
          <button onClick={() => setSelectedCat(null)} style={{ fontSize: 12, fontWeight: 600, color: t.blue, border: "none", background: t.blueGradSoft, padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="x" size={12} color={t.blue} /> Tout afficher
          </button>
        )}
      </div>

      {/* Offers grid */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 16 }}>
        {filtered.map(o => (
          <div key={o.id} style={{ background: t.card, borderRadius: 18, boxShadow: t.cardShadow, overflow: "hidden", cursor: "pointer", border: `1px solid ${t.borderSoft}`, transition: "transform 0.18s, box-shadow 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = t.cardShadowHover; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = t.cardShadow; }}>
            <div onClick={() => onOfferClick(o)} style={{ position: "relative" }}>
              <img src={o.img} alt="" style={{ width: "100%", height: 148, objectFit: "cover", display: "block" }} />
              <span style={{ position: "absolute", top: 10, right: 10, background: t.blueGrad, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, boxShadow: "0 2px 8px rgba(37,99,235,0.4)" }}>{o.discount}</span>
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
              <div onClick={() => onOfferClick(o)}>
                <div style={{ fontSize: 10, fontWeight: 600, color: t.textTert, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>{o.cat}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8, letterSpacing: -0.2 }}>{o.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: o.price > 0 ? 12 : 0 }}>
                  <span style={{ fontSize: 19, fontWeight: 800, color: t.blue, letterSpacing: -0.5 }}>{o.display}</span>
                  <span style={{ fontSize: 12, color: t.textTert, textDecoration: "line-through" }}>{o.old}</span>
                </div>
              </div>
              {o.price > 0 && (
                <button onClick={() => onAddToCart(o)} style={{ width: "100%", padding: "9px", borderRadius: 10, border: "none", background: t.blueGradSoft, color: t.blue, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font, transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = t.blueLighter}
                  onMouseLeave={e => e.currentTarget.style.background = t.blueGradSoft}>
                  + Ajouter au panier
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── OFFER DETAIL ─────────────────────────────────────────────────────
function OfferDetail({ offer, onBack, onAddToCart, t }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ maxWidth: 1000, animation: "pkRise 0.4s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: t.bgTint, borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.textSec, fontFamily: font, marginBottom: 24, boxShadow: t.cardShadowSoft }}>
        <Icon name="arrow-left" size={16} color={t.textSec} /> Retour au catalogue
      </button>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 20 : 32 }}>
        {/* Left: image */}
        <div style={{ flex: 1.2 }}>
          <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: t.cardShadow }}>
            <img src={offer.img} alt="" style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
          </div>
        </div>

        {/* Right: info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: t.bgTint, border: `1px solid ${t.borderSoft}`, borderRadius: 20, padding: "4px 12px", marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: t.textTert, textTransform: "uppercase", letterSpacing: 0.6 }}>{offer.cat}</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: "0 0 16px", letterSpacing: -0.7 }}>{offer.name}</h1>

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: t.blue, letterSpacing: -1 }}>{offer.display}</span>
            <span style={{ fontSize: 16, color: t.textTert, textDecoration: "line-through" }}>{offer.old}</span>
            <span style={{ background: t.blueGrad, color: "#fff", fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20, boxShadow: "0 2px 8px rgba(37,99,235,0.35)" }}>{offer.discount}</span>
          </div>

          <p style={{ fontSize: 14, color: t.textSec, lineHeight: 1.75, margin: "0 0 20px" }}>{offer.desc}</p>

          <div style={{ background: t.bgTint, borderRadius: 14, padding: "16px 18px", marginBottom: 20, border: `1px solid ${t.borderSoft}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, background: t.amberLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="info-circle" size={14} color={t.amber} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>Conditions</div>
            </div>
            <p style={{ fontSize: 13, color: t.textSec, lineHeight: 1.65, margin: 0 }}>{offer.conditions}</p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {offer.price > 0
              ? <button onClick={() => onAddToCart(offer)} style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: t.blueGrad, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(37,99,235,0.4)", transition: "transform 0.15s, box-shadow 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.45)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.4)"; }}>
                  Ajouter au panier
                </button>
              : <button style={{ flex: 1, padding: "14px", borderRadius: 12, border: "none", background: t.greenGrad, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(16,185,129,0.35)" }}>
                  Accéder à l'offre
                </button>}
            <button style={{ padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${t.borderSoft}`, background: t.card, cursor: "pointer", boxShadow: t.cardShadowSoft, transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#f43f5e"}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.borderSoft}>
              <Icon name="heart" size={18} color={t.textSec} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CART ─────────────────────────────────────────────────────────────
function PaymentConfirm({ orders, onGoToWallet, onGoToCatalogue, t }) {
  const total = orders.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const orderNum = orders[0]?.orderNum || "000000";
  const email = "benjamin@alphaoptique.fr";
  return (
    <div style={{ maxWidth: 520, margin: "48px auto 0", animation: "pkPop 0.4s ease" }}>
      {/* Success icon */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: t.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
          <Icon name="circle-check" size={44} color="#fff" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: "0 0 6px", letterSpacing: -0.7 }}>Paiement confirmé !</h1>
        <div style={{ fontSize: 13, color: t.textSec }}>Commande #{orderNum} · <strong style={{ color: t.green }}>{total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</strong></div>
      </div>

      {/* Tickets card */}
      <div style={{ ...card(t), padding: "20px 24px", marginBottom: 14 }}>
        <SectionTitle icon="ticket" iconColor={t.blue} iconBg={t.blueGradSoft} title="Vos billets" t={t} />
        {orders.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderTop: i > 0 ? `1px solid ${t.borderSoft}` : "none" }}>
            <img src={item.img} alt="" style={{ width: 56, height: 42, borderRadius: 10, objectFit: "cover", boxShadow: t.cardShadowSoft }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{item.name}</div>
              <div style={{ fontSize: 12, color: t.textSec }}>{item.cat}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: t.green }}>
              <Icon name="circle-check" size={14} color={t.green} /> Wallet
            </div>
          </div>
        ))}
      </div>

      {/* Email notice */}
      <div style={{ background: t.blueGradSoft, borderRadius: 14, padding: "16px 20px", marginBottom: 24, border: `1px solid ${t.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(37,99,235,0.35)" }}>
            <Icon name="mail" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.blue, marginBottom: 3 }}>Email de confirmation envoyé</div>
            <div style={{ fontSize: 12, color: t.blue, opacity: 0.8, lineHeight: 1.5 }}>Billets disponibles à <strong>{email}</strong> et dans votre wallet Perky.</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onGoToCatalogue} style={{ flex: 1, padding: "13px", borderRadius: 12, border: `1.5px solid ${t.borderSoft}`, background: t.card, color: t.textSec, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: font, transition: "border-color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = t.blue}
          onMouseLeave={e => e.currentTarget.style.borderColor = t.borderSoft}>
          Continuer mes achats
        </button>
        <button onClick={onGoToWallet} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "none", background: t.blueGrad, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 14px rgba(37,99,235,0.4)", transition: "transform 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "none"}>
          <Icon name="wallet" size={16} color="#fff" /> Voir mon wallet
        </button>
      </div>
    </div>
  );
}

function CartPage({ cart, onRemove, onPay, t }) {
  const isMobile = useIsMobile();
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  if (!cart.length) return (
    <div style={{ textAlign: "center", padding: "80px 0", animation: "pkRise 0.4s ease" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: t.bgTint, border: `1.5px solid ${t.borderSoft}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
        <Icon name="shopping-cart" size={36} color={t.textTert} />
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 8, letterSpacing: -0.5 }}>Panier vide</div>
      <div style={{ fontSize: 14, color: t.textSec }}>Parcourez le catalogue pour ajouter des offres</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, animation: "pkRise 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <Badge text="Panier" variant="blue" t={t} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "8px 0 0", letterSpacing: -0.8 }}>Mon panier</h1>
      </div>

      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 24 }}>
        {/* Items */}
        <div style={{ flex: 1 }}>
          {cart.map((item, i) => (
            <div key={i} style={{ ...card(t), padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16, transition: "transform 0.18s, box-shadow 0.18s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = t.cardShadowHover; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = t.cardShadow; }}>
              <img src={item.img} alt="" style={{ width: 72, height: 54, borderRadius: 12, objectFit: "cover", boxShadow: t.cardShadowSoft }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: t.textTert, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{item.cat}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3 }}>{item.name}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: t.blue, letterSpacing: -0.5 }}>{item.display}</span>
                <button onClick={() => onRemove(item.id)} style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${t.borderSoft}`, background: t.bgTint, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.15s, background 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#f43f5e"; e.currentTarget.style.background = "#fff1f2"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = t.borderSoft; e.currentTarget.style.background = t.bgTint; }}>
                  <Icon name="trash" size={15} color={t.textSec} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ width: isMobile ? "100%" : 280, flexShrink: 0 }}>
          <div style={{ ...card(t), padding: "22px", position: "sticky", top: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: t.text, marginBottom: 16, letterSpacing: -0.4 }}>Résumé</div>
            {cart.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: t.textSec, marginBottom: 8 }}>
                <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
                <span style={{ fontWeight: 600, color: t.text }}>{item.display}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${t.borderSoft}`, margin: "14px 0", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: t.blue, letterSpacing: -0.5 }}>{total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
            </div>
            <button onClick={onPay} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: t.blueGrad, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font, boxShadow: "0 4px 14px rgba(37,99,235,0.4)", transition: "transform 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(37,99,235,0.45)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.4)"; }}>
              Procéder au paiement
            </button>
            <div style={{ fontSize: 11, color: t.textTert, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
              🔒 Billets envoyés dans votre wallet et par email
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WALLET ───────────────────────────────────────────────────────────
function EmpWallet({ t }) {
  const tickets = [
    { name: "2x Places UGC", date: "Valable jusqu'au 30/06/2026", img: IMG.ugc },
    { name: "Disneyland — 28/05", date: "Billet pour 2 personnes", img: IMG.disney }
  ];
  return (
    <div style={{ maxWidth: 720, animation: "pkRise 0.4s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <Badge text="Wallet" variant="green" t={t} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "8px 0 4px", letterSpacing: -0.8 }}>Mon wallet</h1>
        <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Tous vos billets et codes promo en un endroit</p>
      </div>

      <SectionTitle icon="ticket" iconColor={t.green} iconBg={t.greenGrad} title="Billets actifs" sub={`${tickets.length} billets disponibles`} t={t} />

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {tickets.map((it, i) => (
          <div key={i} style={{ ...card(t), padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "transform 0.18s, box-shadow 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = t.cardShadowHover; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = t.cardShadow; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: t.cardShadowSoft }}>
                <img src={it.img} alt="" style={{ width: 64, height: 48, objectFit: "cover", display: "block" }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 3, letterSpacing: -0.2 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: t.textSec }}>{it.date}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Badge text="Actif" variant="green" dot t={t} />
              <button style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${t.borderSoft}`, background: t.bgTint, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font, color: t.textSec, transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.borderSoft}>
                Renvoyer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ────────────────────────────────────────────────────────
function Settings({ dark, setDark, t }) {
  return (
    <div style={{ maxWidth: 600, animation: "pkRise 0.4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <Badge text="Paramètres" variant="blue" t={t} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "8px 0 0", letterSpacing: -0.8 }}>Paramètres</h1>
      </div>

      <div style={{ ...card(t), overflow: "hidden" }}>
        <div style={{ padding: "14px 22px", borderBottom: `1px solid ${t.borderSoft}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: t.blueGradSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="palette" size={15} color={t.blue} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.textTert, textTransform: "uppercase", letterSpacing: 0.8 }}>Apparence</div>
        </div>
        <div style={{ padding: "20px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 3, letterSpacing: -0.3 }}>Mode sombre</div>
            <div style={{ fontSize: 13, color: t.textSec }}>S'adapte aussi automatiquement à votre système</div>
          </div>
          <button onClick={() => setDark(d => !d)} style={{ width: 50, height: 28, borderRadius: 14, border: "none", background: dark ? t.blueGrad : t.borderSoft, cursor: "pointer", position: "relative", transition: "background 0.25s", boxShadow: dark ? "0 3px 10px rgba(37,99,235,0.4)" : "none", flexShrink: 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: dark ? 25 : 3, transition: "left 0.25s", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── NAV CONFIGS ─────────────────────────────────────────────────────
// ─── GUIDE 100% SANTÉ ────────────────────────────────────────────────
function Guide100Sante({ t, onBack }) {
  const steps = [
    { num: 1, title: "Vérifiez votre mutuelle", icon: "shield-check", color: t.green, content: "Votre employeur vous a affilié à une mutuelle d'entreprise. Connectez-vous sur le site de votre organisme (souvent Malakoff Humanis, AG2R, Harmonie) et vérifiez que la garantie « 100% Santé » est bien activée sur votre contrat. C'est gratuit et obligatoire depuis 2021." },
    { num: 2, title: "Choisissez un opticien partenaire", icon: "eye", color: t.blue, content: "Rendez-vous chez un opticien qui affiche le label « Opticien partenaire 100% Santé ». Ils sont facilement identifiables par leur affichage en vitrine. Chez un opticien partenaire, vous accédez au catalogue de montures et verres inclus dans le dispositif." },
    { num: 3, title: "Choisissez une monture du panier 100%", icon: "shopping-bag", color: t.amber, content: "Le catalogue 100% Santé comprend des montures à partir de 30€ (adulte) et 50€ (enfant). Les verres correcteurs sont inclus selon votre correction. Ces équipements sont intégralement remboursés : 150€ par la Sécurité sociale + le reste par votre mutuelle." },
    { num: 4, title: "Remboursement intégral automatique", icon: "coin", color: t.green, content: "Vous n'avancez rien. L'opticien facture directement votre Sécurité sociale et votre mutuelle via la carte Vitale et l'attestation de droits mutuelle. Le reste à charge est 0€. Renouvelable tous les 2 ans (1 an si correction modifiée)." },
  ];
  const faqs = [
    { q: "Puis-je choisir des lunettes hors catalogue ?", r: "Oui, mais vous aurez un reste à charge. Les lunettes « Panier Libre » sont remboursées partiellement selon votre mutuelle." },
    { q: "Le 100% Santé concerne-t-il les lentilles ?", r: "Non. Les lentilles de contact sont hors du dispositif 100% Santé, leur remboursement dépend de votre contrat mutuelle." },
    { q: "C'est valable aussi pour le dentaire et l'auditif ?", r: "Oui. Le 100% Santé couvre aussi les prothèses dentaires (couronnes, bridges) et les aides auditives — même principe, 0€ de reste à charge." },
  ];
  return (
    <div style={{ maxWidth: 700, animation: "pkRise 0.4s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: t.bgTint, borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.textSec, fontFamily: font, marginBottom: 24, boxShadow: t.cardShadowSoft }}
        onMouseEnter={e => e.currentTarget.style.background = t.bgSecondary}
        onMouseLeave={e => e.currentTarget.style.background = t.bgTint}>
        <Icon name="arrow-left" size={16} color={t.textSec} /> Retour
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: t.greenGrad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(16,185,129,0.35)" }}>
          <Icon name="heart" size={26} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0, letterSpacing: -0.7 }}>Guide 100% Santé</h1>
          <p style={{ fontSize: 14, color: t.textSec, margin: "4px 0 0" }}>Optique, dentaire et auditif sans reste à charge</p>
        </div>
      </div>
      <div style={{ background: t.greenGrad, borderRadius: 14, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "0 4px 14px rgba(16,185,129,0.25)" }}>
        <Icon name="info-circle" size={18} color="#fff" />
        <p style={{ fontSize: 13, color: "#fff", margin: 0, lineHeight: 1.65 }}>Le 100% Santé vous permet d'accéder à des <strong>lunettes, prothèses dentaires ou aides auditives sans payer un centime</strong>, grâce à la combinaison Sécurité sociale + mutuelle d'entreprise.</p>
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 14, letterSpacing: -0.3 }}>Optique — Comment ça marche en 4 étapes</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ ...card(t), padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${s.color}33` }}>
              <Icon name={s.icon} size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4 }}>{s.num}. {s.title}</div>
              <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.65 }}>{s.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...card(t), overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "14px 20px", background: t.bgTint, fontSize: 13, fontWeight: 700, color: t.text, borderBottom: `1px solid ${t.borderSoft}`, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="help-circle" size={15} color={t.textTert} /> Questions fréquentes
        </div>
        {faqs.map((f, i) => (
          <div key={i} style={{ padding: "16px 20px", borderBottom: i < faqs.length - 1 ? `1px solid ${t.borderSoft}` : "none" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: t.blue }}>→</span> {f.q}
            </div>
            <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.55 }}>{f.r}</div>
          </div>
        ))}
      </div>
      <div style={{ background: t.bgTint, borderRadius: 14, padding: "16px 20px", fontSize: 13, color: t.textSec, lineHeight: 1.65, border: `1px solid ${t.borderSoft}` }}>
        💡 En tant que salarié d'Alpha Optique (un magasin d'optique), vous avez un accès privilégié aux conseils professionnels de votre équipe pour choisir le meilleur équipement 100% Santé.
      </div>
    </div>
  );
}

// ─── GUIDE CPF ────────────────────────────────────────────────────────
function GuideCPF({ t, onBack }) {
  const isMobile = useIsMobile();
  const steps = [
    { num: 1, title: "Consultez votre solde CPF", icon: "wallet", color: t.blue, content: "Rendez-vous sur moncompteformation.gouv.fr ou téléchargez l'application \"Mon Compte Formation\". Connectez-vous avec FranceConnect (impôts.gouv.fr ou ameli.fr). Vous verrez votre solde disponible en euros : les salariés accumulent environ 500€/an, plafonné à 5 000€." },
    { num: 2, title: "Choisissez une formation éligible", icon: "school", color: t.amber, content: "Sur la plateforme, recherchez une formation parmi les 500 000+ disponibles. Filtrez par thème, durée, lieu ou modalité (présentiel/distanciel). Les formations éligibles sont identifiées par le picto CPF. Vous pouvez chercher des formations en lien avec votre poste (optique, commerce, langues, bureautique...)." },
    { num: 3, title: "Vérifiez le financement", icon: "calculator", color: t.green, content: "Si votre solde couvre 100% du coût : inscription immédiate, aucune démarche avec votre employeur nécessaire. Si le coût dépasse votre solde : vous pouvez compléter de votre poche ou demander un co-financement à votre employeur ou à votre OPCO (organisme financeur de branche)." },
    { num: 4, title: "Inscrivez-vous et suivez la formation", icon: "certificate", color: t.blue, content: "Confirmez votre inscription directement en ligne, 11 jours ouvrés après la demande (délai de rétractation). Suivez la formation. À la fin, l'attestation de réussite est ajoutée à votre espace CPF et le montant est débité de votre solde." },
  ];
  const tips = [
    { icon: "bolt", title: "Droit individuel", text: "Le CPF vous appartient. Votre employeur ne peut pas s'y opposer si vous suivez la formation hors temps de travail." },
    { icon: "clock", title: "Formation pendant le travail", text: "Si la formation a lieu sur votre temps de travail, vous devez demander l'accord de votre employeur." },
    { icon: "shield-check", title: "Vigilance arnaques", text: "Méfiez-vous des démarchages par SMS ou téléphone qui promettent de \"débloquer\" votre CPF. C'est gratuit et direct sur la plateforme officielle." },
  ];
  return (
    <div style={{ maxWidth: 700, animation: "pkRise 0.4s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: t.bgTint, borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.textSec, fontFamily: font, marginBottom: 24, boxShadow: t.cardShadowSoft }}
        onMouseEnter={e => e.currentTarget.style.background = t.bgSecondary}
        onMouseLeave={e => e.currentTarget.style.background = t.bgTint}>
        <Icon name="arrow-left" size={16} color={t.textSec} /> Retour
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
          <Icon name="school" size={26} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0, letterSpacing: -0.7 }}>Mon Compte Formation (CPF)</h1>
          <p style={{ fontSize: 14, color: t.textSec, margin: "4px 0 0" }}>Utilisez vos droits formation facilement</p>
        </div>
      </div>
      <div style={{ background: t.blueGrad, borderRadius: 14, padding: "16px 20px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "0 4px 14px rgba(37,99,235,0.25)" }}>
        <Icon name="info-circle" size={18} color="#fff" />
        <p style={{ fontSize: 13, color: "#fff", margin: 0, lineHeight: 1.65 }}>Le CPF (Compte Personnel de Formation) vous permet de <strong>financer des formations professionnelles</strong> tout au long de votre carrière. Vous accumulez des droits en euros chaque année, indépendamment de votre employeur.</p>
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 14, letterSpacing: -0.3 }}>Comment utiliser votre CPF en 4 étapes</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ ...card(t), padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${s.color}33` }}>
              <Icon name={s.icon} size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4 }}>{s.num}. {s.title}</div>
              <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.65 }}>{s.content}</div>
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 12, letterSpacing: -0.3 }}>Ce qu'il faut savoir</h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
        {tips.map((tip, i) => (
          <div key={i} style={{ ...card(t), padding: "16px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: t.blueGradSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name={tip.icon} size={17} color={t.blue} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 5, letterSpacing: -0.2 }}>{tip.title}</div>
            <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.55 }}>{tip.text}</div>
          </div>
        ))}
      </div>
      <div style={{ background: t.blueGradSoft, borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, border: `1px solid ${t.borderSoft}`, cursor: "pointer" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(37,99,235,0.35)" }}>
          <Icon name="external-link" size={18} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.blue, marginBottom: 2 }}>Accéder à mon compte formation</div>
          <div style={{ fontSize: 12, color: t.blue, opacity: 0.7 }}>moncompteformation.gouv.fr — Connexion via FranceConnect</div>
        </div>
      </div>
    </div>
  );
}

// ─── GUIDE D'UTILISATION PERKY ────────────────────────────────────────
function GuidesHub({ t, onSelect }) {
  const isMobile = useIsMobile();
  const guides = [
    { id: "sante", icon: "heart", color: t.green, grad: t.greenGrad, title: "Guide 100% Santé", sub: "Lunettes, dentaire et auditif à 0€ de reste à charge — comment ça marche" },
    { id: "cpf", icon: "school", color: t.blue, grad: t.blueGrad, title: "Mon Compte Formation", sub: "Utilisez vos droits CPF pour vous former gratuitement" },
    { id: "perky", icon: "help-circle", color: t.amber, grad: t.amberGrad, title: "Guide d'utilisation Perky", sub: "Comment naviguer dans l'application et profiter de toutes les fonctionnalités" },
  ];
  return (
    <div style={{ maxWidth: 820, animation: "pkRise 0.4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <Badge text="Guides" variant="blue" t={t} />
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "8px 0 4px", letterSpacing: -0.8 }}>Aide & Guides</h1>
        <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Tout ce dont vous avez besoin pour profiter de Perky</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {guides.map(g => (
          <div key={g.id} onClick={() => onSelect(g.id)}
            style={{ ...card(t), padding: "24px", cursor: "pointer", border: `1.5px solid ${t.borderSoft}`, transition: "transform 0.18s, box-shadow 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = t.cardShadowHover; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = t.cardShadow; }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: g.grad, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, boxShadow: `0 4px 12px ${g.color}44` }}>
              <Icon name={g.icon} size={24} color="#fff" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: t.text, marginBottom: 6, letterSpacing: -0.4 }}>{g.title}</div>
            <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.55 }}>{g.sub}</div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: g.color }}>
              Lire le guide <Icon name="arrow-right" size={13} color={g.color} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: t.bgTint, borderRadius: 16, padding: "18px 22px", border: `1.5px solid ${t.borderSoft}`, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: t.blueGradSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="message-circle" size={20} color={t.blue} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 2 }}>Besoin d'aide supplémentaire ?</div>
          <div style={{ fontSize: 13, color: t.textSec }}>Contactez le support : <strong style={{ color: t.blue }}>support@perky.fr</strong></div>
        </div>
      </div>
    </div>
  );
}

function GuidePerky({ t, onBack }) {
  const sections = [
    { icon: "home", color: t.blue, title: "Accueil", text: "Votre tableau de bord personnel. Retrouvez en un coup d'œil les avantages activés par votre employeur, votre niveau de rémunération globale, et les offres du moment." },
    { icon: "tag", color: t.amber, title: "Catalogue", text: "Parcourez +2 000 offres exclusives : cinéma, parcs, voyages, shopping, sport, beauté. Filtrez par catégorie ou recherchez une enseigne. Cliquez sur une offre pour voir les détails et l'ajouter à votre panier." },
    { icon: "shopping-cart", color: t.blue, title: "Panier & Paiement", text: "Vos offres sélectionnées apparaissent ici. Payez en toute sécurité par carte bancaire. Vos billets sont envoyés instantanément dans votre wallet et par email." },
    { icon: "wallet", color: t.green, title: "Mon Wallet", text: "Stockage sécurisé de tous vos billets et codes promo. Retrouvez vos billets actifs, téléchargez-les ou renvoyez-les par email si besoin." },
    { icon: "gift", color: t.green, title: "Avantages employeur", text: "Les dispositifs activés par votre employeur (PPV, transport, chèques cadeaux...) apparaissent sur votre accueil. Ils contribuent à votre rémunération globale et sont mis à jour automatiquement." },
  ];
  return (
    <div style={{ maxWidth: 700, animation: "pkRise 0.4s ease" }}>
      <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "none", background: t.bgTint, borderRadius: 20, cursor: "pointer", fontSize: 13, fontWeight: 600, color: t.textSec, fontFamily: font, marginBottom: 24, boxShadow: t.cardShadowSoft }}
        onMouseEnter={e => e.currentTarget.style.background = t.bgSecondary}
        onMouseLeave={e => e.currentTarget.style.background = t.bgTint}>
        <Icon name="arrow-left" size={16} color={t.textSec} /> Retour
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: t.amberGrad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(245,158,11,0.35)" }}>
          <Icon name="help-circle" size={26} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: t.text, margin: 0, letterSpacing: -0.7 }}>Guide d'utilisation Perky</h1>
          <p style={{ fontSize: 14, color: t.textSec, margin: "4px 0 0" }}>Tout ce qu'il faut savoir pour bien utiliser votre espace</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {sections.map((s, i) => (
          <div key={i} style={{ ...card(t), padding: "18px 20px", display: "flex", gap: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: s.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${s.color}33` }}>
              <Icon name={s.icon} size={18} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 5, letterSpacing: -0.2 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.65 }}>{s.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: t.bgTint, borderRadius: 14, padding: "18px 20px", border: `1.5px solid ${t.borderSoft}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 8, letterSpacing: -0.3 }}>Une question ? Un problème ?</div>
        <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.65 }}>
          Contactez le support Perky à <strong style={{ color: t.blue }}>support@perky.fr</strong> ou consultez la FAQ sur <strong style={{ color: t.blue }}>help.perky.fr</strong>.<br />
          Pour les questions sur vos avantages employeur, adressez-vous directement à votre gestionnaire RH.
        </div>
      </div>
    </div>
  );
}

const empNav = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "catalogue", label: "Catalogue", icon: "tag" },
  { id: "cart", label: "Mon panier", icon: "shopping-cart" },
  { id: "wallet", label: "Mon wallet", icon: "wallet" },
  { id: "guide", label: "Aide & Guides", icon: "help-circle" },
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

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [authState, setAuthState] = useState("login");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [empPage, setEmpPage] = useState("home");
  const [bossPage, setBossPage] = useState("home");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [cart, setCart] = useState([]);
  const [employees, setEmployees] = useState(INIT_EMPLOYEES);
  const [scannerState, setScannerState] = useState(INIT_SCANNER);
  const [company, setCompany] = useState({ name: "Alpha Optique", sector: "Optique / Santé", siret: "" });
  const [paidOrders, setPaidOrders] = useState([]);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, icon: "gift", color: "#1D9E75", title: "Votre employeur a activé les chèques vacances", sub: "Jusqu'à 550€ disponibles pour vos prochaines vacances", time: "Il y a 2j", read: false },
    { id: 2, icon: "coin", color: "#185FA5", title: "PPV 2026 versée sur votre paie", sub: "1 000€ nets ont été ajoutés à votre bulletin de mai", time: "Il y a 5j", read: false },
    { id: 3, icon: "flame", color: "#BA7517", title: "Nouvelle offre : Disneyland Paris", sub: "-30€ sur le billet 1 jour, disponible dès maintenant", time: "Il y a 1sem", read: true },
    { id: 4, icon: "bus", color: "#378ADD", title: "Transport remboursé à 75%", sub: "Votre employeur prend désormais en charge 75% de votre Navigo", time: "Il y a 2sem", read: true },
  ]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [guidePage, setGuidePage] = useState("hub");
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const h = e => setDark(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const t = dark ? DARK : LIGHT;

  const handleLogin = (account) => {
    setCurrentAccount(account);
    if (account.role === "patron") setAuthState("boss-onboarding");
    else setAuthState("emp-activation");
  };

  const handleLogout = () => { setAuthState("login"); setCurrentAccount(null); setEmpPage("home"); setBossPage("home"); };

  const updateEmployeePPV = useCallback((id, val) => {
    setEmployees(p => p.map(e => e.id === id ? { ...e, ppv: val } : e));
  }, []);

  const addToCart = useCallback((offer) => {
    setCart(p => { const ex = p.find(i => i.id === offer.id); return ex ? p.map(i => i.id === offer.id ? { ...i, qty: (i.qty || 1) + 1 } : i) : [...p, { ...offer, qty: 1 }]; });
    setEmpPage("cart");
  }, []);

  const handlePayment = useCallback(() => {
    const orderNum = Math.floor(Math.random() * 900000) + 100000;
    setPaidOrders(cart.map(i => ({ ...i, orderNum, paidAt: new Date() })));
    setCart([]);
    setShowPaymentConfirm(true);
    const newNotif = {
      id: Date.now(), icon: "ticket", color: "#1D9E75",
      title: `Commande #${orderNum} confirmée`,
      sub: `${cart.length} billet${cart.length > 1 ? "s" : ""} disponible${cart.length > 1 ? "s" : ""} dans votre wallet`,
      time: "À l'instant", read: false,
    };
    setNotifications(p => [newNotif, ...p]);
  }, [cart]);

  const markAllRead = () => setNotifications(p => p.map(n => ({ ...n, read: true })));

  const activeEmployee = employees.find(e => e.id === 1) || INIT_EMPLOYEES[0];
  const currentEmpPage = showPaymentConfirm ? "confirmation" : empPage;

  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authState === "login") return <LoginPage onLogin={handleLogin} t={t} />;
  if (authState === "emp-activation") return <EmployeeActivation onComplete={() => setAuthState("app")} t={t} />;
  if (authState === "boss-onboarding") return <PatronOnboarding onComplete={(co) => { if (co) setCompany(co); setAuthState("app"); }} t={t} />;

  const isPatron = currentAccount?.role === "patron";

  const empViews = {
    home: <EmpHome employee={activeEmployee} employees={employees.filter(e => e.active)} scannerState={scannerState} t={t} onGoToCatalogue={() => setEmpPage("catalogue")} />,
    catalogue: selectedOffer ? <OfferDetail offer={selectedOffer} onBack={() => setSelectedOffer(null)} onAddToCart={offer => { addToCart(offer); setSelectedOffer(null); }} t={t} /> : <EmpCatalogue onOfferClick={o => setSelectedOffer(o)} onAddToCart={addToCart} selectedCat={selectedCat} setSelectedCat={setSelectedCat} t={t} />,
    cart: <CartPage cart={cart} onRemove={id => setCart(p => p.filter(i => i.id !== id))} onPay={handlePayment} t={t} />,
    wallet: <EmpWallet t={t} />,
    guide: guidePage === "sante" ? <Guide100Sante t={t} onBack={() => setGuidePage("hub")} /> : guidePage === "cpf" ? <GuideCPF t={t} onBack={() => setGuidePage("hub")} /> : guidePage === "perky" ? <GuidePerky t={t} onBack={() => setGuidePage("hub")} /> : <GuidesHub t={t} onSelect={setGuidePage} />,
    settings: <Settings dark={dark} setDark={setDark} t={t} />,
    detail: selectedOffer ? <OfferDetail offer={selectedOffer} onBack={() => { setSelectedOffer(null); setEmpPage("catalogue"); }} onAddToCart={offer => { addToCart(offer); setSelectedOffer(null); }} t={t} /> : null,
    confirmation: <PaymentConfirm orders={paidOrders} onGoToWallet={() => { setShowPaymentConfirm(false); setEmpPage("wallet"); }} onGoToCatalogue={() => { setShowPaymentConfirm(false); setEmpPage("catalogue"); }} t={t} />,
  };

  const bossViews = {
    home: <BossHome employees={employees.filter(e => e.active)} scannerState={scannerState} t={t} onNav={setBossPage} />,
    scanner: <BossScanner employees={employees} scannerState={scannerState} setScannerState={setScannerState} onUpdateEmployeePPV={updateEmployeePPV} t={t} company={company} />,
    team: <BossTeam employees={employees} setEmployees={setEmployees} t={t} />,
    factures: <BossFactures t={t} />,
    offres: <EmpCatalogue onOfferClick={o => setSelectedOffer(o)} onAddToCart={addToCart} selectedCat={selectedCat} setSelectedCat={setSelectedCat} t={t} />,
    settings: <Settings dark={dark} setDark={setDark} t={t} />,
  };

  const navItems = isPatron ? bossNav : empNav;
  const activePageId = isPatron ? bossPage : (currentEmpPage === "detail" ? "catalogue" : currentEmpPage === "confirmation" ? "cart" : currentEmpPage);

  const handleNavSelect = (id) => {
    if (isPatron) setBossPage(id);
    else { setEmpPage(id); setSelectedOffer(null); setShowPaymentConfirm(false); }
    setSidebarOpen(false);
  };

  const userInfo = isPatron
    ? { initials: "AO", name: "Alpha Optique", sub: "Dirigeant" }
    : { initials: activeEmployee.initials, name: `${activeEmployee.firstName} ${activeEmployee.lastName}`, sub: "Alpha Optique" };

  return (
    <div style={{ fontFamily: font, background: t.appGrad, minHeight: "100vh", color: t.text }} onClick={() => { showNotifs && setShowNotifs(false); }}>
      <style>{`
        @keyframes pkFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pkPop { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pkRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pkFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes pkDrift { 0% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-20px) scale(1.12); } 100% { transform: translate(0,0) scale(1); } }
        @keyframes pkSlideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        html { -webkit-text-size-adjust: 100%; }
        body { margin: 0; overscroll-behavior: none; }
        input, button, select, textarea { -webkit-appearance: none; appearance: none; font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${t.borderStrong}; border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* ── TOPBAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "10px 14px" : "10px 22px", borderBottom: `1px solid ${t.border}`, background: t.glass, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", position: "sticky", top: 0, zIndex: 200 }}>
        {isMobile ? (
          /* Mobile topbar: hamburger + logo + notifs */
          <>
            <button onClick={e => { e.stopPropagation(); setSidebarOpen(s => !s); }}
              style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: t.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.cardShadowSoft }}>
              <Icon name="menu-2" size={18} color={t.text} />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: t.blueGrad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <span style={{ fontSize: 17, fontWeight: 800, color: t.text, letterSpacing: -0.5 }}>Perky</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!isPatron && (
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowNotifs(s => !s)} style={{ position: "relative", width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: showNotifs ? t.blueLighter : t.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.cardShadowSoft }}>
                    <BellIcon size={17} color={showNotifs ? t.blue : t.textSec} />
                    {unreadCount > 0 && <span style={{ position: "absolute", top: 6, right: 6, minWidth: 14, height: 14, borderRadius: 7, background: t.red, border: `2px solid ${t.card}`, color: "#fff", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>}
                  </button>
                  {showNotifs && (
                    <div style={{ position: "fixed", top: 60, right: 8, left: 8, background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.popShadow, overflow: "hidden", zIndex: 300, animation: "pkPop 0.2s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${t.borderSoft}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Notifications</span>
                          {unreadCount > 0 && <span style={{ background: t.red, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 20 }}>{unreadCount}</span>}
                        </div>
                        {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font, fontWeight: 700 }}>Tout lire</button>}
                      </div>
                      <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        {notifications.map((notif, i) => (
                          <div key={notif.id} onClick={() => setNotifications(p => p.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                            style={{ display: "flex", gap: 10, padding: "12px 18px", borderBottom: i < notifications.length - 1 ? `1px solid ${t.borderSoft}` : "none", background: notif.read ? "transparent" : t.blueLighter + "55", cursor: "pointer" }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: notif.color + "1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon name={notif.icon} size={16} color={notif.color} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: notif.read ? 500 : 700, color: t.text, marginBottom: 2, lineHeight: 1.4 }}>{notif.title}</div>
                              <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.35, marginBottom: 3 }}>{notif.sub}</div>
                              <div style={{ fontSize: 11, color: t.textTert }}>{notif.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button onClick={handleLogout} style={{ width: 38, height: 38, borderRadius: 10, border: `1px solid ${t.border}`, background: t.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: t.cardShadowSoft }}>
                <Icon name="logout" size={16} color={t.textSec} />
              </button>
            </div>
          </>
        ) : (
          /* Desktop topbar */
          <>
            <div style={{ display: "flex", gap: 4, padding: 3, background: t.bgSecondary, borderRadius: 12, border: `1px solid ${t.borderSoft}` }}>
              {[{ id: "employee", icon: "user", label: "Espace salarié" }, { id: "employer", icon: "briefcase", label: "Espace patron" }].map(m => {
                const isActive = isPatron ? m.id === "employer" : m.id === "employee";
                return <button key={m.id} onClick={() => { if (m.id === "employee") setCurrentAccount({ ...currentAccount, role: "employee" }); else setCurrentAccount({ ...currentAccount, role: "patron" }); }}
                  style={{ padding: "7px 15px", borderRadius: 9, border: "none", fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: isActive ? 700 : 500, background: isActive ? t.card : "transparent", color: isActive ? t.blue : t.textSec, display: "flex", alignItems: "center", gap: 7, boxShadow: isActive ? t.cardShadowSoft : "none", transition: "all 0.15s" }}>
                  <Icon name={m.icon} size={14} color={isActive ? t.blue : t.textSec} /> {m.label}
                </button>;
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              {!isPatron && (
                <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowNotifs(s => !s)} style={{ position: "relative", width: 38, height: 38, borderRadius: 11, border: `1px solid ${t.border}`, background: showNotifs ? t.blueLighter : t.card, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", boxShadow: t.cardShadowSoft }}>
                    <BellIcon size={17} color={showNotifs ? t.blue : t.textSec} />
                    {unreadCount > 0 && <span style={{ position: "absolute", top: 6, right: 6, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 8, background: t.red, border: `2px solid ${t.card}`, color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</span>}
                  </button>
                  {showNotifs && (
                    <div style={{ position: "absolute", top: 46, right: 0, width: 384, background: t.card, border: `1px solid ${t.border}`, borderRadius: 18, boxShadow: t.popShadow, overflow: "hidden", zIndex: 300, animation: "pkPop 0.2s ease" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${t.borderSoft}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Notifications</span>
                          {unreadCount > 0 && <span style={{ background: t.red, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>{unreadCount}</span>}
                        </div>
                        {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font, fontWeight: 700 }}>Tout marquer lu</button>}
                      </div>
                      <div style={{ maxHeight: 360, overflowY: "auto" }}>
                        {notifications.map((notif, i) => (
                          <div key={notif.id} onClick={() => setNotifications(p => p.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                            style={{ display: "flex", gap: 12, padding: "14px 20px", borderBottom: i < notifications.length - 1 ? `1px solid ${t.borderSoft}` : "none", background: notif.read ? "transparent" : t.blueLighter + "66", cursor: "pointer", transition: "background 0.12s" }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: notif.color + "1F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon name={notif.icon} size={18} color={notif.color} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: notif.read ? 500 : 700, color: t.text, marginBottom: 2, lineHeight: 1.4 }}>{notif.title}</div>
                              <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.4, marginBottom: 4 }}>{notif.sub}</div>
                              <div style={{ fontSize: 11, color: t.textTert }}>{notif.time}</div>
                            </div>
                            {!notif.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.blue, flexShrink: 0, marginTop: 8 }} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button onClick={handleLogout} style={{ fontSize: 12.5, color: t.textSec, border: `1px solid ${t.border}`, background: t.card, padding: "8px 14px", borderRadius: 11, cursor: "pointer", fontFamily: font, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, boxShadow: t.cardShadowSoft, transition: "color 0.14s" }}
                onMouseEnter={e => e.currentTarget.style.color = t.text}
                onMouseLeave={e => e.currentTarget.style.color = t.textSec}>
                <Icon name="logout" size={14} color={t.textSec} /> Déconnexion
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {isMobile && sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500 }} onClick={() => setSidebarOpen(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)", animation: "pkFade 0.2s ease" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: t.sidebar, boxShadow: t.popShadow, animation: "pkSlideIn 0.25s cubic-bezier(0.4,0,0.2,1)", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <Sidebar items={navItems} active={activePageId} onSelect={handleNavSelect} user={userInfo} role={isPatron ? "Espace dirigeant" : "Espace salarié"} t={t} cartCount={cart.length} />
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div style={{ display: "flex" }}>
        {/* Desktop sidebar */}
        {!isMobile && (
          <Sidebar items={navItems} active={activePageId} onSelect={handleNavSelect} user={userInfo} role={isPatron ? "Espace dirigeant" : "Espace salarié"} t={t} cartCount={cart.length} />
        )}

        {/* Page content */}
        <div style={{ flex: 1, padding: isMobile ? "20px 16px 90px" : "32px 40px", overflowY: "auto", minHeight: isMobile ? "calc(100vh - 59px)" : "calc(100vh - 59px)", overflowX: "hidden" }}>
          {isPatron ? (bossViews[bossPage] || bossViews.home) : empViews[currentEmpPage]}
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      {isMobile && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200, background: t.sidebar, borderTop: `1px solid ${t.border}`, display: "flex", paddingBottom: "env(safe-area-inset-bottom)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
          {navItems.slice(0, 5).map(it => {
            const isActive = activePageId === it.id;
            const count = it.id === "cart" ? cart.length : 0;
            return (
              <button key={it.id} onClick={() => handleNavSelect(it.id)}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 4px 10px", border: "none", background: "transparent", cursor: "pointer", fontFamily: font, color: isActive ? t.blue : t.textTert, fontSize: 10, fontWeight: isActive ? 700 : 500, position: "relative" }}>
                <div style={{ position: "relative" }}>
                  <Icon name={it.icon} size={22} color={isActive ? t.blue : t.textTert} />
                  {count > 0 && <span style={{ position: "absolute", top: -4, right: -6, minWidth: 14, height: 14, borderRadius: 7, background: t.red, color: "#fff", fontSize: 8, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{count}</span>}
                </div>
                <span style={{ maxWidth: 56, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.2 }}>{it.label}</span>
                {isActive && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 28, height: 3, borderRadius: "0 0 4px 4px", background: t.blueGrad }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
