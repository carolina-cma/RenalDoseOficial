import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../helpers/firebase";
import "../css/antibioticodetalle.css";
import Button from "react-bootstrap/Button";

interface Antibiotico {
  id: string;
  nombreComercial: string;
  compuestoPrincipal: string;
  laboratorio: string;
  descripcion: string;
  imageUrl: string;
  presentacion: string;
}

const AntibioticoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [antibiotico, setAntibiotico] = useState<Antibiotico | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAntibiotico = async () => {
      if (id) {
        const docRef = doc(firestore, "antibioticos", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAntibiotico({ id: docSnap.id, ...docSnap.data() } as Antibiotico);
        }
      }
    };

    fetchAntibiotico();
  }, [id]);

  const handleCalcularDosis = () => {
    navigate("/seleccionarPaciente", { state: { antibiotico } });
  };

  if (!antibiotico) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="detalle-container">
      <header className="detalle-header">
        <h1>RenalDose</h1>
        <Button variant="outline-dark" onClick={() => navigate("/")} className="user-icon">
         
        </Button>
      </header>
      <div className="detalle-content">
        <h2>CÁLCULO DE DOSIFICACIÓN</h2>
        <div className="detalle-info">
          <img src={antibiotico.imageUrl} alt={antibiotico.nombreComercial} className="detalle-image" />
          <div className="detalle-texto">
            <h3>{antibiotico.nombreComercial}</h3>
            <p><strong>Compuesto principal:</strong> {antibiotico.compuestoPrincipal}</p>
            <p><strong>Laboratorio:</strong> {antibiotico.laboratorio}</p>
            <p><strong>Descripción:</strong> {antibiotico.descripcion}</p>
            <p><strong>Presentación:</strong> {antibiotico.presentacion}</p>
          </div>
        </div>
        <Button variant="success" className="detalle-button" onClick={handleCalcularDosis}>
          Calcular la Dosis
        </Button>
      </div>
    </div>
  );
};

export default AntibioticoDetalle;