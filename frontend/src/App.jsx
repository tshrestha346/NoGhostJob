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

function App() {
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  return <Login onLoginSuccess={() => navigate("/")} />;
}

function RegisterPage() {
  const navigate = useNavigate();
  return <Register onRegisterSuccess={() => navigate("/")} />;
}

export default App;