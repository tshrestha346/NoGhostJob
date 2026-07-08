import { useState, useMemo } from "react";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
const C = {
  navy:"#07192E",navyMid:"#0D2B4A",blue:"#1565C0",blueMid:"#1976D2",blueAcc:"#2196F3",
  bluePale:"#E3F2FD",blueSoft:"#BBDEFB",white:"#FFFFFF",offWhite:"#F7FAFF",
  border:"#DDEAFC",gray:"#6B7A99",grayLight:"#EEF2F7",grayDark:"#3D4A63",
  green:"#15803D",greenPale:"#DCFCE7",greenBd:"#BBF7D0",
  amber:"#B45309",amberPale:"#FEF3C7",amberBd:"#FDE68A",
  red:"#DC2626",redPale:"#FEF2F2",redBd:"#FECACA",
  purple:"#7C3AED",purplePale:"#EDE9FE",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function JobStatusBadge({ s }) {
  const map = { Active:{ bg:C.greenPale, color:C.green, border:C.greenBd }, Closed:{ bg:C.redPale, color:C.red, border:C.redBd }, Draft:{ bg:C.grayLight, color:C.gray, border:C.border } };
  const m = map[s] || map.Draft;
  return <span style={{ padding:"3px 10px", borderRadius:"20px", background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:"11px", fontWeight:700 }}>{s}</span>;
}

function SectionHeader({ title, sub, action, onAction }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px" }}>
      <div>
        <div style={{ fontSize:"19px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{title}</div>
        {sub && <div style={{ fontSize:"13px", color:C.gray, marginTop:"2px" }}>{sub}</div>}
      </div>
      {action && <button onClick={onAction} style={{ padding:"8px 18px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>{action}</button>}
    </div>
  );
}

// ─── CONFIRM MODAL ────────────────────────────────────────────────────────────
function ConfirmModal({ msg, onConfirm, onCancel, confirmLabel="Confirm", danger=false }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,25,46,0.5)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:C.white, borderRadius:"16px", padding:"32px 36px", maxWidth:"380px", width:"90%", boxShadow:"0 20px 60px rgba(7,25,46,0.2)" }}>
        <div style={{ fontSize:"28px", textAlign:"center", marginBottom:"12px" }}>{danger ? "⚠️" : "❓"}</div>
        <div style={{ fontSize:"16px", fontWeight:700, color:C.navy, textAlign:"center", marginBottom:"8px", fontFamily:"'Georgia', serif" }}>{msg}</div>
        <div style={{ display:"flex", gap:"10px", marginTop:"24px" }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px", borderRadius:"9px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.grayDark, fontSize:"14px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"11px", borderRadius:"9px", border:"none", background: danger ? C.red : C.blue, color:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer" }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function JobListings({ jobs, setJobs, setPage, setPostEditJob }) {
  const [confirm, setConfirm] = useState(null);

  const deleteJob = id => { setJobs(js => js.filter(j => j.id !== id)); setConfirm(null); };
  const toggleStatus = id => setJobs(js => js.map(j => j.id===id ? { ...j, status: j.status==="Active"?"Closed":"Active" } : j));

  return (
    <div>
      {confirm && <ConfirmModal msg={`Delete "${confirm.title}"? This cannot be undone.`} onConfirm={()=>deleteJob(confirm.id)} onCancel={()=>setConfirm(null)} confirmLabel="Delete" danger />}
      <SectionHeader title="Job Listings" sub={`${jobs.length} total jobs posted`} action="+ Post New Job" onAction={()=>setPage("post")} />

      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {jobs.map(job => (
          <div key={job.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"20px 24px", boxShadow:"0 2px 8px rgba(10,30,60,0.04)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:"16px" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"6px" }}>
                  <span style={{ fontSize:"18px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{job.title}</span>
                  <JobStatusBadge s={job.status} />
                </div>
                <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"10px" }}>
                  {[["🏷",job.dept],["💼",job.type],["📍",job.loc],["💰",job.salary],["📅","Posted "+job.posted]].map(([ic,v])=>(
                    <span key={v} style={{ fontSize:"12px", color:C.gray, display:"flex", alignItems:"center", gap:"3px" }}><span>{ic}</span>{v}</span>
                  ))}
                </div>
                <div style={{ display:"flex", gap:"16px" }}>
                  <div style={{ padding:"8px 14px", borderRadius:"8px", background:C.bluePale, border:`1px solid ${C.blueSoft}` }}>
                    <span style={{ fontSize:"18px", fontWeight:800, color:C.blue }}>{job.apps}</span>
                    <span style={{ fontSize:"12px", color:C.gray, marginLeft:"5px" }}>applicants</span>
                  </div>
                  <div style={{ padding:"8px 14px", borderRadius:"8px", background:C.grayLight, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:"18px", fontWeight:800, color:C.grayDark }}>{job.views}</span>
                    <span style={{ fontSize:"12px", color:C.gray, marginLeft:"5px" }}>views</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
                <button
                  onClick={()=>{ setPostEditJob(job); setPage("post"); }}
                  style={{ padding:"8px 14px", borderRadius:"8px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.grayDark, fontSize:"12px", fontWeight:600, cursor:"pointer" }}>
                  ✏️ Edit
                </button>
                <button
                  onClick={()=>toggleStatus(job.id)}
                  style={{ padding:"8px 14px", borderRadius:"8px", border:`1.5px solid ${job.status==="Active"?C.amberBd:C.greenBd}`, background: job.status==="Active"?C.amberPale:C.greenPale, color: job.status==="Active"?C.amber:C.green, fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
                  {job.status==="Active" ? "⏸ Pause" : "▶ Activate"}
                </button>
                <button
                  onClick={()=>setPage("applicants")}
                  style={{ padding:"8px 14px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
                  👥 View Applicants
                </button>
                <button
                  onClick={()=>setConfirm(job)}
                  style={{ padding:"8px 14px", borderRadius:"8px", border:`1.5px solid ${C.redBd}`, background:C.redPale, color:C.red, fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
