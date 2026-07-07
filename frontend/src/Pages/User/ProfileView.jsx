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

export default function ProfileView() {
  const skills = ["React","TypeScript","Node.js","GraphQL","CSS/SASS","Jest","Figma","AWS"];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:"20px" }}>
      {/* Left card */}
      <div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"24px", textAlign:"center", marginBottom:"16px" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", fontWeight:800, color:"#fff", margin:"0 auto 12px" }}>{USER.avatar}</div>
          <div style={{ fontSize:"18px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{USER.name}</div>
          <div style={{ fontSize:"13px", color:C.gray, marginBottom:"12px" }}>{USER.role}</div>
          <div style={{ display:"flex", gap:"6px", justifyContent:"center", flexWrap:"wrap", marginBottom:"14px" }}>
            {["📍 "+USER.location, "✉️ "+USER.email].map(t=><span key={t} style={{ fontSize:"11px", color:C.grayDark }}>{t}</span>)}
          </div>
          <div style={{ height:"6px", borderRadius:"6px", background:C.grayLight, marginBottom:"6px", overflow:"hidden" }}>
            <div style={{ width:`${USER.profilePct}%`, height:"100%", borderRadius:"6px", background:`linear-gradient(90deg,${C.blue},${C.blueAcc})` }} />
          </div>
          <div style={{ fontSize:"11px", color:C.gray }}>Profile {USER.profilePct}% complete</div>
          <button style={{ marginTop:"14px", width:"100%", padding:"9px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>Edit Profile</button>
        </div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"20px" }}>
          <div style={{ fontSize:"14px", fontWeight:700, color:C.navy, marginBottom:"12px" }}>📄 Resume</div>
          <div style={{ padding:"12px", borderRadius:"8px", background:C.offWhite, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ fontSize:"22px" }}>📄</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"12px", fontWeight:600, color:C.navy }}>{USER.resume}</div>
              <div style={{ fontSize:"11px", color:C.gray }}>Uploaded May 1, 2025</div>
            </div>
          </div>
          <button style={{ marginTop:"10px", width:"100%", padding:"8px", borderRadius:"8px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.blue, fontSize:"12px", fontWeight:700, cursor:"pointer" }}>Upload New</button>
        </div>
      </div>

      {/* Right: details */}
      <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px" }}>
          <div style={{ fontSize:"16px", fontWeight:700, color:C.navy, marginBottom:"14px", fontFamily:"'Georgia', serif" }}>Skills & Expertise</div>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {skills.map(s=><span key={s} style={{ padding:"5px 14px", borderRadius:"20px", background:C.bluePale, border:`1px solid ${C.blueSoft}`, color:C.blue, fontSize:"12px", fontWeight:700 }}>{s}</span>)}
            <button style={{ padding:"5px 14px", borderRadius:"20px", border:`1.5px dashed ${C.border}`, background:"transparent", color:C.gray, fontSize:"12px", fontWeight:600, cursor:"pointer" }}>+ Add Skill</button>
          </div>
        </div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"22px" }}>
          <div style={{ fontSize:"16px", fontWeight:700, color:C.navy, marginBottom:"14px", fontFamily:"'Georgia', serif" }}>Work Preferences</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px" }}>
            {[["💼","Job Type","Full Time, Hybrid"],["📍","Location","San Francisco, Remote"],["💰","Salary Expectation","$120k – $160k"],["🗓","Availability","Immediately"]].map(([ic,label,val])=>(
              <div key={label} style={{ padding:"12px", borderRadius:"10px", background:C.offWhite, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:"11px", fontWeight:700, color:C.gray, letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:"4px" }}>{ic} {label}</div>
                <div style={{ fontSize:"13px", fontWeight:600, color:C.navy }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}