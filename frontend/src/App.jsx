import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

function App() {
  return (
    <BrowserRouter>
     <Navbar/>
      <Routes>
        <Route path="/Login" element={<Login/>} />
        <Route path="/Register" element={<Register />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;