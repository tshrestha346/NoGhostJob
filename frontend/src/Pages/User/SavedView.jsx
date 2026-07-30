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

export default function SavedView() {
  const [saved, setSaved] = useState(SAVED_JOBS.map(j=>j.id));
  return (
    <div>
      <SectionHeader title="Saved Jobs" sub={`${saved.length} jobs in your watchlist`} />
      <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
        {SAVED_JOBS.map(job => (
          <div key={job.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"20px 24px", display:"flex", alignItems:"center", gap:"16px" }}>
            <LogoBox logo={job.logo} lc={job.lc} size={50} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"17px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif", marginBottom:"4px" }}>{job.title}</div>
              <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
                {[["🏢",job.company],["📍",job.loc],["💼",job.type],["💰",job.salary]].map(([ic,v], index)=>(
                  <span key={index} style={{ fontSize:"12px", color:C.gray, display:"flex", alignItems:"center", gap:"3px" }}><span>{ic}</span>{index}</span>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={()=>setSaved(s=>s.filter(x=>x!==job.id))} style={{ padding:"8px 14px", borderRadius:"8px", border:`1.5px solid ${C.redBd}`, background:C.redPale, color:C.red, fontSize:"12px", fontWeight:600, cursor:"pointer" }}>🗑 Remove</button>
              <button style={{ padding:"8px 18px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>Apply Now →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}