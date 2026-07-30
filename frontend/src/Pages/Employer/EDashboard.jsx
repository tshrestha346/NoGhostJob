import { useCallback, useEffect, useMemo, useState } from "react";
import Overview from "./Overview";
import JobListings from "./JobListings";
import ApplicantsView from "./ApplicantsView";
import PostJob from "./PostJob";
import Analytics from "./Analytics";
import {
  getApplicationsForJob,
  getCompanyJobs,
  getCurrentEmployer,
  getEmployerCompanyId,
  normaliseApplication,
  normaliseJob,
} from "./employerApi";

const C = {
  navy: "#07192E", blue: "#1565C0", blueAcc: "#2196F3", white: "#FFFFFF",
  offWhite: "#F7FAFF", border: "#DDEAFC", gray: "#6B7A99", red: "#DC2626",
};

const NAV_ITEMS = [
  { key: "overview", icon: "⊞", label: "Overview" },
  { key: "jobs", icon: "💼", label: "Job Listings" },
  { key: "applicants", icon: "👥", label: "Applicants" },
  { key: "post", icon: "✏️", label: "Post a Job" },
  // { key: "analytics", icon: "📊", label: "Analytics" },
];

export default function EmployerDashboard() {
  const employer = getCurrentEmployer();
  const companyId = getEmployerCompanyId();

  const [page, setPage] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const employerName = employer?.company?.name || employer?.companyName || employer?.fullName || "Employer";
  const logo = employerName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const loadApplicantsForJobs = useCallback(async (jobList) => {
    const results = await Promise.allSettled(
      jobList.map(async (job) => {
        const response = await getApplicationsForJob(job.id);
        const rows = Array.isArray(response)
          ? response
          : response?.applications || response?.data || [];
        return rows.map((item) => normaliseApplication(item, job));
      })
    );

    return results.flatMap((result) =>
      result.status === "fulfilled" ? result.value : []
    );
  }, []);

  const refreshDashboard = useCallback(async () => {
    if (!companyId) {
      setError("No company ID was found in the logged-in employer data.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getCompanyJobs(companyId);
      const rows = Array.isArray(response)
        ? response
        : response?.jobs || response?.data || [];
      const mappedJobs = rows.map(normaliseJob);
      const mappedApplicants = await loadApplicantsForJobs(mappedJobs);

      setJobs(mappedJobs);
      setApplicants(mappedApplicants);
    } catch (err) {
      setError(err.message || "Failed to load employer dashboard.");
    } finally {
      setLoading(false);
    }
  }, [companyId, loadApplicantsForJobs]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const openApplicantsForJob = (job) => {
    setSelectedJob(job);
    setPage("applicants");
  };

  const handleSetPage = (nextPage) => {
    setPage(nextPage);
    if (nextPage !== "post") setEditJob(null);
    if (nextPage !== "applicants") setSelectedJob(null);
  };

  const visibleApplicants = useMemo(() => {
    if (!selectedJob) return applicants;
    return applicants.filter(
      (app) => String(app.jobId) === String(selectedJob.id)
    );
  }, [applicants, selectedJob]);

  const views = {
    overview: (
      <Overview jobs={jobs} applicants={applicants} setPage={handleSetPage} />
    ),
    jobs: (
      <JobListings
        jobs={jobs}
        setJobs={setJobs}
        setPage={handleSetPage}
        onViewApplicants={openApplicantsForJob}
        setPostEditJob={(job) => {
          setEditJob(job);
          setPage("post");
        }}
        onRefresh={refreshDashboard}
      />
    ),
    applicants: (
      <ApplicantsView
        applicants={visibleApplicants}
        setApplicants={setApplicants}
        selectedJob={selectedJob}
        onShowAll={() => setSelectedJob(null)}
      />
    ),
    post: (
      <PostJob
        editJob={editJob}
        setEditJob={setEditJob}
        setPage={handleSetPage}
        companyId={companyId}
        onSaved={refreshDashboard}
      />
    ),
    // analytics: <Analytics jobs={jobs} applicants={applicants} />,
  };

  if (loading) {
    return <div style={{ padding: 50, fontFamily: "Segoe UI" }}>Loading employer dashboard…</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: C.offWhite, fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex" }}>
      <aside style={{ width: 230, background: C.navy, display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#42A5F5,#1565C0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{logo}</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{employerName}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Employer</div>
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
            <div style={{ fontSize: 12, color: C.gray }}>{selectedJob && page === "applicants" ? selectedJob.title : "Employer Portal"}</div>
          </div>
          <button onClick={() => handleSetPage("post")} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: `linear-gradient(135deg,${C.blue},${C.blueAcc})`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>+ Post a Job</button>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {error && <div style={{ marginBottom: 18, padding: 14, borderRadius: 9, background: "#FEF2F2", color: C.red }}>{error}</div>}
          {views[page]}
        </div>
      </main>
    </div>
  );
}
