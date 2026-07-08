import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setOpen(false);
    navigate("/Login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#DDEAFC] bg-white/90 backdrop-blur-md font-['Segoe_UI',system-ui,sans-serif]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-gradient-to-br from-blue-400 to-blue-700 text-base font-extrabold text-white shadow-sm">
            C
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#07192E]">
            CareerHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
          >
            Home
          </Link>

          <Link
            to="/Jobs"
            className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
          >
            Jobs
          </Link>

          <Link
            to="/Companies"
            className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
          >
            Companies
          </Link>

          <Link
            to="/AboutPage"
            className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
          >
            About
          </Link>

          <Link
            to="/Contact"
            className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
          >
            Contact
          </Link>
{isLoggedIn && (
  <>
    <Link
      to="/CreateCV"
      className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
    >
      Create CV
    </Link>

    <Link
      to="/Profile"
      className="text-sm font-semibold text-[#3D4A63] transition-colors hover:text-blue-700"
    >
      Profile
    </Link>
  </>
)}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] transition-transform hover:-translate-y-0.5"
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                to="/Login"
                className="text-sm font-bold text-blue-700 transition-colors hover:text-blue-500"
              >
                Log in
              </Link>

              <Link
                to="/Register"
                className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] transition-transform hover:-translate-y-0.5"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDEAFC] bg-[#F7FAFF] text-[#07192E] lg:hidden"
        >
          <span className="text-xl">{open ? "✕" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-[#DDEAFC] bg-white px-5 py-5 shadow-lg lg:hidden">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#3D4A63] hover:bg-blue-50 hover:text-blue-700"
            >
              Home
            </Link>

            <Link
              to="/Jobs"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#3D4A63] hover:bg-blue-50 hover:text-blue-700"
            >
              Jobs
            </Link>

            <Link
              to="/Companies"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#3D4A63] hover:bg-blue-50 hover:text-blue-700"
            >
              Companies
            </Link>

            <Link
              to="/AboutPage"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#3D4A63] hover:bg-blue-50 hover:text-blue-700"
            >
              About
            </Link>

            <Link
              to="/Contact"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-[#3D4A63] hover:bg-blue-50 hover:text-blue-700"
            >
              Contact
            </Link>


 <Link
                to="/Profile"
                className="text-sm font-bold text-blue-700 hover:text-blue-500"
              >
                Profile
              </Link>
            {isLoggedIn && (
              <Link
                to="/CreateCV"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-[#3D4A63] hover:bg-blue-50 hover:text-blue-700"
              >
                Create CV
              </Link>

            )}
            {isLoggedIn && (
              <Link
                to="/Profile"
                className="text-sm font-bold text-blue-700 hover:text-blue-500"
              >
                Profile
              </Link>

            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="col-span-1 rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-5 py-3 text-center text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)] sm:col-span-2"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  to="/Login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-[#DDEAFC] bg-[#F7FAFF] px-5 py-3 text-center text-sm font-bold text-blue-700"
                >
                  Log in
                </Link>

                <Link
                  to="/Register"
                  onClick={() => setOpen(false)}
                  className="rounded-xl bg-gradient-to-br from-blue-700 to-blue-400 px-5 py-3 text-center text-sm font-bold text-white shadow-[0_6px_18px_rgba(21,101,192,0.25)]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}