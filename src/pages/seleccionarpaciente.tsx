import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../helpers/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import "../css/seleccionarPaciente.css"; 

interface Paciente {
  id: string;
  nombreCompleto: string;
  carnetIdentidad: string;
  depuracionCreatinina: string;
  peso: string;
}

const SeleccionarPaciente: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [search, setSearch] = useState("");
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { antibiotico } = location.state;

  useEffect(() => {
    const fetchPacientes = async () => {
      const querySnapshot = await getDocs(collection(firestore, "pacientes"));
      const pacientesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Paciente[];
      setPacientes(pacientesData);
      setFilteredPacientes(pacientesData);
    };
    fetchPacientes();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFilteredPacientes(
      pacientes.filter(
        (paciente) =>
          (paciente.carnetIdentidad && paciente.carnetIdentidad.toLowerCase().includes(value)) ||
          (paciente.nombreCompleto && paciente.nombreCompleto.toLowerCase().includes(value))
      )
    );
  };

  const handleSelectPaciente = (paciente: Paciente) => {
    navigate("/calculoDosis", { state: { paciente, antibiotico } });
  };

  return (
    <Container className="seleccionar-paciente-container">
      <h2 className="text-center title">Seleccionar Paciente</h2>
      <p className="text-center subtitle">Busca un paciente por su carnet de identidad o nombre para ver más detalles</p>
      <Form.Group controlId="search" className="mb-4 search-group">
        <Form.Control
          type="text"
          placeholder="Ingrese el CI o nombre del paciente"
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
      </Form.Group>
      <ListGroup className="patient-list">
        {filteredPacientes.map((paciente) => (
          <ListGroup.Item
            key={paciente.id}
            action
            onClick={() => handleSelectPaciente(paciente)}
            className="patient-item"
          >
            <div>
              <strong>{paciente.nombreCompleto || "Nombre no disponible"}</strong>
              <div className="ci">CI: {paciente.carnetIdentidad}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default SeleccionarPaciente;
