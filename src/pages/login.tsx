import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../helpers/firebase";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import "../css/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");

  const onLogin = (e: any) => {
    const form = e.currentTarget;
    e.preventDefault();
    if (form.checkValidity()) {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage, error);
          setMessage(error.message);
          setShowAlert(true);
        });
    }
    setValidated(true);
  };

  return (
    <Container fluid className="container-login">
      <Row className="justify-content-md-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} className="login-container">
          <div className="login-box">
            <h1 className="login-title">RenalDose</h1>
            <h2 className="login-subtitle">Iniciar Sesión</h2>
            <Form className="pt-3" noValidate validated={validated} onSubmit={onLogin}>
              <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible show={showAlert}>
                <Alert.Heading>Correo y contraseña no encontrados</Alert.Heading>
                <p>{message}</p>
              </Alert>
              <Form.Group className="mb-3" controlId="email">
                <FloatingLabel controlId="email" label="Correo electrónico" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="off"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control-login"
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <InputGroup hasValidation>
                  <FloatingLabel controlId="password" label="Contraseña" className="mb-3">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      autoComplete="off"
                      value={password}
                      required
                      minLength={6}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      Password must comply with the 6 characters restriction.
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </InputGroup>
              </Form.Group>
              <Button variant="primary" type="submit" className="login-button">
                Iniciar Sesión
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
