import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../helpers/firebase";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import "../css/registrarantibiotico.css";

const RegistrarAntibiotico: React.FC = () => {
  const [nombreComercial, setNombreComercial] = useState<string>("");
  const [compuestoPrincipal, setCompuestoPrincipal] = useState<string>("");
  const [laboratorio, setLaboratorio] = useState<string>("");
  const [presentacion, setPresentacion] = useState<string>("Tableta");
  const [descripcion, setDescripcion] = useState<string>("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [dosisFrecuencia, setDosisFrecuencia] = useState<any>({});
  const [mensajeNoEncontrado, setMensajeNoEncontrado] = useState<string>("");

 
  const [dosisClCrMayor50, setDosisClCrMayor50] = useState<string>("");
  const [frecuenciaClCrMayor50, setFrecuenciaClCrMayor50] = useState<string>("");
  const [dosisClCr30a50, setDosisClCr30a50] = useState<string>("");
  const [frecuenciaClCr30a50, setFrecuenciaClCr30a50] = useState<string>("");
  const [dosisClCr10a30, setDosisClCr10a30] = useState<string>("");
  const [frecuenciaClCr10a30, setFrecuenciaClCr10a30] = useState<string>("");
  const [dosisClCrMenor10, setDosisClCrMenor10] = useState<string>("");
  const [frecuenciaClCrMenor10, setFrecuenciaClCrMenor10] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    if (compuestoPrincipal) {
      const fetchDosisFrecuencia = async () => {
        const q = query(
          collection(firestore, "dosisFrecuencia"),
          where("compuestoPrincipal", "==", compuestoPrincipal)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data())[0];

        if (data) {
          setDosisFrecuencia(data);
          setMensajeNoEncontrado("");
        } else {
          setDosisFrecuencia({});
          setMensajeNoEncontrado(`No se encontraron datos para el compuesto "${compuestoPrincipal}".`);
        }
      };
      fetchDosisFrecuencia();
    }
  }, [compuestoPrincipal]);

  const handleImageUpload = async (file: File) => {
    const storageRef = ref(storage, `antibioticos/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreComercial || !compuestoPrincipal || !laboratorio || !descripcion || !imagen) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      const imageUrl = await handleImageUpload(imagen);

      await addDoc(collection(firestore, "antibioticos"), {
        nombreComercial,
        compuestoPrincipal,
        laboratorio,
        presentacion,
        descripcion,
        imageUrl,
      });

      setError("");
      navigate("/listaantibiotico");
    } catch (err) {
      console.error("Error al registrar el antibiótico:", err);
      setError("Hubo un problema al registrar el antibiótico. Inténtalo de nuevo.");
    }
  };

  const obtenerOpcionesPorPresentacion = (rango: string) => {
    const opciones = dosisFrecuencia[presentacion.toLowerCase()]?.[rango] || [];
    return opciones.map((option: string) => <option key={option} value={option}>{option}</option>);
  };

  return (
    <Container>
      <h2>Registrar Antibiótico</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {mensajeNoEncontrado && <Alert variant="warning">{mensajeNoEncontrado}</Alert>}
      <Form onSubmit={handleSubmit} className="form-content">
        <div className="left-column">
          <Form.Group controlId="nombreComercial" className="mb-3">
            <Form.Label>Nombre Comercial</Form.Label>
            <Form.Control
              type="text"
              value={nombreComercial}
              onChange={(e) => setNombreComercial(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="compuestoPrincipal" className="mb-3">
            <Form.Label>Compuesto Principal</Form.Label>
            <Form.Control
              type="text"
              value={compuestoPrincipal}
              onChange={(e) => setCompuestoPrincipal(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="laboratorio" className="mb-3">
            <Form.Label>Laboratorio</Form.Label>
            <Form.Control
              type="text"
              value={laboratorio}
              onChange={(e) => setLaboratorio(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="presentacion" className="mb-3">
            <Form.Label>Presentación</Form.Label>
            <Form.Select
              value={presentacion}
              onChange={(e) => setPresentacion(e.target.value)}
            >
              <option value="Tableta">Tableta</option>
              <option value="Intravenoso">Intravenoso</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="descripcion" className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="imagen" className="mb-3">
            <Form.Label>Imagen</Form.Label>
            <InputGroup>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImagen((e.target as HTMLInputElement).files ? (e.target as HTMLInputElement).files![0] : null)
                }
                required
              />
            </InputGroup>
          </Form.Group>
        </div>


        <div className="right-column">
          <h3>Dosis por ClCr para {presentacion}</h3>

          {/* ClCr > 50 */}
          <Form.Group controlId="dosisClCrMayor50" className="mb-3">
            <Form.Label>Dosis para ClCr mayor 50</Form.Label>
            <Form.Select
              value={dosisClCrMayor50}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDosisClCrMayor50(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("mayor50")}
            </Form.Select>
            <Form.Label>Frecuencia para ClCr mayor 50</Form.Label>
            <Form.Select
              value={frecuenciaClCrMayor50}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFrecuenciaClCrMayor50(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("frecuenciaMayor50")}
            </Form.Select>
          </Form.Group>

       
          <Form.Group controlId="dosisClCr30a50" className="mb-3">
            <Form.Label>Dosis para ClCr 30-50</Form.Label>
            <Form.Select
              value={dosisClCr30a50}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDosisClCr30a50(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("de30a50")}
            </Form.Select>
            <Form.Label>Frecuencia para ClCr 30-50</Form.Label>
            <Form.Select
              value={frecuenciaClCr30a50}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFrecuenciaClCr30a50(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("frecuencia30a50")}
            </Form.Select>
          </Form.Group>

   
          <Form.Group controlId="dosisClCr10a30" className="mb-3">
            <Form.Label>Dosis para ClCr 10-30</Form.Label>
            <Form.Select
              value={dosisClCr10a30}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDosisClCr10a30(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("de10a30")}
            </Form.Select>
            <Form.Label>Frecuencia para ClCr 10-30</Form.Label>
            <Form.Select
              value={frecuenciaClCr10a30}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFrecuenciaClCr10a30(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("frecuencia10a30")}
            </Form.Select>
          </Form.Group>
          
          <Form.Group controlId="dosisClCrMenor10" className="mb-3">
            <Form.Label>Dosis para ClCr menor 10</Form.Label>
            <Form.Select
              value={dosisClCrMenor10}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDosisClCrMenor10(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("menor10")}
            </Form.Select>
            <Form.Label>Frecuencia para ClCr menor 10</Form.Label>
            <Form.Select
              value={frecuenciaClCrMenor10}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFrecuenciaClCrMenor10(e.target.value)}
            >
              {obtenerOpcionesPorPresentacion("frecuenciaMenor10")}
            </Form.Select>
          </Form.Group>
        </div>

        <Button variant="primary" type="submit">
          Registrar Antibiótico
        </Button>
      </Form>
    </Container>
  );
};

export default RegistrarAntibiotico;