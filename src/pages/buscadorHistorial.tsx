import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import '../css/buscadorHistorial.css';

const BuscadorHistorial: React.FC = () => {
  const [carnetIdentidad, setCarnetIdentidad] = useState<string>("");
  const navigate = useNavigate();

  const handleBuscar = () => {
    if (carnetIdentidad.trim()) {
      navigate(`/historial/${carnetIdentidad}`);
    } else {
      alert("Por favor, ingrese un carnet de identidad válido.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); 
      handleBuscar();
    }
  };

  return (
    <Container className="buscador-container">
      <h2>Búsqueda de Historial</h2>
      <Form>
        <Form.Group controlId="carnetIdentidad">
          <Form.Label>Carnet de Identidad</Form.Label>
          <Form.Control
            type="text"
            value={carnetIdentidad}
            onChange={(e) => setCarnetIdentidad(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ingrese el carnet de identidad"
          />
        </Form.Group>
        <Button className="btn" onClick={handleBuscar}>
          Buscar
        </Button>
      </Form>
    </Container>
  );
};

export default BuscadorHistorial;