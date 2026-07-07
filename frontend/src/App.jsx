import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import ContactPage  from "./Pages/ContactUs";
import CompaniesPage from "./Pages/Companies";
import AboutPage from "./Pages/AboutPage";
import JobsPage from "./Pages/Jobs";
import JobDetailsPage from "./Pages/JobDetails";
import UDashboard from "./Pages/User/UDashboard";
import EDashboard from "./Pages/Employer/EDashboard";
import CreateCv from "./Pages/CVBuilder";

function App() {
  const isLoggedIn = !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
  
  return (
    <BrowserRouter>     
      <Navbar />
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
        <Route path="/Udashboard" element={<UDashboard />} />
        <Route path="/CreateCv" element={<CreateCv />} />

        {/* Employer Routes */}
        <Route path="/EDashboard" element={<EDashboard />} />
      </Routes>
      {!isLoggedIn ? (
        <Footer />
        ):(
          <></>
        )}
    </BrowserRouter>
  );
}

function LoginPage() {
  return <Login />;
}

function RegisterPage() {
  const navigate = useNavigate();
  return <Register onRegisterSuccess={() => navigate("/Udashboard")} />;
}

export default App;