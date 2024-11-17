import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../helpers/firebase";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const MensajeDosis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paciente, antibiotico, dosisCalculada, frecuencia } = location.state || {};
  const [diasTratamiento, setDiasTratamiento] = useState<number | "">("");

  const confirmarGuardarDosis = async () => {
    if (!paciente || !antibiotico) {
      alert("Información incompleta: asegúrate de que los datos del paciente y del antibiótico estén disponibles.");
      return;
    }

    if (!diasTratamiento || diasTratamiento <= 0) {
      alert("Por favor, ingresa un número válido de días para el tratamiento.");
      return;
    }

    const fecha = new Date().toISOString();

    try {
      await addDoc(collection(firestore, "historialDosificaciones"), {
        pacienteId: paciente.id || "",
        antibioticoId: antibiotico.id || "",
        detallesAntibiotico: {
          compuestoPrincipal: antibiotico.compuestoPrincipal || "No disponible",
          nombreComercial: antibiotico.nombreComercial || "No disponible",
          presentacion: antibiotico.presentacion || "No disponible",
          descripcion: antibiotico.descripcion || "No disponible",
          laboratorio: antibiotico.laboratorio || "No disponible",
          imageUrl: antibiotico.imageUrl || "",
        },
        detallesPaciente: {
          nombreCompleto: paciente.nombreCompleto || "No disponible",
          carnetIdentidad: paciente.carnetIdentidad || "No disponible",
          edad: paciente.fechaNacimiento || "No disponible",
          tipoInsuficiencia: paciente.tipoInsuficiencia || "No disponible",
          depuracionCreatinina: paciente.depuracionCreatinina || "No disponible",
        },
        dosisCalculada: parseFloat(dosisCalculada) || 0,
        frecuencia: frecuencia || "No disponible",
        diasTratamiento: diasTratamiento,
        fecha,
      });

      alert("Dosis confirmada y guardada en el historial del paciente.");
      navigate("/"); 
    } catch (error) {
      console.error("Error al guardar la dosis:", error);
      alert("Hubo un error al guardar la dosis. Inténtalo de nuevo.");
    }
  };

  return (
    <Container>
      <h2>Mensaje de Dosificación</h2>
      <h4>Datos del Paciente</h4>
      <p>
        <strong>Nombre Completo:</strong> {paciente?.nombreCompleto || "No disponible"}
      </p>
      <p>
        <strong>CI:</strong> {paciente?.carnetIdentidad || "No disponible"}
      </p>
      <p>
        <strong>Edad:</strong> {paciente?.fechaNacimiento || "No disponible"}
      </p>
      <p>
        <strong>Tipo de Insuficiencia Renal:</strong> {paciente?.tipoInsuficiencia || "No disponible"}
      </p>
      <p>
        <strong>Depuración de Creatinina:</strong> {paciente?.depuracionCreatinina || "No disponible"} mL/min
      </p>

      {antibiotico && (
        <>
          <h4>Detalles del Antibiótico</h4>
          <p>
            <strong>Nombre Comercial:</strong> {antibiotico.nombreComercial || "No disponible"}
          </p>
          <p>
            <strong>Compuesto Principal:</strong> {antibiotico.compuestoPrincipal || "No disponible"}
          </p>
          <p>
            <strong>Descripción:</strong> {antibiotico.descripcion || "No disponible"}
          </p>
          <p>
            <strong>Laboratorio:</strong> {antibiotico.laboratorio || "No disponible"}
          </p>
          <p>
            <strong>Presentación:</strong> {antibiotico.presentacion || "No disponible"}
          </p>
          <p>
            <strong>Imagen:</strong>
            <img src={antibiotico.imageUrl || ""} alt="Imagen del antibiótico" width="100" height="100" />
          </p>
        </>
      )}

      <h4>Resultado de Dosificación</h4>
      <p>
        <strong>Dosis Calculada (mg):</strong> {dosisCalculada || "No disponible"}
      </p>
      <p>
        <strong>Frecuencia (horas):</strong> {frecuencia || "No disponible"}
      </p>
      <Form.Group className="mb-3" controlId="diasTratamiento">
        <Form.Label><strong>Días de Tratamiento:</strong></Form.Label>
        <Form.Control
          type="number"
          value={diasTratamiento}
          onChange={(e) => setDiasTratamiento(Number(e.target.value) || "")}
          placeholder="Ingresa la cantidad de días"
          min="1"
          required
        />
      </Form.Group>

      <Button variant="success" onClick={confirmarGuardarDosis}>
        Confirmar Dosis y Guardar
      </Button>
    </Container>
  );
};

export default MensajeDosis;
