import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
/* ============================================================
   DATA MODEL
   ============================================================ */

const createId = () => Math.random().toString(36).slice(2, 9);

const emptyExperience = () => ({
  id: createId(),
  role: "",
  company: "",
  location: "",
  start: "",
  end: "",
  current: false,
  description: "",
});

const emptyEducation = () => ({
  id: createId(),
  degree: "",
  school: "",
  location: "",
  start: "",
  end: "",
  description: "",
});

const emptyLanguage = () => ({ id: createId(), name: "", level: "Professional" });
const emptyProject = () => ({ id: createId(), name: "", link: "", description: "" });
const emptyCertification = () => ({ id: createId(), name: "", issuer: "", year: "" });

const LANGUAGE_LEVELS = ["Native", "Fluent", "Professional", "Conversational", "Basic"];



const blankData = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
  },
  summary: "",
  skills: [],
  experience: [emptyExperience()],
  education: [emptyEducation()],
  languages: [emptyLanguage()],
  projects: [],
  certifications: [],
};

// Sample data so every template has something realistic to preview
// before the person fills in their own details.
const getStoredUser = () => {
  return JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null"
  );
};

const getStoredToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const createInitialData = () => {
  const user = getStoredUser();

  return {
    personal: {
      fullName: user?.fullName || "",
      jobTitle: user?.role || "",
      email: user?.email || "",
      phone: user?.phoneNo || "",
      location: [user?.address, user?.postalCode, user?.country]
        .filter(Boolean)
        .join(", "),
      linkedin: "",
      website: "",
    },
    summary: "",
    skills: [],
    experience: [emptyExperience()],
    education: [emptyEducation()],
    languages: [emptyLanguage()],
    projects: [],
    certifications: [],
  };
};

function normalizeCVData(savedData = {}) {
  const initialData = createInitialData();

  return {
    personal: {
      ...initialData.personal,
      ...(savedData.personal || {}),
    },
    summary: typeof savedData.summary === "string" ? savedData.summary : "",
    skills: Array.isArray(savedData.skills) ? savedData.skills : [],
    experience:
      Array.isArray(savedData.experience) && savedData.experience.length > 0
        ? savedData.experience.map((item) => ({
            ...emptyExperience(),
            ...(item || {}),
            id: item?.id || createId(),
          }))
        : [emptyExperience()],
    education:
      Array.isArray(savedData.education) && savedData.education.length > 0
        ? savedData.education.map((item) => ({
            ...emptyEducation(),
            ...(item || {}),
            id: item?.id || createId(),
          }))
        : [emptyEducation()],
    languages:
      Array.isArray(savedData.languages) && savedData.languages.length > 0
        ? savedData.languages.map((item) => ({
            ...emptyLanguage(),
            ...(item || {}),
            id: item?.id || createId(),
          }))
        : [emptyLanguage()],
    projects: Array.isArray(savedData.projects)
      ? savedData.projects.map((item) => ({
          ...emptyProject(),
          ...(item || {}),
          id: item?.id || createId(),
        }))
      : [],
    certifications: Array.isArray(savedData.certifications)
      ? savedData.certifications.map((item) => ({
          ...emptyCertification(),
          ...(item || {}),
          id: item?.id || createId(),
        }))
      : [],
  };
}

const templateList = [
  { id: "modern", name: "Modern Professional", desc: "Clean two-column layout, great for tech & product roles." },
  { id: "europass", name: "Europass Style", desc: "Familiar European format, ideal for EU applications." },
  { id: "minimal", name: "Minimal ATS", desc: "Single column, no graphics — built to pass ATS screening." },
  { id: "executive", name: "Executive", desc: "Bold dark sidebar with a timeline for senior roles." },
];

function formatRange(start, end, current) {
  if (!start && !end && !current) return "";
  return `${start || ""} – ${current ? "Present" : end || ""}`;
}

/* ============================================================
   PDF GENERATION
   ------------------------------------------------------------
   The original bug: html2canvas captured the preview into ONE
   image and stretched it onto a single A4 page, so anything
   longer than one page got squished or cut off. This version
   slices the captured canvas into A4-height chunks and adds
   each chunk as its own PDF page.

   Note: html2canvas can't parse modern CSS color functions like
   oklch(), which Tailwind v4's default palette uses. If download
   throws a color-parsing error on Tailwind v4, swap the
   `html2canvas` import for `html2canvas-pro` (same API).
   ============================================================ */

async function generatePdfFromElement(element, filename = "cv.pdf") {
  if (!element) throw new Error("Nothing to export yet — the preview isn't mounted.");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidthMm = pdf.internal.pageSize.getWidth();
  const pageHeightMm = pdf.internal.pageSize.getHeight();

  const pxPerMm = canvas.width / pageWidthMm;
  const pageHeightPx = Math.floor(pageHeightMm * pxPerMm);

  let renderedHeightPx = 0;
  let pageIndex = 0;

  while (renderedHeightPx < canvas.height) {
    const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedHeightPx);

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeightPx;

    const ctx = pageCanvas.getContext("2d");
    ctx.drawImage(
      canvas,
      0,
      renderedHeightPx,
      canvas.width,
      sliceHeightPx,
      0,
      0,
      canvas.width,
      sliceHeightPx
    );

    const imgData = pageCanvas.toDataURL("image/png");
    const sliceHeightMm = sliceHeightPx / pxPerMm;

    if (pageIndex > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, pageWidthMm, sliceHeightMm);

    renderedHeightPx += sliceHeightPx;
    pageIndex += 1;
  }

  pdf.save(filename);
}

/* ============================================================
   SMALL FORM PRIMITIVES
   ============================================================ */

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <input className="input-style" {...props} />
    </label>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <textarea className="input-style" {...props} />
    </label>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-slate-500">{label}</span>
      <select className="input-style" {...props}>
        {children}
      </select>
    </label>
  );
}

function FormSection({ title, subtitle, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <h3 className="text-base font-bold text-[#07192E]">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
        <span className={`text-blue-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      {open && <div className="space-y-3 border-t border-blue-50 px-5 py-5">{children}</div>}
    </div>
  );
}

function TemplateCard({ template, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-lg ${
        selected ? "border-blue-600 shadow-lg" : "border-blue-100"
      }`}
    >
      <div className="mb-4 h-32 rounded-xl border border-blue-100 bg-[#F7FAFF] p-4">
        <div className="mb-3 h-4 w-24 rounded bg-blue-700" />
        <div className="mb-2 h-2 w-full rounded bg-blue-100" />
        <div className="mb-2 h-2 w-4/5 rounded bg-blue-100" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-12 rounded bg-white" />
          <div className="h-12 rounded bg-white" />
        </div>
      </div>
      <h3 className="text-base font-bold text-[#07192E]">{template.name}</h3>
      <p className="mt-1 text-xs text-slate-500">{template.desc}</p>
      <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
        {selected ? "Selected" : "Choose template"}
      </span>
    </button>
  );
}

/* ============================================================
   REPEATABLE SECTION EDITORS
   ============================================================ */

function SkillsEditor({ skills, onChange }) {
  const [draft, setDraft] = useState("");
  const safeSkills = Array.isArray(skills) ? skills : [];


  function addSkill() {
    const value = draft.trim();
    if (!value || safeSkills.includes(value)) return;
    onChange([...safeSkills, value]);
    setDraft("");
  }
  function removeSkill(skill) {
    onChange(safeSkills.filter((s) => s !== skill));
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g. React.js"
          className="input-style"
        />
        <button
          type="button"
          onClick={addSkill}
          className="shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {safeSkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-blue-400 hover:text-blue-700"
              aria-label={`Remove ${skill}`}
            >
              ×
            </button>
          </span>
        ))}
        {safeSkills.length === 0 && <p className="text-xs text-slate-400">No skills added yet.</p>}
      </div>
    </div>
  );
}

function ExperienceEditor({ items, onChange }) {
    const safeItems = Array.isArray(items) ? items : [];

  function update(id, patch) {
    onChange(safeItems.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  function remove(id) {
    onChange(safeItems.filter((item) => item.id !== id));
  }
  function add() {
    onChange([...safeItems, emptyExperience()]);
  }

 

  return (
    <div className="space-y-5">
      {safeItems.map((item, index) => (
        <div key={item.id} className="relative rounded-xl border border-blue-100 bg-[#F7FAFF] p-4">
          {safeItems.length > 1 && (
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="absolute right-3 top-3 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          )}
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Role {index + 1}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Job title"
              value={item.role}
              onChange={(e) => update(item.id, { role: e.target.value })}
              placeholder="Frontend Developer"
            />
            <Field
              label="Company"
              value={item.company}
              onChange={(e) => update(item.id, { company: e.target.value })}
              placeholder="Acme Inc."
            />
            <Field
              label="Location"
              value={item.location}
              onChange={(e) => update(item.id, { location: e.target.value })}
              placeholder="Berlin, Germany"
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Start"
                value={item.start}
                onChange={(e) => update(item.id, { start: e.target.value })}
                placeholder="Jan 2022"
              />
              <Field
                label="End"
                value={item.current ? "Present" : item.end}
                disabled={item.current}
                onChange={(e) => update(item.id, { end: e.target.value })}
                placeholder="Mar 2024"
              />
            </div>
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-600">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => update(item.id, { current: e.target.checked })}
            />
            I currently work here
          </label>
          <div className="mt-3">
            <TextAreaField
              label="Description"
              rows={3}
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Key responsibilities and achievements..."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border-2 border-dashed border-blue-200 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        + Add experience
      </button>
    </div>
  );
}

function EducationEditor({ items, onChange }) {
    const safeItems = Array.isArray(items) ? items : [];

  function update(id, patch) {
    onChange(safeItems.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  function remove(id) {
    onChange(safeItems.filter((item) => item.id !== id));
  }
  function add() {
    onChange([...safeItems, emptyEducation()]);
  }

  return (
    <div className="space-y-5">
      {safeItems.map((item, index) => (
        <div key={item.id} className="relative rounded-xl border border-blue-100 bg-[#F7FAFF] p-4">
          {safeItems.length > 1 && (
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="absolute right-3 top-3 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          )}
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Education {index + 1}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Degree"
              value={item.degree}
              onChange={(e) => update(item.id, { degree: e.target.value })}
              placeholder="MSc Information Technology"
            />
            <Field
              label="School"
              value={item.school}
              onChange={(e) => update(item.id, { school: e.target.value })}
              placeholder="MDH University"
            />
            <Field
              label="Location"
              value={item.location}
              onChange={(e) => update(item.id, { location: e.target.value })}
              placeholder="Stockholm, Sweden"
            />
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Start"
                value={item.start}
                onChange={(e) => update(item.id, { start: e.target.value })}
                placeholder="2019"
              />
              <Field
                label="End"
                value={item.end}
                onChange={(e) => update(item.id, { end: e.target.value })}
                placeholder="2021"
              />
            </div>
          </div>
          <div className="mt-3">
            <TextAreaField
              label="Notes (optional)"
              rows={2}
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Relevant coursework, honors, thesis..."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border-2 border-dashed border-blue-200 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        + Add education
      </button>
    </div>
  );
}

function LanguagesEditor({ items, onChange }) {
  const safeItems = Array.isArray(items) ? items : [];
  function update(id, patch) {
    onChange(safeItems.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  function remove(id) {
    onChange(safeItems.filter((item) => item.id !== id));
  }
  function add() {
    onChange([...safeItems, emptyLanguage()]);
  }

  return (
    <div className="space-y-3">
      {safeItems.map((item, index) => (
        <div key={item.id} className="flex items-end gap-2 rounded-xl border border-blue-100 bg-[#F7FAFF] p-3">
          <div className="flex-1">
            <Field
              label={`Language ${index + 1}`}
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="English"
            />
          </div>
          <div className="w-36">
            <SelectField label="Level" value={item.level} onChange={(e) => update(item.id, { level: e.target.value })}>
              {LANGUAGE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </SelectField>
          </div>
          {safeItems.length > 1 && (
            <button
              type="button"
              onClick={() => remove(item.id)}
              className="mb-1 text-xs font-semibold text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border-2 border-dashed border-blue-200 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        + Add language
      </button>
    </div>
  );
}

function ProjectsEditor({ items, onChange }) {
  const safeItems = Array.isArray(items) ? items : [];

  function update(id, patch) {
    onChange(safeItems.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  function remove(id) {
    onChange(safeItems.filter((item) => item.id !== id));
  }
  function add() {
    onChange([...safeItems, emptyProject()]);
  }

  return (
    <div className="space-y-5">
      {safeItems.map((item, index) => (
        <div key={item.id} className="relative rounded-xl border border-blue-100 bg-[#F7FAFF] p-4">
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="absolute right-3 top-3 text-xs font-semibold text-red-500 hover:text-red-600"
          >
            Remove
          </button>
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-blue-700">Project {index + 1}</p>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Project name"
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="CV Builder"
            />
            <Field
              label="Link (optional)"
              value={item.link}
              onChange={(e) => update(item.id, { link: e.target.value })}
              placeholder="github.com/you/project"
            />
          </div>
          <div className="mt-3">
            <TextAreaField
              label="Description"
              rows={2}
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="What it does and the impact it had..."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border-2 border-dashed border-blue-200 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        + Add project
      </button>
    </div>
  );
}

function CertificationsEditor({ items, onChange }) {
  const safeItems = Array.isArray(items) ? items : [];

  function update(id, patch) {
    onChange(safeItems.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  function remove(id) {
    onChange(safeItems.filter((item) => item.id !== id));
  }
  function add() {
    onChange([...safeItems, emptyCertification()]);
  }

  return (
    <div className="space-y-3">
      {safeItems.map((item, index) => (
        <div key={item.id} className="relative grid grid-cols-3 gap-2 rounded-xl border border-blue-100 bg-[#F7FAFF] p-3">
          <Field
            label={`Certification ${index + 1}`}
            value={item.name}
            onChange={(e) => update(item.id, { name: e.target.value })}
            placeholder="AWS Solutions Architect"
          />
          <Field
            label="Issuer"
            value={item.issuer}
            onChange={(e) => update(item.id, { issuer: e.target.value })}
            placeholder="Amazon"
          />
          <Field
            label="Year"
            value={item.year}
            onChange={(e) => update(item.id, { year: e.target.value })}
            placeholder="2024"
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="absolute right-3 top-3 text-xs font-semibold text-red-500 hover:text-red-600"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-full rounded-xl border-2 border-dashed border-blue-200 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
      >
        + Add certification
      </button>
    </div>
  );
}

/* ============================================================
   TEMPLATES
   ============================================================ */

function ModernTemplate({ data }) {
  const { personal = [], summary = [], skills = [], experience = [], education = [], languages = [], projects = [], certifications = [] } = data;
  const hasExperience = experience.filter((e) => e.role || e.company).length > 0;
  const hasEducation = education.filter((e) => e.degree || e.school).length > 0;
  const namedLanguages = languages.filter((l) => l.name);
  const namedCertifications = certifications.filter((c) => c.name);
  const namedProjects = projects.filter((p) => p.name);

  const Section = ({ title, children }) => (
    <section className="mb-7">
      <h2 className="mb-3 border-b-2 border-blue-600 pb-1 text-sm font-bold uppercase tracking-wider text-blue-700">
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div className="min-h-[1122px] w-[794px] bg-white text-[#07192E]">
      <div className="bg-gradient-to-r from-[#07192E] to-blue-700 px-10 py-10 text-white">
        <h1 className="text-4xl font-bold">{personal.fullName || "Your Name"}</h1>
        <p className="mt-2 text-xl text-blue-100">{personal.jobTitle || "Job Title"}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-blue-100">
          <span>{personal.email || "email@example.com"}</span>
          <span>{personal.phone || "+49 000 000000"}</span>
          <span>{personal.location || "Berlin, Germany"}</span>
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-8 px-10 py-8">
        <aside>
          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">Add your top skills</p>
              )}
            </div>
          </Section>

          <Section title="Languages">
            <div className="space-y-1 text-sm text-slate-600">
              {namedLanguages.length > 0 ? (
                namedLanguages.map((l) => (
                  <p key={l.id}>
                    {l.name} <span className="text-slate-400">— {l.level}</span>
                  </p>
                ))
              ) : (
                <p className="text-slate-400">English — Fluent</p>
              )}
            </div>
          </Section>

          {namedCertifications.length > 0 && (
            <Section title="Certifications">
              <div className="space-y-2 text-sm text-slate-600">
                {namedCertifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-[#07192E]">{c.name}</p>
                    <p className="text-xs text-slate-400">{[c.issuer, c.year].filter(Boolean).join(" · ")}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </aside>

        <main>
          <Section title="Profile">
            <p className="text-sm leading-7 text-slate-600">
              {summary ||
                "Motivated professional with experience in software development, problem solving, and teamwork."}
            </p>
          </Section>

          <Section title="Experience">
            <div className="space-y-5">
              {hasExperience ? (
                experience
                  .filter((e) => e.role || e.company)
                  .map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-[#07192E]">
                          {e.role || "Role"} <span className="font-normal text-slate-500">· {e.company}</span>
                        </p>
                        <p className="shrink-0 text-xs font-medium text-slate-400">
                          {formatRange(e.start, e.end, e.current)}
                        </p>
                      </div>
                      {e.location && <p className="text-xs text-slate-400">{e.location}</p>}
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">{e.description}</p>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-slate-400">Add your work experience</p>
              )}
            </div>
          </Section>

          <Section title="Education">
            <div className="space-y-4">
              {hasEducation ? (
                education
                  .filter((e) => e.degree || e.school)
                  .map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-bold text-[#07192E]">
                          {e.degree || "Degree"} <span className="font-normal text-slate-500">· {e.school}</span>
                        </p>
                        <p className="shrink-0 text-xs font-medium text-slate-400">
                          {formatRange(e.start, e.end, false)}
                        </p>
                      </div>
                      {e.description && <p className="mt-1 text-sm leading-6 text-slate-600">{e.description}</p>}
                    </div>
                  ))
              ) : (
                <p className="text-sm text-slate-400">Add your education</p>
              )}
            </div>
          </Section>

          {namedProjects.length > 0 && (
            <Section title="Projects">
              <div className="space-y-3">
                {namedProjects.map((p) => (
                  <div key={p.id}>
                    <p className="font-bold text-[#07192E]">
                      {p.name} {p.link && <span className="font-normal text-blue-600">({p.link})</span>}
                    </p>
                    <p className="text-sm leading-6 text-slate-600">{p.description}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </main>
      </div>
    </div>
  );
}

function EuropassTemplate({ data }) {
  const { personal = [], summary = [], skills = [], experience = [], education = [], languages = [], projects = [], certifications = [] } = data;
  const hasExperience = experience.filter((e) => e.role || e.company).length > 0;
  const hasEducation = education.filter((e) => e.degree || e.school).length > 0;
  const namedLanguages = languages.filter((l) => l.name);
  const namedCertifications = certifications.filter((c) => c.name);
  const namedProjects = projects.filter((p) => p.name);

  const SidebarSection = ({ title, children }) => (
    <div className="mb-8 text-sm">
      <h3 className="mb-3 border-b border-blue-300 pb-1 font-bold uppercase text-blue-700">{title}</h3>
      <div className="space-y-1 text-slate-700">{children}</div>
    </div>
  );

  const Block = ({ title, children }) => (
    <section className="mb-8">
      <h2 className="mb-3 border-b-2 border-blue-700 pb-1 text-lg font-bold text-blue-700">{title}</h2>
      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">{children}</p>
    </section>
  );

  return (
    <div className="min-h-[1122px] w-[794px] bg-white text-[#07192E]">
      <div className="border-b-4 border-blue-700 px-10 py-8">
        <h1 className="text-3xl font-bold uppercase tracking-wide">{personal.fullName || "Your Name"}</h1>
        <p className="mt-2 text-lg font-semibold text-blue-700">{personal.jobTitle || "Curriculum Vitae"}</p>
      </div>

      <div className="grid grid-cols-[230px_1fr]">
        <aside className="min-h-[1000px] bg-blue-50 px-6 py-8">
          <SidebarSection title="Personal info">
            <p>{personal.email || "email@example.com"}</p>
            <p>{personal.phone || "+49 000 000000"}</p>
            <p>{personal.location || "Berlin, Germany"}</p>
            {personal.linkedin && <p>{personal.linkedin}</p>}
            {personal.website && <p>{personal.website}</p>}
          </SidebarSection>

          <SidebarSection title="Skills">
            <ul className="list-disc space-y-1 pl-4">
              {skills.length > 0 ? (
                skills.map((skill) => <li key={skill}>{skill}</li>)
              ) : (
                <li className="text-slate-400">Add your top skills</li>
              )}
            </ul>
          </SidebarSection>

          <SidebarSection title="Languages">
            <div className="space-y-1">
              {namedLanguages.length > 0 ? (
                namedLanguages.map((l) => (
                  <p key={l.id}>
                    {l.name} <span className="text-slate-400">— {l.level}</span>
                  </p>
                ))
              ) : (
                <p className="text-slate-400">English — Fluent</p>
              )}
            </div>
          </SidebarSection>

          {namedCertifications.length > 0 && (
            <SidebarSection title="Certifications">
              <div className="space-y-2">
                {namedCertifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-xs text-slate-500">{[c.issuer, c.year].filter(Boolean).join(" · ")}</p>
                  </div>
                ))}
              </div>
            </SidebarSection>
          )}
        </aside>

        <main className="px-8 py-8">
          <Block title="Profile">
            {summary ||
              "A motivated candidate seeking opportunities to grow professionally and contribute to a modern organization."}
          </Block>

          <section className="mb-8">
            <h2 className="mb-3 border-b-2 border-blue-700 pb-1 text-lg font-bold text-blue-700">Work Experience</h2>
            <div className="space-y-4">
              {hasExperience ? (
                experience
                  .filter((e) => e.role || e.company)
                  .map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <p className="font-bold">
                          {e.role || "Role"} <span className="font-normal text-slate-500">· {e.company}</span>
                        </p>
                        <p className="shrink-0 text-xs text-slate-400">{formatRange(e.start, e.end, e.current)}</p>
                      </div>
                      <p className="mt-1 whitespace-pre-line text-sm leading-7 text-slate-700">{e.description}</p>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-slate-400">Add your work experience</p>
              )}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 border-b-2 border-blue-700 pb-1 text-lg font-bold text-blue-700">
              Education and Training
            </h2>
            <div className="space-y-4">
              {hasEducation ? (
                education
                  .filter((e) => e.degree || e.school)
                  .map((e) => (
                    <div key={e.id}>
                      <div className="flex items-baseline justify-between gap-3 text-sm">
                        <p className="font-bold">
                          {e.degree || "Degree"} <span className="font-normal text-slate-500">· {e.school}</span>
                        </p>
                        <p className="shrink-0 text-xs text-slate-400">{formatRange(e.start, e.end, false)}</p>
                      </div>
                      {e.description && <p className="mt-1 text-sm leading-7 text-slate-700">{e.description}</p>}
                    </div>
                  ))
              ) : (
                <p className="text-sm text-slate-400">Add your education</p>
              )}
            </div>
          </section>

          {namedProjects.length > 0 && (
            <Block title="Projects">
              {namedProjects.map((p) => `${p.name}${p.link ? ` (${p.link})` : ""}\n${p.description}`).join("\n\n")}
            </Block>
          )}
        </main>
      </div>
    </div>
  );
}

function MinimalTemplate({ data }) {
  const { personal = [], summary = [], skills = [], experience = [], education = [], languages = [], projects = [], certifications = [] } = data;
  const hasExperience = experience.filter((e) => e.role || e.company).length > 0;
  const hasEducation = education.filter((e) => e.degree || e.school).length > 0;
  const namedLanguages = languages.filter((l) => l.name);
  const namedCertifications = certifications.filter((c) => c.name);
  const namedProjects = projects.filter((p) => p.name);

  const contactLine = [personal.email, personal.phone, personal.location, personal.linkedin, personal.website]
    .filter(Boolean)
    .join("  ·  ");

  const Section = ({ title, children }) => (
    <section className="mb-6">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{title}</h2>
      {children}
    </section>
  );

  return (
    <div className="min-h-[1122px] w-[794px] bg-white px-14 py-12 text-[#1B2433]">
      <header className="mb-8 border-b border-slate-300 pb-6">
        <h1 className="text-3xl font-bold tracking-tight">{personal.fullName || "Your Name"}</h1>
        <p className="mt-1 text-base text-slate-600">{personal.jobTitle || "Job Title"}</p>
        <p className="mt-3 text-xs text-slate-500">
          {contactLine || "email@example.com  ·  +49 000 000000  ·  Berlin, Germany"}
        </p>
      </header>

      <Section title="Summary">
        <p className="text-sm leading-7 text-slate-700">
          {summary || "Motivated professional with experience in software development, problem solving, and teamwork."}
        </p>
      </Section>

      <Section title="Experience">
        <div className="space-y-4">
          {hasExperience ? (
            experience
              .filter((e) => e.role || e.company)
              .map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <p className="font-semibold">
                      {e.role || "Role"}, {e.company}
                    </p>
                    <p className="shrink-0 text-xs text-slate-500">{formatRange(e.start, e.end, e.current)}</p>
                  </div>
                  {e.location && <p className="text-xs text-slate-400">{e.location}</p>}
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{e.description}</p>
                </div>
              ))
          ) : (
            <p className="text-sm text-slate-400">Add your work experience</p>
          )}
        </div>
      </Section>

      <Section title="Education">
        <div className="space-y-3">
          {hasEducation ? (
            education
              .filter((e) => e.degree || e.school)
              .map((e) => (
                <div key={e.id}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <p className="font-semibold">
                      {e.degree || "Degree"}, {e.school}
                    </p>
                    <p className="shrink-0 text-xs text-slate-500">{formatRange(e.start, e.end, false)}</p>
                  </div>
                  {e.description && <p className="mt-1 text-sm leading-6 text-slate-700">{e.description}</p>}
                </div>
              ))
          ) : (
            <p className="text-sm text-slate-400">Add your education</p>
          )}
        </div>
      </Section>

      <Section title="Skills">
        <p className="text-sm leading-7 text-slate-700">{skills.length > 0 ? skills.join("  ·  ") : "Add your top skills"}</p>
      </Section>

      {namedLanguages.length > 0 && (
        <Section title="Languages">
          <p className="text-sm leading-7 text-slate-700">
            {namedLanguages.map((l) => `${l.name} (${l.level})`).join("  ·  ")}
          </p>
        </Section>
      )}

      {namedProjects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-2">
            {namedProjects.map((p) => (
              <div key={p.id}>
                <p className="text-sm font-semibold">
                  {p.name} {p.link && <span className="font-normal text-slate-500">({p.link})</span>}
                </p>
                <p className="text-sm leading-6 text-slate-700">{p.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {namedCertifications.length > 0 && (
        <Section title="Certifications">
          <p className="text-sm leading-7 text-slate-700">
            {namedCertifications.map((c) => [c.name, c.issuer, c.year].filter(Boolean).join(", ")).join("  ·  ")}
          </p>
        </Section>
      )}
    </div>
  );
}

function ExecutiveTemplate({ data = [] }) {
  const { personal = [], summary = [], skills = [], experience = [], education = [], languages = [], projects = [], certifications = [] } = data;
  const hasExperience = experience.filter((e) => e.role || e.company).length > 0;
  const hasEducation = education.filter((e) => e.degree || e.school).length > 0;
  const namedLanguages = languages.filter((l) => l.name);
  const namedCertifications = certifications.filter((c) => c.name);
  const namedProjects = projects.filter((p) => p.name);

  const SidebarSection = ({ title, children }) => (
    <div className="mt-8">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">{title}</h3>
      {children}
    </div>
  );

  const Section = ({ title, children }) => (
    <section className="mb-8">
      <h2 className="mb-3 border-b-2 border-[#0B1F3A] pb-1 text-sm font-bold uppercase tracking-wider text-[#0B1F3A]">
        {title}
      </h2>
      {children}
    </section>
  );

  return (
    <div className="grid min-h-[1122px] w-[794px] grid-cols-[270px_1fr] bg-white text-[#1B2433]">
      <aside className="bg-[#0B1F3A] px-7 py-10 text-white">
        <h1 className="text-2xl font-bold leading-tight">{personal.fullName || "Your Name"}</h1>
        <p className="mt-1 text-sm font-medium uppercase tracking-wide text-amber-400">
          {personal.jobTitle || "Job Title"}
        </p>

        <div className="mt-8 space-y-1 text-xs text-slate-300">
          <p>{personal.email || "email@example.com"}</p>
          <p>{personal.phone || "+49 000 000000"}</p>
          <p>{personal.location || "Berlin, Germany"}</p>
          {personal.linkedin && <p>{personal.linkedin}</p>}
          {personal.website && <p>{personal.website}</p>}
        </div>

        <SidebarSection title="Skills">
          <div className="flex flex-wrap gap-1.5">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <span key={skill} className="rounded bg-white/10 px-2 py-1 text-[11px] font-medium">
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400">Add your top skills</p>
            )}
          </div>
        </SidebarSection>

        <SidebarSection title="Education">
          <div className="space-y-3 text-xs text-slate-300">
            {hasEducation ? (
              education
                .filter((e) => e.degree || e.school)
                .map((e) => (
                  <div key={e.id}>
                    <p className="font-semibold text-white">{e.degree || "Degree"}</p>
                    <p>{e.school}</p>
                    <p className="text-slate-400">{formatRange(e.start, e.end, false)}</p>
                  </div>
                ))
            ) : (
              <p className="text-slate-400">Add your education</p>
            )}
          </div>
        </SidebarSection>

        {namedLanguages.length > 0 && (
          <SidebarSection title="Languages">
            <div className="space-y-1 text-xs text-slate-300">
              {namedLanguages.map((l) => (
                <p key={l.id}>
                  {l.name} <span className="text-slate-500">— {l.level}</span>
                </p>
              ))}
            </div>
          </SidebarSection>
        )}

        {namedCertifications.length > 0 && (
          <SidebarSection title="Certifications">
            <div className="space-y-2 text-xs text-slate-300">
              {namedCertifications.map((c) => (
                <div key={c.id}>
                  <p className="font-semibold text-white">{c.name}</p>
                  <p className="text-slate-400">{[c.issuer, c.year].filter(Boolean).join(" · ")}</p>
                </div>
              ))}
            </div>
          </SidebarSection>
        )}
      </aside>

      <main className="px-9 py-10">
        <Section title="Executive Profile">
          <p className="text-sm leading-7 text-slate-700">
            {summary ||
              "Results-driven leader with a track record of building high-performing teams and delivering measurable business impact."}
          </p>
        </Section>

        <Section title="Experience">
          <div className="space-y-6 border-l-2 border-amber-400/40 pl-5">
            {hasExperience ? (
              experience
                .filter((e) => e.role || e.company)
                .map((e) => (
                  <div key={e.id} className="relative">
                    <span className="absolute -left-[27px] top-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-bold text-[#0B1F3A]">
                        {e.role || "Role"} <span className="font-normal text-slate-500">· {e.company}</span>
                      </p>
                      <p className="shrink-0 text-xs font-medium text-slate-400">
                        {formatRange(e.start, e.end, e.current)}
                      </p>
                    </div>
                    {e.location && <p className="text-xs text-slate-400">{e.location}</p>}
                    <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-600">{e.description}</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-slate-400">Add your work experience</p>
            )}
          </div>
        </Section>

        {namedProjects.length > 0 && (
          <Section title="Key Projects">
            <div className="space-y-3">
              {namedProjects.map((p) => (
                <div key={p.id}>
                  <p className="font-bold text-[#0B1F3A]">
                    {p.name} {p.link && <span className="font-normal text-amber-600">({p.link})</span>}
                  </p>
                  <p className="text-sm leading-6 text-slate-600">{p.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}

/* ============================================================
   MAIN APP
   ============================================================ */

export default function CVBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [data, setData] = useState(() => createInitialData());
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const previewRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadSavedCV() {
      const token = getStoredToken();

      if (!token) {
        if (active) {
          setData(createInitialData());
        }
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/cv", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load CV");
        }

        if (!active) return;

        if (result.cv?.data) {
          setData(normalizeCVData(result.cv.data));
          setSelectedTemplate(result.cv.template || "modern");
        } else {
          setData(createInitialData());
        }
      } catch (error) {
        console.error("Failed to load saved CV:", error);

        if (active) {
          toast.error(error.message || "Failed to load CV");
          setData(createInitialData());
        }
      }
    }

    loadSavedCV();

    return () => {
      active = false;
    };
  }, []);
  
  function updatePersonal(patch) {
    setData((prev) => ({ ...prev, personal: { ...prev.personal, ...patch } }));
  }

  async function downloadPDF() {
    setDownloadError("");
    setIsDownloading(true);
    try {
      const filename = `${data?.personal?.fullName || "my-cv"}.pdf`.trim().replace(/\s+/g, "-").toLowerCase();
      await generatePdfFromElement(previewRef.current, filename);
    } catch (err) {
      console.error(err);
      setDownloadError(`Couldn't generate the PDF: ${err.message || "unknown error, check the console."}`);
    } finally {
      setIsDownloading(false);
    }
  }
  const [saveMessage, setSaveMessage] = useState("");

  async function saveCVToBackend() {
    try {
      setSaveMessage("");

      const token = getStoredToken();

      if (!token) {
        toast.error("Please login again.");
        return;
      }

      const normalizedData = normalizeCVData(data);

      const response = await fetch("http://localhost:5000/api/auth/cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template: selectedTemplate,
          data: normalizedData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not save CV");
      }

      setData(normalizedData);
      toast.success("CV saved successfully!");
    } catch (error) {
      console.error("CV save error:", error);
      toast.error(error.message || "Failed to save CV.");
    }
  }

  function renderTemplate() {
    const safeData = normalizeCVData(data);

    switch (selectedTemplate) {
      case "europass":
        return <EuropassTemplate data={safeData} />;
      case "minimal":
        return <MinimalTemplate data={safeData} />;
      case "executive":
        return <ExecutiveTemplate data={safeData} />;
      default:
        return <ModernTemplate data={safeData} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAFF] px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-bold text-[#07192E]">CV Builder</h1>
          <p className="mt-2 text-slate-500">Choose a template, fill in your details, preview and download your CV.</p>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("This will clear the sample CV and all your entries. Continue?")) {
                setData(createInitialData());
              }
            }}
            className="mt-4 text-xs font-semibold text-blue-600 underline-offset-2 hover:underline"
          >
            Clear sample data &amp; start from scratch
          </button>
        </div>

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {templateList.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              selected={selectedTemplate === template.id}
              onClick={() => setSelectedTemplate(template.id)}
            />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="space-y-4">
            <FormSection title="Personal info" defaultOpen>
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Full name"
                  value={data.personal?.fullName || ""}
                  onChange={(e) => updatePersonal({ fullName: e.target.value })}
                  placeholder="Jane Doe"
                />
                <Field
                  label="Job title"
                  value={data.personal?.jobTitle || ""}
                  onChange={(e) => updatePersonal({ jobTitle: e.target.value })}
                  placeholder="Senior Frontend Developer"
                />
                <Field
                  label="Email"
                  value={data.personal?.email || ""}
                  onChange={(e) => updatePersonal({ email: e.target.value })}
                  placeholder="jane@email.com"
                />
                <Field
                  label="Phone"
                  value={data.personal?.phone || ""}
                  onChange={(e) => updatePersonal({ phone: e.target.value })}
                  placeholder="+49 000 000000"
                />
                <Field
                  label="Location"
                  value={data.personal?.location || ""}
                  onChange={(e) => updatePersonal({ location: e.target.value })}
                  placeholder="Berlin, Germany"
                />
                <Field
                  label="LinkedIn"
                  value={data.personal?.linkedin || ""}
                  onChange={(e) => updatePersonal({ linkedin: e.target.value })}
                  placeholder="linkedin.com/in/janedoe"
                />
                <Field
                  label="Website"
                  value={data.personal?.website || ""}
                  onChange={(e) => updatePersonal({ website: e.target.value })}
                  placeholder="janedoe.dev"
                />
              </div>
            </FormSection>

            <FormSection title="Professional summary" defaultOpen>
              <TextAreaField
                label="Summary"
                rows={4}
                value={data.summary || ""}
                onChange={(e) => setData((p) => ({ ...p, summary: e.target.value }))}
                placeholder="A short pitch about who you are and what you're great at."
              />
            </FormSection>

            <FormSection title="Skills" subtitle={`${Array.isArray(data.skills) ? data.skills.length : 0} added`}>
              <SkillsEditor skills={Array.isArray(data.skills) ? data.skills : []} onChange={(skills) => setData((p) => ({ ...p, skills }))} />
            </FormSection>

            <FormSection title="Work experience" subtitle={`${Array.isArray(data.experience) ? data.experience.length : 0} role(s)`}>
              <ExperienceEditor items={Array.isArray(data.experience) ? data.experience : []} onChange={(experience) => setData((p) => ({ ...p, experience }))} />
            </FormSection>

            <FormSection title="Education" subtitle={`${Array.isArray(data.education) ? data.education.length : 0} entr${Array.isArray(data.education) && data.education.length === 1 ? "y" : "ies"}`}>
              <EducationEditor items={Array.isArray(data.education) ? data.education : []} onChange={(education) => setData((p) => ({ ...p, education }))} />
            </FormSection>

            <FormSection title="Projects" subtitle="optional">
              <ProjectsEditor items={Array.isArray(data.projects) ? data.projects : []} onChange={(projects) => setData((p) => ({ ...p, projects }))} />
            </FormSection>

            <FormSection title="Certifications" subtitle="optional">
              <CertificationsEditor
                items={Array.isArray(data.certifications) ? data.certifications : []}
                onChange={(certifications) => setData((p) => ({ ...p, certifications }))}
              />
            </FormSection>

            <FormSection title="Languages">
              <LanguagesEditor items={Array.isArray(data.languages) ? data.languages : []} onChange={(languages) => setData((p) => ({ ...p, languages }))} />
            </FormSection>

            <button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="w-full rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 py-3 font-bold text-white shadow-lg disabled:opacity-60"
            >
              {isDownloading ? "Generating PDF..." : "Download CV as PDF"}
            </button>
            {downloadError && <p className="text-center text-xs font-medium text-red-500">{downloadError}</p>}

            <button
  onClick={saveCVToBackend}
  className="w-full rounded-xl bg-green-600 py-3 font-bold text-white shadow-lg hover:bg-green-700"
>
  Save CV
</button>

{saveMessage && (
  <p className="text-center text-xs font-medium text-blue-600">
    {saveMessage}
  </p>
)}
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#07192E]">Live Preview</h2>
              <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">A4 Preview</span>
            </div>

            <div className="overflow-auto rounded-2xl border border-blue-100 bg-slate-200 p-5">
              <div ref={previewRef} className="mx-auto bg-white">
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .input-style {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #DDEAFC;
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
          color: #07192E;
          background: white;
        }
        .input-style:focus {
          border-color: #1565C0;
          box-shadow: 0 0 0 3px rgba(21, 101, 192, 0.12);
        }
        .input-style:disabled {
          background: #F1F5F9;
          color: #94A3B8;
        }
      `}</style>
    </div>
  );
}