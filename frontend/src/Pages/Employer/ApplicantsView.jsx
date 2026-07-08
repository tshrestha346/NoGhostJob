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

// ─── DATA ────────────────────────────────────────────────────────────────────

const STATUS_META = {
  Applied:    { color:C.blue,   bg:C.bluePale,  border:C.blueSoft, icon:"📩" },
  Shortlisted:{ color:C.amber,  bg:C.amberPale, border:C.amberBd,  icon:"⭐" },
  Interview:  { color:C.purple, bg:C.purplePale,border:"#C4B5FD",  icon:"🎙️" },
  Offered:    { color:C.green,  bg:C.greenPale, border:C.greenBd,  icon:"🎉" },
  Rejected:   { color:C.red,    bg:C.redPale,   border:C.redBd,    icon:"✕"  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status];
  if (!m) return null;
  return <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"20px", background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:"11px", fontWeight:700, whiteSpace:"nowrap" }}>{m.icon} {status}</span>;
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

export default function ApplicantsView({ applicants, setApplicants }) {
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
