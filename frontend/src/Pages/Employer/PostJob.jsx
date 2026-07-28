import { useEffect, useState } from "react";
import { createJob, updateJob } from "./employerApi";

const C = { navy:"#07192E", blue:"#1565C0", blueAcc:"#2196F3", white:"#FFFFFF", offWhite:"#F7FAFF", border:"#DDEAFC", gray:"#6B7A99", grayDark:"#3D4A63", red:"#DC2626", redPale:"#FEF2F2" };
const EMPTY_JOB = { title:"", dept:"Engineering", type:"Full Time", loc:"", salary:"", desc:"", status:"Active" };

export default function PostJob({ editJob, setEditJob, setPage, companyId, onSaved }) {
  const isEdit = Boolean(editJob);
  const [form, setForm] = useState(EMPTY_JOB);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(isEdit ? {
      title: editJob.title || "",
      dept: editJob.dept || "Engineering",
      type: editJob.type || "Full Time",
      loc: editJob.loc || "",
      salary: editJob.salary || "",
      desc: editJob.desc || "",
      status: editJob.status || "Active",
    } : EMPTY_JOB);
  }, [editJob, isEdit]);

  const inputStyle = { width:"100%", padding:"12px 14px", borderRadius:9, border:`1.5px solid ${C.border}`, background:C.offWhite, fontSize:14, color:C.navy, outline:"none", boxSizing:"border-box" };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.loc.trim()) {
      setError("Job title and location are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      department: form.dept,
      jobType: form.type,
      location: form.loc.trim(),
      salary: form.salary.trim(),
      description: form.desc.trim(),
      status: form.status,
      company: companyId,
      companyId,
    };

    try {
      setSaving(true);
      setError("");
      if (isEdit) await updateJob(editJob.id, payload);
      else await createJob(payload);
      await onSaved();
      setEditJob(null);
      setPage("jobs");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth:720 }}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:19, fontWeight:700, color:C.navy, fontFamily:"Georgia, serif" }}>{isEdit ? `Edit: ${editJob.title}` : "Post a New Job"}</div>
        <div style={{ fontSize:13, color:C.gray }}>{isEdit ? "Update the job information" : "The job will be saved to your company"}</div>
      </div>

      {error && <div style={{ marginBottom:14, padding:12, borderRadius:8, background:C.redPale, color:C.red }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:28, marginBottom:18 }}>
          <label>Job Title *</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title:e.target.value })} style={inputStyle} />

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:16 }}>
            <div><label>Department</label><select value={form.dept} onChange={(e) => setForm({ ...form, dept:e.target.value })} style={inputStyle}>{["Engineering","Design","Marketing","Product","Operations","Finance","HR"].map((v) => <option key={v}>{v}</option>)}</select></div>
            <div><label>Job Type</label><select value={form.type} onChange={(e) => setForm({ ...form, type:e.target.value })} style={inputStyle}>{["Full Time","Part Time","Contract","Hybrid","Remote"].map((v) => <option key={v}>{v}</option>)}</select></div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginTop:16 }}>
            <div><label>Location *</label><input value={form.loc} onChange={(e) => setForm({ ...form, loc:e.target.value })} style={inputStyle} /></div>
            <div><label>Salary Range</label><input value={form.salary} onChange={(e) => setForm({ ...form, salary:e.target.value })} style={inputStyle} /></div>
          </div>

          <div style={{ marginTop:16 }}><label>Description</label><textarea rows={8} value={form.desc} onChange={(e) => setForm({ ...form, desc:e.target.value })} style={{ ...inputStyle, resize:"vertical" }} /></div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button type="button" onClick={() => { setEditJob(null); setPage("jobs"); }} style={{ flex:1, padding:13 }}>Cancel</button>
          <button type="submit" disabled={saving} style={{ flex:3, padding:13, border:"none", borderRadius:10, background:`linear-gradient(135deg,${C.blue},${C.blueAcc})`, color:"#fff", fontWeight:700 }}>{saving ? "Saving…" : isEdit ? "Save Changes" : "Publish Job"}</button>
        </div>
      </form>
    </div>
  );
}
