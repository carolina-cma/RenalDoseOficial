import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { auth, firestore } from "../helpers/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import RegisterSuccessModal from "./registerExitosoModal";
import "../css/registercuentadoctor.css";

const RegistroCuentaDoctor: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        navigate("/");
        setShowModal(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showModal, navigate]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setOriginalUser(user);
      }
    });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setShowAlert(true);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await updateCurrentUser(auth, null);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const doctorData = JSON.parse(localStorage.getItem("doctorData") || "{}");

      await setDoc(doc(firestore, "doctores", user.uid), {
        ...doctorData,
      });

      localStorage.removeItem("doctorData");
      setMessage("");
      setShowModal(true);

      await updateCurrentUser(auth, originalUser);
    } catch (error) {
      setMessage("Ocurrió un error al registrar al doctor. Inténtelo nuevamente.");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <div className="register-container">
        <h2>Registro de Cuenta Doctor</h2>
        {showAlert && <Alert variant="danger">{message}</Alert>}
        <Form onSubmit={onSubmit}>
          <FloatingLabel controlId="email" label="Correo" className="mb-3">
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="password" label="Contraseña" className="mb-3">
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </FloatingLabel>

          <FloatingLabel controlId="confirmPassword" label="Confirmar Contraseña" className="mb-3">
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FloatingLabel>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
        </Form>

        <RegisterSuccessModal show={showModal} handleClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default RegistroCuentaDoctor;
