import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../helpers/firebase";  
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import "../css/listaantibioticos.css";

interface Antibiotico {
  id: string;
  nombreComercial: string;
  compuestoPrincipal: string;
  laboratorio: string;
  imageUrl: string;
  presentacion: string;
}

const ListaAntibiotico: React.FC = () => {
  const [antibioticos, setAntibioticos] = useState<Antibiotico[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAntibioticos, setSelectedAntibioticos] = useState<Set<string>>(new Set());
  const [isSelecting, setIsSelecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAntibioticos = async () => {
      const antibioticosCollection = collection(firestore, "antibioticos");
      const antibioticosSnapshot = await getDocs(antibioticosCollection);
      const antibioticosList = antibioticosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Antibiotico[];
      setAntibioticos(antibioticosList);
    };

    fetchAntibioticos();
  }, []);

  const handleRegistrarNuevo = () => {
    navigate("/registrarantibiotico");
  };

  const toggleSelectAntibiotico = (id: string) => {
    setSelectedAntibioticos((prev) => {
      const newSelection = new Set(prev);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return newSelection;
    });
  };

  const handleEliminarSeleccionados = async () => {
    const idsToDelete = Array.from(selectedAntibioticos);
    for (const id of idsToDelete) {
      await deleteDoc(doc(firestore, "antibioticos", id));
    }
    setAntibioticos((prev) => prev.filter((antibiotico) => !selectedAntibioticos.has(antibiotico.id)));
    setSelectedAntibioticos(new Set());
    setIsSelecting(false);
  };

  const filteredAntibioticos = antibioticos.filter((antibiotico) =>
    antibiotico.nombreComercial.toLowerCase().includes(search.toLowerCase()) ||
    antibiotico.compuestoPrincipal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container className="py-4">
      <h1 className="text-center">Lista de Antibióticos</h1>
      <Form.Group controlId="formSearch" className="my-3">
        <Form.Control
          type="text"
          placeholder="Buscador por nombre o compuesto principal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>
      <Button variant="success" onClick={handleRegistrarNuevo} className="mb-3">
        Registrar Nuevo Antibiótico
      </Button>
      <Button
        variant="danger"
        onClick={() => setIsSelecting(!isSelecting)}
        className="mb-3"
        disabled={antibioticos.length === 0}
      >
        {isSelecting ? "Cancelar Selección" : "Eliminar Seleccionados"}
      </Button>

      {isSelecting && selectedAntibioticos.size > 0 && (
        <Button
          variant="warning"
          onClick={handleEliminarSeleccionados}
          className="mb-3"
        >
          Confirmar Eliminación
        </Button>
      )}

      <Row>
        {filteredAntibioticos.length === 0 ? (
          <Col className="text-center">
            <p>No se encontraron antibióticos.</p>
          </Col>
        ) : (
          filteredAntibioticos.map((antibiotico) => (
            <Col key={antibiotico.id} sm={6} md={4} lg={3} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={antibiotico.imageUrl}
                  alt={`Imagen de ${antibiotico.nombreComercial}`}
                />
                <Card.Body>
                  <Card.Title>{antibiotico.nombreComercial}</Card.Title>
                  <Card.Text>
                    <strong>Compuesto principal:</strong> {antibiotico.compuestoPrincipal}
                  </Card.Text>
                  <Card.Text>
                    <strong>Laboratorio:</strong> {antibiotico.laboratorio}
                  </Card.Text>
                  <Card.Text>
                    <strong>Presentación:</strong> {antibiotico.presentacion}
                  </Card.Text>
                  <Button 
                    variant="outline-success" 
                    onClick={() => navigate(`/antibiotico/${antibiotico.id}`)}
                    >
                        Ver Más
                  </Button>
                  {isSelecting && (
                    <Button 
                      variant={selectedAntibioticos.has(antibiotico.id) ? "primary" : "outline-primary"}
                      onClick={() => toggleSelectAntibiotico(antibiotico.id)}
                      className="ms-2"
                    >
                      {selectedAntibioticos.has(antibiotico.id) ? "Deseleccionar" : "Seleccionar"}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default ListaAntibiotico;
