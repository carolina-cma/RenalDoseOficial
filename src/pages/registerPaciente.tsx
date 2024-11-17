import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export default function RegisterPaciente() {
  const navigate = useNavigate();
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [carnetIdentidad, setCarnetIdentidad] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [edad, setEdad] = useState<number | null>(null); 
  const [genero, setGenero] = useState("");
  const [numeroCelular, setNumeroCelular] = useState("");
  const [nombreEmergencia, setNombreEmergencia] = useState("");
  const [numeroEmergencia, setNumeroEmergencia] = useState("");

  const calcularEdad = (fecha: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const onSubmit = (e: any) => {
    e.preventDefault();

  
    const pacienteData = {
      nombreCompleto,
      carnetIdentidad,
      fechaNacimiento,
      edad,
      genero,
      numeroCelular,
      nombreEmergencia,
      numeroEmergencia,
    };
    localStorage.setItem("pacienteData", JSON.stringify(pacienteData));

    
    navigate("/registerClinico");
  };

  const handleFechaNacimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fecha = e.target.value;
    setFechaNacimiento(fecha);
    setEdad(calcularEdad(fecha)); 
  };

  return (
    <Container>
      <Row className="pt-5 justify-content-md-center">
        <Col md={6}>
          <h2>Registro de Paciente</h2>
          <Form className="pt-3" onSubmit={onSubmit}>
            <FloatingLabel controlId="nombreCompleto" label="Nombre Completo" className="mb-3">
              <Form.Control
                type="text"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
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

            <FloatingLabel controlId="fechaNacimiento" label="Fecha de Nacimiento" className="mb-3">
              <Form.Control
                type="date"
                value={fechaNacimiento}
                onChange={handleFechaNacimientoChange}
                required
              />
            </FloatingLabel>

            <FloatingLabel controlId="edad" label="Edad" className="mb-3">
              <Form.Control
                type="text"
                value={edad !== null ? `${edad} años` : ""}
                readOnly
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

            <FloatingLabel controlId="nombreEmergencia" label="Nombre Contacto de Emergencia" className="mb-3">
              <Form.Control
                type="text"
                value={nombreEmergencia}
                onChange={(e) => setNombreEmergencia(e.target.value)}
                required
              />
            </FloatingLabel>

            <FloatingLabel controlId="numeroEmergencia" label="Número Contacto de Emergencia" className="mb-3">
              <Form.Control
                type="text"
                value={numeroEmergencia}
                onChange={(e) => setNumeroEmergencia(e.target.value)}
                required
              />
            </FloatingLabel>

            <Button variant="primary" type="submit">Siguiente</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
