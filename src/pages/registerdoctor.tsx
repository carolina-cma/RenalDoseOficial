import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import '../css/registerdoctor.css';

export default function RegistroDoctor() {
  const navigate = useNavigate();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");
  const [carnetIdentidad, setCarnetIdentidad] = useState("");
  const [especialidadMedica, setEspecialidadMedica] = useState("");

  const onSubmit = (e: any) => {
    e.preventDefault();

    const doctorData = {
      nombreCompleto,
      fechaNacimiento,
      genero,
      numeroCelular,
      carnetIdentidad,
      especialidadMedica,
    };
    localStorage.setItem("doctorData", JSON.stringify(doctorData));

    navigate("/registercuentadoctor");
  };

  return (
    <div className="form-container">
      <h2>Registro de Doctor</h2>
      <Form className="pt-3" onSubmit={onSubmit}>
        <FloatingLabel controlId="nombreCompleto" label="Nombre Completo" className="mb-3">
          <Form.Control
            type="text"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="fechaNacimiento" label="Fecha de Nacimiento" className="mb-3">
          <Form.Control
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="genero" label="Género" className="mb-3">
          <Form.Select
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
            required
          >
            <option value="">Seleccione</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </Form.Select>
        </FloatingLabel>

        <FloatingLabel controlId="numeroCelular" label="Número de Celular" className="mb-3">
          <Form.Control
            type="text"
            value={numeroCelular}
            onChange={(e) => setNumeroCelular(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="carnetIdentidad" label="Carnet de Identidad" className="mb-3">
          <Form.Control
            type="text"
            value={carnetIdentidad}
            onChange={(e) => setCarnetIdentidad(e.target.value)}
            required
          />
        </FloatingLabel>

        <FloatingLabel controlId="especialidadMedica" label="Especialidad Médica" className="mb-3">
          <Form.Control
            type="text"
            value={especialidadMedica}
            onChange={(e) => setEspecialidadMedica(e.target.value)}
            required
          />
        </FloatingLabel>

        <Button variant="primary" type="submit">Siguiente</Button>
      </Form>
    </div>
  );
}
