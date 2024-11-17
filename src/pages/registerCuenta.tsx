import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, FloatingLabel, Alert } from "react-bootstrap";
import { auth, firestore } from "../helpers/firebase";
import { createUserWithEmailAndPassword, onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import RegisterSuccessModal from "./registerExitosoModal";
import "../css/registerCuenta.css";

const RegisterCuenta: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Nuevo estado
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
    navigate("/"); // Redirige al usuario al cerrar el modal
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setShowAlert(true);
      return;
    }

    if (isSubmitting) return; // Evita múltiples clics mientras se procesa
    setIsSubmitting(true); // Activa el estado de carga

    try {
      // Desvincula temporalmente el usuario actual para crear un nuevo usuario sin cambiar de sesión
      await updateCurrentUser(auth, null);

      // Crea la cuenta para el nuevo paciente
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtiene los datos del paciente y clínicos desde el almacenamiento local
      const pacienteData = JSON.parse(localStorage.getItem("pacienteData") || "{}");
      const clinicoData = JSON.parse(localStorage.getItem("clinicoData") || "{}");

      // Almacena los datos del paciente en Firestore
      await setDoc(doc(firestore, "pacientes", user.uid), {
        ...pacienteData,
        ...clinicoData,
      });

      // Limpia los datos locales
      localStorage.removeItem("pacienteData");
      localStorage.removeItem("clinicoData");

      // Vuelve a establecer el usuario original como el usuario activo
      await updateCurrentUser(auth, originalUser);

      // Muestra el modal de éxito
      setShowModal(true);
      setMessage(""); // Resetea el mensaje en caso de éxito
    } catch (error: any) {
      console.error("Error:", error);
      setMessage("Error al registrar el usuario: " + error.message);
      setShowAlert(true);
    } finally {
      setIsSubmitting(false); // Libera el estado de carga
    }
  };

  return (
    <div className="wrapper">
      <div className="register-container">
        <h2>Registro de Cuenta</h2>
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

          <RegisterSuccessModal show={showModal} handleClose={handleCloseModal} />
        </Form>
      </div>
    </div>
  );
};

export default RegisterCuenta;
