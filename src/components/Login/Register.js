import { React, useState} from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import Particle from "../Particle";
import { useForm } from 'react-hook-form'
import { useExternalApi } from "../../hooks/accountResponse";
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';



function Register() {

    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();
    const [mensaje,setMensaje] = useState("")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [showModal, setShowModal] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    const [esMedico, setEsMedico] = useState(false); 

    const handleSwitchChange = () => {
      setEsMedico(!esMedico); 
    };

    const showActivationModal = () => {
        setShowModal(true);
      };
      
      const handleCloseModal = () => {
        setShowModal(false);
        // Redirigir al usuario al inicio de sesión
        setRedirectToLogin(true);
      };

    const { handleSubmit: registerSubmit, register: datos } = useForm({})

    const [formErrors, setFormErrors] = useState({
        correo: false,
        password: false,
        conPassword: false,
        nombre: false,
        apellido: false,
        fechaNacimiento: false,
        sexo: false,
        cedula: false,


    });

    const SEXO =
        [
            { name: "hombre", value: "hombre" },
            { name: "mujer", value: "mujer" },
        ]

    const {RegisterPaciente,RegisterMedico} = useExternalApi()



    const onSubmit = data => {

        let errors = {};
        if (data.correo === '') {
            errors.correo = true;
        }
        if (data.password === '') {
            errors.password = true;
        }
        if (data.conPassword === '') {
            errors.conPassword = true;
        }
        if (data.nombre === '') {
            errors.nombre = true;
        }
        if (data.apellido === '') {
            errors.apellido = true;
        }
        if (data.fechaNacimiento === '' && !esMedico) {
            errors.fechaNacimiento = true;
        }
        if (data.cedula === '') {
            errors.cedula = true;
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
        } else if (data.password !== data.conPassword) {
            setPasswordError('Las contraseñas no coinciden');
        } else if (data.password.length < 8 || !/\d/.test(data.password)) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres y un número');
        } else {

            if(esMedico){
                console.log('Datos enviados:', data);
                RegisterMedico(data,setMensaje,setShow).then(()=>{showActivationModal()})

            }else{
                console.log('Datos enviados:', data);
                RegisterPaciente(data,setMensaje,setShow)
            }
            setPasswordError('');
            setFormErrors({
                correo: false,
                password: false,
                conPassword: false,
                nombre:false,
                apellido:false,
                fechaNacimiento:false,
                cedula:false
            });
        }
    };
    if(redirectToLogin){
        navigate('/login');
    }


    return (
        <Container fluid className="register-section">
            <Particle />
            <Container>
                <Alert variant='danger' show={show} onClose={handleClose} dismissible>
                    {mensaje}
                </Alert>
                <Modal show={showModal} onHide={handleCloseModal} centered>
                      <Modal.Header closeButton>
                        <Modal.Title>Activación de Cuenta</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Su cuenta de médico ha sido registrada y está pendiente de activación por parte de un administrador.
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                          Cerrar
                        </Button>
                      </Modal.Footer>
                    </Modal>
                <Row className="vh-100 d-flex justify-content-center align-items-center">
                    <Col md={8} lg={6} xs={12}>
                        <Card className="shadow">
                            <Card.Body>
                                <div className="mb-3 mt-md-4">
                                    <h1 className="login-heading">Registrar <strong className="purple">Usuario </strong></h1>
                                    <p className=" mb-5">Por favor ingrese sus datos</p>
                                    <div className="mb-3">

                                        <Row className="mb-3">
                                            <Form.Label>¿Desea realizar el registro como Medico?</Form.Label>
                                            <Form.Check type="switch" onChange={handleSwitchChange} />
                                        </Row>

                                        <Form onSubmit={registerSubmit(onSubmit)} >
                                            <Row>
                                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                                    <Form.Label className="text-center">
                                                        Correo Electronico
                                                    </Form.Label>
                                                    <Form.Control type="email" placeholder="Correo Electronico" required
                                                        {...datos("correo", { required: false })}
                                                        isInvalid={formErrors.correo} />
                                                </Form.Group>
                                            </Row>

                                            <Row>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Label className="text-center">
                                                            contraseña
                                                        </Form.Label>
                                                        <Form.Control type="password" placeholder="Contraseña"
                                                            name="password"
                                                            {...datos("password", { required: false })}
                                                            required
                                                            isInvalid={formErrors.password} />
                                                    </Form.Group>
                                                </Col>

                                                <Col md={6}>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Label className="text-center">
                                                            Confirmar contraseña
                                                        </Form.Label>
                                                        <Form.Control type="password" placeholder="Confirmar contraseña"
                                                            name="conPassword"
                                                            {...datos("conPassword", { required: false })}
                                                            required
                                                            isInvalid={formErrors.conPassword} />
                                                    </Form.Group>
                                                </Col>

                                                {passwordError && <div className="text-danger">{passwordError}</div>}


                                            </Row>

                                            <Row className="mb-3">
                                                <Form.Group as={Col} name="nombre">
                                                    <Form.Label>nombre</Form.Label>
                                                    <Form.Control {...datos('nombre', { required: false })} type="input" placeholder="nombre"
                                                        isInvalid={formErrors.nombre} />

                                                </Form.Group>

                                                <Form.Group as={Col} controlId="apellido">
                                                    <Form.Label>apellido</Form.Label>
                                                    <Form.Control {...datos('apellido', { required: false })} type="input" placeholder="apellido"
                                                        isInvalid={formErrors.nombre} />
                                                </Form.Group>
                                            </Row>

                                            {!esMedico && (<Row className="mb-3">
                                                <Form.Group as={Col} name="fechaNacimiento">
                                                    <Form.Label>Fecha de nacimiento</Form.Label>
                                                    <Form.Control {...datos('fechaNacimiento', { required: false })} type="date" placeholder="Fecha"
                                                        isInvalid={formErrors.fechaNacimiento} />

                                                </Form.Group>

                                                <Form.Group as={Col} controlId="sexo">
                                                    <Form.Label>sexo</Form.Label>
                                                    <Form.Select {...datos('sexo', { required: false })} type="input" placeholder="sexo"
                                                    >
                                                        {SEXO.map((e, key) => {
                                                            return <option key={e.value} value={e.value
                                                            }> {e.name} </option>
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Row>)}

                                            <Row className="mb-3">
                                                <Form.Group as={Col} name="cedula">
                                                    <Form.Label>Cedula</Form.Label>
                                                    <Form.Control {...datos('cedula', { required: false })} type="input" placeholder="Cedula"
                                                        isInvalid={formErrors.cedula} />

                                                </Form.Group>
                                            </Row>

                                            <Button as={Col} md={4} variant="primary" type="submit" onClick={registerSubmit(onSubmit)}>
                                                Registrar
                                            </Button>

                                        </Form>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </Container>
    );
}

export default Register;