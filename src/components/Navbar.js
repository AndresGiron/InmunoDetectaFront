import React, { useState, useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import UserContext from '../userContext';
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { TbReportMedical,TbReport } from "react-icons/tb";
import {
  AiOutlineCalculator,
  AiOutlineUser,
  AiOutlineLogin,
  AiOutlineHome
} from "react-icons/ai";
import {RxExit} from "react-icons/rx"
import {GrUserSettings} from "react-icons/gr"
import {LiaUsersCogSolid} from "react-icons/lia"

function NavBar() {
  const [expand, updateExpanded] = useState(false);
  const [navColour, updateNavbar] = useState(false);
  const {user,setUser} = useContext(UserContext)

  const CerrarSesion = () => {
    console.log("pase por aqui")
    setUser("")
    console.log(user)
  }

  function scrollHandler() {
    if (window.scrollY >= 20) {
      updateNavbar(true);
    } else {
      updateNavbar(false);
    }
  }

  window.addEventListener("scroll", scrollHandler);

  return (

    <Navbar
      expanded={expand}
      fixed="top"
      expand="md"
      className={navColour ? "sticky" : "navbar"}
    >
      {/* {console.log(user.rol)} */}
      <Container>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={() => {
            updateExpanded(expand ? false : "expanded");
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto" defaultActiveKey="#home">

            <Nav.Item>
              <Nav.Link as={Link} to="/" onClick={() => updateExpanded(false)}>
                <AiOutlineHome style={{ marginBottom: "2px" }} /> Inicio
              </Nav.Link>
            </Nav.Item>

            {(user === ""|| user.rol === "paciente") && <Nav.Item>
              <Nav.Link as={Link} to="/diagnosticoIA" onClick={() => updateExpanded(false)}>
                <AiOutlineCalculator style={{ marginBottom: "2px" }} /> Diagnostico Usando IA
              </Nav.Link>
            </Nav.Item>}

            {user !== "" && user.rol === "medico"&& <Nav.Item>
              <Nav.Link as={Link} to="/diagnosticoIAMedico" onClick={() => updateExpanded(false)}>
                <AiOutlineCalculator style={{ marginBottom: "2px" }} /> Diagnostico Usando IA
              </Nav.Link>
            </Nav.Item>}

            {user !== "" && user.rol === "medico"&& 
            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/generalReport"
                onClick={() => updateExpanded(false)}
              >
                <TbReportMedical style={{ marginBottom: "2px" }} /> Diagnosticos
              </Nav.Link>
            </Nav.Item>
            } 

            {user !== "" && user.rol === "paciente"&& <Nav.Item>
              <Nav.Link
                as={Link}
                to="/misDiagnosticos"
                onClick={() => updateExpanded(false)}
              >
                <TbReportMedical style={{ marginBottom: "2px" }} /> Mis Diagnosticos
              </Nav.Link>
            </Nav.Item>}

            {user !== "" && user.rol === "admin"&& <Nav.Item>
              <Nav.Link
                as={Link}
                to="/adminUsersControl"
                onClick={() => updateExpanded(false)}
              >
                <LiaUsersCogSolid style={{ marginBottom: "2px" }} /> Usuarios
              </Nav.Link>
            </Nav.Item>}

            {user !== "" && user.rol === "paciente" && <Nav.Item>
              <Nav.Link
                as={Link}
                to="/profile"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineUser
                  style={{ marginBottom: "2px" }}
                />{" "}
                Mi perfil
              </Nav.Link>
            </Nav.Item>}

            {user !== "" && user.rol === "medico" && <Nav.Item>
              <Nav.Link
                as={Link}
                to="/profileMedico"
                onClick={() => updateExpanded(false)}
              >
                <AiOutlineUser
                  style={{ marginBottom: "2px" }}
                />{" "}
                Mi perfil
              </Nav.Link>
            </Nav.Item>}

            {user === "" && <Nav.Item className="fork-btn">
              <Button
                as={Link}
                to="/login"
                onClick={() => updateExpanded(false)}
                className="fork-btn-inner"
              >
                <AiOutlineLogin style={{ fontSize: "1.2em" }} />{" "}
                Iniciar Sesion </Button>
            </Nav.Item>}

            {user !== "" && <Nav.Item className="fork-btn">
              <Button
                as={Link}
                to="/login"
                onClick={CerrarSesion}
                className="fork-btn-inner"
              >
                <RxExit style={{ fontSize: "1.2em" }} />{" "}
                Cerrar Sesion </Button>
            </Nav.Item>}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
