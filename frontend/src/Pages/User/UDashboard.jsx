import { useState, useMemo } from "react";
import Overview from './Overview';
import ApplicationsView from "./ApplicationsView";
import MyApplicationsPage from "../MyApplicationsPage.jsx";
import InterviewsView from "./InterviewsView";
import SavedView from "./SavedView";
import RecommendedView from "./RecommendedView.jsx";
import ProfileView from "./ProfileView.jsx";

// ─── TOKENS ───────────────────────────────────────────────────────────────────
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

// ─── VIEWS ────────────────────────────────────────────────────────────────────



// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [page, setPage] = useState("overview");

  const views = { overview:<Overview setPage={setPage}/>, applications:<MyApplicationsPage/>,  profile:<ProfileView/> };

  return (
    <div style={{ minHeight:"100vh", background:C.offWhite, fontFamily:"'Segoe UI', system-ui, sans-serif", display:"flex" }}>
      {/* ── SIDEBAR ─────────────────────────────── */}
      <div style={{ width:"230px", background:C.navy, display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", flexShrink:0 }}>
        {/* Logo */}
        <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"linear-gradient(135deg,#42A5F5,#1565C0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:800, color:"#fff" }}>C</div>
            <span style={{ color:"#fff", fontFamily:"'Georgia', serif", fontSize:"18px", fontWeight:700 }}>CareerHub</span>
          </div>
        </div>

        {/* User */}
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"50%", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800, color:"#fff", flexShrink:0 }}>{USER.avatar}</div>
          <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:"13px", fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{USER.name}</div>
            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Job Seeker</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={()=>setPage(item.key)} style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", border:"none", background: active ? "rgba(66,165,245,0.18)" : "transparent", color: active ? "#90CAF9" : "rgba(255,255,255,0.6)", fontSize:"13px", fontWeight: active ? 700 : 400, cursor:"pointer", marginBottom:"2px", textAlign:"left", transition:"all 0.15s", borderLeft: active ? `3px solid ${C.blueAcc}` : "3px solid transparent" }}>
                <span style={{ fontSize:"16px" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding:"14px 10px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", border:"none", background:"rgba(220,38,38,0.12)", color:"rgba(248,113,113,0.9)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
            <span style={{ fontSize:"16px" }}>🚪</span> Sign Out
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────── */}
      <div style={{ flex:1, overflow:"auto" }}>
        {/* Topbar */}
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:20 }}>
          <div>
            <div style={{ fontSize:"20px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{NAV_ITEMS.find(n=>n.key===page)?.label}</div>
            <div style={{ fontSize:"12px", color:C.gray }}>CareerHub · Job Seeker Portal</div>
          </div>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <button style={{ position:"relative", padding:"8px 12px", borderRadius:"8px", border:`1px solid ${C.border}`, background:"transparent", cursor:"pointer", fontSize:"16px" }}>
              🔔
              <span style={{ position:"absolute", top:"5px", right:"5px", width:"7px", height:"7px", borderRadius:"50%", background:C.red, border:"1.5px solid #fff" }} />
            </button>
            <button style={{ padding:"8px 18px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>Browse Jobs</button>
          </div>
        </div>

        <div style={{ padding:"28px 32px" }}>
          {views[page]}
        </div>
      </div>
    </div>
  );
}