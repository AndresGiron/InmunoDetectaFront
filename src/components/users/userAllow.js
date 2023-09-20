import React, { useState, useEffect } from 'react';
import { Table, Card, Form, Container, Row, Button, Col } from 'react-bootstrap';
import { useExternalApi } from '../../hooks/adminResponse';
import Typewriter from "typewriter-effect";
import { FaCheck, FaTimes } from 'react-icons/fa';
import Particle from "../Particle";
import ReactPaginate from 'react-paginate';

const TableView = () => {
  const [usuarios, setUsuarios] = useState([])
  const [currentPage, setCurrentPage] = useState(0); // Cambiar a 0
  const [usuariosPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(false);

  const {
    traerUsuarios,
    cambiarEstado
  } = useExternalApi()

  useEffect(() => {
    traerUsuarios(setUsuarios)
  }, []);



  const toggleEstado = (userId, currentState) => {
    setUpdating(true);
    cambiarEstado(userId).then(() => { traerUsuarios(setUsuarios) }).finally(() => setUpdating(false));
    console.log(userId)
  }

  const filteredData = usuarios.filter(item =>
    item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.medico_info.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.medico_info.apellido.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const offset = currentPage * usuariosPerPage;
  const currentUsuarios = filteredData.slice(offset, offset + usuariosPerPage);

  const pageCount = Math.ceil(filteredData.length / usuariosPerPage); // Calcular cantidad de páginas

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };


  if (!usuarios || Object.keys(usuarios).length === 0 || usuarios === {}) {
    return <div className="circle-loader">
      <div className="circle"></div>
      <div>" "</div>
      <Typewriter className="main-name"
        options={{
          strings: [
            "Cargando...",],
          autoStart: true,
          loop: true,
          deleteSpeed: 30,
          delay: 60
        }}
      />
    </div>
  }

  return (
    <Container fluid className="login-section">
      <Particle />
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">

          <div className="d-flex justify-content-center">

            <Card style={{ width: '90%' }}>

              <Card.Body>
                <Card.Title><h1 className="login-heading">Usuarios <strong className="purple">Doctores </strong></h1></Card.Title>
                {updating && (<div className="circleMini-loader">
                  <div className="circleMini"></div>
                  <Typewriter className="main-name"
                    options={{
                      strings: [
                        "Actualizando...",],
                      autoStart: true,
                      loop: true,
                      deleteSpeed: 30,
                      delay: 60
                    }}
                  />
                </div>
                )}
                <Form.Group controlId="searchEmail" className="mb-5">
                  <Form.Label>Buscar</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingresa el correo, nombre o apellido"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </Form.Group>


                <Table striped bordered hover>
                  <thead>
                    <tr className="AdminTableTitle" style={{ backgroundColor: '#430054', color: '#eaf8ff' }}>
                      <th>Email</th>
                      <th>Nombre</th>
                      <th>Apellido</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsuarios.map((item, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#a3a1a6" : "#eaf8ff" }}>
                        <td>{item.email}</td>
                        <td>{item.medico_info.nombre}</td>
                        <td>{item.medico_info.apellido}</td>
                        <td>
                          <Button variant={item.estado ? 'success' : 'danger'}
                            onClick={() => toggleEstado(item.id, item.estado)}>
                            {item.estado ? <FaCheck /> : <FaTimes />}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="pagination-container">
                  <ReactPaginate
                    previousLabel={'Anterior'}
                    nextLabel={'Siguiente'}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    pageClassName={'page-item'} // Estilo de cada página
                    pageLinkClassName={'page-link'} // Estilo del enlace de página
                    previousClassName={'page-item'} // Estilo del botón "Anterior"
                    nextClassName={'page-item'} // Estilo del botón "Siguiente"
                    previousLinkClassName={'page-link'} // Estilo del enlace de botón "Anterior"
                    nextLinkClassName={'page-link'} // Estilo del enlace de botón "Siguiente"
                    disabledClassName={'disabled'}
                    breakClassName={'page-item'}
                  />
                </div>
              </Card.Body>
            </Card>
          </div>
        </Row>
      </Container>
    </Container>
  );
};

export default TableView;