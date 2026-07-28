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
  // { key:"analytics",    icon:"📊", label:"Analytics"       },
  { key:"settings",     icon:"⚙️", label:"Settings"        },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status];
  if (!m) return null;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"20px", background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:"11px", fontWeight:700, whiteSpace:"nowrap" }}>{m.icon} {status}</span>;
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

// ─── OVERVIEW ─────────────────────────────────────────────────────────────────
export default function Overview({ jobs, applicants, setPage }) {
  // const activeJobs = jobs.filter(j => j.status === "Active").length;
  const activeJobs = (jobs || []).filter(j => j.is_active).length;
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
