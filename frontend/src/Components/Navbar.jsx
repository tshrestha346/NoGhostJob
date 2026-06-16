import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = ["Find Jobs", "Companies", "Login", "Register"];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#DDEAFC] bg-white/90 backdrop-blur-md font-['Segoe_UI',system-ui,sans-serif]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-gradient-to-br from-blue-400 to-blue-700 text-base font-extrabold text-white shadow-sm">
            C
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#07192E]">
            CareerHub
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="/Login"
            className="text-sm font-bold text-blue-700 transition-colors hover:text-blue-500"
          >
            Log in
          </a>

          <a
            href="#"
            className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] transition-transform hover:-translate-y-0.5"
          >
            Post a Job
          </a>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDEAFC] bg-[#F7FAFF] text-[#07192E] lg:hidden"
          aria-label="Toggle menu"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-[#DDEAFC] bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#3D4A63] transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="#"
              className="rounded-xl border border-[#DDEAFC] bg-[#F7FAFF] px-5 py-3 text-center text-sm font-bold text-blue-700"
            >
              Log in
            </a>

            <a
              href="#"
              className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-5 py-3 text-center text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)]"
            >
              Post a Job
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}