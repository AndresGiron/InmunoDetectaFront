import {React, useEffect, useState, useContext} from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import Particle from "../Particle";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form"
import { useForm } from 'react-hook-form'
import { useExternalApi } from '../../hooks/doctorResponse';
import UserContext from '../../userContext';
import Typewriter from "typewriter-effect";


function ProfileDoctor() {
    const { handleSubmit: registerSubmit, register: datos } = useForm({})
    const { user } = useContext(UserContext);
    const [medico, setMedico] = useState("")


    const {
        traerDoctor,
        actualizarDoctor
      } = useExternalApi()

    const onSubmit = data => {
        console.log(data)
        actualizarDoctor(user,data,setMedico)
    }

    useEffect(()=>{
        traerDoctor(user,setMedico)
      },[])

    if (!medico || Object.keys(medico).length === 0 || medico === {}) {
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
        <Container fluid className="profile-section">
            <Particle />
            <Container>
                <h1 className="profile-heading">
                    Mi <strong className="purple">Perfil </strong>
                </h1>
                <p style={{ color: "white" }}>
                    Datos Personales
                </p>
                <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
                    <Col md={10} className="profile-card">
                        <Card className="profile-card-view">
                            <Row>
                                <Col></Col>
                                <Card.Img className="profile-img" variant="top" src={"https://ui-avatars.com/api/?background=random&name=" + medico.nombre + medico.apellido} alt="card-img" />
                                <Col></Col>
                            </Row>

                            <div className="mb-3 mt-md-4">
                                <Form onSubmit={registerSubmit(onSubmit)}>
                                    <Row className="d-flex justify-content-center mb-2">
                                        <Col md={8}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Correo Electronico
                                                </Form.Label>
                                                <Form.Control type="email" required readOnly value={medico.correo}
                                                    {...datos("correo", { required: true })} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="d-flex justify-content-center mb-2">
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Nombre
                                                </Form.Label>
                                                <Form.Control type="input" required defaultValue={medico.nombre}
                                                    {...datos("nombre", { required: true })} />
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Apellido
                                                </Form.Label>
                                                <Form.Control type="input" required defaultValue={medico.apellido}
                                                    {...datos("apellido", { required: true })} />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="d-flex justify-content-center mb-2">
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                                <Form.Label className="text-center">
                                                    Cedula
                                                </Form.Label>
                                                <Form.Control type="input" required value={medico.cedula} readOnly
                                                    {...datos("cedula", { required: true })} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button onClick={registerSubmit(onSubmit)} style={{ zIndex: 1000 }}>Actualizar</Button>
                                </Form>
                            </div>

                        </Card>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
}

export default ProfileDoctor;