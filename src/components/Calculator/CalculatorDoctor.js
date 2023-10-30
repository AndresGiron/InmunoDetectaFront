import React, { useState, useEffect,useContext } from "react";
import { Container, Row, Col, Button, Card, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import Particle from "../Particle";
//import laptopImg from "../../Assets/about.png";
import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import { useForm } from 'react-hook-form'
import { useExternalApi } from '../../hooks/calculatorResponse';
import Typewriter from "typewriter-effect";
import InputGroup from 'react-bootstrap/InputGroup';
import Select from 'react-select';
import UserContext from '../../userContext';


function CalculadoraDoctor() {
  const { handleSubmit: registerSubmit, register: datos } = useForm({})
  const [resultPredict, setResultPredict] = useState(-1)
  const [show, setShow] = useState(false);
  const [popUpText, setPopUpText] = useState("")
  const [pacientes, setPacientes] = useState({})
  const { user } = useContext(UserContext);

  /* Bloque para seleccionar el paciente */
  const [selectedOption, setSelectedOption] = useState(pacientes[0]);
  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  /* Bloque para mostrar los tratamientos previos */
  const [useTratamientos, setTratamientos] = useState(false)
  const handleTratamientosPreviosCheck = () => {
    setTratamientos(!useTratamientos)

  }

  /*Funciones para mostrar/ocultar el popUp*/
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    prediccion,
    traerPacientes,
    registrarPrediccion
  } = useExternalApi()

  /* Bloque para mostrar los esquemas inmunosupresores  */
  const [useEsquemaInmunosupresor, setEsquemaInmunosupresor] = useState(false)
  const handleEsquemaInmunosupresorCheck = () => {
    setEsquemaInmunosupresor(!useEsquemaInmunosupresor)

  }

  /* Bloque para mostrar anti DNA  */
  const [useAntiDNA, setAntiDNA] = useState(false)
  const handleAntiDNACheck = (e) => {
    if(e === "false"){
      setAntiDNA(false)
    }else if (e === "true"){
      setAntiDNA(true)
    }else if (e === ""){
      setAntiDNA(false)
    }
  }

  /* Bloque para mostrar ANCAs  */
  const [useANCAs, setANCAs] = useState(false)
  const handleANCAsCheck = () => {
    setANCAs(!useANCAs)

  }

  /* Bloque para mostrar ANAs  */
  const [useANAs, setANAs] = useState(false)
  const handleANAsCheck = () => {
    setANAs(!useANAs)

  }

  //Evitar que puedan precionarse las teclas de -,. y e
  const handleKeyDown = (event) => {
    if (event.key === '-' || event.key === '.' || event.key === 'e') {
      event.preventDefault();
    }
  };

  const handleKeyDownFLoat = (event) => {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  // Evitar que se pegue contenido
  const handlePaste = (event) => {
    //
    event.preventDefault();
  };

  const onSubmit = data => {

    if (data["Anticuerpos_anti_DNA_dc"]==="true"){
      data["Anticuerpos_anti_DNA_dc"]=true
    }else if (data["Anticuerpos_anti_DNA_dc"]==="false"){
      data["Anticuerpos_anti_DNA_dc"]=false
    }

    if (data["ELISA_para_VIH"]==="true"){
      data["ELISA_para_VIH"]=true
    }else if (data["ELISA_para_VIH"]==="false"){
      data["ELISA_para_VIH"]=false
    }

    if (data["Seguimiento previo por reumatologia"]==="true"){
      data["Seguimiento previo por reumatologia"]=true
    }else if (data["Seguimiento previo por reumatologia"]==="false"){
      data["Seguimiento previo por reumatologia"]=false
    }

    if (data["Antigeno_de_superficie_para_hepatitis B"]==="true"){
      data["Antigeno_de_superficie_para_hepatitis B"]=true
    }else if (data["Antigeno_de_superficie_para_hepatitis B"]==="false"){
      data["Antigeno_de_superficie_para_hepatitis B"]=false
    }

    if (data["Anticuerpos_para_Hepatitis_C"]==="true"){
      data["Anticuerpos_para_Hepatitis_C"]=true
    }else if (data["Anticuerpos_para_Hepatitis_C"]==="false"){
      data["Anticuerpos_para_Hepatitis_C"]=false
    }

    if(data["ANAs"] === false)
    {
      data["ANAs_t_tulos_y_patr_n"] = ""
    }
    if(data["ANCAs"] === false){
      data["ANCAs_titulos_y_patron_"] = ""
    }

    if(data["Tenía tratamiento reumatologico previo"] === false)
    {
      TRATAMIENTO_PREVIO.map((e,key)=>{
        data[e.value] = false
        return 0
      }) 
    }

    if(data["Recibió esquema inmunosupresor en la hospitalizacion"] === false)
    {
      ESQUEMA_INMUNOSUPRESOR.map((e,key)=>{
        data[e.value] = false
        return 0
      }) 
    }

   if(data["Anticuerpos_anti_DNA_dc"] === false ||  data["Anticuerpos_anti_DNA_dc"] === "")
    {
      data["T_tulos_Anti_DNA_dc_al_ingreso"] = ""
    }


    console.log(data)
    console.log(user.email)
    prediccion(data,setResultPredict).then((datos) => {
      handleShow()
      console.log(selectedOption)
      if(selectedOption !== undefined && selectedOption["value"] !== -1){
        console.log("con paciente",selectedOption)
        registrar(datos,selectedOption["value"])
      }
    })
  }
  
  const registrar = (data,pacienteSeleccionado) => 
  {
    registrarPrediccion(data,pacienteSeleccionado,user)
  } 

  useEffect(()=>{
    console.log(resultPredict)
    if (resultPredict === 1)
    {
      setPopUpText("Infección NO asociada a enfermedad autoinmune")

    }else if (resultPredict === 0)
    {
      setPopUpText("Infección asociada a enfermedad autoinmune")
    }
    
  },[resultPredict])

  useEffect(()=>{
    traerPacientes(setPacientes)
    setSelectedOption(pacientes[0])
  },[])

  const GENERO = [
    { value: 1, name: 'Hombre' },
    { value: 0, name: 'Mujer' },
  ]

  const ETNIA = [
    { value: 0, name: 'Mestizo' },
    { value: 1, name: 'Indigena' },
    { value: 2, name: 'afrodescendiente' },
    { value: 3, name: 'otro' },
    { value: "",name: 'sin dato'}
  ]

  const ESCOLARIDAD = [
    { value: 0, name: 'Primaria' },
    { value: 1, name: 'Secundaria' },
    { value: 2, name: 'Técnica' },
    { value: 3, name: 'Universitaria' },
    { value: "",name: 'sin dato'}
  ]

  const COMORBILIDADES = [
    { value: 'HTA', name: 'Coomorbilidades previas- HTA' },
    { value: 'Insuficiencia venosa', name: 'Coomorbilidades previas - Insuficiencia venosa ' },
    { value: 'Dislipidemia', name: 'Coomorbilidades previas - Dislipidemia ' },
    { value: 'Osteoporosis', name: 'Coomorbilidades previas - Osteoporosis' },
    { value: 'Cardiopatia', name: 'Coomorbilidades previas - Cardiopatia' },
    { value: 'Obesidad', name: 'Coomorbilidades previas - Obesidad' },
    { value: 'Diabetes Melitus', name: 'Coomorbilidades previas - Diabetes Mellitus' },
    { value: 'EPOC', name: 'Coomorbilidades previas - EPOC' },
    { value: 'Enfermedad cerebrovascular', name: 'Coomorbilidades previas - Enfermedad cerebrovascular (ECV)' },
    { value: 'Cancer', name: 'Coomorbilidades previas Cáncer' },
    { value: 'Enfermedad renal cronica', name: 'Coomorbilidades previas Enfermedad renal cronica' },
    { value: 'Trastorno depresivo', name: 'Coomorbilidades previas - Trastorno depresivo ' },
    { value: 'Hipotiroidismo', name: 'Coomorbilidades previas - Hipotiroidismo' },
    { value: 'Tuberculosis', name: 'Coomorbilidades previas -Tuberculosis' },
    { value: 'VIH', name: 'Coomorbilidades previas  - Infeccion por VIH' },
    { value: 'Otras', name: 'Coomorbilidades previas - Otras' },
  ]

  const DIAGNOSTICO_REUMATICO =
    [
      { value: 0, name: 'Sin enfermedad reumatica' },
      { value: 1, name: 'Posible enfermedad reumatica a estudio' },
      { value: 2, name: 'LES' },
      { value: 3, name: 'Artritis reumatoide' },
      { value: 4, name: 'Esclerosis sistemica' },
      { value: 5, name: 'Vasculitis' },
      { value: 6, name: 'Sindrome de Sjogren' },
      { value: 7, name: 'Enfermedad articular por cristales: gota y CPPD' },
      { value: 8, name: 'Otro diagnostico reumatologico' },
      { value: 9, name: 'SAF' },
      { value: 10, name: 'Miopia inflamatoria' }
    ]

  const TRATAMIENTO_PREVIO =
    [
      { value: "Esteroide", name: "Esteroide" },
      { value: "Antimalarico", name: "Antimalarico" },
      { value: "Leflunomida", name: "Leflunomida" },
      { value: "Metotrexate", name: "Metotrexate" },
      { value: "Sulfasalazina", name: "Sulfasalazina" },
      { value: "Biológico", name: "Biológico" },
      { value: "Azatioprina", name: "Azatioprina" },
      { value: "Ciclofosfamida", name: "Ciclofosfamida" },
      { value: "Micofenolato", name: "Micofenolato" },
      { value: "Tacrolimus", name: "Tacrolimus" },
      { value: "Hipouricemiante", name: "Hipouricemiante" },
      { value: "Ciclosporina", name: "Ciclosporina" },
      { value: "Otro", name: "Otro" },

    ]

  const ESQUEMA_INMUNOSUPRESOR =
    [
      { value: "Esteroide_1", name: "Esteroide" },
      { value: "Azatioprina_1", name: "Azatioprina" },
      { value: "Ciclofosfamida_1", name: "Ciclofosfamida" },
      { value: "Micofenolato_1", name: "Micofenolato" },
      { value: "Tracolimus_1", name: "Tracolimus" },
      { value: "Ciclosporina_1", name: "Ciclosporina" },
      { value: "Enfermedad reumatica activa_1", name: "Enfermedad reumatica activa" },
    ]

  const RECUENTOS =
    [
      { value: "Recuento_de_leucocitos_al_ingr", name: "Leucocitos" },
      { value: "Recuento_de_linfocitos_al_ingr", name: "Linfocitos" },
      { value: "Recuento_de_eosinofilos_al_ing", name: "Eosinofilos" },
      { value: "Hemoglobina_al_ingreso__gr_dl_", name: "Hemoglobina" },
      { value: "Plaquetas_al_ingreso__celulas_", name: "Plaquetas (conteo celulas)" },
      { value: "Creatinina_al_ingreso", name: "Creatinina" },
    ]

  const UROANALISIS =
    [
      { value: 'Segun_los_hallazgos_del_uroan_Proteinas', name: "Proteinas" },
      { value: 'Segun_los_hallazgos_del_uroan_Eritrocitos', name: "Eritrocitos" },
      { value: 'Segun_los_hallazgos_del_uroan_Leucocitos ', name: "Leucocitos" },
      { value: 'Segun_los_hallazgos_del_uroan_Cilindros', name: "Cilindros" },
    ]

  const EXAMENESYANALISIS =
    [
      { value: 'CPK__valor_mas_representativo_', name: "Creatina-fosfocinasa (CPK)" },
      { value: 'TGO_al_inicio_copy', name: "TGO" },
      { value: 'TGP_al_inicio__copy', name: "TGP" },
      { value: 'PCR_al_ingreso_', name: "Proteina C reactiva (PCR)" },
      { value: 'VSG_al_ingreso_', name: "velocidad de sedimentacion globular (VSG)" },
      { value: 'Resultados_de_anticuerpos_anti peptido citrulinado ', name: "anticuerpos antipeptido ciclico citrulinado (anti-CPP)" },
      { value: 'T_tulos_Factor_Reumatoide_al_i', name: "Factor Reumatoide (FR)" },
      { value: 'Anticiaguante_lupico_por_venen', name: "Anticuagulante lupico" },

      
    ]

  const TITULOS =
    [
      { value: 'T_tulos_Anti_Ro_al_ingreso', name: "Anti Ro" },
      { value: 'T_tulos_Anti_La_al_ingreso', name: "Anti La" },
      { value: 'T_tulos_anti_RNP_al_ingreso', name: "Anti RNP" },
      { value: 'T_tulos_anti_Sm_al_ingreso', name: "Anti Sm" },
      { value: 'T_tulos_anti_cardiolipinas_IgG', name: "Anti cardiolipinas IgG" },
      { value: 'T_tulos_anti_cardiolipinas_IgM', name: "Anti cardiolipinas IgM" },
      { value: 'T_tulos_anti_B__glicoproteina_', name: "Anti B glicoproteina 1" },
      { value: 'T_tulos_anti_B__glicopro_copy', name: "Anti B glicoproteina 2" },
    ]
  const HEPATITIS = 
  [
    { value: 'Antigeno_de_superficie_para_hepatitis B', name: "Antigeno de superficie hepatitis B" },
    { value: 'Anticuerpos_para_Hepatitis_C', name: "Anticuerpos para Hepatitis C" },
  ]


  if ((!pacientes || Object.keys(pacientes).length === 0 || pacientes === {}) && selectedOption !== null) {
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
    <Container fluid className="about-section">
      <Particle />
      <Container>


        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={7}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "50px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px" }}>
              INGRESE DATOS
            </h1>



            <Form onSubmit={registerSubmit(onSubmit)}>
              <Row className="mb-5">
                <Card style={{ backgroundColor: 'transparent', border: 'none' }} >
                  <InputGroup>
                    <InputGroup.Text md={3} as={Col} style={{
                      backgroundColor: "#430054",
                      color: "#eaf8ff",
                      border: null,
                      borderWidth: "0%",
                    }}
                    >Paciente</InputGroup.Text>

                    <Col md={9}>
                      <div>
                        <OverlayTrigger
                          placement="right"
                          overlay={<Tooltip id="tooltip-top">La opcion "Sin paciente asociado" no deja un registro de la prediccion a realizar</Tooltip>}
                        >
                          <Select
                            options={pacientes}
                            isSearchable={true}
                            value={selectedOption}
                            defaultValue={pacientes[0]}
                            onChange={handleSelectChange} />
                        </OverlayTrigger>
                      </div>
                    </Col>
                  </InputGroup>
                </Card>
              </Row>

              <Accordion className="mb-5" defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Datos Generales</Accordion.Header>
                  <Accordion.Body>

                    <Row className="mb-3">
                      <Form.Group as={Col} name="Edad al momento del evento">
                        <Form.Label>Edad</Form.Label>
                        <Form.Control {...datos('Edad al momento del evento', { required: true })} type="number" 
                        placeholder="Edad"
                        defaultValue={18}
                        min={0}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        />
                      </Form.Group>

                      <Form.Group as={Col} controlId="Genero">
                        <Form.Label>Género</Form.Label>
                        <Form.Select {...datos('Genero', { required: true })} >
                          {GENERO.map((e, key) => {
                            return <option key={e.value} value={e.value
                            }> {e.name} </option>
                          })}  </Form.Select>
                      </Form.Group>
                    </Row>


                    <Row className="mb-3">
                      <Form.Group as={Col} controlId="Etnia">
                        <Form.Label>Etnia</Form.Label>
                        <Form.Select {...datos('Etnia', { required: false })} >
                          {ETNIA.map((e, key) => {
                            return <option key={e.value} value={e.value
                            }> {e.name} </option>
                          })} </Form.Select>
                      </Form.Group>

                      <Form.Group controlId="Escolaridad" as={Col}>
                        <Form.Label>Escolaridad</Form.Label>
                        <Form.Select {...datos('Escolaridad', { required: false })} > {ESCOLARIDAD.map((e, key) => {
                          return <option key={e.value} value={e.value
                          }> {e.name} </option>
                        })} </Form.Select>
                      </Form.Group>
                    </Row>


                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Comorbilidades</Accordion.Header>
                  <Accordion.Body>
                    <Row >
                      <Col></Col>
                      <Col md={6}>
                        {COMORBILIDADES.map((e, key) => {
                          return <Row key={e.value} className="d-flex justify-content-left mb-2">
                            <Form.Check {...datos(e.name, { required: false })} id={e.value} label={e.value} />
                          </Row>
                        })}
                      </Col>
                      <Col></Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>Diagnóstico y Tratamientos</Accordion.Header>
                  <Accordion.Body>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} controlId="diagnostico reumatico">
                          <Form.Label>Diagnóstico reumatico</Form.Label>
                          <Form.Select {...datos('Dx reumatologico final agrupado', { required: false })} >
                            {DIAGNOSTICO_REUMATICO.map((e, key) => {
                              return <option key={e.value} value={e.value
                              }> {e.name} </option>
                            })}  </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                      <Form.Label>Seguimiento previo por reumatologia</Form.Label>
                        <Form.Group as={Col} name="Seguimiento previo por reumatologia">
                          <Form.Select {...datos('Seguimiento previo por reumatologia', { required: false })} >
                            <option key={"positivo"} value={true}> Positivo </option>
                            <option key={"negativo"} value={false}> Negativo </option>
                            <option key={"sin dato"} value={""}> Sin dato </option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} name="Uso_de_tratamiento_antibiotico">
                          <Form.Check {...datos("Uso_de_tratamiento_antibiotico", { required: false })} type="switch" label="Uso de tratamiento antibiotico" />
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} name="Tenía tratamiento reumatologico previo">
                          <Form.Check {...datos("Tenía tratamiento reumatologico previo", { required: false })}
                            type="switch"
                            label="Tratamiento reumatologico previo"
                            checked={useTratamientos}
                            onChange={handleTratamientosPreviosCheck} />
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row>
                      <Col></Col>
                      <Col md={6}>
                        {TRATAMIENTO_PREVIO.map((e, key) => {
                          if (useTratamientos) {

                            return <Row key={e.value} className="d-flex justify-content-center mb-2">
                              <Form.Check {...datos(e.value, { required: false })} id={e.value} label={e.name} />
                            </Row>

                          } else {

                            return <Form.Check hidden {...datos(e.value, { required: false })} id={e.value} key={e.value} />

                          }
                        })}
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row>
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} name="Recibió esquema inmunosupresor en la hospitalizacion">
                          <Form.Check {...datos("Recibió esquema inmunosupresor en la hospitalizacion", { required: false })}
                            type="switch"
                            label="Esquema inmunosupresor en la hospitalizacion"
                            checked={useEsquemaInmunosupresor}
                            onChange={handleEsquemaInmunosupresorCheck} />
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={6}>
                        {ESQUEMA_INMUNOSUPRESOR.map((e, key) => {
                          if (useEsquemaInmunosupresor) {
                            return <Row key={e.value} className="d-flex justify-content-center mb-2">
                              <Form.Check {...datos(e.value, { required: false })} id={e.value} label={e.name} />
                            </Row>
                          } else {

                            return <Form.Check hidden {...datos(e.value, { required: false })} id={e.value} key={e.value} />

                          }
                        })}
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} name="Requerimiento de Ventilacion mecanica">
                          <Form.Check {...datos("Requerimiento de Ventilacion mecanica", { required: false })}
                            type="switch"
                            label="Requerimiento de Ventilacion mecanica" />
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} name="Requerimiento de TRR de novo">
                          <Form.Check {...datos("Requerimiento de TRR de novo", { required: false })}
                            type="switch"
                            label="Requerimiento de TRR de novo" />
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>Recuentos</Accordion.Header>
                  <Accordion.Body>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={6}>

                        {RECUENTOS.map((e, key) => {
                          return <Row key={e.value}>
                            <Form.Label>{e.name}</Form.Label>
                            <Form.Control {...datos(e.value, { required: false })} className="d-flex justify-content-left mb-2 pl-2" id={e.value}
                            type="number"
                            min={0}
                            onKeyDown={handleKeyDownFLoat}
                            onPaste={handlePaste}  />
                          </Row>
                        })}

                      </Col>
                      <Col></Col>
                    </Row>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>Hallazgos segun Uroanálisis</Accordion.Header>
                  <Accordion.Body>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>

                        {UROANALISIS.map((e, key) => {
                          return <Row key={e.value} className="d-flex justify-content-left mb-2 pl-2">
                            <Form.Check {...datos(e.value, { required: false })} id={e.value} type="switch" label={e.name} />
                          </Row>
                        })}
                      </Col>
                      <Col></Col>
                    </Row>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                  <Accordion.Header>Exámenes y Análisis</Accordion.Header>
                  <Accordion.Body>

                  <Row className="mb-3">
                      <Col></Col>
                      <Col md={6}>
                      <Form.Label>ELISA para VIH</Form.Label>
                        <Form.Group as={Col} name="ELISA_para_VIH">
                          <Form.Select {...datos('ELISA_para_VIH', { required: false })} >
                            <option key={"positivo"} value={true}> Positivo </option>
                            <option key={"negativo"} value={false}> Negativo </option>
                            <option key={"sin dato"} value={""}> Sin dato </option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={6}>

                        {EXAMENESYANALISIS.map((e, key) => {
                          return <Row key={e.value}>
                            <Form.Label>{e.name}</Form.Label>
                            <Form.Control {...datos(e.value, { required: false })} className="d-flex justify-content-left mb-2 pl-2" id={e.value} 
                            type="number"
                            min={0}
                            onKeyDown={handleKeyDownFLoat}
                            onPaste={handlePaste}  />
                          </Row>
                        })}
                      </Col>
                      <Col></Col>
                    </Row>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="6">
                  <Accordion.Header>Títulos</Accordion.Header>
                  <Accordion.Body>

                  <Row className="mb-3">
                      <Col></Col>
                      <Col md={6}>
                        <Form.Group as={Col} name="Anticuerpos_anti_DNA_dc" >
                          <Form.Label>Anti DNA dc</Form.Label>
                          <Form.Select {...datos('Anticuerpos_anti_DNA_dc', { required: false })} 
                          label="Anticuerpos Anti DNA dc"
                          onChange={(e)=>{handleAntiDNACheck(e.target.value)}}
                          className="d-flex justify-content-left mb-2 pl-2"
                          defaultValue={false}
                          >
                            <option key={"positivo"} value={true}> Positivo </option>
                            <option key={"negativo"} value={false}> Negativo </option>
                            <option key={"sin dato"} value={""}> Sin dato </option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={6}>

                        {useAntiDNA && (
                          <Form.Group name="T_tulos_Anti_DNA_dc_al_ingreso">
                            <Form.Label>Anti DNA dc</Form.Label>
                            <Form.Control {...datos('T_tulos_Anti_DNA_dc_al_ingreso', { required: false })} className="d-flex justify-content-left mb-2 pl-2" type="number" placeholder="Anti DNA dc" />
                          </Form.Group>
                        )}

                        {(!useAntiDNA && <Form.Control hidden {...datos('T_tulos_Anti_DNA_dc_al_ingreso', { required: false })} type="number"/>)}
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={6}>

                        {TITULOS.map((e, key) => {
                          return <Row key={e.value}>
                            <Form.Label>{e.name}</Form.Label>
                            <Form.Control {...datos(e.value, { required: false })} className="d-flex justify-content-left mb-2 pl-2" id={e.value} placeholder={e.name} 
                            type="number"
                            min={0}
                            onKeyDown={handleKeyDownFLoat}
                            onPaste={handlePaste}  />
                          </Row>
                        })}
                      </Col>
                      <Col></Col>
                    </Row>

                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="7">
                  <Accordion.Header>ANCAs y ANAs</Accordion.Header>
                  <Accordion.Body>

                  <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} name="ANCAs">
                          <Form.Check {...datos('ANCAs', { required: false })} 
                          type="switch" 
                          label="ANCAs"
                          checked={useANCAs}
                          onChange={handleANCAsCheck}
                          />
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>

                        {useANCAs && (
                          <Form.Group name="ANCAs_titulos_y_patron_">
                            <Form.Label className="d-flex justify-content-left mb-2 pl-2">ANCAs</Form.Label>
                            <Form.Control {...datos('ANCAs_titulos_y_patron_', { required: false })} className="d-flex justify-content-left mb-2 pl-2" type="input" placeholder="ANCAs" />
                          </Form.Group>
                        )}

                        {(!useANCAs && <Form.Control hidden {...datos('ANCAs_titulos_y_patron_', { required: false })} type="input"/>)}
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>
                        <Form.Group as={Col} name="ANAs">
                          <Form.Check {...datos('ANAs', { required: false })} 
                          type="switch" 
                          label="ANAs"
                          checked={useANAs}
                          onChange={handleANAsCheck}
                          />
                        </Form.Group>
                      </Col>
                      <Col></Col>
                    </Row>

                    <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>

                        {useANAs && (
                          <Form.Group name="ANAs_t_tulos_y_patr_n">
                            <Form.Label className="d-flex justify-content-left mb-2 pl-2" >ANAs</Form.Label>
                            <Form.Control {...datos('ANAs_t_tulos_y_patr_n', { required: false })} className="d-flex justify-content-left mb-2 pl-2" type="input" placeholder="ANAs" />
                          </Form.Group>
                        )}

                        {(!useANAs && <Form.Control hidden {...datos('ANAs_t_tulos_y_patr_n', { required: false })} type="input"/>)}
                      </Col>
                      <Col></Col>
                    </Row>

                    
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="8">
                  <Accordion.Header>Hepatitis</Accordion.Header>
                  <Accordion.Body>
                  <Row className="mb-3">
                      <Col></Col>
                      <Col md={11}>

                        {HEPATITIS.map((e, key) => {
                          return <Row key={e.value} className="d-flex justify-content-left mb-2 pl-2">
                            <Form.Label>{e.name}</Form.Label>
                            <Form.Select {...datos(e.value, { required: false })} id={e.value} type="switch" label={e.name} >
                            <option key={"positivo"} value={true}> Positivo </option>
                            <option key={"negativo"} value={false}> Negativo </option>
                            <option key={"sin dato"} value={""}> Sin dato </option>
                            </Form.Select>
                          </Row>
                        })}
                      </Col>
                      <Col></Col>
                    </Row>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Form>

            <Row>
              <Card style={{ backgroundColor: 'transparent', border: 'none' }} >
                <Col><Button onClick={registerSubmit(onSubmit)} style={{ zIndex: 1000 }}>Realizar Diagnóstico</Button></Col>
              </Card>
            </Row>

          </Col>
        </Row>

        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Diagnóstico</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {popUpText}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleClose}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </Container>

    
  );
}

export default CalculadoraDoctor;



