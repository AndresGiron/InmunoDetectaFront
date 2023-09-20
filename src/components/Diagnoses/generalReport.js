import React, { useState, useEffect } from 'react';
import { Table, Card, Form, Container, Row, Button, Col } from 'react-bootstrap';
import { useExternalApi } from '../../hooks/doctorResponse';
import Typewriter from "typewriter-effect";
import Particle from "../Particle";
import ReactPaginate from 'react-paginate';
import BarChart from './BarChart';
import BarChartComorbilidades from './BarChartComorbilidades'
import BarChartTratamientoPrevio from './BarChartTratamientoPrevio'
import BarChartEsquemaInmunosupresor from './BarChartEsquemaInmunosupresor';
import CircleChartEtnia from './CircleChartEtnia'
import CircleChartDx from './CircleChartDx';
import * as XLSX from 'xlsx';


const GeneralReport = () => {
    const [diagnosticos, setDiagnosticos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [diagnosticosPerPage] = useState(6);
    const [filterMedico, setFilterMedico] = useState('');
    const [filterPaciente, setfilterPaciente] = useState('');
    const [filterEdadOrden, setFilterEdadOrden] = useState('asc');
    const [filterResultado, setFilterResultado] = useState('');
    const [DiagnosticosInfeccionAsociada, setDiagnosticosInfeccionAsociada] = useState(0);
    const [DiagnosticosInfeccionNOAsociada, setDiagnosticosInfeccionNoAsociada] = useState(0);

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
        traerDiagnosticos
    } = useExternalApi()

    useEffect(() => {
        traerDiagnosticos(setDiagnosticos)
    }, []);

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
            (item.medico_nombre_apellido.toLowerCase().includes(filterMedico.toLowerCase()) ||
                item.cedula_medico.toLowerCase().includes(filterMedico.toLowerCase())) &&
            (item.paciente_nombre_apellido.toLowerCase().includes(filterPaciente.toLowerCase()) ||
                item.cedula_paciente.toLowerCase().includes(filterPaciente.toLowerCase())) &&
            (filterResultado === '' || item.diagnostico_completo["Infeccion asociada a la enfermedad"] === filterResultado)
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

    const exportToExcel = () => {
        const fileName = 'diagnosticos.xlsx';
        const ws = XLSX.utils.json_to_sheet(diagnosticos.map(item => item.diagnostico_completo));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Diagnósticos');
        XLSX.writeFile(wb, fileName);
    };

    const infecciones = diagnosticos.map(item => item.diagnostico_completo["Infeccion asociada a la enfermedad"]);



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
                <Row className="vh-100 justify-content-center align-items-center">

                    <div className='justify-content-center align-items-stretch mb-4'>

                        <Card style={{ width: '100%' }}>

                            <Card.Body>
                                <Card.Title><h3> <strong className="purple">Diagnosticos </strong></h3></Card.Title>

                                <div className="d-flex justify-content-end mb-2"> {/* Agregamos un div con clase para alinear el botón a la izquierda */}
                                    <Button onClick={exportToExcel} variant="primary">
                                        Exportar a Excel
                                    </Button>
                                </div>

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
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nombre Completo o Cedula"
                                                    value={filterMedico}
                                                    onChange={e => setFilterMedico(e.target.value)}
                                                />
                                            </th>
                                            <th>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nombre Completo o Cedula"
                                                    value={filterPaciente}
                                                    onChange={e => setfilterPaciente(e.target.value)}
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
                                            <th>Medico</th>
                                            <th>Paciente</th>
                                            <th>Resultado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentDiagnosticos.map((item, index) => (
                                            <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#a3a1a6" : "#eaf8ff" }}>
                                                <td>{item.diagnostico_fecha}</td>
                                                <td>{item.medico_nombre_apellido}</td>
                                                <td>{item.paciente_nombre_apellido}</td>
                                                <td>{item.diagnostico_completo["Infeccion asociada a la enfermedad"]}</td>
                                            </tr>
                                        ))}


                                    </tbody>

                                </Table>
                                {tieneClaveEspecifica(diagnosticos, "Result") &&
                                    <div className="sinDiagnosticos">
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
                                        pageClassName={'page-item'}
                                        pageLinkClassName={'page-link'}
                                        previousClassName={'page-item'}
                                        nextClassName={'page-item'}
                                        previousLinkClassName={'page-link'}
                                        nextLinkClassName={'page-link'}
                                        disabledClassName={'disabled'}
                                        breakClassName={'page-item'}
                                    />
                                </div>
                            </Card.Body>
                        </Card>

                    </div>
                </Row>

                <Row className='justify-content-center align-items-stretch mb-3'>
                    <Col md={4}>
                        <Card style={{ height: '100%' }}>
                            <Card.Body style={{ backgroundColor: '#D9F070' }}>
                                <div className="d-flex flex-column h-100"> {/* Agrega las clases d-flex y flex-column */}
                                    <p>
                                        <strong> Diagnosticos Realizados </strong>
                                    </p>
                                    <h2>
                                        <strong>{infecciones.length}</strong>
                                    </h2>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body style={{ backgroundColor: '#F070D9' }}>
                                <p>
                                    <strong> Diagnosticos con Infeccion Asociada </strong>
                                </p>
                                <h2>
                                    <strong>{infecciones.reduce((contador, valor) => {
                                        if (valor === "Infeccion asociada") {
                                            return contador + 1;
                                        }
                                        return contador;
                                    }, 0)} </strong>
                                </h2>
                                <h2>
                                    <strong>{((infecciones.reduce((contador, valor) => {
                                        if (valor === "Infeccion asociada") {
                                            return contador + 1;
                                        }
                                        return contador;
                                    }, 0)/infecciones.length)*100).toFixed(2)}% </strong>
                                </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card>
                            <Card.Body style={{ backgroundColor: '#F08770' }}>
                                <p>
                                    <strong> Diagnosticos con Infeccion NO Asociada </strong>
                                </p>
                                <h2>
                                    <strong>{infecciones.reduce((contador, valor) => {
                                        if (valor === "Infeccion NO asociada") {
                                            return contador + 1;
                                        }
                                        return contador;
                                    }, 0)} </strong>
                                </h2>
                                <h2>
                                    <strong>{((infecciones.reduce((contador, valor) => {
                                        if (valor === "Infeccion NO asociada") {
                                            return contador + 1;
                                        }
                                        return contador;
                                    }, 0)/infecciones.length)*100).toFixed(2)}% </strong>
                                </h2>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='justify-content-center align-items-stretch mb-4'>
                    <Col md={7} xs={12}>
                        <div className="d-flex justify-content-center h-100">
                            <Card style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Title>
                                        <h3> <strong className="purple"> Esquemas inmunosupresores </strong> diagnosticos </h3>
                                    </Card.Title>
                                    <div>
                                        <BarChartEsquemaInmunosupresor data={diagnosticos} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                    
                    <Col md={5} xs={12}>
                        <Row>
                            <div className="d-flex justify-content-center mb-4">
                                <Card style={{ width: '100%' }}>
                                    <Card.Body>
                                        <Card.Title>
                                            <h3 > <strong className="purple"> Etnia </strong> diagnosticos </h3>
                                        </Card.Title>
                                        <div>
                                            <CircleChartEtnia data={diagnosticos} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Row>
                        <Row >
                            <div className="d-flex justify-content-center">
                                <Card style={{ width: '100%' }}>
                                    <Card.Body>
                                        <Card.Title>
                                            <h3 > <strong className="purple"> reumatologia </strong> diagnosticos </h3>
                                        </Card.Title>
                                        <div>
                                            <CircleChartDx data={diagnosticos} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Row>

                    </Col>


                </Row>

                <Row className='justify-content-center align-items-stretch'>

                    <Col md={6} xs={12}>
                        <Row>
                            <div className="d-flex justify-content-center mb-4">
                                <Card style={{ width: '100%' }}>
                                    <Card.Body>
                                        <Card.Title>
                                            <h3> <strong className="purple"> Comorbilidades </strong> diagnosticos </h3>
                                        </Card.Title>
                                        <div>
                                            <BarChartComorbilidades data={diagnosticos} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Row>
                        <Row>
                            <div className="d-flex justify-content-center">
                                <Card style={{ width: '100%' }}>
                                    <Card.Body>
                                        <Card.Title>
                                            <h3 > <strong className="purple"> Edad </strong> diagnosticos </h3>
                                        </Card.Title>
                                        <div style={{ height: '100%' }}> {/* Establece la altura del div interior al 100% */}
                                            <BarChart data={diagnosticos} />
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Row>

                    </Col>

                    <Col md={6} xs={12} className= "d-flex align-items-stretch">
                        <div className="d-flex justify-content-center mb-4 h-100">
                            <Card style={{ width: '100%' }} >
                                <Card.Body >
                                    <Card.Title>
                                        <h3> <strong className="purple"> Tratamientos previos </strong> diagnosticos </h3>
                                    </Card.Title>
                                    <div >
                                        <BarChartTratamientoPrevio data={diagnosticos} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>


                </Row>

            </Container>
        </Container>
    );
};

export default GeneralReport;