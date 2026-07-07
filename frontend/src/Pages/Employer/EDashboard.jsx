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

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EMPLOYER = { name:"TechCorp Inc.", logo:"TC", industry:"Technology", email:"hr@techcorp.com", plan:"Pro" };

const initJobs = [
  { id:1, title:"Senior React Developer",  dept:"Engineering",  type:"Full Time", loc:"Remote",         salary:"$120k–$150k", posted:"May 10, 2025", status:"Active",   apps:34, views:820 },
  { id:2, title:"Product Designer",        dept:"Design",        type:"Hybrid",    loc:"San Francisco",  salary:"$90k–$120k",  posted:"May 14, 2025", status:"Active",   apps:21, views:540 },
  { id:3, title:"Backend Engineer",        dept:"Engineering",  type:"Full Time", loc:"New York",       salary:"$130k–$160k", posted:"May 18, 2025", status:"Active",   apps:18, views:390 },
  { id:4, title:"Marketing Manager",       dept:"Marketing",     type:"Remote",    loc:"Remote",         salary:"$80k–$100k",  posted:"Apr 28, 2025", status:"Closed",   apps:52, views:1200 },
  { id:5, title:"DevOps Engineer",         dept:"Engineering",  type:"Full Time", loc:"Austin, TX",     salary:"$110k–$140k", posted:"May 20, 2025", status:"Draft",    apps:0,  views:0 },
];

const APPLICANTS = [
  { id:1, name:"Alex Johnson",  initials:"AJ", role:"Senior React Developer", jobId:1, applied:"May 18",  exp:"5 yrs", loc:"SF, CA",   salary:"$130k", status:"Interview",  score:92, skills:["React","TS","Node"] },
  { id:2, name:"Priya Nair",    initials:"PN", role:"Senior React Developer", jobId:1, applied:"May 17",  exp:"7 yrs", loc:"Remote",   salary:"$140k", status:"Shortlisted", score:88, skills:["React","GraphQL","AWS"] },
  { id:3, name:"Sam Patel",     initials:"SP", role:"Senior React Developer", jobId:1, applied:"May 16",  exp:"4 yrs", loc:"NY",       salary:"$120k", status:"Applied",    score:75, skills:["React","Vue","CSS"] },
  { id:4, name:"Jordan Lee",    initials:"JL", role:"Senior React Developer", jobId:1, applied:"May 15",  exp:"6 yrs", loc:"Remote",   salary:"$135k", status:"Rejected",   score:60, skills:["Angular","TS"] },
  { id:5, name:"Maria Chen",    initials:"MC", role:"Product Designer",       jobId:2, applied:"May 19",  exp:"4 yrs", loc:"SF, CA",   salary:"$100k", status:"Applied",    score:84, skills:["Figma","UX","Research"] },
  { id:6, name:"David Kim",     initials:"DK", role:"Product Designer",       jobId:2, applied:"May 18",  exp:"6 yrs", loc:"SF, CA",   salary:"$110k", status:"Shortlisted", score:90, skills:["Figma","Sketch","DS"] },
  { id:7, name:"Nina Ross",     initials:"NR", role:"Backend Engineer",       jobId:3, applied:"May 21",  exp:"5 yrs", loc:"NY",       salary:"$145k", status:"Applied",    score:81, skills:["Python","Go","PostgreSQL"] },
  { id:8, name:"Tom Walker",    initials:"TW", role:"Backend Engineer",       jobId:3, applied:"May 20",  exp:"8 yrs", loc:"Remote",   salary:"$155k", status:"Interview",  score:95, skills:["Rust","K8s","AWS"] },
];

const STATUS_META = {
  Applied:    { color:C.blue,   bg:C.bluePale,  border:C.blueSoft, icon:"📩" },
  Shortlisted:{ color:C.amber,  bg:C.amberPale, border:C.amberBd,  icon:"⭐" },
  Interview:  { color:C.purple, bg:C.purplePale,border:"#C4B5FD",  icon:"🎙️" },
  Offered:    { color:C.green,  bg:C.greenPale, border:C.greenBd,  icon:"🎉" },
  Rejected:   { color:C.red,    bg:C.redPale,   border:C.redBd,    icon:"✕"  },
};

const NAV_ITEMS = [
  { key:"overview",     icon:"⊞",  label:"Overview"        },
  { key:"jobs",         icon:"💼", label:"Job Listings"    },
  { key:"applicants",   icon:"👥", label:"Applicants"      },
  { key:"post",         icon:"✏️", label:"Post a Job"      },
  { key:"analytics",    icon:"📊", label:"Analytics"       },
  { key:"settings",     icon:"⚙️", label:"Settings"        },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status];
  if (!m) return null;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"20px", background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:"11px", fontWeight:700, whiteSpace:"nowrap" }}>{m.icon} {status}</span>;
}
function JobStatusBadge({ s }) {
  const map = { Active:{ bg:C.greenPale, color:C.green, border:C.greenBd }, Closed:{ bg:C.redPale, color:C.red, border:C.redBd }, Draft:{ bg:C.grayLight, color:C.gray, border:C.border } };
  const m = map[s] || map.Draft;
  return <span style={{ padding:"3px 10px", borderRadius:"20px", background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:"11px", fontWeight:700 }}>{s}</span>;
}
function StatCard({ icon, value, label, sub, bg=C.bluePale }) {
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"20px", display:"flex", alignItems:"center", gap:"14px", boxShadow:"0 2px 8px rgba(10,30,60,0.04)" }}>
      <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:"26px", fontWeight:800, color:C.navy, fontFamily:"'Georgia', serif", lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:"13px", fontWeight:600, color:C.grayDark, marginTop:"2px" }}>{label}</div>
        {sub && <div style={{ fontSize:"11px", color:C.gray, marginTop:"1px" }}>{sub}</div>}
      </div>
    </div>
  );
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

// ─── APPLICANT DETAIL MODAL ──────────────────────────────────────────────────
function ApplicantModal({ app, onClose, onStatus }) {
  if (!app) return null;
  const nextStatuses = Object.keys(STATUS_META).filter(s => s !== app.status);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,25,46,0.5)", zIndex:998, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:C.white, borderRadius:"18px", padding:"32px 36px", maxWidth:"560px", width:"95%", boxShadow:"0 24px 80px rgba(7,25,46,0.25)", maxHeight:"90vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
          <div style={{ display:"flex", gap:"14px", alignItems:"center" }}>
            <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px", fontWeight:800, color:"#fff" }}>{app.initials}</div>
            <div>
              <div style={{ fontSize:"20px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{app.name}</div>
              <div style={{ fontSize:"13px", color:C.gray }}>{app.role}</div>
              <div style={{ marginTop:"4px" }}><StatusBadge status={app.status} /></div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:"20px", cursor:"pointer", color:C.gray, padding:"4px" }}>✕</button>
        </div>

        {/* Details grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
          {[["🗓 Applied",app.applied],["📍 Location",app.loc],["💼 Experience",app.exp],["💰 Expected",app.salary]].map(([l,v])=>(
            <div key={l} style={{ padding:"11px 14px", borderRadius:"9px", background:C.offWhite, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.gray, letterSpacing:"0.4px", textTransform:"uppercase", marginBottom:"3px" }}>{l}</div>
              <div style={{ fontSize:"14px", fontWeight:600, color:C.navy }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Match score */}
        <div style={{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"14px 16px", marginBottom:"20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
            <span style={{ fontSize:"13px", fontWeight:700, color:C.navy }}>Profile Match Score</span>
            <span style={{ fontSize:"14px", fontWeight:800, color: app.score >= 85 ? C.green : app.score >= 70 ? C.amber : C.red }}>{app.score}%</span>
          </div>
          <div style={{ height:"6px", borderRadius:"6px", background:C.grayLight, overflow:"hidden" }}>
            <div style={{ width:`${app.score}%`, height:"100%", borderRadius:"6px", background:`linear-gradient(90deg,${C.blue},${C.blueAcc})`, transition:"width 0.5s" }} />
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginBottom:"24px" }}>
          <div style={{ fontSize:"13px", fontWeight:700, color:C.navy, marginBottom:"8px" }}>Skills</div>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {app.skills.map(s=><span key={s} style={{ padding:"4px 12px", borderRadius:"6px", background:C.bluePale, border:`1px solid ${C.blueSoft}`, color:C.blue, fontSize:"12px", fontWeight:700 }}>{s}</span>)}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
          {nextStatuses.filter(s => s !== "Applied").map(s => {
            const m = STATUS_META[s];
            const isRej = s === "Rejected";
            return (
              <button key={s} onClick={()=>{ onStatus(app.id, s); onClose(); }} style={{ flex:1, minWidth:"100px", padding:"10px", borderRadius:"9px", border:`1.5px solid ${isRej ? C.redBd : m.border}`, background: isRej ? C.redPale : m.bg, color: isRej ? C.red : m.color, fontSize:"12px", fontWeight:700, cursor:"pointer", transition:"all 0.15s", whiteSpace:"nowrap" }}>
                {m.icon} {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
function Overview({ jobs, applicants, setPage }) {
  const activeJobs = jobs.filter(j => j.status === "Active").length;
  const totalApps  = applicants.length;
  const interviews = applicants.filter(a => a.status === "Interview").length;
  const offers     = applicants.filter(a => a.status === "Offered").length;

  return (
    <div>
      {/* Banner */}
      <div style={{ background:`linear-gradient(135deg,${C.navy} 0%,#1565C0 100%)`, borderRadius:"16px", padding:"28px 32px", marginBottom:"24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:"200px", height:"200px", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.07)", right:"-40px", top:"-40px" }} />
        <div style={{ position:"relative", zIndex:2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", marginBottom:"4px" }}>Employer Dashboard</div>
            <div style={{ fontSize:"26px", fontWeight:700, color:"#fff", fontFamily:"'Georgia', serif", marginBottom:"6px" }}>Welcome back, {EMPLOYER.name} 👋</div>
            <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.65)" }}>You have <strong style={{color:"#90CAF9"}}>{totalApps} applications</strong> to review across {activeJobs} active jobs.</div>
          </div>
          <button onClick={()=>setPage("post")} style={{ padding:"12px 24px", borderRadius:"10px", border:"none", background:C.white, color:C.blue, fontSize:"14px", fontWeight:700, cursor:"pointer" }}>+ Post a Job</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"24px" }}>
        <StatCard icon="💼" value={activeJobs}  label="Active Jobs"  sub="Currently open"     />
        <StatCard icon="👥" value={totalApps}   label="Applications" sub="Total received"     bg={C.amberPale} />
        <StatCard icon="🎙️" value={interviews}  label="Interviews"  sub="Scheduled"           bg={C.purplePale} />
        <StatCard icon="🎉" value={offers}       label="Offers Sent" sub="Awaiting response"  bg={C.greenPale} />
      </div>

      {/* Two-col */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:"20px", marginBottom:"20px" }}>
        {/* Job listing quick view */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px 24px" }}>
          <SectionHeader title="Active Job Listings" action="Manage All" onAction={()=>setPage("jobs")} />
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {jobs.filter(j=>j.status==="Active").map(job => (
              <div key={job.id} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"12px 14px", borderRadius:"10px", background:C.offWhite, border:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:"14px", fontWeight:700, color:C.navy }}>{job.title}</div>
                  <div style={{ fontSize:"11px", color:C.gray }}>{job.dept} · {job.type} · {job.loc}</div>
                </div>
                <div style={{ marginLeft:"auto", textAlign:"right" }}>
                  <div style={{ fontSize:"18px", fontWeight:800, color:C.blue }}>{job.apps}</div>
                  <div style={{ fontSize:"10px", color:C.gray }}>applicants</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:"18px", fontWeight:800, color:C.grayDark }}>{job.views}</div>
                  <div style={{ fontSize:"10px", color:C.gray }}>views</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent applicants */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px 24px" }}>
          <SectionHeader title="Recent Applicants" action="View All" onAction={()=>setPage("applicants")} />
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {applicants.slice(0,5).map(app => (
              <div key={app.id} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:800, color:"#fff", flexShrink:0 }}>{app.initials}</div>
                <div style={{ flex:1, overflow:"hidden" }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:C.navy, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{app.name}</div>
                  <div style={{ fontSize:"11px", color:C.gray }}>{app.role}</div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline summary */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px 24px" }}>
        <SectionHeader title="Hiring Pipeline" />
        <div style={{ display:"flex", gap:"0" }}>
          {Object.entries(STATUS_META).map(([status, m], i, arr) => {
            const cnt = applicants.filter(a=>a.status===status).length;
            return (
              <div key={status} style={{ flex:1, background:m.bg, border:`1px solid ${m.border}`, borderRadius: i===0?"10px 0 0 10px":i===arr.length-1?"0 10px 10px 0":"0", padding:"16px", textAlign:"center", borderRight: i<arr.length-1?"none":`1px solid ${m.border}` }}>
                <div style={{ fontSize:"20px", marginBottom:"4px" }}>{m.icon}</div>
                <div style={{ fontSize:"24px", fontWeight:800, color:m.color, fontFamily:"'Georgia', serif" }}>{cnt}</div>
                <div style={{ fontSize:"11px", fontWeight:700, color:m.color, marginTop:"2px" }}>{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── JOB LISTINGS CRUD ────────────────────────────────────────────────────────
function JobListings({ jobs, setJobs, setPage, setPostEditJob }) {
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

// ─── APPLICANTS VIEW ─────────────────────────────────────────────────────────
function ApplicantsView({ applicants, setApplicants }) {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const statuses = ["All", ...Object.keys(STATUS_META)];
  const filtered = filter === "All" ? applicants : applicants.filter(a => a.status === filter);

  const updateStatus = (id, status) => {
    setApplicants(as => as.map(a => a.id === id ? { ...a, status } : a));
  };
  const removeApplicant = id => { setApplicants(as => as.filter(a => a.id !== id)); setConfirm(null); };

  return (
    <div>
      {selected && <ApplicantModal app={selected} onClose={()=>setSelected(null)} onStatus={updateStatus} />}
      {confirm && <ConfirmModal msg={`Remove ${confirm.name}'s application?`} onConfirm={()=>removeApplicant(confirm.id)} onCancel={()=>setConfirm(null)} confirmLabel="Remove" danger />}

      <SectionHeader title="Applicants" sub={`${applicants.length} total candidates across all jobs`} />

      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"6px", marginBottom:"20px", flexWrap:"wrap" }}>
        {statuses.map(s => {
          const m = STATUS_META[s];
          const active = filter === s;
          const cnt = s==="All" ? applicants.length : applicants.filter(a=>a.status===s).length;
          return (
            <button key={s} onClick={()=>setFilter(s)} style={{ padding:"6px 16px", borderRadius:"20px", border:`1.5px solid ${active ? (m?.border||C.border) : C.border}`, background: active ? (m?.bg||C.bluePale) : "transparent", color: active ? (m?.color||C.blue) : C.gray, fontSize:"13px", fontWeight: active ? 700 : 500, cursor:"pointer", transition:"all 0.15s" }}>
              {s!=="All" && m?.icon+" "}{s} ({cnt})
            </button>
          );
        })}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {filtered.map(app => (
          <div key={app.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"18px 22px", display:"flex", alignItems:"center", gap:"16px", boxShadow:"0 2px 8px rgba(10,30,60,0.04)" }}>
            {/* Avatar */}
            <div style={{ width:"48px", height:"48px", borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"15px", fontWeight:800, color:"#fff", flexShrink:0 }}>{app.initials}</div>

            {/* Info */}
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"3px" }}>
                <span style={{ fontSize:"16px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{app.name}</span>
                <StatusBadge status={app.status} />
                <span style={{ marginLeft:"auto", fontSize:"13px", fontWeight:800, color: app.score>=85?C.green:app.score>=70?C.amber:C.red }}>⭐ {app.score}%</span>
              </div>
              <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
                {[["📋",app.role],["📅","Applied "+app.applied],["💼",app.exp+" exp"],["📍",app.loc],["💰",app.salary]].map(([ic,v])=>(
                  <span key={v} style={{ fontSize:"12px", color:C.gray, display:"flex", alignItems:"center", gap:"3px" }}><span>{ic}</span>{v}</span>
                ))}
              </div>
              <div style={{ display:"flex", gap:"5px", marginTop:"7px", flexWrap:"wrap" }}>
                {app.skills.map(s=><span key={s} style={{ padding:"2px 9px", borderRadius:"5px", background:C.grayLight, border:`1px solid ${C.border}`, color:C.grayDark, fontSize:"11px", fontWeight:600 }}>{s}</span>)}
              </div>
            </div>

            {/* Quick-action buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:"6px", flexShrink:0, minWidth:"120px" }}>
              <button onClick={()=>setSelected(app)} style={{ padding:"8px 0", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>View Profile</button>
              {app.status !== "Offered" && app.status !== "Rejected" && (
                <button onClick={()=>updateStatus(app.id, app.status==="Applied"?"Shortlisted":app.status==="Shortlisted"?"Interview":"Offered")}
                  style={{ padding:"8px 0", borderRadius:"8px", border:`1.5px solid ${C.greenBd}`, background:C.greenPale, color:C.green, fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
                  ▲ Advance
                </button>
              )}
              {app.status !== "Rejected" && (
                <button onClick={()=>updateStatus(app.id,"Rejected")}
                  style={{ padding:"8px 0", borderRadius:"8px", border:`1.5px solid ${C.redBd}`, background:C.redPale, color:C.red, fontSize:"11px", fontWeight:700, cursor:"pointer" }}>
                  ✕ Reject
                </button>
              )}
              <button onClick={()=>setConfirm(app)} style={{ padding:"8px 0", borderRadius:"8px", border:`1px solid ${C.border}`, background:"transparent", color:C.gray, fontSize:"11px", fontWeight:600, cursor:"pointer" }}>🗑 Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── POST / EDIT JOB ─────────────────────────────────────────────────────────
const EMPTY_JOB = { title:"", dept:"Engineering", type:"Full Time", loc:"", salary:"", desc:"", status:"Active" };

function PostJob({ jobs, setJobs, editJob, setEditJob, setPage }) {
  const isEdit = !!editJob;
  const [form, setForm] = useState(isEdit ? { title:editJob.title, dept:editJob.dept, type:editJob.type, loc:editJob.loc, salary:editJob.salary, desc:editJob.desc||"", status:editJob.status } : EMPTY_JOB);
  const [success, setSuccess] = useState(false);

  const inputStyle = (focus=false) => ({ width:"100%", padding:"12px 14px", borderRadius:"9px", border:`1.5px solid ${focus?C.blueAcc:C.border}`, background:C.offWhite, fontSize:"14px", color:C.navy, outline:"none", boxSizing:"border-box", fontFamily:"inherit", transition:"all 0.15s" });

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim() || !form.loc.trim()) return;
    if (isEdit) {
      setJobs(js => js.map(j => j.id===editJob.id ? { ...j, ...form } : j));
    } else {
      setJobs(js => [...js, { ...form, id:Date.now(), posted:"May 26, 2025", apps:0, views:0 }]);
    }
    setSuccess(true);
    setTimeout(() => { setSuccess(false); setEditJob(null); setPage("jobs"); }, 1500);
  };

  const DEPTS = ["Engineering","Design","Marketing","Product","Operations","Finance","HR"];
  const TYPES = ["Full Time","Part Time","Contract","Hybrid","Remote"];
  const STATUSES = ["Active","Draft"];

  if (success) return (
    <div style={{ textAlign:"center", padding:"60px 0" }}>
      <div style={{ fontSize:"48px", marginBottom:"14px" }}>{isEdit ? "✅" : "🎉"}</div>
      <div style={{ fontSize:"24px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif", marginBottom:"8px" }}>{isEdit ? "Job Updated!" : "Job Posted!"}</div>
      <div style={{ fontSize:"14px", color:C.gray }}>Redirecting to your listings…</div>
    </div>
  );

  return (
    <div style={{ maxWidth:"720px" }}>
      <SectionHeader title={isEdit ? `Edit: ${editJob.title}` : "Post a New Job"} sub={isEdit ? "Update the details below" : "Fill in the details to attract the best candidates"} />

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"28px", marginBottom:"18px" }}>
          <div style={{ fontSize:"15px", fontWeight:700, color:C.navy, marginBottom:"18px" }}>📋 Job Details</div>

          <div style={{ marginBottom:"16px" }}>
            <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:C.grayDark, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>Job Title *</label>
            <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Senior React Developer" style={inputStyle()} onFocus={e=>e.target.style.borderColor=C.blueAcc} onBlur={e=>e.target.style.borderColor=C.border} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"16px" }}>
            {[["Department","dept",DEPTS],["Job Type","type",TYPES]].map(([label,field,opts])=>(
              <div key={field}>
                <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:C.grayDark, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>{label}</label>
                <select value={form[field]} onChange={e=>setForm(f=>({...f,[field]:e.target.value}))} style={{ ...inputStyle(), cursor:"pointer" }}>
                  {opts.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom:"16px" }}>
            <div>
              <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:C.grayDark, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>Location *</label>
              <input value={form.loc} onChange={e=>setForm(f=>({...f,loc:e.target.value}))} placeholder="e.g. San Francisco, CA or Remote" style={inputStyle()} onFocus={e=>e.target.style.borderColor=C.blueAcc} onBlur={e=>e.target.style.borderColor=C.border} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:C.grayDark, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>Salary Range</label>
              <input value={form.salary} onChange={e=>setForm(f=>({...f,salary:e.target.value}))} placeholder="e.g. $100k–$130k" style={inputStyle()} onFocus={e=>e.target.style.borderColor=C.blueAcc} onBlur={e=>e.target.style.borderColor=C.border} />
            </div>
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label style={{ display:"block", fontSize:"12px", fontWeight:700, color:C.grayDark, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>Status</label>
            <div style={{ display:"flex", gap:"8px" }}>
              {STATUSES.map(s=>(
                <button key={s} type="button" onClick={()=>setForm(f=>({...f,status:s}))} style={{ flex:1, padding:"10px", borderRadius:"9px", border:`1.5px solid ${form.status===s?C.blueAcc:C.border}`, background: form.status===s?C.bluePale:"transparent", color: form.status===s?C.blue:C.gray, fontSize:"13px", fontWeight: form.status===s?700:500, cursor:"pointer", transition:"all 0.15s" }}>
                  {s==="Active"?"🟢 Active":"📝 Draft"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"28px", marginBottom:"18px" }}>
          <div style={{ fontSize:"15px", fontWeight:700, color:C.navy, marginBottom:"18px" }}>📝 Job Description</div>
          <textarea value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))} placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting…" rows={8}
            style={{ ...inputStyle(), resize:"vertical", lineHeight:1.7 }}
            onFocus={e=>e.target.style.borderColor=C.blueAcc} onBlur={e=>e.target.style.borderColor=C.border}
          />
        </div>

        <div style={{ display:"flex", gap:"10px" }}>
          <button type="button" onClick={()=>{ setEditJob(null); setPage("jobs"); }} style={{ flex:1, padding:"13px", borderRadius:"10px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.grayDark, fontSize:"14px", fontWeight:600, cursor:"pointer" }}>Cancel</button>
          <button type="submit" style={{ flex:3, padding:"13px", borderRadius:"10px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"14px", fontWeight:700, cursor:"pointer", boxShadow:`0 6px 20px rgba(21,101,192,0.28)` }}>
            {isEdit ? "✅ Save Changes" : "🚀 Publish Job"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
function Analytics({ jobs, applicants }) {
  const bars = jobs.map(j => ({ label:j.title.split(" ").slice(0,2).join(" "), apps:j.apps, views:j.views }));
  const maxViews = Math.max(...bars.map(b=>b.views), 1);
  return (
    <div>
      <SectionHeader title="Analytics" sub="Performance overview of your job listings" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px", marginBottom:"24px" }}>
        <StatCard icon="👁️" value={jobs.reduce((a,j)=>a+j.views,0)} label="Total Views"      sub="Across all listings" />
        <StatCard icon="📩" value={jobs.reduce((a,j)=>a+j.apps,0)}  label="Total Applicants" sub="All time"            bg={C.amberPale} />
        <StatCard icon="📊" value={(jobs.reduce((a,j)=>a+j.apps,0)/Math.max(jobs.reduce((a,j)=>a+j.views,0),1)*100).toFixed(1)+"%"} label="Apply Rate" sub="Views to applications" bg={C.greenPale} />
      </div>

      {/* Bar chart */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"24px", marginBottom:"20px" }}>
        <div style={{ fontSize:"16px", fontWeight:700, color:C.navy, marginBottom:"20px", fontFamily:"'Georgia', serif" }}>Job Views Performance</div>
        <div style={{ display:"flex", gap:"14px", alignItems:"flex-end", height:"160px" }}>
          {bars.map((b,i) => (
            <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.blue }}>{b.views}</div>
              <div style={{ width:"100%", borderRadius:"6px 6px 0 0", background:`linear-gradient(180deg,${C.blueAcc},${C.blue})`, height:`${(b.views/maxViews)*120}px`, minHeight:"8px", transition:"height 0.4s" }} />
              <div style={{ fontSize:"10px", color:C.gray, textAlign:"center", lineHeight:1.3 }}>{b.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Source breakdown */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"24px" }}>
        <div style={{ fontSize:"16px", fontWeight:700, color:C.navy, marginBottom:"16px", fontFamily:"'Georgia', serif" }}>Applicant Status Breakdown</div>
        <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
          {Object.entries(STATUS_META).map(([status, m]) => {
            const cnt = applicants.filter(a=>a.status===status).length;
            const pct = Math.round(cnt/Math.max(applicants.length,1)*100);
            return (
              <div key={status} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <span style={{ fontSize:"13px", fontWeight:600, color:m.color, minWidth:"90px" }}>{m.icon} {status}</span>
                <div style={{ flex:1, height:"8px", borderRadius:"8px", background:C.grayLight, overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", borderRadius:"8px", background:m.color, transition:"width 0.4s" }} />
                </div>
                <span style={{ fontSize:"13px", fontWeight:700, color:C.navy, minWidth:"36px", textAlign:"right" }}>{cnt}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EMPLOYER DASHBOARD ──────────────────────────────────────────────────
export default function EmployerDashboard() {
  const [page,       setPage]      = useState("overview");
  const [jobs,       setJobs]      = useState(initJobs);
  const [applicants, setApplicants]= useState(APPLICANTS);
  const [editJob,    setEditJob]   = useState(null);

  const handleSetPage = p => { setPage(p); if (p !== "post") setEditJob(null); };

  const views = {
    overview:   <Overview     jobs={jobs} applicants={applicants} setPage={handleSetPage} />,
    jobs:       <JobListings  jobs={jobs} setJobs={setJobs} setPage={handleSetPage} setPostEditJob={j=>{ setEditJob(j); setPage("post"); }} />,
    applicants: <ApplicantsView applicants={applicants} setApplicants={setApplicants} />,
    post:       <PostJob jobs={jobs} setJobs={setJobs} editJob={editJob} setEditJob={setEditJob} setPage={handleSetPage} />,
    analytics:  <Analytics jobs={jobs} applicants={applicants} />,
    settings:   <div style={{ fontSize:"16px", color:C.gray, padding:"40px 0", textAlign:"center" }}>⚙️ Settings coming soon…</div>,
  };

  return (
    <div style={{ minHeight:"100vh", background:C.offWhite, fontFamily:"'Segoe UI', system-ui, sans-serif", display:"flex" }}>
      {/* SIDEBAR */}
      <div style={{ width:"230px", background:C.navy, display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", flexShrink:0 }}>
        <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"linear-gradient(135deg,#42A5F5,#1565C0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:800, color:"#fff" }}>C</div>
            <span style={{ color:"#fff", fontFamily:"'Georgia', serif", fontSize:"18px", fontWeight:700 }}>CareerHub</span>
          </div>
        </div>

        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:"linear-gradient(135deg,#42A5F5,#1565C0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800, color:"#fff", flexShrink:0 }}>{EMPLOYER.logo}</div>
          <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:"13px", fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{EMPLOYER.name}</div>
            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Employer · {EMPLOYER.plan}</div>
          </div>
        </div>

        <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={()=>handleSetPage(item.key)} style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", border:"none", background: active?"rgba(66,165,245,0.18)":"transparent", color: active?"#90CAF9":"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight: active?700:400, cursor:"pointer", marginBottom:"2px", textAlign:"left", transition:"all 0.15s", borderLeft: active?`3px solid ${C.blueAcc}`:"3px solid transparent" }}>
                <span style={{ fontSize:"16px" }}>{item.icon}</span>
                {item.label}
                {item.key==="applicants" && applicants.filter(a=>a.status==="Applied").length > 0 && (
                  <span style={{ marginLeft:"auto", background:C.red, color:"#fff", fontSize:"10px", fontWeight:800, padding:"1px 6px", borderRadius:"10px" }}>{applicants.filter(a=>a.status==="Applied").length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding:"14px 10px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", border:"none", background:"rgba(220,38,38,0.12)", color:"rgba(248,113,113,0.9)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
            <span style={{ fontSize:"16px" }}>🚪</span> Sign Out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, overflow:"auto" }}>
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:20 }}>
          <div>
            <div style={{ fontSize:"20px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{NAV_ITEMS.find(n=>n.key===page)?.label}</div>
            <div style={{ fontSize:"12px", color:C.gray }}>CareerHub · Employer Portal</div>
          </div>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <button style={{ position:"relative", padding:"8px 12px", borderRadius:"8px", border:`1px solid ${C.border}`, background:"transparent", cursor:"pointer", fontSize:"16px" }}>
              🔔
              <span style={{ position:"absolute", top:"5px", right:"5px", width:"7px", height:"7px", borderRadius:"50%", background:C.red, border:"1.5px solid #fff" }} />
            </button>
            <button onClick={()=>handleSetPage("post")} style={{ padding:"8px 20px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>+ Post a Job</button>
          </div>
        </div>
        <div style={{ padding:"28px 32px" }}>{views[page]}</div>
      </div>
    </div>
  );
}