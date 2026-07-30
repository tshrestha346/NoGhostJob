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

export default function ApplicationsView() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", ...Object.keys(STATUS_META)];
  const filtered = filter === "All" ? APPLICATIONS : APPLICATIONS.filter(a => a.status === filter);

  return (
    <div>
      <SectionHeader title="My Applications" sub={`${APPLICATIONS.length} total applications`} />
      {/* Filter tabs */}
      <div style={{ display:"flex", gap:"6px", marginBottom:"20px", flexWrap:"wrap" }}>
        {statuses.map(s => {
          const m = STATUS_META[s];
          const active = filter === s;
          return (
            <button key={s} onClick={()=>setFilter(s)} style={{ padding:"6px 16px", borderRadius:"20px", border:`1.5px solid ${active ? (m?.border || C.border) : C.border}`, background: active ? (m?.bg || C.bluePale) : "transparent", color: active ? (m?.color || C.blue) : C.gray, fontSize:"13px", fontWeight: active ? 700 : 500, cursor:"pointer", transition:"all 0.15s" }}>
              {s !== "All" && m?.icon + " "}{s} {s === "All" ? `(${APPLICATIONS.length})` : `(${APPLICATIONS.filter(a=>a.status===s).length})`}
            </button>
          );
        })}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {filtered.map(app => (
          <div key={app.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"20px 24px", display:"flex", alignItems:"center", gap:"16px", boxShadow:"0 2px 8px rgba(10,30,60,0.04)" }}>
            <LogoBox logo={app.logo} lc={app.lc} size={50} />
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"4px" }}>
                <span style={{ fontSize:"17px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{app.title}</span>
                <StatusBadge status={app.status} />
              </div>
              <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
                {[["🏢",app.company],["📍",app.loc],["💼",app.type],["💰",app.salary],["📅","Applied "+app.applied]].map(([ic,v], index)=>(
                  <span key={index} style={{ fontSize:"12px", color:C.gray, display:"flex", alignItems:"center", gap:"3px" }}><span>{ic}</span>{index}</span>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", flexShrink:0 }}>
              <button style={{ padding:"8px 16px", borderRadius:"8px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.grayDark, fontSize:"12px", fontWeight:600, cursor:"pointer" }}>View Details</button>
              {app.status !== "Rejected" && <button style={{ padding:"8px 16px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>Message HR</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}