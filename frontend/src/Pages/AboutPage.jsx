const teamMembers = [
  {
    name: "Alexandra Morgan",
    title: "Chief Executive Officer",
    initials: "AM",
    bio: "20+ years leading enterprise technology firms across North America and Europe.",
  },
  {
    name: "David Chen",
    title: "Chief Technology Officer",
    initials: "DC",
    bio: "Former Google engineer. Architect of our core infrastructure and product roadmap.",
  },
  {
    name: "Priya Nair",
    title: "Head of Design",
    initials: "PN",
    bio: "Award-winning designer with a passion for human-centered product experiences.",
  },
  {
    name: "Marcus Williams",
    title: "VP of Operations",
    initials: "MW",
    bio: "Operational strategist ensuring seamless delivery for 200+ enterprise clients.",
  },
];

const stats = [
  { value: "12+", label: "Years of Excellence" },
  { value: "200+", label: "Enterprise Clients" },
  { value: "98%", label: "Client Retention" },
  { value: "40+", label: "Countries Served" },
];

const values = [
  {
    icon: "⬡",
    title: "Integrity First",
    desc: "We hold ourselves to the highest ethical standards in every engagement.",
  },
  {
    icon: "◈",
    title: "Innovation-Driven",
    desc: "Constant reinvention keeps our clients ahead in rapidly changing markets.",
  },
  {
    icon: "◎",
    title: "Client-Centric",
    desc: "Every decision is guided by the measurable outcomes we deliver for clients.",
  },
  {
    icon: "⬟",
    title: "Global Perspective",
    desc: "Diverse teams. Inclusive solutions. A truly worldwide footprint.",
  },
];

const offices = [
  { city: "New York", address: "350 Fifth Avenue, Suite 4200", country: "USA" },
  { city: "London", address: "30 St Mary Axe, Level 12", country: "UK" },
  { city: "Singapore", address: "1 Raffles Place, Tower 2", country: "SG" },
];

// ─── ABOUT PAGE ──────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden text-center px-12 pt-[90px] pb-20"
        style={{
          background:
            "linear-gradient(150deg, #0A2540 0%, #0D3A6E 60%, #1565C0 100%)",
        }}
      >
        <div className="absolute -top-20 -right-20 w-[380px] h-[380px] rounded-full border border-[rgba(66,165,245,0.12)]" />
        <div className="absolute -bottom-16 -left-16 w-[280px] h-[280px] rounded-full border border-[rgba(66,165,245,0.08)]" />
        <div className="relative max-w-[700px] mx-auto">
          <span className="inline-block bg-[rgba(66,165,245,0.15)] border border-[rgba(66,165,245,0.3)] text-[#42A5F5] text-xs font-semibold tracking-[1.4px] uppercase px-4 py-[5px] rounded-full mb-[22px]">
            Our Story
          </span>
          <h1 className="font-['Georgia',serif] text-[52px] font-bold text-white leading-[1.15] m-0 mb-5 tracking-[-1px]">
            Building the Future of
            <br />
            <span className="bg-gradient-to-r from-[#42A5F5] to-[#90CAF9] bg-clip-text text-transparent">
              Enterprise Technology
            </span>
          </h1>
          <p className="text-white/70 text-[17px] leading-[1.75] max-w-[560px] mx-auto">
            Since 2012, Nexvara has partnered with the world's most ambitious organizations
            to design, build, and scale transformative digital platforms.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#E3F2FD] border-t border-b border-[#BBDEFB] px-12 py-10">
        <div className="max-w-[900px] mx-auto grid grid-cols-4 gap-0">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`text-center px-6 py-4 ${
                i < 3 ? "border-r border-[#BBDEFB]" : ""
              }`}
            >
              <div className="font-['Georgia',serif] text-4xl font-bold text-[#1565C0] leading-none mb-1.5">
                {s.value}
              </div>
              <div className="text-[13px] text-[#6B7A99] tracking-[0.3px]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-12 py-20 max-w-[1100px] mx-auto">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-semibold tracking-[1.4px] uppercase text-[#1976D2] block mb-3.5">
              Our Mission
            </span>
            <h2 className="font-['Georgia',serif] text-4xl font-bold text-[#0A2540] leading-[1.25] m-0 mb-5 tracking-[-0.5px]">
              Accelerating growth through intelligent technology
            </h2>
            <p className="text-[#6B7A99] text-base leading-[1.8] m-0 mb-4">
              We believe technology should be an accelerant for human ambition — not a barrier.
              Our teams embed deeply with clients, co-creating solutions that compound in value
              over time.
            </p>
            <p className="text-[#6B7A99] text-base leading-[1.8] m-0">
              From strategy to execution, we operate as true partners — invested in outcomes,
              transparent in process, and relentless in delivery.
            </p>
          </div>
          <div
            className="rounded-2xl px-9 py-10 text-white"
            style={{
              background: "linear-gradient(135deg, #0A2540 0%, #1A4A8A 100%)",
            }}
          >
            {values.map((v, i) => (
              <div
                key={i}
                className={`flex gap-4 ${
                  i < 3
                    ? "mb-7 pb-7 border-b border-white/[0.08]"
                    : "mb-0 pb-0 border-b-0"
                }`}
              >
                <div className="w-[38px] h-[38px] rounded-lg bg-[rgba(66,165,245,0.2)] border border-[rgba(66,165,245,0.3)] flex items-center justify-center text-lg flex-shrink-0 text-[#42A5F5]">
                  {v.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">
                    {v.title}
                  </div>
                  <div className="text-[13px] text-white/60 leading-[1.6]">
                    {v.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-[#F7FAFF] border-t border-[#DDEAFC] px-12 py-[72px]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold tracking-[1.4px] uppercase text-[#1976D2] block mb-3">
              Leadership
            </span>
            <h2 className="font-['Georgia',serif] text-[34px] font-bold text-[#0A2540] m-0 tracking-[-0.5px]">
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {teamMembers.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#DDEAFC] px-6 py-7 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(21,101,192,0.12)]"
              >
                <div className="w-[60px] h-[60px] rounded-full bg-[#E3F2FD] border-2 border-[#BBDEFB] flex items-center justify-center font-bold text-base text-[#1565C0] mx-auto mb-3.5">
                  {m.initials}
                </div>
                <div className="text-[15px] font-semibold text-[#0A2540] mb-1">
                  {m.name}
                </div>
                <div className="text-xs text-[#1976D2] font-medium tracking-[0.3px] mb-3 uppercase">
                  {m.title}
                </div>
                <p className="text-[13px] text-[#6B7A99] leading-[1.65] m-0">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}