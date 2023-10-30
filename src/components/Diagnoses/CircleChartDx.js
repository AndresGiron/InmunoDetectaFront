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

const CircleChartDx = ({ data }) => {
    const [DatosDx, setDatosDx] = useState(
        []
    )

    useEffect(()=>{
        setDatosDx(
            data.map((item) => {
                if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "0") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Sin enfermedad reumatica"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "1") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Posible enfermedad reumatica a estudio"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "2") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "LES"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "3") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Artritis reumatoide"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "4") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Esclerosis Sistemica"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "5") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Vasculitis"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "6") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Sindrome de Sjogren"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "7") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Enfermedad articular por cristales: gota y CPPD"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "8") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Otro diagnostico reumatologico"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "9") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "SAF"
                } else if (item.diagnostico_completo["Dx reumatologico final agrupado"] === "10") {
                    item.diagnostico_completo["Dx reumatologico final agrupado"] = "Miopatia inflamatoria"
                } 
                
                return {
                    "Infeccion": item.diagnostico_completo["Infeccion asociada a la enfermedad"],
                    "Fecha": item.diagnostico_fecha,
                    "Dx reumatologico final agrupado": item.diagnostico_completo["Dx reumatologico final agrupado"],
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
            default:
                break;
        }
    };

    const filteredData = DatosDx.filter(item => {
        const fechaItem = new Date(item.Fecha);
        const fechaInicio = new Date(filterFechaInicio);
        const fechaFin = new Date(filterFechaFin);

        return (
            fechaItem >= fechaInicio &&
            fechaItem <= fechaFin &&
            (filterGenero === '' || item.Genero === filterGenero)
        );
    })


    const countsAsociada = {};
    const countsNoAsociada = {};

    filteredData.forEach((item) => {
        const Dx = item["Dx reumatologico final agrupado"];

        if (item.Infeccion === "Infección asociada") {
            if (!countsAsociada[Dx]) {
                countsAsociada[Dx] = 0;
            }
            countsAsociada[Dx]++;
        } else if (item.Infeccion === "Infección NO asociada") {
            if (!countsNoAsociada[Dx]) {
                countsNoAsociada[Dx] = 0;
            }
            countsNoAsociada[Dx]++;
        }
    });


    const reumatologias = [...new Set(filteredData.map((item) => item["Dx reumatologico final agrupado"]))];

    // Obtener cantidades para Infección asociada y NO asociada
    const cantidadAsociada = reumatologias.map((Dx) =>
        countsAsociada[Dx] ? countsAsociada[Dx] : 0
    );
    const cantidadNoAsociada = reumatologias.map((Dx) =>
        countsNoAsociada[Dx] ? countsNoAsociada[Dx] : 0
    );


    // Configurar datos para los gráficos
    const dataCombined = {
        labels: reumatologias,
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





    if (!DatosDx || Object.keys(DatosDx).length === 0 || DatosDx === []) {
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
                    {filteredData.length > 0 && <Doughnut data={dataCombined} options={optionsCombined} />}
                    {filteredData.length === 0 && <h2>No hay datos para los filtros seleccionados</h2>}
                </Col>
                <Col></Col>
            </Row>
        </div>
    );

}

export default CircleChartDx;

