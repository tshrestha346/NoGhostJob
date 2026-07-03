import { useState, useMemo } from "react";

// ─── DESIGN TOKENS (kept for dynamic/per-item colors that Tailwind's static
// class system can't express — e.g. colors coming from data, computed hover
// state, etc. Everything else below uses Tailwind utility classes.) ─────────
const C = {
  navy:     "#07192E",
  navyMid:  "#0D2B4A",
  blue:     "#1565C0",
  blueMid:  "#1976D2",
  blueAcc:  "#2196F3",
  bluePale: "#E3F2FD",
  blueSoft: "#BBDEFB",
  white:    "#FFFFFF",
  offWhite: "#F7FAFF",
  border:   "#DDEAFC",
  gray:     "#6B7A99",
  grayLight:"#EEF2F7",
  grayDark: "#3D4A63",
  green:    "#15803D",
  greenPale:"#DCFCE7",
  greenBd:  "#BBF7D0",
  amber:    "#B45309",
  amberPale:"#FEF3C7",
  amberBd:  "#FDE68A",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const COMPANIES = [
  {
    id: 1,
    name: "Google",
    initials: "G",
    color: "#4285F4",
    industry: "Technology",
    size: "100,000+",
    location: "Mountain View, CA",
    rating: 4.9,
    reviews: 12400,
    openings: 234,
    type: "Public",
    founded: 1998,
    tags: ["Remote Friendly", "Top Payer", "Best Culture"],
    desc: "Google builds products and services that organize the world's information and make it universally accessible and useful.",
    perks: ["Health Insurance", "Stock Options", "Remote Work", "Learning Budgetsst"],
  },
  {
    id: 2,
    name: "Microsoft",
    initials: "Ms",
    color: "#00A4EF",
    industry: "Technology",
    size: "50,000–100,000",
    location: "Redmond, WA",
    rating: 4.8,
    reviews: 9800,
    openings: 189,
    type: "Public",
    founded: 1975,
    tags: ["Remote Friendly", "Top Payer"],
    desc: "Microsoft empowers every person and organization on the planet to achieve more through intelligent cloud and AI.",
    perks: ["Health Insurance", "401k Match", "Parental Leave", "Gym Subsidy"],
  },
  {
    id: 3,
    name: "Amazon",
    initials: "Az",
    color: "#FF9900",
    industry: "E-Commerce / Cloud",
    size: "100,000+",
    location: "Seattle, WA",
    rating: 4.7,
    reviews: 18200,
    openings: 456,
    type: "Public",
    founded: 1994,
    tags: ["Fast Growth", "Top Payer"],
    desc: "Amazon is guided by four principles: customer obsession, passion for invention, commitment to excellence, and long-term thinking.",
    perks: ["Health Insurance", "RSUs", "Relocation Support", "Tuition Assistance"],
  },
  {
    id: 4,
    name: "Apple",
    initials: "🍎",
    color: "#555555",
    industry: "Consumer Technology",
    size: "100,000+",
    location: "Cupertino, CA",
    rating: 4.9,
    reviews: 8700,
    openings: 167,
    type: "Public",
    founded: 1976,
    tags: ["Top Payer", "Best Culture", "Prestigious"],
    desc: "Apple creates products that enrich people's lives and help them do the things they love in new ways.",
    perks: ["Product Discounts", "Stock Options", "Health Insurance", "On-site Wellness"],
  },
  {
    id: 5,
    name: "Meta",
    initials: "M",
    color: "#0866FF",
    industry: "Social Media",
    size: "50,000–100,000",
    location: "Menlo Park, CA",
    rating: 4.6,
    reviews: 7300,
    openings: 234,
    type: "Public",
    founded: 2004,
    tags: ["Remote Friendly", "Fast Growth"],
    desc: "Meta builds technologies that help people connect, find communities, and grow businesses across its family of apps.",
    perks: ["Free Meals", "Stock Options", "Childcare", "Wellness Credits"],
  },
  {
    id: 6,
    name: "Stripe",
    initials: "S",
    color: "#635BFF",
    industry: "FinTech",
    size: "5,000–10,000",
    location: "San Francisco, CA",
    rating: 4.8,
    reviews: 3100,
    openings: 98,
    type: "Private",
    founded: 2010,
    tags: ["Remote Friendly", "Top Payer", "Best Culture"],
    desc: "Stripe builds economic infrastructure for the internet, helping businesses of every size accept payments and grow revenue.",
    perks: ["Remote Work", "Home Office Budget", "Stock Options", "Learning Stipend"],
  },
  {
    id: 7,
    name: "OpenAI",
    initials: "AI",
    color: "#10a37f",
    industry: "Artificial Intelligence",
    size: "1,000–5,000",
    location: "San Francisco, CA",
    rating: 4.9,
    reviews: 1900,
    openings: 87,
    type: "Private",
    founded: 2015,
    tags: ["Fast Growth", "Top Payer", "Cutting Edge"],
    desc: "OpenAI's mission is to ensure that artificial general intelligence benefits all of humanity — safely and responsibly.",
    perks: ["Equity", "Research Budget", "Health Insurance", "Flexible Hours"],
  },
  {
    id: 8,
    name: "Airbnb",
    initials: "Ab",
    color: "#FF5A5F",
    industry: "Travel & Hospitality",
    size: "5,000–10,000",
    location: "San Francisco, CA",
    rating: 4.6,
    reviews: 4200,
    openings: 74,
    type: "Public",
    founded: 2008,
    tags: ["Remote Friendly", "Best Culture"],
    desc: "Airbnb connects hosts and guests to create a world where anyone can belong anywhere, in over 220 countries worldwide.",
    perks: ["Travel Credits", "Stock Options", "Remote First", "Wellness Budget"],
  },
  {
    id: 9,
    name: "Netflix",
    initials: "N",
    color: "#E50914",
    industry: "Entertainment / Streaming",
    size: "10,000–50,000",
    location: "Los Gatos, CA",
    rating: 4.8,
    reviews: 5600,
    openings: 112,
    type: "Public",
    founded: 1997,
    tags: ["Top Payer", "Best Culture", "Prestigious"],
    desc: "Netflix is the world's leading streaming entertainment service, with 260+ million paid memberships in 190+ countries.",
    perks: ["Unlimited PTO", "Top-tier Salary", "Freedom & Responsibility", "Health Benefits"],
  },
  {
    id: 10,
    name: "Shopify",
    initials: "Sh",
    color: "#96BF48",
    industry: "E-Commerce",
    size: "10,000–50,000",
    location: "Ottawa, Canada",
    rating: 4.7,
    reviews: 3800,
    openings: 143,
    type: "Public",
    founded: 2006,
    tags: ["Remote Friendly", "Fast Growth"],
    desc: "Shopify provides essential internet infrastructure for commerce, giving merchants tools to build businesses online and offline.",
    perks: ["Remote First", "Equity", "Learning Budget", "Annual Retreat"],
  },
  {
    id: 11,
    name: "Figma",
    initials: "Fi",
    color: "#F24E1E",
    industry: "Design Tools",
    size: "1,000–5,000",
    location: "San Francisco, CA",
    rating: 4.8,
    reviews: 1400,
    openings: 55,
    type: "Private",
    founded: 2012,
    tags: ["Best Culture", "Fast Growth", "Remote Friendly"],
    desc: "Figma is a collaborative interface design tool that helps teams design, prototype, and handoff work all in one place.",
    perks: ["Equity", "Remote Work", "Creative Culture", "Conference Budget"],
  },
  {
    id: 12,
    name: "Notion",
    initials: "No",
    color: "#191919",
    industry: "Productivity SaaS",
    size: "500–1,000",
    location: "San Francisco, CA",
    rating: 4.7,
    reviews: 920,
    openings: 38,
    type: "Private",
    founded: 2016,
    tags: ["Remote Friendly", "Best Culture", "Fast Growth"],
    desc: "Notion is a connected workspace for teams — combining docs, wikis, databases, and project management in one product.",
    perks: ["Remote Work", "Equity", "Catered Lunches", "Learning Stipend"],
  },
];

const INDUSTRIES = ["All", "Technology", "FinTech", "Artificial Intelligence", "E-Commerce", "Design Tools", "Entertainment / Streaming", "Social Media", "Productivity SaaS", "Travel & Hospitality", "Consumer Technology"];
const SIZES      = ["All Sizes", "500–1,000", "1,000–5,000", "5,000–10,000", "10,000–50,000", "50,000–100,000", "100,000+"];
const TYPES      = ["All Types", "Public", "Private"];
const SORT_OPTS  = [
  { v: "top",      l: "Top Rated"     },
  { v: "openings", l: "Most Openings" },
  { v: "reviews",  l: "Most Reviews"  },
  { v: "newest",   l: "Newest"        },
];
const TAGS       = ["Remote Friendly", "Top Payer", "Best Culture", "Fast Growth", "Cutting Edge", "Prestigious"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Stars({ value, size = 13 }) {
  return (
    <div className="flex gap-px">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className="leading-none"
          style={{ fontSize: `${size}px`, color: i <= Math.round(value) ? "#F59E0B" : C.border }}
        >★</span>
      ))}
    </div>
  );
}

function TagBadge({ label, active, onClick }) {
  const tagColors = {
    "Remote Friendly": { bg: C.bluePale,  color: C.blue,  border: C.blueSoft },
    "Top Payer":       { bg: "#FEF3C7",   color: "#B45309", border: "#FDE68A" },
    "Best Culture":    { bg: "#DCFCE7",   color: "#15803D", border: "#BBF7D0" },
    "Fast Growth":     { bg: "#F3E5F5",   color: "#7B1FA2", border: "#CE93D8" },
    "Cutting Edge":    { bg: "#E0F2F1",   color: "#00695C", border: "#80CBC4" },
    "Prestigious":     { bg: "#FFF3E0",   color: "#E65100", border: "#FFCC80" },
  };
  const t = tagColors[label] || { bg: C.grayLight, color: C.gray, border: C.border };
  return (
    <span
      onClick={onClick}
      className={`inline-block px-[10px] py-[3px] rounded-[20px] text-[11px] font-bold whitespace-nowrap transition-all duration-150 ${onClick ? "cursor-pointer" : "cursor-default"}`}
      style={{
        background: active ? t.color : t.bg,
        border: `1px solid ${t.border}`,
        color: active ? "#fff" : t.color,
      }}
    >{label}</span>
  );
}

function PerkBadge({ label }) {
  return (
    <span className="inline-block px-[10px] py-[3px] rounded-[6px] bg-[#EEF2F7] border border-[#DDEAFC] text-[#3D4A63] text-[11px] font-semibold">
      {label}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <span className="inline-block bg-[#E3F2FD] border border-[#BBDEFB] text-[#1976D2] text-[11px] font-bold tracking-[1.2px] uppercase px-4 py-[5px] rounded-[20px] mb-3">
      {children}
    </span>
  );
}


// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ search, setSearch }) {
  return (
    <section className="relative overflow-hidden text-center px-12 pt-[72px] pb-[88px] bg-[linear-gradient(150deg,#07192E_0%,#0D2B4A_55%,#1565C0_100%)]">
      {[480, 340, 200].map((sz, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${sz}px`, height: `${sz}px`,
            border: `1px solid rgba(66,165,245,${0.05 + i * 0.04})`,
            top: `${-sz / 2 + i * 25}px`, right: `${-sz / 2 + i * 25}px`,
          }}
        />
      ))}
      <div className="absolute w-[320px] h-[320px] rounded-full bg-[rgba(33,150,243,0.1)] blur-[70px] -bottom-20 -left-[60px]" />

      <div className="relative z-[2] max-w-[680px] mx-auto">
        <div className="mb-[18px]">
          <span className="inline-flex items-center gap-[7px] bg-[rgba(66,165,245,0.15)] border border-[rgba(66,165,245,0.3)] text-[#90CAF9] text-[11px] font-bold tracking-[1.2px] uppercase px-4 py-[5px] rounded-[20px]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#42A5F5] inline-block" />
            4,800+ Verified Companies
          </span>
        </div>
        <h1 className="font-[Georgia,serif] text-[clamp(34px,5vw,56px)] font-bold text-white leading-[1.12] tracking-[-1.5px] mb-4">
          Explore Top Companies
          <br />
          <span className="bg-[linear-gradient(90deg,#42A5F5,#90CAF9)] bg-clip-text text-transparent">
            Hiring Right Now
          </span>
        </h1>
        <p className="text-[rgba(255,255,255,0.62)] text-[17px] leading-[1.75] mb-9">
          Research company culture, salaries, reviews and open roles — all in one place.
        </p>

        {/* Search */}
        <div className="max-w-[540px] mx-auto bg-white rounded-xl py-[6px] pr-[6px] pl-0 flex shadow-[0_20px_60px_rgba(7,25,46,0.25)] border border-[#DDEAFC]">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search company name or industry…"
              className="w-full py-[13px] pl-11 pr-[14px] border-none bg-transparent text-sm text-[#07192E] outline-none font-[inherit] box-border"
            />
          </div>
          <button className="px-7 rounded-lg border-none bg-[linear-gradient(135deg,#1565C0,#2196F3)] text-white text-sm font-bold cursor-pointer shadow-[0_4px_16px_rgba(21,101,192,0.3)]">
            Search
          </button>
        </div>

        {/* Quick stats */}
        <div className="flex justify-center gap-8 mt-8">
          {[["4,800+", "Companies"], ["25,000+", "Open Roles"], ["18,000+", "Hires Made"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-[22px] font-extrabold text-white font-[Georgia,serif] leading-none">{v}</div>
              <div className="text-xs text-[rgba(255,255,255,0.55)] mt-[3px]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED STRIP ───────────────────────────────────────────────────────────
function FeaturedStrip() {
  const featured = COMPANIES.slice(0, 6);
  return (
    <section className="bg-[#E3F2FD] border-b border-[#BBDEFB] px-12 py-7">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="text-[11px] font-bold tracking-[1px] uppercase text-[#6B7A99] whitespace-nowrap">Featured</span>
          <div className="w-px h-5 bg-[#DDEAFC]" />
          {featured.map(co => (
            <div key={co.id} className="flex items-center gap-2 cursor-pointer">
              <div
                className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[10px] font-extrabold"
                style={{ background: co.color + "18", border: `1px solid ${co.color}30`, color: co.color }}
              >{co.initials}</div>
              <span className="text-[13px] font-semibold text-[#07192E]">{co.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMPANY CARD ─────────────────────────────────────────────────────────────
function CompanyCard({ co, view }) {
  const [hov, setHov] = useState(false);
  const [following, setFollowing] = useState(false);

  if (view === "list") {
    return (
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="bg-white rounded-[14px] px-6 py-5 flex items-center gap-5 transition-all duration-200"
        style={{
          border: `1.5px solid ${hov ? C.blueAcc : C.border}`,
          transform: hov ? "translateX(4px)" : "none",
          boxShadow: hov ? "0 6px 28px rgba(21,101,192,0.1)" : "0 2px 8px rgba(10,30,60,0.04)",
        }}
      >
        {/* Logo */}
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0"
          style={{ background: co.color + "15", border: `1.5px solid ${co.color}30`, color: co.color }}
        >{co.initials}</div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[17px] font-bold text-[#07192E] font-[Georgia,serif]">{co.name}</span>
            <span
              className="px-2 py-[2px] rounded text-[10px] font-bold"
              style={{
                background: co.type === "Public" ? C.bluePale : C.greenPale,
                border: `1px solid ${co.type === "Public" ? C.blueSoft : C.greenBd}`,
                color: co.type === "Public" ? C.blue : C.green,
              }}
            >{co.type}</span>
          </div>
          <div className="text-xs text-[#6B7A99] mb-[6px]">
            {co.industry} · 📍 {co.location} · Est. {co.founded}
          </div>
          <div className="flex gap-[6px] flex-wrap">
            {co.tags.slice(0, 3).map(t => <TagBadge key={t} label={t} />)}
          </div>
        </div>

        {/* Rating */}
        <div className="text-center min-w-[80px]">
          <div className="text-[22px] font-extrabold text-[#07192E] leading-none">{co.rating}</div>
          <Stars value={co.rating} size={12} />
          <div className="text-[11px] text-[#6B7A99] mt-[2px]">{(co.reviews / 1000).toFixed(1)}k reviews</div>
        </div>

        {/* Openings */}
        <div className="text-center min-w-[80px]">
          <div className="text-[22px] font-extrabold text-[#1565C0] leading-none">{co.openings}</div>
          <div className="text-[11px] text-[#6B7A99] mt-[2px]">open roles</div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setFollowing(!following)}
            className="px-4 py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all duration-150"
            style={{
              border: `1.5px solid ${following ? C.blueSoft : C.border}`,
              background: following ? C.bluePale : "transparent",
              color: following ? C.blue : C.grayDark,
            }}
          >{following ? "✓ Following" : "+ Follow"}</button>
          <button
            className="px-5 py-[9px] rounded-lg border-none text-white text-xs font-bold cursor-pointer"
            style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.blueAcc})` }}
          >View Jobs</button>
        </div>
      </div>
    );
  }

  // Grid card
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="bg-white rounded-2xl p-6 transition-all duration-[220ms] flex flex-col gap-[14px]"
      style={{
        border: `1.5px solid ${hov ? C.blueAcc : C.border}`,
        transform: hov ? "translateY(-5px)" : "none",
        boxShadow: hov ? "0 14px 44px rgba(21,101,192,0.13)" : "0 2px 10px rgba(10,30,60,0.05)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div
          className="w-[54px] h-[54px] rounded-[13px] flex items-center justify-center text-[15px] font-extrabold"
          style={{ background: co.color + "15", border: `1.5px solid ${co.color}28`, color: co.color }}
        >{co.initials}</div>
        <span
          className="px-[10px] py-[3px] rounded-[6px] text-[10px] font-bold"
          style={{
            background: co.type === "Public" ? C.bluePale : C.greenPale,
            border: `1px solid ${co.type === "Public" ? C.blueSoft : C.greenBd}`,
            color: co.type === "Public" ? C.blue : C.green,
          }}
        >{co.type}</span>
      </div>

      {/* Name + meta */}
      <div>
        <div className="text-lg font-bold text-[#07192E] font-[Georgia,serif] mb-1">{co.name}</div>
        <div className="text-xs text-[#6B7A99]">{co.industry}</div>
      </div>

      {/* Desc */}
      <p className="text-[13px] text-[#3D4A63] leading-[1.65] m-0 [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden">
        {co.desc}
      </p>

      {/* Meta row */}
      <div className="flex gap-[14px] flex-wrap">
        {[["📍", co.location], ["👥", co.size], ["📅", `Est. ${co.founded}`]].map(([icon, val]) => (
          <span key={val} className="text-[11px] text-[#6B7A99] flex items-center gap-[3px]">
            <span>{icon}</span> {val}
          </span>
        ))}
      </div>

      {/* Tags */}
      <div className="flex gap-[5px] flex-wrap">
        {co.tags.slice(0, 2).map(t => <TagBadge key={t} label={t} />)}
      </div>

      {/* Perks */}
      <div className="flex gap-[5px] flex-wrap">
        {co.perks.slice(0, 3).map(p => <PerkBadge key={p} label={p} />)}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#DDEAFC]" />

      {/* Rating + openings */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-[6px]">
            <span className="text-lg font-extrabold text-[#07192E]">{co.rating}</span>
            <Stars value={co.rating} size={13} />
          </div>
          <div className="text-[11px] text-[#6B7A99] mt-px">{(co.reviews / 1000).toFixed(1)}k reviews</div>
        </div>
        <div className="text-right">
          <div className="text-[22px] font-extrabold text-[#1565C0] leading-none">{co.openings}</div>
          <div className="text-[11px] text-[#6B7A99]">open roles</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFollowing(!following)}
          className="flex-1 py-[9px] rounded-lg text-xs font-bold cursor-pointer transition-all duration-150"
          style={{
            border: `1.5px solid ${following ? C.blueSoft : C.border}`,
            background: following ? C.bluePale : "transparent",
            color: following ? C.blue : C.grayDark,
          }}
        >{following ? "✓ Following" : "+ Follow"}</button>
        <button
          className="flex-[2] py-[9px] rounded-lg border-none text-white text-xs font-bold cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${C.blue}, ${C.blueAcc})` }}
        >View {co.openings} Jobs →</button>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CompaniesPage() {
  const [search,       setSearch]       = useState("");
  const [industry,     setIndustry]     = useState("All");
  const [size,         setSize]         = useState("All Sizes");
  const [type,         setType]         = useState("All Types");
  const [activeTag,    setActiveTag]    = useState(null);
  const [sort,         setSort]         = useState("top");
  const [view,         setView]         = useState("grid"); // "grid" | "list"

  const filtered = useMemo(() => {
    let r = COMPANIES.filter(co => {
      const q   = search.toLowerCase();
      const kw  = co.name.toLowerCase().includes(q) || co.industry.toLowerCase().includes(q) || co.location.toLowerCase().includes(q);
      const ind = industry === "All" || co.industry === industry;
      const sz  = size === "All Sizes" || co.size === size;
      const tp  = type === "All Types" || co.type === type;
      const tag = !activeTag || co.tags.includes(activeTag);
      return kw && ind && sz && tp && tag;
    });
    if (sort === "top")      r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "openings") r = [...r].sort((a, b) => b.openings - a.openings);
    if (sort === "reviews")  r = [...r].sort((a, b) => b.reviews - a.reviews);
    if (sort === "newest")   r = [...r].sort((a, b) => b.founded - a.founded);
    return r;
  }, [search, industry, size, type, activeTag, sort]);

  const selectClass = "px-[14px] py-[9px] rounded-lg border-[1.5px] border-[#DDEAFC] bg-white text-[#3D4A63] text-[13px] font-semibold cursor-pointer outline-none font-[inherit]";

  return (
    <div className="min-h-screen bg-[#F7FAFF] font-[Segoe_UI,system-ui,sans-serif]">
      {/* <Navbar /> */}
      <Hero search={search} setSearch={setSearch} />
      <FeaturedStrip />

      {/* ── TAG PILLS ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#DDEAFC] px-12 py-4">
        <div className="max-w-[1200px] mx-auto flex items-center gap-[10px] flex-wrap">
          <span className="text-xs font-bold text-[#6B7A99] tracking-[0.5px]">Filter by:</span>
          {TAGS.map(tag => (
            <TagBadge
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="px-[10px] py-[3px] rounded-[20px] border border-[#DDEAFC] bg-transparent text-[#6B7A99] text-[11px] font-semibold cursor-pointer"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-12 pt-8 pb-20 grid grid-cols-[240px_1fr] gap-7 items-start">

        {/* ── SIDEBAR ─────────────────────────────────────────────── */}
        <div className="bg-white border border-[#DDEAFC] rounded-[14px] px-5 py-6 sticky top-20 shadow-[0_4px_20px_rgba(10,30,60,0.05)]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-base">⚙️</span>
            <span className="text-[17px] font-bold text-[#07192E] font-[Georgia,serif]">Filters</span>
          </div>

          {/* Industry */}


          <div className="h-px bg-[#DDEAFC] my-4" />

          {/* Company Size */}
          <div className="mb-5">
            <div className="text-[11px] font-bold tracking-[0.8px] uppercase text-[#6B7A99] mb-[10px]">Company Size</div>
            {SIZES.map(s => (
              <label key={s} className="flex items-center gap-[10px] mb-2 cursor-pointer">
                <div
                  onClick={() => setSize(s)}
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={{
                    border: `2px solid ${size === s ? C.blue : C.border}`,
                    background: size === s ? C.blue : "transparent",
                  }}
                >
                  {size === s && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
                </div>
                <span
                  className="text-[13px]"
                  style={{ color: size === s ? C.navy : C.grayDark, fontWeight: size === s ? 600 : 400 }}
                >{s}</span>
              </label>
            ))}
          </div>

          <div className="h-px bg-[#DDEAFC] my-4" />

          {/* Type */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.8px] uppercase text-[#6B7A99] mb-[10px]">Company Type</div>
            {TYPES.map(t => (
              <label key={t} className="flex items-center gap-[10px] mb-2 cursor-pointer">
                <div
                  onClick={() => setType(t)}
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
                  style={{
                    border: `2px solid ${type === t ? C.blue : C.border}`,
                    background: type === t ? C.blue : "transparent",
                  }}
                >
                  {type === t && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
                </div>
                <span
                  className="text-[13px]"
                  style={{ color: type === t ? C.navy : C.grayDark, fontWeight: type === t ? 600 : 400 }}
                >{t}</span>
              </label>
            ))}
          </div>

          {/* Clear all */}
          {(industry !== "All" || size !== "All Sizes" || type !== "All Types" || activeTag) && (
            <button
              onClick={() => { setIndustry("All"); setSize("All Sizes"); setType("All Types"); setActiveTag(null); }}
              className="mt-5 w-full py-[9px] rounded-lg border-[1.5px] border-[#DDEAFC] bg-transparent text-[#6B7A99] text-[13px] font-bold cursor-pointer"
            >✕ Clear All Filters</button>
          )}
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
        <div>
          {/* Results bar */}
          <div className="bg-white border border-[#DDEAFC] rounded-xl px-5 py-[14px] flex justify-between items-center mb-[18px]">
            <div>
              <span className="text-xl font-bold text-[#07192E] font-[Georgia,serif]">{filtered.length} companies</span>
              <span className="text-[13px] text-[#6B7A99] ml-2">match your criteria</span>
            </div>
            <div className="flex gap-[10px] items-center">
              <select value={sort} onChange={e => setSort(e.target.value)} className={selectClass}>
                {SORT_OPTS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
              {/* View toggle */}
              <div className="flex rounded-lg border border-[#DDEAFC] overflow-hidden">
                {[["grid", "⊞"], ["list", "☰"]].map(([v, icon]) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-2 border-none text-base cursor-pointer ${v === "grid" ? "border-r border-[#DDEAFC]" : ""}`}
                    style={{
                      background: view === v ? C.bluePale : C.white,
                      color: view === v ? C.blue : C.gray,
                      fontWeight: view === v ? 700 : 400,
                    }}
                  >{icon}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#DDEAFC] rounded-[14px] px-6 py-16 text-center">
              <div className="text-[40px] mb-3">🏢</div>
              <div className="text-lg font-bold text-[#07192E] mb-[6px]">No companies found</div>
              <div className="text-sm text-[#6B7A99]">Try adjusting your search or filters.</div>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]" : "flex flex-col gap-3"}>
              {filtered.map(co => <CompanyCard key={co.id} co={co} view={view} />)}
            </div>
          )}

          {/* Load more */}
          {filtered.length > 0 && (
            <div className="text-center mt-9">
              <button className="px-10 py-[13px] rounded-[10px] border-[1.5px] border-[#DDEAFC] bg-white text-[#1565C0] text-sm font-bold cursor-pointer">
                Load More Companies
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="px-12 pb-[72px]">
        <div className="max-w-[1200px] mx-auto rounded-[20px] px-12 py-[52px] flex justify-between items-center relative overflow-hidden bg-[linear-gradient(135deg,#07192E_0%,#1565C0_100%)]">
          <div className="absolute w-[300px] h-[300px] rounded-full border border-[rgba(255,255,255,0.07)] -right-20 -top-20" />
          <div className="relative z-[2]">
            <div className="text-[28px] font-bold text-white font-[Georgia,serif] mb-2">
              Is your company hiring?
            </div>
            <p className="text-[rgba(255,255,255,0.65)] text-[15px] m-0">
              Reach 120,000+ qualified candidates. Post your first role today.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0 relative z-[2]">
            <button className="px-7 py-[13px] rounded-[10px] border-[1.5px] border-[rgba(255,255,255,0.25)] bg-transparent text-white text-sm font-semibold cursor-pointer">
              Learn More
            </button>
            <button className="px-7 py-[13px] rounded-[10px] border-none bg-white text-[#1565C0] text-sm font-bold cursor-pointer">
              Post a Job →
            </button>
          </div>
        </div>
      </section>


    </div>
  );
}