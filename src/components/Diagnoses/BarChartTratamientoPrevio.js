import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Form, Row, Col, Card } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import Typewriter from "typewriter-effect";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
    Legend
)

const BarChart = ({ data }) => {
    console.log(data)
    const [DatosDeComorbilidades, setDatosDeComorbilidades] = useState(
        data.map((item) => {
            return {
                "Infeccion": item.diagnostico_completo["Infeccion asociada a la enfermedad"],
                "Fecha": item.diagnostico_fecha,
                "Genero": item.diagnostico_completo["Genero"],
                "Tenía tratamiento reumatologico previo": item.diagnostico_completo["Tenía tratamiento reumatologico previo"],
                "Esteroide": item.diagnostico_completo["Esteroide"],
                "Antimalarico": item.diagnostico_completo["Antimalarico"],
                "Leflunomida": item.diagnostico_completo["Leflunomida"],
                "Metotrexate": item.diagnostico_completo["Metotrexate"],
                "Sulfasalazina": item.diagnostico_completo["Sulfasalazina"],
                "Biológico": item.diagnostico_completo["Biológico"],
                "Azatioprina": item.diagnostico_completo["Azatioprina"],
                "Ciclofosfamida": item.diagnostico_completo["Ciclofosfamida"],
                "Micofenolato": item.diagnostico_completo["Micofenolato"],
                "Tacrolimus": item.diagnostico_completo["Tacrolimus"],
                "Hipouricemiante": item.diagnostico_completo["Hipouricemiante"],
                "Ciclosporina": item.diagnostico_completo["Ciclosporina"],
                "Otro": item.diagnostico_completo["Otro"],
            }
        })
    )


    console.log(DatosDeComorbilidades)

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
            case 'genero':
                setFilterGenero(value);
                break;
            default:
                break;
        }
    };

    const filteredData = DatosDeComorbilidades.filter(item => {
        const fechaItem = new Date(item.Fecha);
        const fechaInicio = new Date(filterFechaInicio);
        const fechaFin = new Date(filterFechaFin);

        return (
            fechaItem >= fechaInicio &&
            fechaItem <= fechaFin &&
            (filterGenero === '' || item.Genero === filterGenero));
    })

    const tratamientos = Object.keys(filteredData[0]).filter(tratamiento => tratamiento !== "Infeccion" && tratamiento !== "Fecha" && tratamiento !== "Genero" && tratamiento !== "Tenía tratamiento reumatologico previo");

    // Filtrar los datos para "Infección Asociada"
    const dataAsociada = tratamientos.map(tratamiento => {
        const count = filteredData.filter(item => item.Infeccion === "Infeccion asociada" && item[tratamiento] === 0).length;
        return count;
    });

    // Filtrar los datos para "Infección No Asociada"
    const dataNoAsociada = tratamientos.map(tratamiento => {
        const count = filteredData.filter(item => item.Infeccion === "Infeccion NO asociada" && item[tratamiento] === 0).length;
        return count;
    });

    console.log(dataAsociada, dataNoAsociada)

    const tratamientoData = filteredData.reduce((counts, item) => {
        if (item["Tenía tratamiento reumatologico previo"] === 0) {
            counts.tratamiento++;
        } else if (item["Tenía tratamiento reumatologico previo"] === 1) {
            counts.noTratamiento++;
        }
        return counts;
    }, { tratamiento: 0, noTratamiento: 0 });

    const { tratamiento, noTratamiento } = tratamientoData;

    console.log(tratamientoData)


    // Configuración de datos para el gráfico de pastel
    const dataTratamiento = {
        labels: ["Tratamiento Previo", "Sin tratamiento previo"],
        datasets: [
            {
                data: [tratamiento, noTratamiento],
                backgroundColor: ["rgba(240, 112, 217, 0.7)", "rgba(240, 112, 153, 0.7)"], // Colores para las secciones del pastel
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


    const dataBarChart = {
        labels: tratamientos,
        datasets: [
            {
                label: "Infección Asociada",
                data: dataAsociada,
                backgroundColor: "rgba(199, 112, 240, 0.7)", // Color de barras para "Infección Asociada"
            },
            {
                label: "Infección No Asociada",
                data: dataNoAsociada,
                backgroundColor: "rgba(240, 135, 112, 0.7)", // Color de barras para "Infección No Asociada"
            },
        ],
    };

    const optionsBarChart = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Cantidad",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Tratamientos",
                },
                ticks: {
                    maxRotation: 65, // Rotación de etiquetas en el eje X
                    minRotation: 65, // Rotación de etiquetas en el eje X
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        if (label) {
                            return `${label}: ${context.parsed.y} (${( (context.parsed.y / filteredData.length ) * 100).toFixed(2)}%)`;
                        }
                        return null;
                    },
                },
            },
        },
    };



    if (!DatosDeComorbilidades || Object.keys(DatosDeComorbilidades).length === 0 || DatosDeComorbilidades === []) {
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
            
            <Row md = {9}>
            
                    <Bar data={dataBarChart} options={optionsBarChart} />
            </Row>
            <Row md = {6}>
                
                    <Col></Col>
                    <Col md = {8}>
                    <Pie data={dataTratamiento} options={optionsPieChart} />
                    </Col>
                    <Col></Col>  
            </Row>
            </Row>
        </div>
    );
}

export default BarChart;

