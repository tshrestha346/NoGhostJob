import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import ContactPage from "./Pages/ContactUs";
import CompaniesPage from "./Pages/Companies";
import AboutPage from "./Pages/AboutPage";
import JobsPage from "./Pages/Jobs";
import JobDetailsPage from "./Pages/JobDetails";
import UDashboard from "./Pages/User/UDashboard";
import EDashboard from "./Pages/Employer/EDashboard";
import CreateCv from "./Pages/CVBuilder";
import Profile from "./Pages/Profile.";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();

  const shouldHideFooter =
  
    location.pathname.startsWith("/UDashboard") ||
    location.pathname.startsWith("/EDashboard") ||
    location.pathname.startsWith("/Profile") ||
    location.pathname.startsWith("/CreateCV");

  return (
    <>
      <Navbar />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#07192E",
            color: "#fff",
          },
          success: {
            style: {
              background: "#16a34a",
            },
          },
          error: {
            style: {
              background: "#dc2626",
            },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Contact" element={<ContactPage />} />
        <Route path="/Companies" element={<CompaniesPage />} />
        <Route path="/AboutPage" element={<AboutPage />} />
        <Route path="/Jobs" element={<JobsPage />} />
        <Route path="/Jobs/:id" element={<JobDetailsPage />} />

        {/* User Routes */}
        <Route path="/UDashboard" element={<UDashboard />} />
        <Route path="/CreateCV" element={<CreateCv />} />
        <Route path="/Profile" element={<Profile />} />

        {/* Employer Routes */}
        <Route path="/EDashboard" element={<EDashboard />} />
      </Routes>

      {!shouldHideFooter && <Footer />}
    </>
  );
}

function LoginPage() {
  return <Login />;
}

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <Register
      onRegisterSuccess={() => navigate("/Udashboard")}
    />
  );
}

export default App;