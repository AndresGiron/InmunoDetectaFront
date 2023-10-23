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
    // eslint-disable-next-line no-unused-vars
    const [DatosDeEdad, setDatosDeEdad] = useState([])

    useEffect(()=>{
        setDatosDeEdad(
            data.map((item) => {
                return {
                    "Edad": item.diagnostico_completo["Edad al momento del evento"],
                    "Infeccion": item.diagnostico_completo["Infeccion asociada a la enfermedad"],
                    "Fecha": item.diagnostico_fecha,
                    "Genero": item.diagnostico_completo["Genero"]
    
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

    // eslint-disable-next-line no-unused-vars
    const [infeccionAsociada, setInfeccionAsociada] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const [infeccionNoAsociada, setInfeccionNoAsociada] = useState(0);
    const [Resultados, setResultados] = useState([])
    const gruposEdad = ["18-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100"];
    const [cantidadFiltrada, setCantidadFiltrada] = useState(0);

    useEffect(() => {
        // Filtrar y contar las personas con Infección Asociada e Infección No Asociada por grupos de edad
        
        const resultadosPorGrupo = gruposEdad.map((grupo) => {
            const rangoEdad = grupo.split("-").map(Number);
            const personasEnRango = DatosDeEdad.filter((persona) => {
                const edad = parseInt(persona.Edad);
                return !isNaN(edad) && edad >= rangoEdad[0] && edad <= rangoEdad[1];
            });



            const infeccionAsociadaCount = personasEnRango.filter((persona) => persona.Infeccion === "Infeccion asociada").length;
            const infeccionNoAsociadaCount = personasEnRango.filter((persona) => persona.Infeccion === "Infeccion NO asociada").length;

            setInfeccionAsociada((prev) => prev + infeccionAsociadaCount);
            setInfeccionNoAsociada((prev) => prev + infeccionNoAsociadaCount);

            return {
                grupo,
                InfeccionAsociada: infeccionAsociadaCount,
                InfeccionNoAsociada: infeccionNoAsociadaCount,
            };
        });

        setResultados(resultadosPorGrupo)
    // eslint-disable-next-line
    }, [DatosDeEdad]);

    useEffect(() => {
        // eslint-disable-next-line
        const filteredData = DatosDeEdad.filter(item => {
            const fechaItem = new Date(item.Fecha);
            const fechaInicio = new Date(filterFechaInicio);
            const fechaFin = new Date(filterFechaFin);

            return (
                fechaItem >= fechaInicio &&
                fechaItem <= fechaFin &&
                (filterGenero === '' || item.Genero === filterGenero));
        })

        setCantidadFiltrada(filteredData.length)


        const resultadosPorGrupo = gruposEdad.map((grupo) => {
            const rangoEdad = grupo.split("-").map(Number);
            const personasEnRango = filteredData.filter((persona) => {
                const edad = parseInt(persona.Edad);
                return !isNaN(edad) && edad >= rangoEdad[0] && edad <= rangoEdad[1];
            });



            const infeccionAsociadaCount = personasEnRango.filter((persona) => persona.Infeccion === "Infeccion asociada").length;
            const infeccionNoAsociadaCount = personasEnRango.filter((persona) => persona.Infeccion === "Infeccion NO asociada").length;

            setInfeccionAsociada((prev) => prev + infeccionAsociadaCount);
            setInfeccionNoAsociada((prev) => prev + infeccionNoAsociadaCount);

            return {
                grupo,
                InfeccionAsociada: infeccionAsociadaCount,
                InfeccionNoAsociada: infeccionNoAsociadaCount,
            };
        });

        setResultados(resultadosPorGrupo)
    // eslint-disable-next-line
    }, [filterFechaInicio, filterFechaFin, filterGenero,DatosDeEdad]);


    const chartDataBar = {
        labels: gruposEdad,
        datasets: [
            {
                label: "Infección Asociada",
                data: Resultados.map((resultado) => resultado.InfeccionAsociada),
                backgroundColor: "rgba(199, 112, 240, 0.7)", // Color de las barras para Infección Asociada
            },
            {
                label: "Infección No Asociada",
                data: Resultados.map((resultado) => resultado.InfeccionNoAsociada),
                backgroundColor: "rgba(240, 135, 112, 0.7)", // Color de las barras para Infección No Asociada
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                type: "category",
                labels: gruposEdad,
                title:{
                    text: "Grupos de Edad",
                    display:true
                }
            },
            y: {
                beginAtZero: true,
                title:{
                    text: "Cantidad",
                    display:true
                }
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.dataset.label || '';
                        if (label) {
                            return `${label}: ${context.parsed.y} (${( (context.parsed.y / cantidadFiltrada ) * 100).toFixed(2)}%)`;
                        }
                        return null;
                    },
                },
            },
        },
    };

    if (!DatosDeEdad || Object.keys(DatosDeEdad).length === 0 || DatosDeEdad === []) {
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
                {cantidadFiltrada > 0 && <Bar data={chartDataBar} options={chartOptions} />}
                {cantidadFiltrada === 0 && <h2>No hay datos para los filtros seleccionados</h2>}
            </Row>
        </div>
    );
}

export default BarChart;

