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

const STATUS_META = {
  Applied:    { color:C.blue,   bg:C.bluePale,  border:C.blueSoft, icon:"📩" },
  Shortlisted:{ color:C.amber,  bg:C.amberPale, border:C.amberBd,  icon:"⭐" },
  Interview:  { color:C.purple, bg:C.purplePale,border:"#C4B5FD",  icon:"🎙️" },
  Offered:    { color:C.green,  bg:C.greenPale, border:C.greenBd,  icon:"🎉" },
  Rejected:   { color:C.red,    bg:C.redPale,   border:C.redBd,    icon:"✕"  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
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

export default function Analytics({ jobs, applicants }) {
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
