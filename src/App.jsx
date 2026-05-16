import { useState, useEffect, useCallback } from "react";

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
function Badge({ text, variant = "blue", t }) {
  const c = { blue: [t.blueLighter, t.blue], green: [t.greenLight, t.green], amber: [t.amberLight, t.amber], red: [t.redLight, t.red] }[variant] || [t.blueLighter, t.blue];
  return <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 10, background: c[0], color: c[1] }}>{text}</span>;
}
function Bar({ pct, color, h = 4 }) {
  return <div style={{ width: "100%", height: h, background: "#33333322", borderRadius: h / 2, overflow: "hidden" }}>
    <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: color, borderRadius: h / 2, transition: "width 0.5s ease" }} /></div>;
}
function Tooltip({ text, t }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ width: 18, height: 18, borderRadius: "50%", background: t.bgSecondary, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "help", flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: t.textSec }}>i</span>
      </div>
      {show && (
        <div style={{ position: "absolute", left: 24, top: -6, width: 280, background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: t.textSec, lineHeight: 1.6, zIndex: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
          {text}
        </div>
      )}
    </div>
  );
}
function Inp({ label, value, onChange, type = "text", placeholder, t, hint }) {
  return <div style={{ marginBottom: 14 }}>
    <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSec, marginBottom: 4 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", padding: "11px 14px", border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 14, fontFamily: font, outline: "none", background: t.bgSecondary, color: t.text, boxSizing: "border-box" }} />
    {hint && <div style={{ fontSize: 11, color: t.textSec, marginTop: 4 }}>{hint}</div>}
  </div>;
}
function Btn({ children, onClick, variant = "primary", disabled, t, full }) {
  const bg = variant === "primary" ? t.blue : variant === "danger" ? t.red : "transparent";
  const color = variant === "ghost" ? t.textSec : "#fff";
  const border = variant === "ghost" ? `1px solid ${t.border}` : "none";
  return <button onClick={onClick} disabled={disabled} style={{ width: full ? "100%" : "auto", padding: "11px 20px", borderRadius: 10, border, background: disabled ? t.border : bg, color: disabled ? t.textSec : color, fontSize: 14, fontWeight: 500, cursor: disabled ? "default" : "pointer", fontFamily: font, transition: "all 0.15s" }}>{children}</button>;
}
function Modal({ open, onClose, title, children, t }) {
  if (!open) return null;
  return <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
    <div style={{ background: t.card, borderRadius: 16, padding: "24px", width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 500, color: t.text, margin: 0 }}>{title}</h2>
        <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer", color: t.textSec, fontSize: 22, lineHeight: 1 }}>×</button>
      </div>
      {children}
    </div>
  </div>;
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────
function LoginPage({ onLogin, t }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    const acc = ACCOUNTS.find(a => a.email === email && a.password === password);
    if (!acc) { setError("Email ou mot de passe incorrect."); return; }
    setError("");
    onLogin(acc);
  };

  const hints = [
    { role: "Patron", email: "patron@alphaoptique.fr", pass: "perky2026" },
    { role: "Salarié", email: "benjamin@alphaoptique.fr", pass: "perky2026" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.bg }}>
      {/* LEFT — image */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#0C2340" }}>
        <img src={IMG.login} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
        <div style={{ position: "relative", zIndex: 1, padding: "48px", maxWidth: 480 }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", letterSpacing: -1, marginBottom: 16 }}>Perky</div>
          <div style={{ fontSize: 24, fontWeight: 500, color: "#fff", lineHeight: 1.4, marginBottom: 16 }}>
            Les avantages des grands groupes, enfin accessibles aux TPE.
          </div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
            PPV, chèques vacances, titres-restaurant, réductions exclusives — tout en un seul endroit.
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
            {["5€ / salarié / mois", "Résiliable à tout moment", "100% conforme URSSAF"].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div style={{ width: 440, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 48px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ fontSize: 24, fontWeight: 500, color: t.text, marginBottom: 6 }}>Connexion</div>
          <div style={{ fontSize: 14, color: t.textSec, marginBottom: 32 }}>Accédez à votre espace Perky</div>

          <Inp label="Adresse email" value={email} onChange={setEmail} type="email" placeholder="vous@entreprise.fr" t={t} />

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: t.textSec, marginBottom: 4 }}>Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={{ width: "100%", padding: "11px 40px 11px 14px", border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 14, fontFamily: font, outline: "none", background: t.bgSecondary, color: t.text, boxSizing: "border-box" }} />
              <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: 12, top: 11, border: "none", background: "none", cursor: "pointer", color: t.textSec }}>
                <Icon name={showPass ? "eye-off" : "eye"} size={18} color={t.textSec} />
              </button>
            </div>
          </div>

          {error && <div style={{ background: t.redLight, color: t.red, padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <button onClick={handleLogin} disabled={!email || !password} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: !email || !password ? t.border : t.blue, color: !email || !password ? t.textSec : "#fff", fontSize: 15, fontWeight: 500, cursor: !email || !password ? "default" : "pointer", fontFamily: font, marginBottom: 16 }}>
            Se connecter
          </button>

          <div style={{ textAlign: "center", fontSize: 13, color: t.textSec, marginBottom: 32 }}>
            <span style={{ color: t.blue, cursor: "pointer" }}>Mot de passe oublié ?</span>
          </div>

          {/* DEMO HINTS */}
          <div style={{ background: t.bgSecondary, borderRadius: 12, padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 500, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>Comptes de démonstration</div>
            {hints.map((h, i) => (
              <button key={i} onClick={() => { setEmail(h.email); setPassword(h.pass); setError(""); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 12px", marginBottom: i < hints.length - 1 ? 6 : 0, borderRadius: 8, border: `1px solid ${t.border}`, background: t.card, cursor: "pointer", fontFamily: font, transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{h.role}</div>
                  <div style={{ fontSize: 11, color: t.textSec }}>{h.email}</div>
                </div>
                <Icon name="arrow-right" size={14} color={t.textSec} />
              </button>
            ))}
          </div>
        </div>
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
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 440, padding: "48px" }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: t.blue, marginBottom: 32 }}>Perky</div>
        <div style={{ background: t.greenLight, borderRadius: 12, padding: "16px 18px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Icon name="mail-check" size={20} color={t.green} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.green, marginBottom: 2 }}>Invitation reçue</div>
            <div style={{ fontSize: 13, color: t.green, opacity: 0.8 }}>Alpha Optique vous a invité à rejoindre Perky</div>
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 6 }}>Bienvenue, Benjamin 👋</div>
        <div style={{ fontSize: 14, color: t.textSec, marginBottom: 28, lineHeight: 1.6 }}>
          Votre employeur vous offre accès à la plateforme d'avantages Perky. Créez votre mot de passe pour activer votre compte.
        </div>
        <Inp label="Mot de passe (6 caractères min.)" value={password} onChange={setPassword} type="password" placeholder="••••••••" t={t} />
        <Inp label="Confirmer le mot de passe" value={confirm} onChange={setConfirm} type="password" placeholder="••••••••" t={t}
          hint={confirm.length > 0 && !match ? "Les mots de passe ne correspondent pas." : ""} />
        <button onClick={() => setStep(2)} disabled={!match} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: match ? t.blue : t.border, color: match ? "#fff" : t.textSec, fontSize: 15, fontWeight: 500, cursor: match ? "pointer" : "default", fontFamily: font }}>
          Activer mon compte
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 440, padding: "48px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: t.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="check" size={32} color={t.green} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 500, color: t.text, marginBottom: 8 }}>Compte activé !</div>
        <div style={{ fontSize: 14, color: t.textSec, lineHeight: 1.6, marginBottom: 32 }}>
          Votre compte Perky est prêt. Vous avez accès au catalogue d'avantages et aux informations partagées par votre employeur.
        </div>
        <div style={{ background: t.bgSecondary, borderRadius: 12, padding: "16px 20px", marginBottom: 28, textAlign: "left" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 12 }}>Ce qui vous attend</div>
          {[
            { icon: "gift", text: "Les avantages activés par Alpha Optique" },
            { icon: "tag", text: "+2 000 offres en billetterie et réductions" },
            { icon: "wallet", text: "Votre wallet pour stocker vos billets" },
          ].map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={it.icon} size={14} color={t.blue} />
              </div>
              <span style={{ fontSize: 13, color: t.textSec }}>{it.text}</span>
            </div>
          ))}
        </div>
        <button onClick={onComplete} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: font }}>
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
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px" }}>
      <div style={{ width: 580, maxWidth: "100%" }}>
        {/* STEPS */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: t.blue, marginRight: 32 }}>Perky</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, background: i + 1 <= step ? t.blue : t.bgSecondary, color: i + 1 <= step ? "#fff" : t.textSec, border: i + 1 === step ? `2px solid ${t.blue}` : "none", transition: "all 0.3s" }}>
                  {i + 1 < step ? <Icon name="check" size={14} color="#fff" /> : i + 1}
                </div>
                <span style={{ fontSize: 13, color: i + 1 === step ? t.text : t.textSec, fontWeight: i + 1 === step ? 500 : 400 }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ width: 40, height: 1, background: t.border, margin: "0 12px" }} />}
            </div>
          ))}
        </div>

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
            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
              {invites.map((inv, i) => (
                <div key={inv.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < invites.length - 1 ? `1px solid ${t.border}` : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: t.blue, flexShrink: 0 }}>
                    {(inv.firstName[0] + (inv.lastName?.[0] || "")).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{inv.firstName} {inv.lastName}</div>
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

            <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Entreprise</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>{company.name}</div>
                  <div style={{ fontSize: 13, color: t.textSec }}>{company.sector}</div>
                </div>
                <button onClick={() => setStep(1)} style={{ fontSize: 12, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Modifier</button>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Équipe</div>
                  <div style={{ fontSize: 15, fontWeight: 500, color: t.text }}>{invites.length} salarié{invites.length > 1 ? "s" : ""} à inviter</div>
                  <div style={{ fontSize: 13, color: t.textSec }}>{invites.map(i => i.firstName).join(", ")}</div>
                </div>
                <button onClick={() => setStep(2)} style={{ fontSize: 12, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Modifier</button>
              </div>
            </div>

            {/* PRICING */}
            <div style={{ background: t.bgSecondary, borderRadius: 14, padding: "20px", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 14 }}>Détail de la facturation</div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: t.textSec, marginBottom: 8 }}>
                <span>Frais d'implantation (une fois)</span>
                <span style={{ fontWeight: 500, color: t.text }}>{SETUP} €</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: t.textSec, marginBottom: 8 }}>
                <span>{invites.length} salarié{invites.length > 1 ? "s" : ""} × 5€/mois</span>
                <span style={{ fontWeight: 500, color: t.text }}>{monthly} €/mois</span>
              </div>
              <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Total aujourd'hui</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: t.blue }}>{SETUP + monthly} € HT</span>
              </div>
              <div style={{ fontSize: 11, color: t.textSec, marginTop: 6 }}>puis {monthly}€/mois — résiliable à tout moment</div>
            </div>

            <div style={{ background: t.greenLight, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: t.green, lineHeight: 1.5, marginBottom: 24, display: "flex", gap: 8 }}>
              <Icon name="shield-check" size={16} color={t.green} />
              Solution 100% conforme URSSAF. Les invitations seront envoyées immédiatement après activation.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={() => setStep(2)} variant="ghost" t={t}>← Retour</Btn>
              <button onClick={() => onComplete({ name: company.name, sector: company.sector, siret: company.siret })} style={{ flex: 1, padding: "13px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: font }}>
                Activer Perky — {SETUP + monthly}€
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{user.name}</div>
        <div style={{ fontSize: 11, color: t.textSec }}>{user.sub}</div>
      </div>
    </div>
  </div>;
}

// ─── BOSS SCANNER ─────────────────────────────────────────────────────
function BossScanner({ employees, scannerState, setScannerState, onUpdateEmployeePPV, t, company }) {
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{item.title}</span>
                <Tooltip text={INFO_TEXTS[item.id]} t={t} />
              </div>
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
          <span style={{ fontSize: 11, color: t.textSec, fontFamily: "monospace", background: t.bgSecondary, padding: "3px 10px", borderRadius: 6, display: "inline-block", marginBottom: 12 }}>{item.loi}</span>

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
                  <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>Montants déjà versés cette année par salarié</div>
                  {activeEmp.map(emp => {
                    const already = s.ppv_already?.[emp.id] || 0;
                    const reliquat = Math.max(0, 3000 - already);
                    return (
                      <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 12, background: t.bgSecondary, borderRadius: 10, padding: "10px 14px", marginBottom: 6 }}>
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.amberLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: t.amber, flexShrink: 0 }}>{emp.initials}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{emp.firstName} {emp.lastName}</div>
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

              <div style={{ fontSize: 13, fontWeight: 500, color: t.text, marginBottom: 10 }}>
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
                        <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{emp.firstName} {emp.lastName}</div>
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
                    <div style={{ display: "grid", gridTemplateColumns: isComplement ? "1fr 1fr 1fr" : "1fr 1fr", gap: 12 }}>
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
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Montant facial du billet</span>
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
                  <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>Part prise en charge par l'entreprise</span>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
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
                <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{item.id === "navigo" ? `${sv.pct}% remboursés` : `${fmt(sv.amount || 0)}€/salarié`}</span>
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
    <div style={{ background: t.bgSecondary, borderRadius: 12, padding: "12px 16px", fontSize: 12, color: t.textSec, lineHeight: 1.6, borderLeft: `3px solid ${t.blue}`, marginTop: 4 }}>
      ⚠️ Estimations indicatives basées sur les plafonds légaux 2026. Valider avec votre expert-comptable.
    </div>
  </div>;
}

// ─── BOSS HOME ────────────────────────────────────────────────────────
function BossHome({ employees, scannerState, t, onNav }) {
  const active = employees.filter(e => e.active);
  const n = active.length;
  const s = scannerState;
  const totalPPV = active.reduce((sum, e) => sum + (e.ppv || 0), 0);
  const totalNavigo = Math.round(((s.navigo.pct - 50) / 100) * 86.40 * 12 * n);
  const totalCadeaux = s.cadeaux.amount * n;
  const totalVacances = s.vacances.amount * n;
  const grandTotal = totalPPV + totalNavigo + totalCadeaux + totalVacances;
  const globalPct = Math.round([totalPPV > 0, totalNavigo > 0, totalCadeaux > 0, totalVacances > 0].filter(Boolean).length / 4 * 100);

  return <div>
    <div style={{ marginBottom: 20 }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 4px" }}>Tableau de bord</h1>
      <p style={{ fontSize: 14, color: t.textSec, margin: 0 }}>Alpha Optique — {n} bénéficiaire{n > 1 ? "s" : ""}</p>
    </div>
    <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, position: "relative", height: 180 }}>
      <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(24,95,165,0.92) 0%, rgba(12,68,124,0.88) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Pouvoir d'achat récupérable</div>
          <div style={{ fontSize: 36, fontWeight: 600, margin: "4px 0" }}>{fmt(grandTotal)} €</div>
          <div style={{ fontSize: 13, opacity: 0.7 }}>~{fmt(Math.round(grandTotal / Math.max(n, 1)))}€ par salarié/an</div>
        </div>
        <div style={{ textAlign: "right", color: "#fff" }}>
          <div style={{ fontSize: 40, fontWeight: 600 }}>{globalPct}%</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>optimisé</div>
          <Bar pct={globalPct} color="rgba(255,255,255,0.4)" h={4} />
        </div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
      {[{ icon: "users", v: `${n}`, l: "Salariés actifs", c: t.blue }, { icon: "chart-bar", v: "67%", l: "Utilisent Perky", c: t.green }, { icon: "coin", v: `${fmt(grandTotal)}€`, l: "Avantages configurés", c: t.amber }].map((s2, i) => (
        <div key={i} style={{ flex: 1, background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}><Icon name={s2.icon} size={16} color={s2.c} /><span style={{ fontSize: 12, color: t.textSec }}>{s2.l}</span></div>
          <div style={{ fontSize: 22, fontWeight: 500, color: t.text }}>{s2.v}</div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: t.text, display: "flex", alignItems: "center", gap: 8 }}><Icon name="chart-bar" size={18} color={t.blue} /> Aperçu du scanner</div>
      <button onClick={() => onNav("scanner")} style={{ fontSize: 13, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Tout configurer →</button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {[
        { title: "PPV 2026", val: `${fmt(totalPPV)}€`, pct: Math.round((totalPPV / (3000 * n)) * 100), c: t.blue, badge: totalPPV > 0 ? "blue" : "amber", status: totalPPV > 0 ? "Configuré" : "À activer" },
        { title: "Navigo", val: `${s.navigo.pct}%`, pct: Math.round(((s.navigo.pct - 50) / 25) * 100), c: t.amber, badge: s.navigo.pct > 50 ? "blue" : "amber", status: s.navigo.pct > 50 ? "Optimisé" : "Optimiser → 75%" },
        { title: "Chèques cadeaux", val: totalCadeaux > 0 ? `${fmt(totalCadeaux)}€` : "—", pct: Math.round((s.cadeaux.amount / 193) * 100), c: t.amber, badge: s.cadeaux.amount > 0 ? "blue" : "amber", status: s.cadeaux.amount > 0 ? "Configuré" : "À activer" },
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

// ─── BOSS TEAM ────────────────────────────────────────────────────────
function BossTeam({ employees, setEmployees, t }) {
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", role: "", seniority: 0 });
  const active = employees.filter(e => e.active);
  const emp = showDetail ? employees.find(e => e.id === showDetail) : null;

  const addEmp = () => {
    if (!form.firstName || !form.email) return;
    const initials = (form.firstName[0] + (form.lastName?.[0] || "")).toUpperCase();
    setEmployees(p => [...p, { ...form, id: Date.now(), initials, seniority: parseInt(form.seniority) || 0, ppv: 0, active: true }]);
    setForm({ firstName: "", lastName: "", email: "", phone: "", role: "", seniority: 0 });
    setShowAdd(false);
  };

  const updateEmp = (id, field, val) => setEmployees(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));
  const removeEmp = (id) => { setEmployees(p => p.map(e => e.id === id ? { ...e, active: false } : e)); setShowConfirm(null); setShowDetail(null); };

  return <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: 0 }}>Équipe</h1>
      <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: t.blue, color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="plus" size={16} color="#fff" /> Ajouter
      </button>
    </div>
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "10px 18px", background: t.bgSecondary, fontSize: 12, color: t.textSec, fontWeight: 500, borderBottom: `1px solid ${t.border}` }}>
        <span>Salarié</span><span>Ancienneté</span><span>Statut</span><span>Abonnement</span><span></span>
      </div>
      {active.length === 0 && <div style={{ padding: "32px", textAlign: "center", color: t.textSec }}>Aucun salarié actif.</div>}
      {active.map((emp, i) => <div key={emp.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "14px 18px", alignItems: "center", borderBottom: i < active.length - 1 ? `1px solid ${t.border}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.blueLighter, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: t.blue }}>{emp.initials}</div>
          <div><div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{emp.firstName} {emp.lastName}</div><div style={{ fontSize: 12, color: t.textSec }}>{emp.role || "—"}</div></div>
        </div>
        <span style={{ fontSize: 13, color: t.textSec }}>{emp.seniority} mois</span>
        <Badge text="Actif" variant="green" t={t} />
        <span style={{ fontSize: 12, color: t.textSec }}>5€/mois</span>
        <button onClick={() => setShowDetail(emp.id)} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${t.border}`, background: "none", fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec }}>Gérer</button>
      </div>)}
    </div>
    <div style={{ marginTop: 10, padding: "12px 16px", background: t.bgSecondary, borderRadius: 10, display: "flex", justifyContent: "space-between", fontSize: 13, color: t.textSec }}>
      <span>{active.length} salarié{active.length > 1 ? "s" : ""} × 5€ = <span style={{ color: t.text, fontWeight: 500 }}>{active.length * 5}€/mois</span></span>
      <span>Prochaine facture : 01/06/2026</span>
    </div>

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

    {emp && <Modal open={!!showDetail} onClose={() => setShowDetail(null)} title={`${emp.firstName} ${emp.lastName}`} t={t}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Inp label="Prénom" value={emp.firstName} onChange={v => updateEmp(emp.id, "firstName", v)} t={t} />
        <Inp label="Nom" value={emp.lastName} onChange={v => updateEmp(emp.id, "lastName", v)} t={t} />
      </div>
      <Inp label="Email" type="email" value={emp.email} onChange={v => updateEmp(emp.id, "email", v)} t={t} />
      <Inp label="Téléphone" value={emp.phone || ""} onChange={v => updateEmp(emp.id, "phone", v)} t={t} />
      <Inp label="Poste / Contrat" value={emp.role || ""} onChange={v => updateEmp(emp.id, "role", v)} t={t} />
      <Inp label="Ancienneté (mois)" type="number" value={emp.seniority || 0} onChange={v => updateEmp(emp.id, "seniority", parseInt(v))} t={t} />
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button onClick={() => setShowConfirm(emp.id)} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${t.redLight}`, background: t.redLight, color: t.red, cursor: "pointer", fontFamily: font, fontSize: 14 }}>Retirer</button>
        <Btn onClick={() => setShowDetail(null)} t={t} full>Enregistrer</Btn>
      </div>
    </Modal>}

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
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 16px" }}>Factures</h1>
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px", padding: "10px 18px", background: t.bgSecondary, fontSize: 12, color: t.textSec, fontWeight: 500, borderBottom: `1px solid ${t.border}` }}>
        <span>Période</span><span>Montant</span><span>Salariés</span><span>Statut</span><span></span>
      </div>
      {[{ p: "Mai 2026", a: "15,00€", c: "3", s: "En cours" }, { p: "Avril 2026", a: "15,00€", c: "3", s: "Payée" }, { p: "Setup initial", a: "150,00€", c: "—", s: "Payée" }].map((f, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px", padding: "12px 18px", alignItems: "center", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 13, color: t.text }}>{f.p}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{f.a}</span>
        <span style={{ fontSize: 13, color: t.textSec }}>{f.c}</span>
        <Badge text={f.s} variant={f.s === "Payée" ? "green" : "blue"} t={t} />
        <button style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${t.border}`, background: "none", fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec }}>PDF</button>
      </div>)}
    </div>
  </div>;
}

// ─── EMPLOYEE HOME ────────────────────────────────────────────────────
function EmpHome({ employee, scannerState, t, onGoToCatalogue }) {
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

  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 4px" }}>Bonjour {employee.firstName}</h1>
    <p style={{ fontSize: 14, color: t.textSec, margin: "0 0 20px" }}>Bienvenue sur votre espace avantages — Alpha Optique</p>
    <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 20, position: "relative", height: 190 }}>
      <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(24,95,165,0.92) 0%, rgba(12,68,124,0.88) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
        <div style={{ color: "#fff" }}>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Votre entreprise fait partie des</div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>Top 12% des TPE</div>
          <div style={{ fontSize: 14, opacity: 0.8, marginTop: 6 }}>en matière d'avantages salariés</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "18px 24px", textAlign: "center", color: "#fff" }}>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{fmt(totalPerks)} €</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>d'avantages actifs / an</div>
        </div>
      </div>
    </div>

    {totalPerks > 0 && <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 4 }}>Votre rémunération globale</div>
      <div style={{ fontSize: 13, color: t.textSec, marginBottom: 16 }}>Ce que votre employeur vous apporte au-delà de votre salaire net</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1.2, background: t.bgSecondary, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: t.textSec, marginBottom: 6 }}>Votre salaire</div>
          <div style={{ fontSize: 20, letterSpacing: 4, color: t.textTert }}>●●●●</div>
          <div style={{ fontSize: 11, color: t.textTert, marginTop: 6 }}>Connu de vous</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 18, color: t.textTert }}>+</div>
        <div style={{ flex: 1, background: t.greenLight, borderRadius: 10, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.green}22` }}>
          <div style={{ fontSize: 11, color: t.green, marginBottom: 4 }}>En espèces</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: t.green }}>{fmt(cashPerks)} €</div>
          <div style={{ fontSize: 11, color: t.green, opacity: 0.8, marginTop: 4 }}>PPV + chèques</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: 18, color: t.textTert }}>+</div>
        <div style={{ flex: 1, background: t.blueLighter, borderRadius: 10, padding: "14px 16px", textAlign: "center", border: `1px solid ${t.blue}22` }}>
          <div style={{ fontSize: 11, color: t.blue, marginBottom: 4 }}>En nature</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: t.blue }}>{fmt(naturePerks)} €</div>
          <div style={{ fontSize: 11, color: t.blue, opacity: 0.8, marginTop: 4 }}>Transport + resto</div>
        </div>
      </div>
      <div style={{ background: t.bgSecondary, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: t.textSec }}>Total avantages offerts par votre employeur</span>
        <span style={{ fontSize: 18, fontWeight: 600, color: t.text }}>{fmt(totalPerks)} €/an</span>
      </div>
    </div>}

    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 500, color: t.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon name="gift" size={18} color={t.blue} /> Ce que Alpha Optique vous offre</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          ppv > 0 && { title: "PPV 2026", sub: ppvAlready > 0 ? `${fmt(ppv)}€ au total (${fmt(ppvAlready)}€ + ${fmt(ppvNew)}€)` : `${fmt(ppv)}€ nets versés`, icon: "coin", type: "cash" },
          navigoExtra > 0 && { title: `Transport ${scannerState.navigo.pct}%`, sub: `+${fmt(navigoExtra)}€/an`, icon: "bus", type: "nature" },
          scannerState.resto.amount > 0 && { title: "Titres-restaurant", sub: `${scannerState.resto.amount}€/jour`, icon: "tools-kitchen-2", type: "nature" },
        ].filter(Boolean).map((it, i) => {
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

    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: t.text, display: "flex", alignItems: "center", gap: 8 }}><Icon name="flame" size={18} color={t.amber} /> Offres du moment</div>
        <button onClick={onGoToCatalogue} style={{ fontSize: 13, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Voir tout →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        {OFFERS.slice(0, 4).map(o => <div key={o.id} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
          <img src={o.img} alt="" style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }} />
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

// ─── EMP CATALOGUE ────────────────────────────────────────────────────
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
        <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.06)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
        <div onClick={() => onOfferClick(o)} style={{ position: "relative" }}>
          <img src={o.img} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
          <span style={{ position: "absolute", top: 10, right: 10, background: t.blue, color: "#fff", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 8 }}>{o.discount}</span>
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <div onClick={() => onOfferClick(o)}>
            <div style={{ fontSize: 11, color: t.textSec, marginBottom: 2 }}>{o.cat}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 6 }}>{o.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: o.price > 0 ? 10 : 0 }}>
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

// ─── OFFER DETAIL ─────────────────────────────────────────────────────
function OfferDetail({ offer, onBack, onAddToCart, t }) {
  return <div>
    <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: t.blue, fontFamily: font, marginBottom: 16 }}>
      <Icon name="arrow-left" size={16} color={t.blue} /> Retour
    </button>
    <div style={{ display: "flex", gap: 28 }}>
      <div style={{ flex: 1 }}><img src={offer.img} alt="" style={{ width: "100%", height: 300, objectFit: "cover", borderRadius: 14 }} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, color: t.textSec, marginBottom: 4 }}>{offer.cat}</div>
        <h1 style={{ fontSize: 24, fontWeight: 500, color: t.text, margin: "0 0 10px" }}>{offer.name}</h1>
        <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 20 }}>
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
            ? <button onClick={() => onAddToCart(offer)} style={{ flex: 1, padding: "13px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: font }}>Ajouter au panier</button>
            : <button style={{ flex: 1, padding: "13px", borderRadius: 10, border: "none", background: t.greenLight, color: t.green, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: font }}>Accéder à l'offre</button>}
          <button style={{ padding: "13px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.card, cursor: "pointer" }}><Icon name="heart" size={18} color={t.textSec} /></button>
        </div>
      </div>
    </div>
  </div>;
}

// ─── CART ─────────────────────────────────────────────────────────────
function PaymentConfirm({ orders, onGoToWallet, onGoToCatalogue, t }) {
  const total = orders.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const orderNum = orders[0]?.orderNum || "000000";
  const email = "benjamin@alphaoptique.fr";
  return (
    <div style={{ maxWidth: 540, margin: "60px auto 0", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: t.greenLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
        <Icon name="circle-check" size={40} color={t.green} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 500, color: t.text, margin: "0 0 8px" }}>Paiement confirmé !</h1>
      <div style={{ fontSize: 14, color: t.textSec, marginBottom: 28 }}>Commande #{orderNum} — {total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</div>

      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, padding: "20px 24px", marginBottom: 16, textAlign: "left" }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: t.text, marginBottom: 14 }}>Vos billets</div>
        {orders.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < orders.length - 1 ? 12 : 0 }}>
            <img src={item.img} alt="" style={{ width: 52, height: 38, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{item.name}</div>
              <div style={{ fontSize: 12, color: t.textSec }}>{item.cat}</div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, color: t.green }}>✓ Ajouté au wallet</span>
          </div>
        ))}
      </div>

      <div style={{ background: t.blueLighter, borderRadius: 14, padding: "16px 20px", marginBottom: 24, textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: t.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon name="mail" size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.blue, marginBottom: 4 }}>Un email de confirmation vous a été envoyé</div>
            <div style={{ fontSize: 13, color: t.blue, opacity: 0.8 }}>Vos billets sont également disponibles à l'adresse <strong>{email}</strong>. Retrouvez-les à tout moment dans votre wallet Perky.</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onGoToCatalogue} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${t.border}`, background: "none", color: t.textSec, fontSize: 14, cursor: "pointer", fontFamily: font }}>
          Continuer mes achats
        </button>
        <button onClick={onGoToWallet} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="wallet" size={16} color="#fff" /> Voir mon wallet
        </button>
      </div>
    </div>
  );
}

function CartPage({ cart, onRemove, onPay, t }) {
  const total = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  if (!cart.length) return <div style={{ textAlign: "center", padding: "80px 0" }}>
    <Icon name="shopping-cart" size={48} color={t.textTert} />
    <div style={{ fontSize: 18, fontWeight: 500, color: t.text, marginTop: 16, marginBottom: 8 }}>Panier vide</div>
    <div style={{ fontSize: 14, color: t.textSec }}>Parcourez le catalogue pour ajouter des offres</div>
  </div>;
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 20px" }}>Mon panier</h1>
    <div style={{ display: "flex", gap: 24 }}>
      <div style={{ flex: 1 }}>
        {cart.map((item, i) => <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 10, display: "flex", alignItems: "center", gap: 16 }}>
          <img src={item.img} alt="" style={{ width: 68, height: 50, borderRadius: 8, objectFit: "cover" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: t.text }}>{item.name}</div>
            <div style={{ fontSize: 12, color: t.textSec }}>{item.cat}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: t.blue }}>{item.display}</span>
            <button onClick={() => onRemove(item.id)} style={{ border: "none", background: "none", cursor: "pointer" }}><Icon name="trash" size={16} color={t.textSec} /></button>
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
          <button onClick={onPay} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: t.blue, color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: font }}>
            Procéder au paiement
          </button>
          <div style={{ fontSize: 11, color: t.textSec, textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
            Billets envoyés dans votre wallet et par email
          </div>
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
    {[{ name: "2x Places UGC", date: "Valable jusqu'au 30/06/2026", img: IMG.ugc }, { name: "Disneyland — 28/05", date: "Billet pour 2 personnes", img: IMG.disney }].map((it, i) => <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img src={it.img} alt="" style={{ width: 54, height: 40, borderRadius: 8, objectFit: "cover" }} />
        <div><div style={{ fontSize: 13, fontWeight: 500, color: t.text }}>{it.name}</div><div style={{ fontSize: 12, color: t.textSec }}>{it.date}</div></div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge text="Actif" variant="green" t={t} />
        <button style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: "none", fontSize: 12, cursor: "pointer", fontFamily: font, color: t.textSec }}>Renvoyer</button>
      </div>
    </div>)}
  </div>;
}

// ─── SETTINGS ────────────────────────────────────────────────────────
function Settings({ dark, setDark, t }) {
  return <div>
    <h1 style={{ fontSize: 22, fontWeight: 500, color: t.text, margin: "0 0 20px" }}>Paramètres</h1>
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: t.textSec, textTransform: "uppercase", letterSpacing: 0.5 }}>Apparence</div>
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

// ─── NAV CONFIGS ─────────────────────────────────────────────────────
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

  if (authState === "login") return <LoginPage onLogin={handleLogin} t={t} />;
  if (authState === "emp-activation") return <EmployeeActivation onComplete={() => setAuthState("app")} t={t} />;
  if (authState === "boss-onboarding") return <PatronOnboarding onComplete={(co) => { if (co) setCompany(co); setAuthState("app"); }} t={t} />;

  const isPatron = currentAccount?.role === "patron";

  const empViews = {
    home: <EmpHome employee={activeEmployee} scannerState={scannerState} t={t} onGoToCatalogue={() => setEmpPage("catalogue")} />,
    catalogue: <EmpCatalogue onOfferClick={o => { setSelectedOffer(o); setEmpPage("detail"); }} onAddToCart={addToCart} selectedCat={selectedCat} setSelectedCat={setSelectedCat} t={t} />,
    detail: selectedOffer ? <OfferDetail offer={selectedOffer} onBack={() => { setSelectedOffer(null); setEmpPage("catalogue"); }} onAddToCart={addToCart} t={t} /> : null,
    cart: <CartPage cart={cart} onRemove={id => setCart(p => p.filter(i => i.id !== id))} onPay={handlePayment} t={t} />,
    confirmation: <PaymentConfirm orders={paidOrders} onGoToWallet={() => { setShowPaymentConfirm(false); setEmpPage("wallet"); }} onGoToCatalogue={() => { setShowPaymentConfirm(false); setEmpPage("catalogue"); }} t={t} />,
    wallet: <EmpWallet t={t} />,
    settings: <Settings dark={dark} setDark={setDark} t={t} />,
  };

  const bossViews = {
    home: <BossHome employees={employees} scannerState={scannerState} t={t} onNav={setBossPage} />,
    scanner: <BossScanner employees={employees} scannerState={scannerState} setScannerState={setScannerState} onUpdateEmployeePPV={updateEmployeePPV} t={t} company={company} />,
    team: <BossTeam employees={employees} setEmployees={setEmployees} t={t} />,
    factures: <BossFactures t={t} />,
    offres: <EmpCatalogue onOfferClick={o => { setSelectedOffer(o); }} onAddToCart={addToCart} selectedCat={selectedCat} setSelectedCat={setSelectedCat} t={t} />,
    settings: <Settings dark={dark} setDark={setDark} t={t} />,
  };

  return (
    <div style={{ fontFamily: font, background: t.bg, minHeight: "100vh", color: t.text }} onClick={() => showNotifs && setShowNotifs(false)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px", borderBottom: `1px solid ${t.border}`, background: t.sidebar, position: "relative", zIndex: 200 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ id: "employee", icon: "user", label: "Espace salarié" }, { id: "employer", icon: "briefcase", label: "Espace patron" }].map(m => {
            const active = isPatron ? m.id === "employer" : m.id === "employee";
            return <button key={m.id} onClick={() => { if (m.id === "employee") setCurrentAccount({ ...currentAccount, role: "employee" }); else setCurrentAccount({ ...currentAccount, role: "patron" }); }}
              style={{ padding: "7px 16px", borderRadius: 8, border: active ? "none" : `1px solid ${t.border}`, fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500, background: active ? t.blue : "transparent", color: active ? "#fff" : t.textSec, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name={m.icon} size={14} color={active ? "#fff" : t.textSec} /> {m.label}
            </button>;
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Cloche notifs — espace salarié uniquement */}
          {!isPatron && (
            <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowNotifs(s => !s)} style={{ position: "relative", width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: showNotifs ? t.blueLighter : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="bell" size={18} color={showNotifs ? t.blue : t.textSec} />
                {unreadCount > 0 && <span style={{ position: "absolute", top: 7, right: 7, width: 8, height: 8, borderRadius: "50%", background: t.red, border: `2px solid ${t.sidebar}` }} />}
              </button>
              {showNotifs && (
                <div style={{ position: "absolute", top: 44, right: 0, width: 360, background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", overflow: "hidden", zIndex: 300 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 500, color: t.text }}>Notifications</span>
                      {unreadCount > 0 && <span style={{ background: t.red, color: "#fff", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>{unreadCount}</span>}
                    </div>
                    {unreadCount > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: t.blue, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Tout marquer lu</button>}
                  </div>
                  <div style={{ maxHeight: 360, overflowY: "auto" }}>
                    {notifications.map((notif, i) => (
                      <div key={notif.id}
                        onClick={() => setNotifications(p => p.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                        style={{ display: "flex", gap: 12, padding: "14px 18px", borderBottom: i < notifications.length - 1 ? `1px solid ${t.border}` : "none", background: notif.read ? "transparent" : t.bgSecondary, cursor: "pointer" }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: notif.color + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon name={notif.icon} size={18} color={notif.color} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: notif.read ? 400 : 500, color: t.text, marginBottom: 2, lineHeight: 1.4 }}>{notif.title}</div>
                          <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.4, marginBottom: 4 }}>{notif.sub}</div>
                          <div style={{ fontSize: 11, color: t.textTert }}>{notif.time}</div>
                        </div>
                        {!notif.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: t.blue, flexShrink: 0, marginTop: 6 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={handleLogout} style={{ fontSize: 12, color: t.textSec, border: `1px solid ${t.border}`, background: "none", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: font, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="logout" size={14} color={t.textSec} /> Déconnexion
          </button>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {!isPatron ? <>
          <Sidebar items={empNav} active={currentEmpPage === "detail" ? "catalogue" : currentEmpPage === "confirmation" ? "cart" : currentEmpPage} onSelect={id => { setEmpPage(id); setSelectedOffer(null); setShowPaymentConfirm(false); }} user={{ initials: activeEmployee.initials, name: `${activeEmployee.firstName} ${activeEmployee.lastName}`, sub: "Alpha Optique" }} role="Espace salarié" t={t} cartCount={cart.length} />
          <div style={{ flex: 1, padding: "24px 32px", background: t.bg, overflowY: "auto", minHeight: "calc(100vh - 45px)" }}>{empViews[currentEmpPage]}</div>
        </> : <>
          <Sidebar items={bossNav} active={bossPage} onSelect={setBossPage} user={{ initials: "AO", name: "Alpha Optique", sub: "Dirigeant" }} role="Espace dirigeant" t={t} cartCount={0} />
          <div style={{ flex: 1, padding: "24px 32px", background: t.bg, overflowY: "auto", minHeight: "calc(100vh - 45px)" }}>{bossViews[bossPage] || bossViews.home}</div>
        </>}
      </div>
    </div>
  );
}
