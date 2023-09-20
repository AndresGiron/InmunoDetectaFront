import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React, { useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import Typewriter from "typewriter-effect";

ChartJS.register(
    Tooltip,
    Legend,
    ArcElement,
)

const CircleChart = ({ data }) => {
    const [DatosDiagnostico, setDatosDiagnostico] = useState(
        data.map((item) => {
            return {
                "Infeccion": item.diagnostico_completo["Infeccion asociada a la enfermedad"],
                "Fecha": item.diagnostico_fecha,
                "Genero": item.diagnostico_completo["Genero"],
            }
        })
    )
    console.log(DatosDiagnostico)

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

    const filteredData = DatosDiagnostico.filter(item => {
        const fechaItem = new Date(item.Fecha);
        const fechaInicio = new Date(filterFechaInicio);
        const fechaFin = new Date(filterFechaFin);

        return (
            fechaItem >= fechaInicio &&
            fechaItem <= fechaFin &&
            (filterGenero === '' || item.Genero === filterGenero)
        );
    })

    const infectionData = filteredData.reduce((counts, item) => {
        if (item.Infeccion === "Infeccion asociada") {
            counts.asociada++;
        } else if (item.Infeccion === "Infeccion NO asociada") {
            counts.noAsociada++;
        }
        return counts;
    }, { asociada: 0, noAsociada: 0 });

    const { asociada, noAsociada } = infectionData;

    const totalCasos = asociada + noAsociada;
    const porcentajeAsociada = ((asociada / totalCasos) * 100).toFixed(2);
    const porcentajeNoAsociada = ((noAsociada / totalCasos) * 100).toFixed(2);

    // Configuración de datos para el gráfico de pastel
    const dataDiagnostico = {
        labels: ["Infección Asociada", "Infección NO Asociada"],
        datasets: [
            {
                data: [asociada, noAsociada],
                backgroundColor: ["rgba(199, 112, 240, 0.7)", "rgba(240, 135, 112, 0.7)"], // Colores para las secciones del pastel
            },
        ],
    };

    const optionsPieChart = {
        plugins: {
            legend: {
                display: true,
                labels: {
                    generateLabels: function (chart) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            const labels = data.labels;
                            const dataset = data.datasets[0].data;
                            const total = dataset.reduce((prev, num) => prev + num);
    
                            return labels.map((label, i) => {
                                const value = dataset[i];
                                const percentage = ((value / total) * 100).toFixed(2);
                                return {
                                    text: `${label} (${percentage}%)`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    hidden: dataset[i] === 0,
                                };
                            });
                        }
                        return [];
                    },
                },
            },
        },
    };



    if (!DatosDiagnostico || Object.keys(DatosDiagnostico).length === 0 || DatosDiagnostico === []) {
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
                <Col> <Form.Control className="mb-3"
                    as="select"
                    value={filterGenero}
                    onChange={e => setFilterGenero(e.target.value)}
                >
                    <option value="">Todos</option>
                    <option value="0">Mujer</option>
                    <option value="1">Hombre</option>
                </Form.Control>    </Col>

            </Row>
            <Row>
                <Col></Col>
                <Col md = {8} >
                <Pie data={dataDiagnostico} options={optionsPieChart}/>
                </Col>
                <Col></Col>
            </Row>
        </div>
    );
}

export default CircleChart;

