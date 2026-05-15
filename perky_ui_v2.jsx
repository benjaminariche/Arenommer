import { useState } from "react";

const B = "#185FA5";
const BL = "#E6F1FB";
const BM = "#378ADD";
const G = "#1D9E75";
const GL = "#E1F5EE";
const A = "#BA7517";
const AL = "#FAEEDA";
const GR = "#888";
const D = "#1a1a1a";
const font = "'DM Sans', 'Segoe UI', system-ui, sans-serif";

function Icon({ name, size = 18, color = GR }) {
  return <i className={`ti ti-${name}`} style={{ fontSize: size, color }} aria-hidden="true" />;
}
function Badge({ text, variant = "blue" }) {
  const s = { blue: { background: BL, color: "#0C447C" }, green: { background: GL, color: "#085041" }, amber: { background: AL, color: "#633806" } }[variant] || { background: BL, color: "#0C447C" };
  return <span style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 10, ...s }}>{text}</span>;
}
function Bar({ pct, color, h = 4 }) {
  return <div style={{ width: "100%", height: h, background: "#eee", borderRadius: h / 2, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: h / 2, transition: "width 0.8s" }} /></div>;
}

const IMG = {
  ugc: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=250&fit=crop",
  disney: "https://images.unsplash.com/photo-1597466599360-3b9775841aec?w=400&h=250&fit=crop",
  parfum: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=250&fit=crop",
  fnac: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400&h=250&fit=crop",
  sport: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=250&fit=crop",
  travel: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop",
  cinema: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=250&fit=crop",
  shopping: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=250&fit=crop",
  parc: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=250&fit=crop",
  beaute: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=250&fit=crop",
  culture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
  food: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=250&fit=crop",
  hero: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop",
};

const OFFERS = [
  { id: 1, name: "Place UGC illimitée", cat: "Cinéma", price: "7,50€", old: "14,20€", discount: "-47%", img: IMG.ugc, desc: "Valable dans tous les cinémas UGC de France. Billet dématérialisé envoyé instantanément sur votre wallet Perky. Présentez le QR code à l'entrée de la salle.", conditions: "Valable 6 mois. Non échangeable, non remboursable. Hors séances spéciales et IMAX.", stock: "Illimité" },
  { id: 2, name: "Disneyland Paris — Billet 1 jour", cat: "Parc", price: "55€", old: "85€", discount: "-30€", img: IMG.disney, desc: "Accès 1 jour aux 2 parcs Disneyland Paris. Billet daté à choisir lors de la commande. Envoi immédiat du e-billet sur votre wallet.", conditions: "Billet daté, non modifiable. Valable pour la date sélectionnée uniquement.", stock: "Selon disponibilité" },
  { id: 3, name: "Parfumerie de l'Europe", cat: "Beauté", price: "-35%", old: "sur la sélection premium", discount: "-35%", img: IMG.parfum, desc: "Accédez à une sélection de grandes marques (Dior, Chanel, YSL, Guerlain) à tarifs exclusifs Perky. Livraison à domicile ou en point relais.", conditions: "Offre réservée aux bénéficiaires Perky. Non cumulable avec d'autres promotions.", stock: "Selon disponibilité" },
  { id: 4, name: "Carte cadeau Fnac", cat: "Shopping", price: "-5%", old: "sur tout le site", discount: "-5%", img: IMG.fnac, desc: "Carte cadeau Fnac/Darty utilisable en ligne et en magasin. Choisissez le montant (20€, 50€, 100€). Envoi du code par email immédiat.", conditions: "Valable 1 an. Utilisable en une ou plusieurs fois.", stock: "Illimité" },
  { id: 5, name: "Fitness Park — Abonnement", cat: "Sport", price: "-20%", old: "sur l'abonnement annuel", discount: "-20%", img: IMG.sport, desc: "Abonnement annuel Fitness Park à tarif préférentiel Perky. Accès à toutes les salles du réseau en France. Inscription en salle avec votre code Perky.", conditions: "Engagement 12 mois. Code à présenter lors de l'inscription en salle.", stock: "Illimité" },
  { id: 6, name: "Séjour Pierre & Vacances", cat: "Voyages", price: "-25%", old: "sur les séjours été", discount: "-25%", img: IMG.travel, desc: "Profitez de tarifs exclusifs sur les résidences Pierre & Vacances et Center Parcs. Réservation via le lien Perky dédié.", conditions: "Selon disponibilité. Offre non cumulable. Réservation via plateforme Perky uniquement.", stock: "Selon disponibilité" },
];

const CATEGORIES = [
  { icon: "device-tv", label: "Cinéma", count: 42, img: IMG.cinema, color: "#6366F1" },
  { icon: "trees", label: "Parcs & loisirs", count: 38, img: IMG.parc, color: "#10B981" },
  { icon: "shopping-bag", label: "Shopping", count: 124, img: IMG.shopping, color: "#F59E0B" },
  { icon: "plane", label: "Voyages", count: 67, img: IMG.travel, color: "#3B82F6" },
  { icon: "barbell", label: "Sport", count: 29, img: IMG.sport, color: "#EF4444" },
  { icon: "tools-kitchen-2", label: "Restauration", count: 56, img: IMG.food, color: "#F97316" },
  { icon: "brush", label: "Beauté", count: 31, img: IMG.beaute, color: "#EC4899" },
  { icon: "book", label: "Culture", count: 45, img: IMG.culture, color: "#8B5CF6" },
];

function Sidebar({ items, active, onSelect, user, role }) {
  return (
    <div style={{ width: 220, background: "#FAFAF9", borderRight: "1px solid #eee", display: "flex", flexDirection: "column", minHeight: "100vh", flexShrink: 0 }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #eee" }}>
        <div style={{ fontSize: 20, fontWeight: 600, color: B, letterSpacing: -0.5 }}>Perky</div>
        <div style={{ fontSize: 11, color: GR, marginTop: 2 }}>{role}</div>
      </div>
      <div style={{ flex: 1, padding: "12px 10px" }}>
        {items.map(it => (
          <button key={it.id} onClick={() => onSelect(it.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active === it.id ? BL : "transparent", color: active === it.id ? B : "#555", cursor: "pointer", fontSize: 13, fontWeight: active === it.id ? 500 : 400, fontFamily: font, marginBottom: 2, textAlign: "left" }}>
            <Icon name={it.icon} size={18} color={active === it.id ? B : "#999"} />{it.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "14px 16px", borderTop: "1px solid #eee", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: BL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: B }}>{user.initials}</div>
        <div><div style={{ fontSize: 13, fontWeight: 500, color: D }}>{user.name}</div><div style={{ fontSize: 11, color: GR }}>{user.sub}</div></div>
      </div>
    </div>
  );
}

function OfferCard({ offer, onClick }) {
  return (
    <div onClick={onClick} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ position: "relative" }}>
        <img src={offer.img} alt="" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
        <span style={{ position: "absolute", top: 10, right: 10, background: B, color: "#fff", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 8 }}>{offer.discount}</span>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 11, color: GR, marginBottom: 2 }}>{offer.cat}</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: D, marginBottom: 6 }}>{offer.name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 500, color: B }}>{offer.price}</span>
          <span style={{ fontSize: 12, color: GR, textDecoration: "line-through" }}>{offer.old}</span>
        </div>
      </div>
    </div>
  );
}

function OfferDetail({ offer, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0", border: "none", background: "none", cursor: "pointer", fontSize: 13, color: B, fontFamily: font, marginBottom: 16 }}>
        <Icon name="arrow-left" size={16} color={B} /> Retour au catalogue
      </button>
      <div style={{ display: "flex", gap: 28 }}>
        <div style={{ flex: 1 }}>
          <img src={offer.img} alt="" style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 14, display: "block" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: GR, marginBottom: 4 }}>{offer.cat}</div>
          <h1 style={{ fontSize: 24, fontWeight: 500, color: D, margin: "0 0 8px" }}>{offer.name}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 28, fontWeight: 500, color: B }}>{offer.price}</span>
            <span style={{ fontSize: 15, color: GR, textDecoration: "line-through" }}>{offer.old}</span>
            <span style={{ background: BL, color: "#0C447C", fontSize: 13, fontWeight: 500, padding: "4px 12px", borderRadius: 8 }}>{offer.discount}</span>
          </div>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 20px" }}>{offer.desc}</p>
          <div style={{ background: "#FAFAF9", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: D, marginBottom: 8 }}>Conditions</div>
            <p style={{ fontSize: 13, color: GR, lineHeight: 1.6, margin: 0 }}>{offer.conditions}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Icon name="package" size={16} color={G} />
            <span style={{ fontSize: 13, color: "#555" }}>Disponibilité : {offer.stock}</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ flex: 1, padding: "14px 24px", borderRadius: 10, border: "none", background: B, color: "#fff", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: font, transition: "transform 0.1s" }}
              onMouseDown={e => e.target.style.transform = "scale(0.98)"}
              onMouseUp={e => e.target.style.transform = "none"}>
              <Icon name="shopping-bag" size={16} color="#fff" /> Ajouter au panier
            </button>
            <button style={{ padding: "14px 18px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontFamily: font }}>
              <Icon name="heart" size={18} color={GR} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmpHome({ onOfferClick }) {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: D, margin: "0 0 4px" }}>Bonjour Marie</h1>
        <p style={{ fontSize: 14, color: GR, margin: 0 }}>Bienvenue sur votre espace avantages</p>
      </div>

      <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 20, position: "relative", height: 200 }}>
        <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(24,95,165,0.9) 0%, rgba(12,68,124,0.85) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
          <div style={{ color: "#fff" }}>
            <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>Votre entreprise fait partie des</div>
            <div style={{ fontSize: 34, fontWeight: 600 }}>Top 12% des TPE</div>
            <div style={{ fontSize: 14, opacity: 0.8, marginTop: 6 }}>en matière d'avantages salariés en France</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "18px 24px", textAlign: "center", color: "#fff", backdropFilter: "blur(4px)" }}>
            <div style={{ fontSize: 28, fontWeight: 600 }}>1 580 €</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>d'avantages actifs</div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: D, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="gift" size={18} color={B} /> Ce que votre employeur vous offre
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { title: "PPV 2026", sub: "1 000€ nets versés en avril", badge: "Reçu", icon: "coin" },
            { title: "Transport 75%", sub: "64,80€/mois remboursés", badge: "Actif", icon: "bus" },
            { title: "Titres-restaurant", sub: "Pluxee — 10€/jour", badge: "Actif", icon: "tools-kitchen-2" },
          ].map((it, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "16px 18px", borderTop: `3px solid ${G}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: GL, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={it.icon} size={16} color={G} />
                </div>
                <Badge text={it.badge} variant="green" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: D, marginBottom: 2 }}>{it.title}</div>
              <div style={{ fontSize: 12, color: GR }}>{it.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: D, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="flame" size={18} color={A} /> Offres du moment
          </div>
          <button onClick={() => onOfferClick(null)} style={{ fontSize: 13, color: B, border: "none", background: "none", cursor: "pointer", fontFamily: font }}>Voir tout <Icon name="arrow-right" size={14} color={B} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
          {OFFERS.slice(0, 4).map(o => <OfferCard key={o.id} offer={o} onClick={() => onOfferClick(o)} />)}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 15, fontWeight: 500, color: D, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="bulb" size={18} color={BM} /> Ressources utiles
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { title: "Guide 100% santé", sub: "Lunettes, dentaire et audio à 0€ de reste à charge", icon: "heart" },
            { title: "Mon compte CPF", sub: "Vos droits formation — accédez à votre solde", icon: "school" },
          ].map((it, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "14px 16px", display: "flex", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: BL, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={it.icon} size={18} color={B} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: D, marginBottom: 2 }}>{it.title}</div><div style={{ fontSize: 12, color: GR, lineHeight: 1.4 }}>{it.sub}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EmpCatalogue({ onOfferClick, selectedCat, setSelectedCat }) {
  const filtered = selectedCat ? OFFERS.filter(o => o.cat === selectedCat) : OFFERS;
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: D, margin: "0 0 16px" }}>Catalogue</h1>
      <div style={{ position: "relative", marginBottom: 20 }}>
        <input type="text" placeholder="Rechercher une enseigne, un parc, une marque..." style={{ width: "100%", padding: "12px 16px 12px 42px", fontSize: 14, border: "1px solid #e0e0e0", borderRadius: 12, outline: "none", boxSizing: "border-box", fontFamily: font, background: "#FAFAF9" }} />
        <div style={{ position: "absolute", left: 14, top: 13 }}><Icon name="search" size={18} color="#bbb" /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {CATEGORIES.map((c, i) => (
          <div key={i} onClick={() => setSelectedCat(selectedCat === c.label ? null : c.label)} style={{
            borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", height: 90,
            border: selectedCat === c.label ? `2px solid ${B}` : "1px solid #eee",
            transition: "transform 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}>
            <img src={c.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 100%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "10px 12px" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{c.label}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{c.count} offres</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: D }}>{selectedCat ? `${selectedCat}` : "Toutes les offres"}</div>
        {selectedCat && <button onClick={() => setSelectedCat(null)} style={{ fontSize: 12, color: B, border: "none", background: BL, padding: "4px 12px", borderRadius: 8, cursor: "pointer", fontFamily: font }}>Tout afficher</button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        {filtered.map(o => <OfferCard key={o.id} offer={o} onClick={() => onOfferClick(o)} />)}
      </div>
      {filtered.length === 0 && <p style={{ textAlign: "center", color: GR, fontSize: 14, padding: "40px 0" }}>Aucune offre dans cette catégorie pour le moment</p>}
    </div>
  );
}

function EmpWallet() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: D, margin: "0 0 16px" }}>Mon wallet</h1>
      <div style={{ fontSize: 14, fontWeight: 500, color: D, marginBottom: 10 }}>Billets actifs</div>
      {[
        { name: "2x Places UGC", date: "Valable jusqu'au 30/06/2026", img: IMG.ugc },
        { name: "Disneyland Paris — 28/05/2026", date: "Billet pour 2 personnes", img: IMG.disney },
      ].map((t, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={t.img} alt="" style={{ width: 52, height: 38, borderRadius: 8, objectFit: "cover" }} />
            <div><div style={{ fontSize: 13, fontWeight: 500, color: D }}>{t.name}</div><div style={{ fontSize: 12, color: GR }}>{t.date}</div></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge text="Actif" variant="green" />
            <button style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: font, color: "#555" }}>Afficher</button>
            <button style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: font, color: "#999" }}>Renvoyer</button>
          </div>
        </div>
      ))}
      <div style={{ fontSize: 14, fontWeight: 500, color: D, margin: "20px 0 10px" }}>Historique</div>
      {[
        { name: "Place Pathé — 12/03/2026", price: "8,20€" },
        { name: "Carte Fnac 50€ — 25/12/2025", price: "47,50€" },
        { name: "Parfumerie Europe — 08/11/2025", price: "42,00€" },
      ].map((t, i) => (
        <div key={i} style={{ background: "#FAFAF9", borderRadius: 10, padding: "10px 16px", marginBottom: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#999" }}>{t.name}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "#999" }}>{t.price}</span>
            <span style={{ fontSize: 11, color: GR, background: "#eee", padding: "2px 8px", borderRadius: 8 }}>Utilisé</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BossHome() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}><h1 style={{ fontSize: 22, fontWeight: 500, color: D, margin: "0 0 4px" }}>Tableau de bord</h1><p style={{ fontSize: 14, color: GR, margin: 0 }}>Optique Dupont — 3 bénéficiaires</p></div>
      <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 16, position: "relative", height: 170 }}>
        <img src={IMG.hero} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(24,95,165,0.92) 0%, rgba(12,68,124,0.88) 100%)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px" }}>
          <div style={{ color: "#fff" }}><div style={{ fontSize: 13, opacity: 0.8 }}>Pouvoir d'achat récupérable</div><div style={{ fontSize: 36, fontWeight: 600, margin: "4px 0" }}>5 580 €</div><div style={{ fontSize: 13, opacity: 0.7 }}>soit ~1 860€ par salarié/an</div></div>
          <div style={{ textAlign: "right", color: "#fff" }}><div style={{ fontSize: 42, fontWeight: 600 }}>33%</div><div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>optimisé</div><Bar pct={33} color="rgba(255,255,255,0.4)" h={4} /></div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[
          { icon: "users", value: "3", label: "Salariés actifs", color: B },
          { icon: "chart-bar", value: "67%", label: "Utilisent Perky", color: G },
          { icon: "coin", value: "1 240€", label: "Économies ce trimestre", color: A },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}><Icon name={s.icon} size={16} color={s.color} /><span style={{ fontSize: 12, color: GR }}>{s.label}</span></div>
            <div style={{ fontSize: 24, fontWeight: 500, color: D }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 15, fontWeight: 500, color: D, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon name="chart-bar" size={18} color={B} /> Scanner avantages</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { title: "Titres-restaurant Pluxee", status: "Activé", badge: "green", pct: 100, color: G, desc: "En place. Part patronale à vérifier." },
          { title: "Navigo 50%", status: "Optimiser → 75%", badge: "amber", pct: 50, color: A, desc: "+259€/an net par salarié. Exonéré." },
          { title: "PPV 2026", status: "Kit prêt", badge: "blue", pct: 30, color: BM, desc: "Jusqu'à 3 000€/salarié. DUE pré-remplie." },
          { title: "Chèques cadeaux Noël", status: "À activer", badge: "amber", pct: 0, color: A, desc: "~193€/salarié exonéré. Commander sur Perky." },
          { title: "Chèques vacances", status: "À activer", badge: "amber", pct: 0, color: A, desc: "~500€/salarié exonéré via ANCV." },
          { title: "Mutuelle", status: "À comparer", badge: "amber", pct: 0, color: A, desc: "Économie possible ~15€/mois/salarié." },
        ].map((it, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: "14px 16px", borderLeft: `3px solid ${it.color}`, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><span style={{ fontSize: 13, fontWeight: 500, color: D }}>{it.title}</span><Badge text={it.status} variant={it.badge} /></div>
            <div style={{ fontSize: 12, color: GR, marginBottom: 8, lineHeight: 1.4 }}>{it.desc}</div>
            <Bar pct={it.pct} color={it.color} h={4} />
          </div>
        ))}
      </div>
    </div>
  );
}

function BossTeam() {
  const members = [
    { name: "Marie Lemaire", role: "Opticienne — CDI", initials: "ML", lastUse: "Aujourd'hui" },
    { name: "Julien Renaud", role: "Opticien — CDI", initials: "JR", lastUse: "Hier" },
    { name: "Sofia Amrani", role: "Alternante", initials: "SA", lastUse: "Il y a 3 jours" },
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, color: D, margin: 0 }}>Équipe</h1>
        <button style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: B, color: "#fff", fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}><Icon name="plus" size={16} color="#fff" /> Ajouter</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "10px 18px", background: "#FAFAF9", fontSize: 12, color: GR, fontWeight: 500, borderBottom: "1px solid #eee" }}><span>Salarié</span><span>Statut</span><span>Dernière activité</span><span>Abonnement</span><span></span></div>
        {members.map((m, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 80px", padding: "14px 18px", alignItems: "center", borderBottom: i < 2 ? "1px solid #f0f0f0" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: BL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: B }}>{m.initials}</div>
              <div><div style={{ fontSize: 13, fontWeight: 500, color: D }}>{m.name}</div><div style={{ fontSize: 12, color: GR }}>{m.role}</div></div>
            </div>
            <span><Badge text="Actif" variant="green" /></span>
            <span style={{ fontSize: 12, color: GR }}>{m.lastUse}</span>
            <span style={{ fontSize: 12, color: GR }}>5€/mois</span>
            <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e0e0e0", background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: font, color: "#999" }}>Gérer</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, padding: "12px 16px", background: "#FAFAF9", borderRadius: 10, display: "flex", justifyContent: "space-between", fontSize: 13, color: GR }}>
        <span>Total : 3 × 5€ = <span style={{ color: D, fontWeight: 500 }}>15€/mois</span></span><span>Prochaine facture : 01/06/2026</span>
      </div>
    </div>
  );
}

function BossFactures() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 500, color: D, margin: "0 0 16px" }}>Factures</h1>
      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px", padding: "10px 18px", background: "#FAFAF9", fontSize: 12, color: GR, fontWeight: 500, borderBottom: "1px solid #eee" }}><span>Période</span><span>Montant</span><span>Salariés</span><span>Statut</span><span></span></div>
        {[
          { p: "Mai 2026", a: "15,00€", c: "3", s: "En cours" },
          { p: "Avril 2026", a: "15,00€", c: "3", s: "Payée" },
          { p: "Mars 2026", a: "15,00€", c: "3", s: "Payée" },
          { p: "Setup initial", a: "150,00€", c: "—", s: "Payée" },
        ].map((f, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 80px", padding: "12px 18px", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ fontSize: 13, color: D }}>{f.p}</span><span style={{ fontSize: 13, fontWeight: 500, color: D }}>{f.a}</span><span style={{ fontSize: 13, color: GR }}>{f.c}</span><span><Badge text={f.s} variant={f.s === "Payée" ? "green" : "blue"} /></span>
            <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #e0e0e0", background: "#fff", fontSize: 12, cursor: "pointer", fontFamily: font, color: "#555" }}>PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const empNav = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "catalogue", label: "Catalogue", icon: "tag" },
  { id: "wallet", label: "Mon wallet", icon: "wallet" },
  { id: "profile", label: "Mon profil", icon: "user" },
];
const bossNav = [
  { id: "home", label: "Tableau de bord", icon: "home" },
  { id: "team", label: "Équipe", icon: "users" },
  { id: "factures", label: "Factures", icon: "file-invoice" },
  { id: "offres", label: "Offres", icon: "tag" },
];

export default function App() {
  const [mode, setMode] = useState("employee");
  const [empPage, setEmpPage] = useState("home");
  const [bossPage, setBossPage] = useState("home");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);

  const handleOfferClick = (offer) => {
    if (offer) { setSelectedOffer(offer); setEmpPage("detail"); }
    else { setSelectedOffer(null); setEmpPage("catalogue"); }
  };

  const empViews = {
    home: <EmpHome onOfferClick={handleOfferClick} />,
    catalogue: <EmpCatalogue onOfferClick={handleOfferClick} selectedCat={selectedCat} setSelectedCat={setSelectedCat} />,
    detail: selectedOffer ? <OfferDetail offer={selectedOffer} onBack={() => { setSelectedOffer(null); setEmpPage("catalogue"); }} /> : null,
    wallet: <EmpWallet />,
    profile: <div style={{ padding: 20, color: GR }}>Profil — paramètres et préférences</div>,
  };
  const bossViews = {
    home: <BossHome />,
    team: <BossTeam />,
    factures: <BossFactures />,
    offres: <EmpCatalogue onOfferClick={handleOfferClick} selectedCat={selectedCat} setSelectedCat={setSelectedCat} />,
  };

  return (
    <div style={{ fontFamily: font }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "10px 0", borderBottom: "1px solid #eee", background: "#FAFAF9" }}>
        {[{ id: "employee", icon: "user", label: "Espace salarié" }, { id: "employer", icon: "briefcase", label: "Espace patron" }].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{ padding: "8px 20px", borderRadius: 8, border: mode === m.id ? "none" : "1px solid #ddd", fontSize: 13, cursor: "pointer", fontFamily: font, fontWeight: 500, background: mode === m.id ? B : "#fff", color: mode === m.id ? "#fff" : "#666", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name={m.icon} size={14} color={mode === m.id ? "#fff" : "#999"} /> {m.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {mode === "employee" ? (
          <>
            <Sidebar items={empNav} active={empPage === "detail" ? "catalogue" : empPage} onSelect={(id) => { setEmpPage(id); setSelectedOffer(null); }} user={{ initials: "ML", name: "Marie Lemaire", sub: "Optique Dupont" }} role="Espace salarié" />
            <div style={{ flex: 1, padding: "24px 32px", minHeight: "100vh", background: "#fff", overflowY: "auto" }}>{empViews[empPage]}</div>
          </>
        ) : (
          <>
            <Sidebar items={bossNav} active={bossPage} onSelect={setBossPage} user={{ initials: "PD", name: "M. Dupont", sub: "Dirigeant" }} role="Espace dirigeant" />
            <div style={{ flex: 1, padding: "24px 32px", minHeight: "100vh", background: "#fff", overflowY: "auto" }}>{bossViews[bossPage]}</div>
          </>
        )}
      </div>
    </div>
  );
}
