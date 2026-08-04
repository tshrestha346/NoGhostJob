import { useState, useEffect } from "react";
import {getSettings} from "../SettingsApi";

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSettings().then((result) => {
      setSettings(result.settings);
    });
  }, []);

  const logo = settings?.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <footer className="bg-[#07192E] text-white">
      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-700 text-lg font-extrabold text-white">
                {logo}
              </div>

              <span className="font-serif text-2xl font-bold">
                {settings?.name}
              </span>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/60">
              Helping professionals discover better opportunities and
              helping companies find exceptional talent worldwide.
              Join over 120,000 job seekers already growing their careers.
            </p>

            {/* Stats */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xl font-bold text-white">25K+</div>
                <div className="text-xs text-white/50">Active Jobs</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xl font-bold text-white">120K+</div>
                <div className="text-xs text-white/50">Candidates</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="text-xl font-bold text-white">4.8K+</div>
                <div className="text-xs text-white/50">Companies</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-300">
              Quick Links
            </h3>

            <ul className="space-y-3">
              {[
                "Find Jobs",
                "Companies",
                "Career Advice",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/60 transition-colors hover:text-blue-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Job Seekers */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-300">
              Job Seekers
            </h3>

            <ul className="space-y-3">
              {[
                "Browse Jobs",
                "Saved Jobs",
                "Resume Builder",
                "Job Alerts",
                "Application Tracker",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/60 transition-colors hover:text-blue-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-blue-300">
              Employers
            </h3>

            <ul className="space-y-3">
              {[
                "Post a Job",
                "Talent Search",
                "Pricing",
                "Employer Branding",
                "Recruitment Solutions",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/60 transition-colors hover:text-blue-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-3xl border border-blue-400/20 bg-gradient-to-r from-blue-700/20 to-blue-500/10 p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="mb-2 text-2xl font-bold">
                Stay updated with new opportunities
              </h3>

              <p className="text-sm text-white/60">
                Get personalized job recommendations and career tips.
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  flex-1 rounded-xl border border-white/10
                  bg-white/10 px-4 py-3 text-sm text-white
                  placeholder:text-white/40
                  outline-none
                  focus:border-blue-400
                "
              />

              <button
                className="
                  rounded-xl bg-gradient-to-br
                  from-blue-500 to-blue-400
                  px-6 py-3 text-sm font-bold text-white
                  shadow-lg transition-transform
                  hover:-translate-y-0.5
                "
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="text-sm text-white/50">
            © {new Date().getFullYear()} {settings?.name}. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-white/50">
            <a href="#" className="hover:text-blue-300">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-blue-300">
              Terms of Service
            </a>

            <a href="#" className="hover:text-blue-300">
              Cookie Policy
            </a>

            <a href="#" className="hover:text-blue-300">
              Contact Us
            </a>
          </div>

          {/* Social */}
          <div className="flex gap-3">
            {["𝕏", "in", "f", "▶"].map((icon) => (
              <a
                key={icon}
                href="#"
                className="
                  flex h-10 w-10 items-center justify-center
                  rounded-xl border border-white/10
                  bg-white/5 text-sm font-bold text-white/70
                  transition-all
                  hover:border-blue-400
                  hover:bg-blue-500/10
                  hover:text-blue-300
                "
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}