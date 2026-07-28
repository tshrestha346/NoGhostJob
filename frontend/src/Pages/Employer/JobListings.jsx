import { useState } from "react";
import { deleteJob, updateJobStatus } from "./employerApi";

const C = { navy:"#07192E", blue:"#1565C0", blueAcc:"#2196F3", white:"#FFFFFF", border:"#DDEAFC", gray:"#6B7A99", grayLight:"#EEF2F7", grayDark:"#3D4A63", green:"#15803D", greenPale:"#DCFCE7", greenBd:"#BBF7D0", amber:"#B45309", amberPale:"#FEF3C7", amberBd:"#FDE68A", red:"#DC2626", redPale:"#FEF2F2", redBd:"#FECACA", bluePale:"#E3F2FD", blueSoft:"#BBDEFB" };

function JobStatusBadge({ status }) {
  const map = {
    Active: { bg: C.greenPale, color: C.green, border: C.greenBd },
    Closed: { bg: C.redPale, color: C.red, border: C.redBd },
    Draft: { bg: C.grayLight, color: C.gray, border: C.border },
  };
  const m = map[status] || map.Draft;
  return <span style={{ padding:"3px 10px", borderRadius:20, background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:11, fontWeight:700 }}>{status}</span>;
}

export default function JobListings({ jobs, setJobs, setPage, setPostEditJob, onViewApplicants, onRefresh }) {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const handleDelete = async (job) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      setBusyId(job.id);
      setError("");
      await deleteJob(job.id);
      setJobs((current) => current.filter((item) => item.id !== job.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleStatus = async (job) => {
    const nextStatus = job.status === "Active" ? "Closed" : "Active";
    try {
      setBusyId(job.id);
      setError("");
      await updateJobStatus(job.id, nextStatus);
      setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status: nextStatus } : item));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
        <div>
          <div style={{ fontSize:19, fontWeight:700, color:C.navy, fontFamily:"Georgia, serif" }}>Job Listings</div>
          <div style={{ fontSize:13, color:C.gray }}>{jobs.length} jobs posted by your company</div>
        </div>
        <button onClick={() => setPage("post")} style={{ padding:"8px 18px", borderRadius:8, border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ Post New Job</button>
      </div>

      {error && <div style={{ marginBottom:12, padding:12, borderRadius:8, background:C.redPale, color:C.red }}>{error}</div>}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {jobs.map((job) => (
          <div key={job.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 24px" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:16, flexWrap:"wrap" }}>
              <div style={{ flex:"1 1 420px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:18, fontWeight:700, color:C.navy, fontFamily:"Georgia, serif" }}>{job.title}</span>
                  <JobStatusBadge status={job.status} />
                </div>
                <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:10 }}>
                  {[job.dept, job.type, job.loc, job.salary, `Posted ${job.posted}`].map((value) => <span key={value} style={{ fontSize:12, color:C.gray }}>{value}</span>)}
                </div>
                <div style={{ display:"flex", gap:16 }}>
                  <div style={{ padding:"8px 14px", borderRadius:8, background:C.bluePale, border:`1px solid ${C.blueSoft}` }}><strong style={{ color:C.blue }}>{job.apps}</strong> <span style={{ fontSize:12, color:C.gray }}>applicants</span></div>
                  <div style={{ padding:"8px 14px", borderRadius:8, background:C.grayLight, border:`1px solid ${C.border}` }}><strong style={{ color:C.grayDark }}>{job.views}</strong> <span style={{ fontSize:12, color:C.gray }}>views</span></div>
                </div>
              </div>

              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <button onClick={() => setPostEditJob(job)} disabled={busyId === job.id}>✏️ Edit</button>
                <button onClick={() => handleToggleStatus(job)} disabled={busyId === job.id}>{job.status === "Active" ? "⏸ Close" : "▶ Activate"}</button>
                <button onClick={() => onViewApplicants(job)} style={{ background:C.blue, color:"#fff" }}>👥 View Applicants</button>
                <button onClick={() => handleDelete(job)} disabled={busyId === job.id} style={{ background:C.redPale, color:C.red }}>🗑 Delete</button>
              </div>
            </div>
          </div>
        ))}

        {!jobs.length && <div style={{ padding:30, textAlign:"center", color:C.gray }}>No jobs have been posted yet.</div>}
      </div>
    </div>
  );
}
