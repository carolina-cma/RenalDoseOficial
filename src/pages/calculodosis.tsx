import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "../helpers/firebase";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const CalculoDosis: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paciente, antibiotico } = location.state || {};

  const [dosisCalculada, setDosisCalculada] = useState<number | null>(null);
  const [isCalculado, setIsCalculado] = useState<boolean>(false);
  const [dosisEditable, setDosisEditable] = useState<string>("");
  const [frecuenciaEditable, setFrecuenciaEditable] = useState<string>("");
  const [dosisOpciones, setDosisOpciones] = useState<string[]>([]);
  const [frecuenciaOpciones, setFrecuenciaOpciones] = useState<string[]>([]);
  const [dosisSeleccionada, setDosisSeleccionada] = useState<string>("");
  const [frecuenciaSeleccionada, setFrecuenciaSeleccionada] = useState<string>("");
  const [necesitaPeso, setNecesitaPeso] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const validData = paciente && antibiotico;

  useEffect(() => {
    console.log(dosisCalculada);
  }, [dosisCalculada]);

  useEffect(() => {
    if (!validData) return;

    const fetchDosisFrecuencia = async () => {
      try {
        const dosisQuery = query(
          collection(firestore, "dosisFrecuencia"),
          where("compuestoPrincipal", "==", antibiotico.compuestoPrincipal)
        );
        const querySnapshot = await getDocs(dosisQuery);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          const presentacionData = data[antibiotico.presentacion.toLowerCase()];

          if (presentacionData) {
            setNecesitaPeso(presentacionData.necesitaPeso || false);
            const depuracionCreatinina = parseInt(paciente.depuracionCreatinina, 10);

            if (depuracionCreatinina > 50 && presentacionData.mayor50) {
              setDosisOpciones(presentacionData.mayor50);
              setFrecuenciaOpciones(presentacionData.frecuenciaMayor50 || []);
            } else if (depuracionCreatinina > 30 && presentacionData.de30a50) {
              setDosisOpciones(presentacionData.de30a50);
              setFrecuenciaOpciones(presentacionData.frecuencia30a50 || []);
            } else if (depuracionCreatinina > 10 && presentacionData.de10a30) {
              setDosisOpciones(presentacionData.de10a30);
              setFrecuenciaOpciones(presentacionData.frecuencia10a30 || []);
            } else if (presentacionData.menor10) {
              setDosisOpciones(presentacionData.menor10);
              setFrecuenciaOpciones(presentacionData.frecuenciaMenor10 || []);
            } else {
              alert("No hay datos de dosificación disponibles para este nivel de depuración de creatinina.");
            }
          } else {
            alert("No hay datos de presentación disponibles para este antibiótico.");
          }
        } else {
          alert("No se encontraron datos de dosificación para el compuesto principal.");
        }
      } catch (error) {
        console.error("Error al cargar datos de dosificación:", error);
        alert("Error al cargar datos de dosificación.");
      } finally {
        setLoading(false);
      }
    };

    fetchDosisFrecuencia();
  }, [antibiotico?.compuestoPrincipal, antibiotico?.presentacion, paciente?.depuracionCreatinina, validData]);

  const calcularDosis = () => {
    if (!validData) return;
    const peso = parseFloat(paciente.peso);

    if (dosisOpciones.length > 0) {
      const dosisInicial = necesitaPeso ? parseFloat(dosisOpciones[0]) * peso : parseFloat(dosisOpciones[0]);
      setDosisCalculada(dosisInicial);
      setDosisEditable(dosisInicial.toString());
      setFrecuenciaEditable(frecuenciaOpciones[0]);
      setIsCalculado(true);
    }
  };

  const confirmarDosis = () => {
    if (!validData) return;

    navigate("/mensajedosis", {
      state: {
        paciente,
        antibiotico,
        dosisCalculada: dosisEditable,
        frecuencia: frecuenciaEditable,
      },
    });
  };

  if (!validData) return <p>Error: Datos del paciente o antibiótico no encontrados.</p>;

  return (
    <Container>
      <h2>Cálculo de Dosificación</h2>
      <h4>Antibiótico Seleccionado</h4>
      <p>
        <strong>Nombre:</strong> {antibiotico.nombreComercial}
      </p>
      <p>
        <strong>Compuesto principal:</strong> {antibiotico.compuestoPrincipal}
      </p>
      <p>
        <strong>Presentación:</strong> {antibiotico.presentacion}
      </p>
      <h4>Datos del Paciente</h4>
      <p>
        <strong>Nombre:</strong> {paciente.nombreCompleto}
      </p>
      <p>
        <strong>Edad:</strong> {paciente.edad}
      </p>
      <p>
        <strong>CI:</strong> {paciente.carnetIdentidad}
      </p>
      <p>
        <strong>Tipo de Insuficiencia Renal:</strong> {paciente.tipoInsuficiencia}
      </p>
      <p>
        <strong>Depuración de Creatinina:</strong> {paciente.depuracionCreatinina} mL/min
      </p>

      {loading ? (
        <p>Cargando datos de dosificación...</p>
      ) : (
        <Button variant="primary" onClick={calcularDosis} disabled={isCalculado}>
          Calcular Dosis
        </Button>
      )}

      {isCalculado && (
        <div className="resultado-calculo mt-4">
          <h4>Resultado del Cálculo</h4>
          <Form.Group controlId="dosisSeleccionada">
            <Form.Label>Dosis (mg)</Form.Label>
            <Form.Select
              value={dosisSeleccionada}
              onChange={(e) => {
                setDosisSeleccionada(e.target.value);
                setDosisEditable(
                  necesitaPeso ? (parseFloat(e.target.value) * parseFloat(paciente.peso)).toString() : e.target.value
                );
              }}
            >
              {dosisOpciones.map((dosis, index) => (
                <option key={index} value={dosis}>
                  {dosis}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="frecuenciaSeleccionada">
            <Form.Label>Frecuencia (horas)</Form.Label>
            <Form.Select
              value={frecuenciaSeleccionada}
              onChange={(e) => {
                setFrecuenciaSeleccionada(e.target.value);
                setFrecuenciaEditable(e.target.value);
              }}
            >
              {frecuenciaOpciones.map((frecuencia, index) => (
                <option key={index} value={frecuencia}>
                  {frecuencia}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="success" onClick={confirmarDosis}>
            Confirmar Dosis
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CalculoDosis;
