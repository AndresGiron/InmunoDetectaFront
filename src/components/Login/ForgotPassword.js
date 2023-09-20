import {React, useState} from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import Particle from "../Particle";
import { useForm } from 'react-hook-form'


function ForgotPassword() {
    const { handleSubmit: registerSubmit, register: datos } = useForm({})
    const [formErrors, setFormErrors] = useState({
        correo: false
    });

    const onSubmit = data => {

        console.log(data)

        let errors = {};
        if (data.correo === '') {
            errors.correo = true;
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
        }else{
            console.log('Datos enviados:', data);

            setFormErrors({
                correo: false,
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
                    <h1 className="login-heading">Recuperar <strong className="purple">Contraseña </strong></h1>
                    <p className=" mb-5">Por favor ingrese su correo!</p>
                <div className="mb-3">
                    <Form onSubmit={registerSubmit(onSubmit)}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-center">
                          Correo Electronico
                        </Form.Label>
                        <Form.Control type="email" placeholder="Correo Electronico" 
                        {...datos("correo", { required: false })} 
                        isInvalid={formErrors.correo}/>
                      </Form.Group>
                        <Button as = {Col} md={4} variant="primary" type="submit" onClick={registerSubmit(onSubmit)}>
                          Enviar
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

export default ForgotPassword;