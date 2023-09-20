import React, { useState, useEffect, useContext } from 'react';
import { Table, Card, Form, Container, Row, Button, Col } from 'react-bootstrap';
import { useExternalApi } from '../../hooks/patientResponse';
import Typewriter from "typewriter-effect";
import { FaCheck, FaTimes } from 'react-icons/fa';
import Particle from "../Particle";
import ReactPaginate from 'react-paginate';
import UserContext from '../../userContext';


const Report = () => {
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [paciente, setPaciente] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [diagnosticosPerPage] = useState(6);
    const [filterMedico, setFilterMedico] = useState('');
    const [filterEdadOrden, setFilterEdadOrden] = useState('asc');
    const [filterResultado, setFilterResultado] = useState('');

    const { user } = useContext(UserContext);

    // Función para obtener la fecha actual
    const getToday = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        return formattedDate;
    };

    // Función para obtener la fecha de hace un año
    const getOneYearAgo = () => {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const formattedDate = oneYearAgo.toISOString().split('T')[0];
        return formattedDate;
    };

    const [filterFechaInicio, setFilterFechaInicio] = useState(getOneYearAgo());
    const [filterFechaFin, setFilterFechaFin] = useState(getToday());

    const {
        traerPaciente,
        misDiagnosticos
    } = useExternalApi()

    useEffect(() => {
        traerPaciente(user, setPaciente)
    }, []);

    useEffect(() => {
        misDiagnosticos(paciente, setDiagnosticos)
    }, [paciente]);

    const tieneClaveEspecifica = (lista, clave) => {
        return lista.some(obj => obj.hasOwnProperty(clave));
    };

    const sortedData = diagnosticos.slice().sort((a, b) => {
        if (filterEdadOrden === 'asc') {
            return a.diagnostico_completo["Edad al momento del evento"] - b.diagnostico_completo["Edad al momento del evento"];
        } else {
            return b.diagnostico_completo["Edad al momento del evento"] - a.diagnostico_completo["Edad al momento del evento"];
        }
    });

    const handleSortEdadChange = () => {
        // Cambiar el orden de clasificación de la columna de edad
        setFilterEdadOrden(filterEdadOrden === 'asc' ? 'desc' : 'asc');
    };

    const filteredData = sortedData.filter(item => {
        const fechaItem = new Date(item.diagnostico_fecha);
        const fechaInicio = new Date(filterFechaInicio);
        const fechaFin = new Date(filterFechaFin);

        return (
            fechaItem >= fechaInicio &&
            fechaItem <= fechaFin &&
            item.medico.toLowerCase().includes(filterMedico.toLowerCase()) &&
            (filterResultado === '' || item.diagnostico_completo["Infeccion asociada a la enfermedad"] === filterResultado) &&
            (filterEdadOrden === 'asc' || filterEdadOrden === 'desc' ||
                (filterEdadOrden === '' && true)
            )
        );
    })

    const handleFilterChange = (e, filterType) => {
        const value = e.target.value;
        switch (filterType) {
            case 'fechaInicio':
                setFilterFechaInicio(value);
                break;
            case 'fechaFin':
                setFilterFechaFin(value);
                break;
            case 'resultado':
                setFilterResultado(value);
                break;
            case 'edadOrden':
                setFilterEdadOrden(value);
                break;
            default:
                break;
        }
    };

    const offset = currentPage * diagnosticosPerPage;
    const currentDiagnosticos = filteredData.slice(offset, offset + diagnosticosPerPage);

    const pageCount = Math.ceil(filteredData.length / diagnosticosPerPage); // Calcular cantidad de páginas

    const handlePageClick = ({ selected: selectedPage }) => {
        setCurrentPage(selectedPage);
    };



    if (!diagnosticos || Object.keys(diagnosticos).length === 0 || diagnosticos === []) {
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

                        <Card style={{ width: '100%' }}>

                            <Card.Body>
                                <Card.Title><h1 className="login-heading">Mis <strong className="purple">Diagnosticos </strong></h1></Card.Title>

                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="d-flex">
                                                    <Form.Control
                                                        type="date"
                                                        value={filterFechaInicio}
                                                        onChange={e => handleFilterChange(e, 'fechaInicio')}
                                                    />
                                                    <span className="mx-2">-</span>
                                                    <Form.Control
                                                        type="date"
                                                        value={filterFechaFin}
                                                        onChange={e => handleFilterChange(e, 'fechaFin')}
                                                    />
                                                </div>
                                            </th>
                                            <th>
                                                <Button onClick={handleSortEdadChange}>
                                                    {filterEdadOrden === 'asc' ? '↓' : '↑'}
                                                </Button>
                                            </th>
                                            <th>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nombre Completo"
                                                    value={filterMedico}
                                                    onChange={e => setFilterMedico(e.target.value)}
                                                />
                                            </th>
                                            <th>
                                                <Form.Control
                                                    as="select"
                                                    value={filterResultado}
                                                    onChange={e => setFilterResultado(e.target.value)}
                                                >
                                                    <option value="">Todos</option>
                                                    <option value="Infeccion asociada">Infección Asociada</option>
                                                    <option value="Infeccion NO asociada">Infección NO Asociada</option>
                                                </Form.Control>
                                            </th>

                                        </tr>
                                        <tr className="AdminTableTitle" style={{ backgroundColor: '#430054', color: '#eaf8ff' }}>
                                            <th>Fecha</th>
                                            <th>Edad al momento del evento</th>
                                            <th>Medico</th>
                                            <th>Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDiagnosticos.map((item, index) => (
                                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#a3a1a6" : "#eaf8ff" }}>
                                                <td>{item.diagnostico_fecha}</td>
                                                <td>{item.diagnostico_completo["Edad al momento del evento"]}</td>
                                                <td>{item.medico}</td>
                                                <td>{item.diagnostico_completo["Infeccion asociada a la enfermedad"]}</td>
                                            </tr>
                                        ))}


                                    </tbody>

                                </Table>
                                {tieneClaveEspecifica(diagnosticos, "Result") &&
                                            <div className ="sinDiagnosticos">
                                                <h1>No hay Diagnosticos asociados</h1>
                                            </div>
                                }

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

export default Report;