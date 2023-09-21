import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import Calculadora from "./components/Calculator/Calculator";
import CalculadoraMedico from "./components/Calculator/CalculatorDoctor";
import Login from "./components/Login/Login";
import ForgotPassword from "./components/Login/ForgotPassword";
import Register from "./components/Login/Register";
import Profile from "./components/Profile/Profile"
import ProfileDoctor from "./components/Profile/ProfileDoctor"
import GeneralReport from "./components/Diagnoses/generalReport";
import AdminControlUsers from "./components/users/userAllow"
import Report from "./components/Diagnoses/patientReport"
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import UserContext from './userContext';


import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, upadateLoad] = useState(true);
  const [user, setUser] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <UserContext.Provider value={{user,setUser}}>
      <Router>
        <Preloader load={load} />
        <div className="App" id={load ? "no-scroll" : "scroll"}>
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project" element={<Projects />} />
            <Route path="/calculadora" element={<Calculadora />} />
            <Route path="/calculadoraMedico" element={(user !== "" && user.rol === "medico")?(<CalculadoraMedico />):(<Navigate to="/calculadora"/>)} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/misDiagnosticos" element={(user !== "" && user.rol === "paciente")?(<Report />):(<Navigate to="/404"/>)} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profileMedico" element={(user !== "" && user.rol === "medico")?(<ProfileDoctor />):(<Navigate to="/404"/>)} />
            <Route path="/generalReport" element={(user !== "" && user.rol === "medico")?(<GeneralReport />):(<Navigate to="/404"/>)} />
            {/* <Route path="/generalReport" element={<GeneralReport />} /> */}
            <Route path="/login" element={(user.rol === ("paciente" || "medico" || "admin"))?(<Navigate to="/404"/>):(<Login />)}/>
            <Route path="/adminUsersControl" element={(user !== "" && user.rol === "admin")?(<AdminControlUsers />):(<Navigate to="/404"/>)}/>
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/register" element={<Register />} />

          </Routes>
          <Footer />
        </div>

      </Router>
    </UserContext.Provider>
  );
}

export default App;
