import {
  C,
  USER,
  APPLICATIONS,
  SAVED_JOBS,
  RECOMMENDED,
  INTERVIEWS,
  NAV_ITEMS,
  STATUS_META,
} from "./UserData";

export function StatCard({ icon, value, label, sub, color=C.blue, bg=C.bluePale }) {
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:"14px", padding:"20px", display:"flex", alignItems:"center", gap:"14px", boxShadow:"0 2px 10px rgba(10,30,60,0.05)" }}>
      <div style={{ width:"48px", height:"48px", borderRadius:"12px", background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:"26px", fontWeight:800, color:C.navy, lineHeight:1, fontFamily:"'Georgia', serif" }}>{value}</div>
        <div style={{ fontSize:"13px", fontWeight:600, color:C.grayDark, marginTop:"2px" }}>{label}</div>
        {sub && <div style={{ fontSize:"11px", color:C.gray, marginTop:"2px" }}>{sub}</div>}
      </div>
    </div>
  );
}

export function SectionHeader({ title, sub, action, onAction }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
      <div>
        <div style={{ fontSize:"18px", fontWeight:700, color:C.navy, fontFamily:"'Georgia', serif" }}>{title}</div>
        {sub && <div style={{ fontSize:"13px", color:C.gray, marginTop:"2px" }}>{sub}</div>}
      </div>
      {action && <button onClick={onAction} style={{ padding:"7px 16px", borderRadius:"8px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.blue, fontSize:"12px", fontWeight:700, cursor:"pointer" }}>{action}</button>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META["Applied"];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"20px", background:m.bg, border:`1px solid ${m.border}`, color:m.color, fontSize:"11px", fontWeight:700, whiteSpace:"nowrap" }}>
      {m.icon} {status}
    </span>
  );
}

export function LogoBox({ logo, lc, size=40 }) {
  return (
    <div style={{ width:`${size}px`, height:`${size}px`, borderRadius:`${size/4}px`, background:lc+"18", border:`1.5px solid ${lc}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:`${size/3}px`, fontWeight:800, color:lc, flexShrink:0 }}>
      {logo}
    </div>
  );
}