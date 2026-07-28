import { useState, useMemo } from "react";
import {
  C,
  USER,
  APPLICATIONS,
  SAVED_JOBS,
  RECOMMENDED,
  INTERVIEWS,
  NAV_ITEMS,
  STATUS_META,
} from "../../Components/User/UserData.js";

import {
    StatCard,
    SectionHeader,
    StatusBadge,
    LogoBox
} from '../../Components/User/UserSections.jsx';

export default function Overview({ setPage }) {
  const counts = useMemo(() => {
    const r = { Applied:0, Screening:0, Interview:0, Offered:0, Rejected:0 };
    APPLICATIONS.forEach(a => r[a.status]++);
    return r;
  }, []);

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background:`linear-gradient(135deg, ${C.navy} 0%, #1565C0 100%)`, borderRadius:"16px", padding:"28px 32px", marginBottom:"24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", width:"200px", height:"200px", borderRadius:"50%", border:"1px solid rgba(255,255,255,0.07)", right:"-40px", top:"-40px" }} />
        <div style={{ position:"relative", zIndex:2, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", marginBottom:"4px" }}>Good morning 👋</div>
            <div style={{ fontSize:"26px", fontWeight:700, color:"#fff", fontFamily:"'Georgia', serif", marginBottom:"6px" }}>Welcome back, {USER.name.split(" ")[0]}!</div>
            <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.65)" }}>You have <strong style={{color:"#90CAF9"}}>{INTERVIEWS.length} interviews</strong> coming up this week.</div>
          </div>
          <div style={{ display:"flex", gap:"10px" }}>
            <button onClick={()=>setPage("applications")} style={{ padding:"10px 20px", borderRadius:"9px", border:"1.5px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.1)", color:"#fff", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>View Applications</button>
            <button style={{ padding:"10px 20px", borderRadius:"9px", border:"none", background:C.white, color:C.blue, fontSize:"13px", fontWeight:700, cursor:"pointer" }}>Browse Jobs →</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"24px" }}>
        <StatCard icon="📋" value={APPLICATIONS.length} label="Total Applied" sub="Last 30 days" />
        <StatCard icon="🎙️" value={counts.Interview}    label="Interviews"   sub="Scheduled"   color={C.purple} bg={C.purplePale} />
        <StatCard icon="🎉" value={counts.Offered}      label="Offers"       sub="Active"      color={C.green}  bg={C.greenPale}  />
        <StatCard icon="🔖" value={SAVED_JOBS.length}   label="Saved Jobs"   sub="In watchlist" />
      </div>

      {/* Application pipeline */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px 24px", marginBottom:"24px" }}>
        <SectionHeader title="Application Pipeline" />
        <div style={{ display:"flex", gap:"0" }}>
          {Object.entries(STATUS_META).map(([status, m], i, arr) => {
            const cnt = counts[status] || 0;
            return (
              <div key={status} style={{ flex:1, position:"relative" }}>
                <div style={{ background:m.bg, border:`1px solid ${m.border}`, borderRadius: i===0?"10px 0 0 10px":i===arr.length-1?"0 10px 10px 0":"0", padding:"14px 16px", textAlign:"center", borderRight: i<arr.length-1 ? "none" : `1px solid ${m.border}` }}>
                  <div style={{ fontSize:"20px", marginBottom:"4px" }}>{m.icon}</div>
                  <div style={{ fontSize:"22px", fontWeight:800, color:m.color, fontFamily:"'Georgia', serif" }}>{cnt}</div>
                  <div style={{ fontSize:"11px", fontWeight:600, color:m.color, marginTop:"2px" }}>{status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two-col: upcoming interviews + recent apps */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr", gap:"20px", marginBottom:"24px" }}>
        {/* Upcoming interviews */}
        

        {/* Recent applications */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px 24px" }}>
          <SectionHeader title="Recent Applications" action="View All" onAction={()=>setPage("applications")} />
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {APPLICATIONS.slice(0,4).map(app => (
              <div key={app.id} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <LogoBox logo={app.logo} lc={app.lc} size={36} />
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"13px", fontWeight:700, color:C.navy }}>{app.title}</div>
                  <div style={{ fontSize:"11px", color:C.gray }}>{app.company} · {app.applied}</div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended */}
      
    </div>
  );
}