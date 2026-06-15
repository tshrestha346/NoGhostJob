import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
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