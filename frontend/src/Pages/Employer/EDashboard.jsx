import { useState, useMemo, useEffect } from "react";
import Overview from "./Overview";
import JobListings from "./JobListings";
import ApplicantsView from "./ApplicantsView";
import PostJob from "./PostJob";
import Analytics from "./Analytics";
import axios from 'axios';

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
const EMPLOYER = { name:"TechCorp Inc.", logo:"TC", industry:"Technology", email:"hr@techcorp.com", plan:"Pro" };

const APPLICANTS = [
  { id:1, name:"Alex Johnson",  initials:"AJ", role:"Senior React Developer", jobId:1, applied:"May 18",  exp:"5 yrs", loc:"SF, CA",   salary:"$130k", status:"Interview",  score:92, skills:["React","TS","Node"] },
  { id:2, name:"Priya Nair",    initials:"PN", role:"Senior React Developer", jobId:1, applied:"May 17",  exp:"7 yrs", loc:"Remote",   salary:"$140k", status:"Shortlisted", score:88, skills:["React","GraphQL","AWS"] },
  { id:3, name:"Sam Patel",     initials:"SP", role:"Senior React Developer", jobId:1, applied:"May 16",  exp:"4 yrs", loc:"NY",       salary:"$120k", status:"Applied",    score:75, skills:["React","Vue","CSS"] },
  { id:4, name:"Jordan Lee",    initials:"JL", role:"Senior React Developer", jobId:1, applied:"May 15",  exp:"6 yrs", loc:"Remote",   salary:"$135k", status:"Rejected",   score:60, skills:["Angular","TS"] },
  { id:5, name:"Maria Chen",    initials:"MC", role:"Product Designer",       jobId:2, applied:"May 19",  exp:"4 yrs", loc:"SF, CA",   salary:"$100k", status:"Applied",    score:84, skills:["Figma","UX","Research"] },
  { id:6, name:"David Kim",     initials:"DK", role:"Product Designer",       jobId:2, applied:"May 18",  exp:"6 yrs", loc:"SF, CA",   salary:"$110k", status:"Shortlisted", score:90, skills:["Figma","Sketch","DS"] },
  { id:7, name:"Nina Ross",     initials:"NR", role:"Backend Engineer",       jobId:3, applied:"May 21",  exp:"5 yrs", loc:"NY",       salary:"$145k", status:"Applied",    score:81, skills:["Python","Go","PostgreSQL"] },
  { id:8, name:"Tom Walker",    initials:"TW", role:"Backend Engineer",       jobId:3, applied:"May 20",  exp:"8 yrs", loc:"Remote",   salary:"$155k", status:"Interview",  score:95, skills:["Rust","K8s","AWS"] },
];  

const NAV_ITEMS = [
  { key:"overview",     icon:"⊞",  label:"Overview"        },
  { key:"jobs",         icon:"💼", label:"Job Listings"    },
  { key:"applicants",   icon:"👥", label:"Applicants"      },
  { key:"post",         icon:"✏️", label:"Post a Job"      },
  { key:"analytics",    icon:"📊", label:"Analytics"       },
  { key:"settings",     icon:"⚙️", label:"Settings"        },
];

// ─── MAIN EMPLOYER DASHBOARD ──────────────────────────────────────────────────
export default function EmployerDashboard() {
  const [page,       setPage]      = useState("overview");
  const [jobs,       setJobs]      = useState();
  const [applicants, setApplicants]= useState(APPLICANTS);
  const [editJob,    setEditJob]   = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSetPage = p => { setPage(p); if (p !== "post") setEditJob(null); };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
          const response = await axios.get(
              "http://localhost:5000/api/jobs"
          );

          setJobs(response.data);
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
    };

    const fetchApplications = async () => {
      try {
          const response = await axios.get(
              "http://localhost:5000/api/getAllApplications"
          );
          console.log('response', response.data)
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div></div>;
  }
  const views = {
    jobs:       <JobListings  jobs={jobs} setJobs={setJobs} setPage={handleSetPage} setPostEditJob={j=>{ setEditJob(j); setPage("post"); }} />,
    overview:   <Overview    jobs={jobs} applicants={applicants} setPage={handleSetPage} />,
    applicants: <ApplicantsView applicants={applicants} setApplicants={setApplicants} />,
    post:       <PostJob jobs={jobs} setJobs={setJobs} editJob={editJob} setEditJob={setEditJob} setPage={handleSetPage} />,
    analytics:  <Analytics jobs={jobs} applicants={applicants} />,
    // settings:   <div style={{ fontSize:"16px", color:C.gray, padding:"40px 0", textAlign:"center" }}>⚙️ Settings coming soon…</div>,
  };

  return (
    <div style={{ minHeight:"100vh", background:C.offWhite, fontFamily:"'Segoe UI', system-ui, sans-serif", display:"flex" }}>
      {/* SIDEBAR */}
      <div style={{ width:"230px", background:C.navy, display:"flex", flexDirection:"column", position:"sticky", top:0, height:"100vh", flexShrink:0 }}>
        <div style={{ padding:"24px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"9px" }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"8px", background:"linear-gradient(135deg,#42A5F5,#1565C0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", fontWeight:800, color:"#fff" }}>C</div>
            <span style={{ color:"#fff", fontFamily:"'Georgia', serif", fontSize:"18px", fontWeight:700 }}>CareerHub</span>
          </div>
        </div>

        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:"linear-gradient(135deg,#42A5F5,#1565C0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:800, color:"#fff", flexShrink:0 }}>{EMPLOYER.logo}</div>
          <div style={{ overflow:"hidden" }}>
            <div style={{ fontSize:"13px", fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{EMPLOYER.name}</div>
            <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.5)" }}>Employer · {EMPLOYER.plan}</div>
          </div>
        </div>

        <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
          {NAV_ITEMS.map(item => {
            const active = page === item.key;
            return (
              <button key={item.key} onClick={()=>handleSetPage(item.key)} style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", border:"none", background: active?"rgba(66,165,245,0.18)":"transparent", color: active?"#90CAF9":"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight: active?700:400, cursor:"pointer", marginBottom:"2px", textAlign:"left", transition:"all 0.15s", borderLeft: active?`3px solid ${C.blueAcc}`:"3px solid transparent" }}>
                <span style={{ fontSize:"16px" }}>{item.icon}</span>
                {item.label}
                {item.key==="applicants" && applicants.filter(a=>a.status==="Applied").length > 0 && (
                  <span style={{ marginLeft:"auto", background:C.red, color:"#fff", fontSize:"10px", fontWeight:800, padding:"1px 6px", borderRadius:"10px" }}>{applicants.filter(a=>a.status==="Applied").length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding:"14px 10px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
          <button style={{ width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", border:"none", background:"rgba(220,38,38,0.12)", color:"rgba(248,113,113,0.9)", fontSize:"13px", fontWeight:600, cursor:"pointer" }}>
            <span style={{ fontSize:"16px" }}>🚪</span> Sign Out
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex:1, overflow:"auto" }}>
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"16px 32px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:20 }}>
          <div>
            <div style={{ fontSize:"20px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{NAV_ITEMS.find(n=>n.key===page)?.label}</div>
            <div style={{ fontSize:"12px", color:C.gray }}>CareerHub · Employer Portal</div>
          </div>
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <button style={{ position:"relative", padding:"8px 12px", borderRadius:"8px", border:`1px solid ${C.border}`, background:"transparent", cursor:"pointer", fontSize:"16px" }}>
              🔔
              <span style={{ position:"absolute", top:"5px", right:"5px", width:"7px", height:"7px", borderRadius:"50%", background:C.red, border:"1.5px solid #fff" }} />
            </button>
            <button onClick={()=>handleSetPage("post")} style={{ padding:"8px 20px", borderRadius:"8px", border:"none", background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontSize:"13px", fontWeight:700, cursor:"pointer" }}>+ Post a Job</button>
          </div>
        </div>
        <div style={{ padding:"28px 32px" }}>{views[page]}</div>
      </div>
    </div>
  );
}