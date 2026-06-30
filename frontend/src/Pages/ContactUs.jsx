import { useState } from "react";

const offices = [
  { city: "New York", address: "350 Fifth Avenue, Suite 4200", country: "USA" },
  { city: "London", address: "30 St Mary Axe, Level 12", country: "UK" },
  { city: "Singapore", address: "1 Raffles Place, Tower 2", country: "SG" },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  // const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(null);

  const inputStyle = (field) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: "8px",
    border: `1.5px solid ${focused === field ? colors.blueMid : colors.border}`,
    background: focused === field ? colors.white : colors.offWhite,
    fontSize: "14px",
    color: colors.navy,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
  });

  const [submitted, setSubmitted] = useState(false);

  // const handleSubmit = () => {
  //   if (form.name && form.email && form.message) setSubmitted(true);
  // };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#DDEAFC] bg-[#F7FAFF] px-4 py-3 text-sm text-[#0A2540] outline-none transition-all focus:border-[#1976D2] focus:bg-white";

  const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.4px] text-[#3D4A63]";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[linear-gradient(150deg,#0A2540_0%,#0D3A6E_60%,#1565C0_100%)] px-12 py-[72px] text-center">
        <span className="mb-5 inline-block rounded-full border border-[rgba(66,165,245,0.3)] bg-[rgba(66,165,245,0.15)] px-4 py-1 text-xs font-semibold uppercase tracking-[1.4px] text-[#42A5F5]">
          Get in Touch
        </span>

        <h1 className="mb-4 font-serif text-5xl font-bold leading-tight tracking-[-1px] text-white">
          Let's Start a Conversation
        </h1>

        <p className="mx-auto max-w-[500px] text-base leading-7 text-white/65">
          Whether you're exploring a new initiative or ready to engage, our
          team responds within one business day.
        </p>
      </section>

      {/* Main Section */}
      <section className="mx-auto grid max-w-[1100px] grid-cols-[1fr_1.6fr] gap-14 px-12 py-[72px]">
        {/* Sidebar */}
        <div>
          <h3 className="mb-7 font-serif text-[22px] font-bold text-[#0A2540]">
            Contact Information
          </h3>

          {[
            {
              icon: "✉",
              label: "General Inquiries",
              val: "hello@nexvara.com",
            },
            {
              icon: "✉",
              label: "Business Development",
              val: "partners@nexvara.com",
            },
            {
              icon: "☏",
              label: "Global Headquarters",
              val: "+1 (212) 555-0190",
            },
            {
              icon: "☏",
              label: "Support Hotline",
              val: "+1 (800) 555-0444",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`mb-5 flex items-start gap-4 pb-5 ${
                i < 3 ? "border-b border-[#DDEAFC]" : ""
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#BBDEFB] bg-[#E3F2FD] text-[#1565C0]">
                {item.icon}
              </div>

              <div>
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#6B7A99]">
                  {item.label}
                </div>

                <div className="text-sm font-medium text-[#0A2540]">
                  {item.val}
                </div>
              </div>
            </div>
          ))}

          {/* Offices */}
          <div className="mt-2 rounded-xl bg-[linear-gradient(135deg,#0A2540_0%,#1A4A8A_100%)] p-6">
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[1.2px] text-[#42A5F5]">
              Global Offices
            </div>

            {offices.map((office, i) => (
              <div
                key={i}
                className={`${
                  i < 2
                    ? "mb-4 border-b border-white/10 pb-4"
                    : ""
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">
                    {office.city}
                  </span>

                  <span className="rounded bg-[rgba(66,165,245,0.2)] px-2 py-1 text-[10px] font-semibold tracking-[0.5px] text-[#42A5F5] border border-[rgba(66,165,245,0.3)]">
                    {office.country}
                  </span>
                </div>

                <div className="text-xs text-white/50">
                  {office.address}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="rounded-2xl border border-[#DDEAFC] bg-white px-9 py-10 shadow-[0_4px_40px_rgba(21,101,192,0.07)]">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#BBDEFB] bg-[#E3F2FD] text-3xl text-[#1565C0]">
                ✓
              </div>

              <h3 className="font-serif text-[26px] font-bold text-[#0A2540]">
                Message Received
              </h3>

              <p className="text-[15px] leading-7 text-[#6B7A99]">
                Thank you, <strong>{form.name}</strong>. A member of our team
                will be in touch within one business day.
              </p>

              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    email: "",
                    company: "",
                    subject: "",
                    message: "",
                  });
                }}
                className="mt-2 rounded-lg bg-[#1976D2] px-7 py-2.5 text-sm font-semibold text-white"
              >
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h3 className="mb-7 font-serif text-2xl font-bold text-[#0A2540]">
                Send Us a Message
              </h3>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    type="email"
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Subject</label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Message *</label>

                <textarea
                  rows={5}
                  placeholder="Tell us about your project, goals, or any questions you have..."
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={`${inputClass} resize-y leading-7`}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#6B7A99]">
                  * Required fields
                </span>

                <button
                  onClick={handleSubmit}
                  className="rounded-lg bg-[linear-gradient(135deg,#1976D2_0%,#0A2540_100%)] px-8 py-3 text-sm font-semibold tracking-[0.3px] text-white transition-opacity hover:opacity-90"
                >
                  Submit Message →
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#BBDEFB] bg-[#E3F2FD] px-12 py-9 text-center">
        <p className="text-sm text-[#6B7A99]">
          Prefer a direct conversation?{" "}
          <span className="cursor-pointer font-semibold text-[#1976D2]">
            Schedule a 30-minute discovery call
          </span>{" "}
          with one of our solutions consultants.
        </p>
      </section>
    </div>
  );
}
