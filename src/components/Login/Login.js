import {React,useState,useContext} from "react";
import { Col, Button, Row, Container, Card, Form} from "react-bootstrap";
import Particle from "../Particle";
import { useForm } from 'react-hook-form'
import { useExternalApi } from '../../hooks/accountResponse';
import UserContext from '../../userContext';
import Alert from 'react-bootstrap/Alert';
import 'bootstrap/dist/css/bootstrap.min.css';



function Login() {
    const { handleSubmit: registerSubmit, register: datos } = useForm({})
    const [formErrors, setFormErrors] = useState({
        correo: false,password:false
    });
    const { user,setUser} = useContext(UserContext);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const handleClose = () => setShow(false);

    const {
      logIn
    } = useExternalApi()

    const onSubmit = data => {

        console.log(data)

        let errors = {};
        if (data.correo === '') {
            errors.correo = true;
        }
        if (data.password === '') {
            errors.password = true;
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
        }else{
            logIn(data.correo,data.password,setUser,setShow,setError)

            setFormErrors({
                correo: false,
                pass: false
            });
        }
    };





    return (
      <Container fluid className="login-section">
        <Particle />
      <Container>
        <Row className="vh-100 d-flex justify-content-center align-items-center">
          <Col md={8} lg={6} xs={12}>
            <Card className="shadow">
              <Card.Body>
                <div className="mb-3 mt-md-4">
                    <h1 className="login-heading">Iniciar <strong className="purple">Sesion </strong></h1>
                    <p className=" mb-5">Por favor ingrese usuario y contraseña!</p>
                <div className="mb-3">
                    <Form onSubmit={registerSubmit(onSubmit)}>
                      <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-center">
                          Correo Electronico
                        </Form.Label>
                        <Form.Control type="email" placeholder="Correo Electronico" 
                        isInvalid={formErrors.correo}
                        {...datos("correo", { required: false })} />
                      </Form.Group>

                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" placeholder="Contraseña" 
                        isInvalid={formErrors.password}
                        {...datos("password", { required: false })} />
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                      >
                        {/* <p className="small">
                          <a className="text-primary" 
                          href="/ForgotPassword">
                            ¿Olvidaste tu contraseña?
                          </a>
                        </p> */}
                      </Form.Group>
                        <Button as = {Col} md={4} variant="primary" type="submit"
                        onClick={registerSubmit(onSubmit)}>
                          Iniciar Sesion
                        </Button>
                    </Form>
                    <div className="mt-3">
                      <p className="mb-0  text-center">
                        ¿Aun no tienes una cuenta?{" "}
                        <a href="/register" className="text-primary fw-bold">
                          Registrate
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

        <Alert  variant='danger' show = {show} onClose={handleClose} dismissible>
          {error}
        </Alert>

        </Row>
        
      </Container>
      </Container>
  );
}

export default Login;