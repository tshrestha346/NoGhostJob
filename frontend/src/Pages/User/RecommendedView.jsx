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

export default function RecommendedView() {
  return (
    <div>
      <SectionHeader title="Recommended Jobs" sub="AI-matched based on your profile and preferences" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"16px" }}>
        {RECOMMENDED.map(job => (
          <div key={job.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px", position:"relative" }}>
            <div style={{ position:"absolute", top:"14px", right:"14px", background:C.greenPale, border:`1px solid ${C.greenBd}`, color:C.green, fontSize:"11px", fontWeight:800, padding:"3px 10px", borderRadius:"20px" }}>{job.match}% match</div>
            <div style={{ display:"flex", gap:"14px", alignItems:"center", marginBottom:"12px" }}>
              <LogoBox logo={job.logo} lc={job.lc} size={48} />
              <div>
                <div style={{ fontSize:"17px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{job.title}</div>
                <div style={{ fontSize:"12px", color:C.gray }}>{job.company} · {job.loc || "Remote"}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", marginBottom:"14px", flexWrap:"wrap" }}>
              <span style={{ padding:"3px 10px", borderRadius:"20px", background:C.bluePale, border:`1px solid ${C.blueSoft}`, color:C.blue, fontSize:"11px", fontWeight:700 }}>{job.type}</span>
              <span style={{ padding:"3px 10px", borderRadius:"20px", background:C.grayLight, border:`1px solid ${C.border}`, color:C.grayDark, fontSize:"11px", fontWeight:600 }}>{job.salary}</span>
            </div>
            <div style={{ display:"flex", gap:"8px" }}>
              <button style={{ flex:1, padding:"9px 0", borderRadius:"8px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.grayDark, fontSize:"12px", fontWeight:600, cursor:"pointer" }}>Save 🔖</button>
              <button style={{ flex:2, padding:"9px 0", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"12px", fontWeight:700, cursor:"pointer" }}>Apply Now →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}