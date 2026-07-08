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

const EMPTY_JOB = { title:"", dept:"Engineering", type:"Full Time", loc:"", salary:"", desc:"", status:"Active" };

export default function PostJob({ jobs, setJobs, editJob, setEditJob, setPage }) {
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