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

export default function InterviewsView() {
  return (
    <div>
      <SectionHeader title="Scheduled Interviews" sub={`${INTERVIEWS.length} upcoming interviews`} />
      <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
        {INTERVIEWS.map(iv => (
          <div key={iv.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"24px", display:"flex", gap:"20px", alignItems:"flex-start", boxShadow:"0 2px 10px rgba(10,30,60,0.05)" }}>
            <LogoBox logo={iv.logo} lc={iv.lc} size={54} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"19px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif", marginBottom:"4px" }}>{iv.role}</div>
              <div style={{ fontSize:"13px", color:C.gray, marginBottom:"12px" }}>{iv.company} · {iv.round}</div>
              <div style={{ display:"flex", gap:"14px", flexWrap:"wrap" }}>
                {[["📅",iv.date],["🕐",iv.time],["📹",iv.type]].map(([ic,v])=>(
                  <div key={v} style={{ display:"flex", alignItems:"center", gap:"6px", padding:"6px 12px", borderRadius:"8px", background:C.offWhite, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:"13px" }}>{ic}</span>
                    <span style={{ fontSize:"13px", fontWeight:600, color:C.grayDark }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px", minWidth:"130px" }}>
              <button style={{ padding:"10px 0", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>Join Call 📹</button>
              <button style={{ padding:"10px 0", borderRadius:"8px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.grayDark, fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Add to Calendar</button>
              <button style={{ padding:"10px 0", borderRadius:"8px", border:`1.5px solid ${C.redBd}`, background:C.redPale, color:C.red, fontSize:"13px", fontWeight:600, cursor:"pointer" }}>Reschedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}