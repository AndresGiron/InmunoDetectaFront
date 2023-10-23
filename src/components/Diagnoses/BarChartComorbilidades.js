import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Form, Row,Col } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Typewriter from "typewriter-effect";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)

const BarChart = ({ data }) => {
    const [DatosDeComorbilidades, setDatosDeComorbilidades] = useState([])
    useEffect(()=>{
        setDatosDeComorbilidades(
            data.map((item) => {
                return {
                    "Infeccion": item.diagnostico_completo["Infeccion asociada a la enfermedad"],
                    "Fecha": item.diagnostico_fecha,
                    "Genero": item.diagnostico_completo["Genero"],
                    "VIH": item.diagnostico_completo["Coomorbilidades previas  - Infeccion por VIH"],
                    "Cardiopatia": item.diagnostico_completo["Coomorbilidades previas - Cardiopatia"],
                    "Diabetes Mellitus": item.diagnostico_completo["Coomorbilidades previas - Diabetes Mellitus"],
                    "Dislipidemia": item.diagnostico_completo["Coomorbilidades previas - Dislipidemia "],
                    "EPOC": item.diagnostico_completo["Coomorbilidades previas - EPOC"],
                    "Enfermedad cerebrovascular (ECV)": item.diagnostico_completo["Coomorbilidades previas - Enfermedad cerebrovascular (ECV)"],
                    "Hipotiroidismo": item.diagnostico_completo["Coomorbilidades previas - Hipotiroidismo"],
                    "Insuficiencia venosa": item.diagnostico_completo["Coomorbilidades previas - Insuficiencia venosa "],
                    "Obesidad": item.diagnostico_completo["Coomorbilidades previas - Obesidad"],
                    "Osteoporosis": item.diagnostico_completo["Coomorbilidades previas - Osteoporosis"],
                    "Trastorno depresivo": item.diagnostico_completo["Coomorbilidades previas - Trastorno depresivo "],
                    "Tuberculosis": item.diagnostico_completo["Coomorbilidades previas -Tuberculosis"],
                    "Cáncer": item.diagnostico_completo["Coomorbilidades previas Cáncer"],
                    "Enfermedad renal cronica": item.diagnostico_completo["Coomorbilidades previas Enfermedad renal cronica"],
                    "HTA": item.diagnostico_completo["Coomorbilidades previas- HTA"],
                    "Otras": item.diagnostico_completo["Coomorbilidades previas - Otras"],
    
                }
            })
        )
    },[data])

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

    const enfermedades = [
        "VIH",
        "Cardiopatia",
        "Diabetes Mellitus",
        "Dislipidemia",
        "EPOC",
        "Enfermedad cerebrovascular (ECV)",
        "Hipotiroidismo",
        "Insuficiencia venosa",
        "Obesidad",
        "Osteoporosis",
        "Trastorno depresivo",
        "Tuberculosis",
        "Cáncer",
        "Enfermedad renal cronica",
        "HTA",
        "Otras",
    ]

    // Filtrar los datos para "Infección Asociada"
    const dataAsociada = enfermedades.map(enfermedad => {
        const count = filteredData.filter(item => item.Infeccion === "Infeccion asociada" && item[enfermedad] === 0).length;
        return count;
    });

    // Filtrar los datos para "Infección No Asociada"
    const dataNoAsociada = enfermedades.map(enfermedad => {
        const count = filteredData.filter(item => item.Infeccion === "Infeccion NO asociada" && item[enfermedad] === 0).length;
        return count;
    });

    const dataBarChart = {
        labels: enfermedades,
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
                    text: "Comorbilidades",
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
                    {filteredData.length > 0 && <Bar data={dataBarChart} options={optionsBarChart} />}
                    {filteredData.length === 0 && <h2>No hay datos para los filtros seleccionados</h2>}
            </Row>
        </div>
    );
}

export default BarChart;

