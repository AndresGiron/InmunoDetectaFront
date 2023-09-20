import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import context from "react-bootstrap/esm/AccordionContext";
import { Pie, Doughnut } from "react-chartjs-2";
import Typewriter from "typewriter-effect";

ChartJS.register(
    Tooltip,
    Legend,
    ArcElement,
)

const CircleChartEtnia = ({ data }) => {
    const [DatosDeEtnia, setDatosDeEtnia] = useState(
        data.map((item) => {
            if (item.diagnostico_completo["Etnia"] === "0") {
                item.diagnostico_completo["Etnia"] = "Mestizo"

            } else if (item.diagnostico_completo["Etnia"] === "1") {
                item.diagnostico_completo["Etnia"] = "Indigena"

            } else if (item.diagnostico_completo["Etnia"] === "2") {
                item.diagnostico_completo["Etnia"] = "Afrodescendiente"

            } else if (item.diagnostico_completo["Etnia"] === "3") {
                item.diagnostico_completo["Etnia"] = "Otro"
            } else if (item.diagnostico_completo["Etnia"] === null) {
                item.diagnostico_completo["Etnia"] = "Sin dato"
            }
            return {
                "Infeccion": item.diagnostico_completo["Infeccion asociada a la enfermedad"],
                "Fecha": item.diagnostico_fecha,
                "Etnia": item.diagnostico_completo["Etnia"],
                "Genero": item.diagnostico_completo["Genero"]

            }
        })
    )

    const getToday = () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        return formattedDate;
    };

    // Función para obtener la fecha de hace un año
    const getTenYearAgo = () => {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
        const formattedDate = oneYearAgo.toISOString().split('T')[0];
        return formattedDate;
    };

    const [filterFechaInicio, setFilterFechaInicio] = useState(getTenYearAgo());
    const [filterFechaFin, setFilterFechaFin] = useState(getToday());
    const [filterGenero, setFilterGenero] = useState('');

    const handleFilterChange = (e, filterType) => {
        const value = e.target.value;
        switch (filterType) {
            case 'fechaInicio':
                setFilterFechaInicio(value);
                break;
            case 'fechaFin':
                setFilterFechaFin(value);
                break;
            default:
                break;
        }
    };

    const filteredData = DatosDeEtnia.filter(item => {
        const fechaItem = new Date(item.Fecha);
        const fechaInicio = new Date(filterFechaInicio);
        const fechaFin = new Date(filterFechaFin);

        return (
            fechaItem >= fechaInicio &&
            fechaItem <= fechaFin &&
            (filterGenero === '' || item.Genero === filterGenero)
        );
    })

    // Procesar datos para contar la cantidad de personas por etnia con Infección asociada
    const countsAsociada = {};
    const countsNoAsociada = {};

    filteredData.forEach((item) => {
        const Etnia = item.Etnia;

        if (item.Infeccion === "Infeccion asociada") {
            if (!countsAsociada[Etnia]) {
                countsAsociada[Etnia] = 0;
            }
            countsAsociada[Etnia]++;
        } else if (item.Infeccion === "Infeccion NO asociada") {
            if (!countsNoAsociada[Etnia]) {
                countsNoAsociada[Etnia] = 0;
            }
            countsNoAsociada[Etnia]++;
        }
    });

    // Obtener etiquetas de etnias
    const etnias = [...new Set(filteredData.map((item) => item.Etnia))];

    // Obtener cantidades para Infección asociada y NO asociada
    const cantidadAsociada = etnias.map((Etnia) =>
        countsAsociada[Etnia] ? countsAsociada[Etnia] : 0
    );
    const cantidadNoAsociada = etnias.map((Etnia) =>
        countsNoAsociada[Etnia] ? countsNoAsociada[Etnia] : 0
    );

    // Configurar datos para los gráficos
    const dataCombined = {
        labels: etnias,
        datasets: [
            {
                label: "Infección Asociada",
                data: cantidadAsociada,
                backgroundColor: [
                    "rgba(240, 112, 217, 0.7)",
                    "rgba(240, 112, 153, 0.7)",
                    "rgba(240, 199, 112, 0.7)",
                    "rgba(217, 240, 112, 0.7)",
                    "rgba(181, 255, 161, 1)",
                    // ... (colores para cada etnia)
                ],
            },
            {
                label: "Infección NO Asociada",
                data: cantidadNoAsociada,
                backgroundColor: [
                    "rgba(240, 112, 217, 0.5)",
                    "rgba(240, 112, 153, 0.5)",
                    "rgba(240, 199, 112, 0.5)",
                    "rgba(217, 240, 112, 0.5)",
                    "rgba(181, 255, 161, 1)",
                    // ... (colores para cada etnia)
                ],
            },
        ],
    };

    const optionsCombined = {
        plugins: {
            legend: {
                display: true,
                position: 'top', // Cambia la posición de la leyenda según tus necesidades
            },
        },
    };





    if (!DatosDeEtnia || Object.keys(DatosDeEtnia).length === 0 || DatosDeEtnia === []) {
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
        <div>
            <Row>
                <Col>
                    <div className="d-flex mb-3">
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
                </Col>

                <Col>
                    <Form.Control className="mb-3"
                        as="select"
                        value={filterGenero}
                        onChange={e => setFilterGenero(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="0">Mujer</option>
                        <option value="1">Hombre</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row>
            <Col></Col>
                <Col md = {10}>
                    <Doughnut data={dataCombined} options={optionsCombined} />
                </Col>
                <Col></Col>
            </Row>
        </div>
    );

}

export default CircleChartEtnia;

