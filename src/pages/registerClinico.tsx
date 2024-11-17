import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "../css/registerClinico.css";

export default function RegisterClinico() {
  const navigate = useNavigate();
  const [peso, setPeso] = useState<number | "">("");
  const [altura, setAltura] = useState<number | "">("");
  const [depuracionCreatinina, setDepuracionCreatinina] = useState<number | "">("");
  const [tipoInsuficiencia, setTipoInsuficiencia] = useState<string>("");
  const [rangoDosis, setRangoDosis] = useState<string>("");
  const [hemodialisis, setHemodialisis] = useState<boolean | "">("");

  useEffect(() => {
    const calcularTipoInsuficiencia = (valor: number): string => {
      if (valor >= 90) return "normal";
      if (valor >= 60) return "leve";
      if (valor >= 45) return "leve - moderado (IRC)";
      if (valor >= 30) return "moderado-grave (IRC)";
      if (valor >= 15) return "grave (IRC)";
      return "prediálisis / diálisis";
    };

    const calcularRangoDosis = (valor: number): string => {
      if (valor >= 50) return ">50";
      if (valor >= 30) return "30 - 50";
      if (valor >= 10) return "10 - 30";
      return "<10";
    };

    if (depuracionCreatinina !== "" && !isNaN(depuracionCreatinina as number)) {
      const valorDepuracion = depuracionCreatinina as number;
      setTipoInsuficiencia(calcularTipoInsuficiencia(valorDepuracion));
      setRangoDosis(calcularRangoDosis(valorDepuracion));
    }
  }, [depuracionCreatinina]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clinicoData = {
      peso,
      altura,
      depuracionCreatinina,
      tipoInsuficiencia,
      rangoDosis, 
      hemodialisis,
    };

    localStorage.setItem("clinicoData", JSON.stringify(clinicoData));
    navigate("/registerCuenta");
  };

  return (
    <Container>
      <Row className="pt-5 justify-content-md-center">
        <Col md={6}>
          <h2>Registro Clínico</h2>
          <Form className="pt-3" onSubmit={onSubmit}>
            <FloatingLabel controlId="peso" label="Peso (kg)" className="mb-3">
              <Form.Control
                type="number"
                value={peso || ""}
                onChange={(e) => setPeso(e.target.value ? parseFloat(e.target.value) : "")}
                required
              />
            </FloatingLabel>

            <FloatingLabel controlId="altura" label="Altura (cm)" className="mb-3">
              <Form.Control
                type="number"
                value={altura || ""}
                onChange={(e) => setAltura(e.target.value ? parseFloat(e.target.value) : "")}
                required
              />
            </FloatingLabel>

            <FloatingLabel controlId="depuracionCreatinina" label="Depuración de Creatinina" className="mb-3">
              <Form.Control
                type="number"
                value={depuracionCreatinina || ""}
                onChange={(e) => setDepuracionCreatinina(e.target.value ? parseFloat(e.target.value) : "")}
                required
              />
            </FloatingLabel>

            <FloatingLabel controlId="tipoInsuficiencia" label="Tipo de Insuficiencia Renal" className="mb-3">
              <Form.Control
                type="text"
                value={tipoInsuficiencia}
                readOnly 
              />
            </FloatingLabel>

            <FloatingLabel controlId="rangoDosis" label="Rango de Dosis" className="mb-3">
              <Form.Control
                type="text"
                value={rangoDosis}
                readOnly 
              />
            </FloatingLabel>

            <FloatingLabel controlId="hemodialisis" label="Hemodiálisis" className="mb-3">
              <Form.Select
                value={hemodialisis === "" ? "" : hemodialisis ? "Sí" : "No"}
                onChange={(e) => setHemodialisis(e.target.value === "Sí")}
                required
              >
                <option value="">Seleccione</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
              </Form.Select>
            </FloatingLabel>

            <Button variant="primary" type="submit">Siguiente</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
