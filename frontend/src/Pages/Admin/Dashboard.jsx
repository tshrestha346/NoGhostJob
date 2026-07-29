import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';

const API_BASE = 'http://localhost:5000';

const C = {
  navy: "#07192E", blue: "#1565C0", blueAcc: "#2196F3", white: "#FFFFFF",
  offWhite: "#F7FAFF", border: "#DDEAFC", gray: "#6B7A99", red: "#DC2626",
};

const NAV_ITEMS = [
  { key: "Dashboard", icon: "⊞", label: "Overview" },
  { key: "Employers", icon: "💼", label: "Employers" },
  { key: "Members", icon: "👥", label: "Members" },
  { key: "Settings", icon: "✏️", label: "Settings" },
];

async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request to ${path} failed with status ${res.status}`);
  return res.json();
}

function normaliseEmployer(raw) {
  return {
    id: raw.id || raw._id,
    company: raw.companyName || raw.company?.name || raw.name || "—",
    email: raw.email || raw.contactEmail || raw.company?.email || "—",
    industry: raw.industry || raw.company?.industry || "—",
    jobsCount: raw.jobsCount ?? raw.jobs?.length ?? raw.activeJobsCount ?? 0,
    status: raw.status || (raw.isActive === false ? "Inactive" : "Active"),
  };
}

function normaliseJobRow(raw) {
  return {
    id: raw.id || raw._id,
    title: raw.title || raw.jobTitle || "—",
    company: raw.companyName || raw.company?.name || "—",
    location: raw.location || raw.city || "Remote",
    type: raw.jobType || raw.type || "Full Time",
    postedAt: raw.postedAt || raw.createdAt || raw.datePosted || null,
  };
}

function formatPostedDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function pickRandom(list, count) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 3px rgba(7,25,46,0.04)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 800, color: C.navy, marginTop: 6, fontFamily: "Georgia, serif" }}>{value}</div>
    </div>
  );
}

function SectionHeader({ title }) {
  return <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 14 }}>{title}</div>;
}

function StatusBadge({ status }) {
  const active = String(status).toLowerCase() === "active";
  return (
    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: active ? C.greenBg : "#FEF2F2", color: active ? C.green : C.red }}>
      {status}
    </span>
  );
}

const th = { textAlign: "left", fontSize: 11, fontWeight: 700, color: C.gray, textTransform: "uppercase", letterSpacing: 0.4, padding: "10px 16px", borderBottom: `1px solid ${C.border}` };
const td = { padding: "12px 16px", fontSize: 13, color: C.navy, borderBottom: `1px solid ${C.border}` };
const tableWrap = { background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(7,25,46,0.04)" };

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const page = location.pathname.split("/").pop();

  // const [page, setPage] = useState("overview");
  const [editJob, setEditJob] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'))
  const userName = user?.fullName?.name || "Admin";
  const logo = userName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  
  const [employers, setEmployers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleSetPage = (nextPage) => {
    navigate(`/${nextPage}`);
  };
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const [employersRes, usersCountRes, jobsRes] = await Promise.allSettled([
          apiGet("/api/admin/employers"),
          apiGet("/api/admin/users/count"),
          apiGet("/api/jobs"),
        ]);

        if (cancelled) return;

        if (employersRes.status === "fulfilled") {
          const rows = Array.isArray(employersRes.value)
            ? employersRes.value
            : employersRes.value?.employers || employersRes.value?.data || [];
          setEmployers(rows.map(normaliseEmployer));
        }

        if (usersCountRes.status === "fulfilled") {
          const val = usersCountRes.value;
          setUsersCount(typeof val === "number" ? val : val?.count ?? val?.total ?? 0);
        }

        if (jobsRes.status === "fulfilled") {
          const rows = Array.isArray(jobsRes.value)
            ? jobsRes.value
            : jobsRes.value?.jobs || jobsRes.value?.data || [];
          setJobsCount(rows.length);
          setJobs(pickRandom(rows, 10).map(normaliseJobRow));
        }

        const anyFailed = [employersRes, usersCountRes, jobsRes].some((r) => r.status === "rejected");
        if (anyFailed) setError("Some dashboard data failed to load. Showing what's available.");
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load admin dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);



  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7FAFF]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

          <p className="mt-4 font-semibold text-[#3D4A63]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.offWhite, fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex" }}>
      <aside style={{ width: 230, background: C.navy, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#42A5F5,#1565C0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{logo}</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{userName}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Admin</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={() => handleSetPage(item.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, border: "none", background: active ? "rgba(66,165,245,0.18)" : "transparent", color: active ? "#90CAF9" : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: active ? 700 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left", borderLeft: active ? `3px solid ${C.blueAcc}` : "3px solid transparent" }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
                {item.key === "applicants" && applicants.filter((a) => a.status === "Applied").length > 0 && (
                  <span style={{ marginLeft: "auto", background: C.red, color: "#fff", fontSize: 10, fontWeight: 800, padding: "1px 6px", borderRadius: 10 }}>
                    {applicants.filter((a) => a.status === "Applied").length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 20 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, fontFamily: "Georgia, serif" }}>{NAV_ITEMS.find((n) => n.key === page)?.label}</div>
            {/* <div style={{ fontSize: 12, color: C.gray }}>{selectedJob && page === "applicants" ? selectedJob.title : "Admin Portal"}</div> */}
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {error && <div style={{ marginBottom: 18, padding: 14, borderRadius: 9, background: "#FEF2F2", color: C.red }}>{error}</div>}
          <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 32 }}>
            {error && <div style={{ padding: 14, borderRadius: 9, background: "#FEF2F2", color: C.red }}>{error}</div>}

            {/* Stat cards */}
            <div style={{ display: "flex", gap: 20 }}>
              <StatCard label="Employers" value={employers.length} />
              <StatCard label="Total Users" value={usersCount} />
              <StatCard label="Total Jobs" value={jobsCount} />
            </div>

            {/* Recent Employers */}
            <div>
              <SectionHeader title="Recent Employers" />
              <div style={tableWrap}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>Company</th>
                      <th style={th}>Email</th>
                      <th style={th}>Industry</th>
                      <th style={th}>Jobs</th>
                      {/* <th style={th}>Status</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {employers.length === 0 ? (
                      <tr><td style={{ ...td, textAlign: "center", color: C.gray }} colSpan={5}>No employers found.</td></tr>
                    ) : (
                      employers.map((emp) => (
                        <tr key={emp.id}>
                          <td style={{ ...td, fontWeight: 600 }}>{emp.company}</td>
                          <td style={td}>{emp.email}</td>
                          <td style={td}>{emp.industry}</td>
                          <td style={td}>{emp.jobsCount}</td>
                          {/* <td style={td}><StatusBadge status={emp.status} /></td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Latest Jobs */}
            <div>
              <SectionHeader title="Latest Jobs (10)" />
              <div style={tableWrap}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={th}>Title</th>
                      <th style={th}>Company</th>
                      <th style={th}>Location</th>
                      <th style={th}>Type</th>
                      <th style={th}>Posted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length === 0 ? (
                      <tr><td style={{ ...td, textAlign: "center", color: C.gray }} colSpan={5}>No jobs found.</td></tr>
                    ) : (
                      jobs.map((job) => (
                        <tr key={job.id}>
                          <td style={{ ...td, fontWeight: 600 }}>{job.title}</td>
                          <td style={td}>{job.company}</td>
                          <td style={td}>{job.location}</td>
                          <td style={td}>{job.type}</td>
                          <td style={td}>{formatPostedDate(job.postedAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}










