import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCompanies} from "../services/api";

const INDUSTRIES = ["All", "Technology", "FinTech", "Artificial Intelligence", "E-Commerce", "E-Commerce / Cloud", "Design Tools", "Entertainment / Streaming", "Social Media", "Productivity SaaS", "Travel & Hospitality", "Consumer Technology"];
const SIZES = ["All Sizes", "500–1,000", "1,000–5,000", "5,000–10,000", "10,000–50,000", "50,000–100,000", "100,000+"];
const TYPES = ["All Types", "Public", "Private"];
const TAGS = ["Remote Friendly", "Top Payer", "Best Culture", "Fast Growth", "Cutting Edge", "Prestigious"];
const SORT_OPTIONS = [
  ["top", "Top Rated"],
  ["openings", "Most Openings"],
  ["reviews", "Most Reviews"],
  ["newest", "Newest"],
  ["name", "Name A–Z"],
];

function Stars({ value = 0 }) {
  return <div className="flex text-sm">{[1,2,3,4,5].map((i) => <span key={i} className={i <= Math.round(value) ? "text-amber-500" : "text-slate-200"}>★</span>)}</div>;
}

function Tag({ value, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-bold transition ${active ? "border-[#1565C0] bg-[#1565C0] text-white" : "border-[#BBDEFB] bg-[#E3F2FD] text-[#1565C0]"}`}
    >
      {value}
    </button>
  );
}

function CompanyCard({ company, view, onOpen }) {
  const reviewsText = company.reviews >= 1000 ? `${(company.reviews / 1000).toFixed(1)}k` : company.reviews;

  if (view === "list") {
    return (
      <article className="flex flex-col gap-5 rounded-2xl border border-[#DDEAFC] bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-lg font-black" style={{ color: company.color, background: `${company.color || "#1565C0"}18` }}>
          {company.initials || company.name?.slice(0, 2)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-[#07192E]">{company.name}</h2>
            <span className="rounded bg-[#E3F2FD] px-2 py-1 text-[10px] font-bold text-[#1565C0]">{company.type}</span>
          </div>
          <p className="mt-1 text-sm text-[#6B7A99]">{company.industry} · {company.location} · Est. {company.founded || "N/A"}</p>
          <div className="mt-3 flex flex-wrap gap-2">{company.tags?.slice(0, 3).map((tag) => <Tag key={tag} value={tag} />)}</div>
        </div>
        <div className="min-w-24 text-center"><strong className="text-2xl text-[#07192E]">{company.rating?.toFixed?.(1) || company.rating}</strong><Stars value={company.rating} /><small className="text-[#6B7A99]">{reviewsText} reviews</small></div>
        <div className="min-w-24 text-center"><strong className="text-2xl text-[#1565C0]">{company.openings || 0}</strong><div className="text-xs text-[#6B7A99]">open roles</div></div>
        <button onClick={onOpen} className="rounded-lg bg-[#1565C0] px-5 py-3 text-sm font-bold text-white">View Jobs →</button>
      </article>
    );
  }

  return (
    <article className="flex flex-col rounded-2xl border border-[#DDEAFC] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#2196F3] hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="grid h-14 w-14 place-items-center rounded-xl text-lg font-black" style={{ color: company.color, background: `${company.color || "#1565C0"}18` }}>
          {company.initials || company.name?.slice(0, 2)}
        </div>
        <span className="rounded bg-[#E3F2FD] px-2 py-1 text-[10px] font-bold text-[#1565C0]">{company.type}</span>
      </div>
      <h2 className="mt-5 text-xl font-bold text-[#07192E]">{company.name}</h2>
      <p className="mt-1 text-sm text-[#6B7A99]">{company.industry}</p>
      <p className="mt-4 line-clamp-3 min-h-[63px] text-sm leading-6 text-[#3D4A63]">{company.desc || company.description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#6B7A99]"><span>📍 {company.location}</span><span>👥 {company.size}</span><span>📅 Est. {company.founded || "N/A"}</span></div>
      <div className="mt-4 flex flex-wrap gap-2">{company.tags?.slice(0, 3).map((tag) => <Tag key={tag} value={tag} />)}</div>
      <div className="mt-4 flex flex-wrap gap-2">{company.perks?.slice(0, 3).map((perk) => <span key={perk} className="rounded-md border border-[#DDEAFC] bg-[#EEF2F7] px-2 py-1 text-xs font-semibold text-[#3D4A63]">{perk}</span>)}</div>
      <div className="my-5 h-px bg-[#DDEAFC]" />
      <div className="flex items-end justify-between"><div><div className="flex items-center gap-2"><strong className="text-xl text-[#07192E]">{company.rating?.toFixed?.(1) || company.rating}</strong><Stars value={company.rating} /></div><small className="text-[#6B7A99]">{reviewsText} reviews</small></div><div className="text-right"><strong className="text-2xl text-[#1565C0]">{company.openings || 0}</strong><div className="text-xs text-[#6B7A99]">open roles</div></div></div>
      <button onClick={onOpen} className="mt-5 w-full rounded-lg bg-gradient-to-r from-[#1565C0] to-[#2196F3] py-3 text-sm font-bold text-white">View {company.openings || 0} Jobs →</button>
    </article>
  );
}

export default function CompaniesPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [size, setSize] = useState("All Sizes");
  const [type, setType] = useState("All Types");
  const [activeTag, setActiveTag] = useState("");
  const [sort, setSort] = useState("top");
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => ({ search, industry, size, type, tag: activeTag, sort, page, limit: 12 }), [search, industry, size, type, activeTag, sort, page]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    fetchCompanies(query)
      .then((data) => {
        if (ignore) return;
        setCompanies((current) => page === 1 ? data.companies : [...current, ...data.companies]);
        setPagination(data.pagination);
      })
      .catch((err) => !ignore && setError(err.message))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [query]);

  const applyFilter = (setter, value) => { setter(value); setPage(1); };
  const submitSearch = (event) => { event.preventDefault(); setSearch(searchInput.trim()); setPage(1); };
  const clearAll = () => { setSearchInput(""); setSearch(""); setIndustry("All"); setSize("All Sizes"); setType("All Types"); setActiveTag(""); setSort("top"); setPage(1); };

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-[#07192E]">
      <section className="bg-gradient-to-br from-[#07192E] via-[#0D2B4A] to-[#1565C0] px-5 py-20 text-center text-white">
        <span className="rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-200">Verified Companies</span>
        <h1 className="mt-5 text-4xl font-bold sm:text-6xl">Explore Top Companies<br/><span className="text-blue-300">Hiring Right Now</span></h1>
        <p className="mx-auto mt-5 max-w-2xl text-white/70">Research company culture, perks and open roles, then move directly to the job details you need.</p>
        <form onSubmit={submitSearch} className="mx-auto mt-8 flex max-w-2xl rounded-xl bg-white p-2 shadow-2xl">
          <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="min-w-0 flex-1 px-4 text-[#07192E] outline-none" placeholder="Search company, industry, or location…" />
          <button className="rounded-lg bg-[#1565C0] px-6 py-3 font-bold">Search</button>
        </form>
      </section>

      {/* <div className="border-b border-[#DDEAFC] bg-white px-5 py-4"><div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2"><span className="mr-2 text-xs font-bold text-[#6B7A99]">Filter by:</span>{TAGS.map((tag) => <Tag key={tag} value={tag} active={activeTag === tag} onClick={() => applyFilter(setActiveTag, activeTag === tag ? "" : tag)} />)}</div></div> */}

      <main className="mx-auto grid max-w-7xl gap-7 px-5 py-8 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#DDEAFC] bg-white p-5 lg:sticky lg:top-20">
          <h2 className="text-xl font-bold">Filters</h2>
          <label className="mt-5 block text-xs font-bold uppercase text-[#6B7A99]">Industry</label>
          <select value={industry} onChange={(e) => applyFilter(setIndustry, e.target.value)} className="mt-2 w-full rounded-lg border border-[#DDEAFC] p-3">{INDUSTRIES.map((item) => <option key={item}>{item}</option>)}</select>
          <label className="mt-5 block text-xs font-bold uppercase text-[#6B7A99]">Company Size</label>
          <select value={size} onChange={(e) => applyFilter(setSize, e.target.value)} className="mt-2 w-full rounded-lg border border-[#DDEAFC] p-3">{SIZES.map((item) => <option key={item}>{item}</option>)}</select>
          <label className="mt-5 block text-xs font-bold uppercase text-[#6B7A99]">Company Type</label>
          <select value={type} onChange={(e) => applyFilter(setType, e.target.value)} className="mt-2 w-full rounded-lg border border-[#DDEAFC] p-3">{TYPES.map((item) => <option key={item}>{item}</option>)}</select>
          <button onClick={clearAll} className="mt-6 w-full rounded-lg border border-[#DDEAFC] py-3 text-sm font-bold text-[#6B7A99]">Clear All Filters</button>
        </aside>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-3 rounded-xl border border-[#DDEAFC] bg-white p-4 sm:flex-row sm:items-center">
            <div><strong className="text-xl">{pagination.total || 0} companies</strong><span className="ml-2 text-sm text-[#6B7A99]">match your criteria</span></div>
            <div className="flex gap-2"><select value={sort} onChange={(e) => applyFilter(setSort, e.target.value)} className="rounded-lg border border-[#DDEAFC] px-3 py-2">{SORT_OPTIONS.map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select><button onClick={() => setView("grid")} className={`rounded-lg border px-3 ${view === "grid" ? "bg-[#E3F2FD] text-[#1565C0]" : "bg-white"}`}>⊞</button><button onClick={() => setView("list")} className={`rounded-lg border px-3 ${view === "list" ? "bg-[#E3F2FD] text-[#1565C0]" : "bg-white"}`}>☰</button></div>
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">{error}</div>}
          {loading && page === 1 ? <div className="rounded-xl border border-[#DDEAFC] bg-white p-14 text-center">Loading companies...</div> : companies.length === 0 ? <div className="rounded-xl border border-[#DDEAFC] bg-white p-14 text-center"><div className="text-4xl">🏢</div><h3 className="mt-3 text-xl font-bold">No companies found</h3><p className="mt-1 text-[#6B7A99]">Try changing the search or filters.</p></div> : <div className={view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>{companies.map((company) => <CompanyCard key={company._id} company={company} view={view} onOpen={() => navigate(`/companies/${company._id}/jobs`)} />)}</div>}

          {pagination.hasMore && <div className="mt-8 text-center"><button disabled={loading} onClick={() => setPage((value) => value + 1)} className="rounded-lg border border-[#DDEAFC] bg-white px-8 py-3 font-bold text-[#1565C0] disabled:opacity-50">{loading ? "Loading..." : "Load More Companies"}</button></div>}
        </section>
      </main>
    </div>
  );
}
