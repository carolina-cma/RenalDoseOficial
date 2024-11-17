import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../helpers/firebase";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import '../css/historialpaciente.css';

interface HistorialData {
  nombreCompleto: string;
  carnetIdentidad: string;
  fechaNacimiento: string;
  depuracionCreatinina: string;
  tipoInsuficiencia: string;
  peso: string;
  hemodialisis: boolean;
  numeroEmergencia: string;
  nombreEmergencia: string;
}

interface DosificacionData {
  id: string; 
  dosisCalculada: number;
  frecuencia: string;
  diasTratamiento: number;
  fecha: string;
  detallesAntibiotico?: {
    nombreComercial?: string;
    compuestoPrincipal?: string;
    presentacion?: string;
  };
}

const calcularEdad = (fechaNacimiento: string) => {
  const hoy = new Date();
  const fechaNac = new Date(fechaNacimiento);
  let edadAnios = hoy.getFullYear() - fechaNac.getFullYear();
  let edadMeses = hoy.getMonth() - fechaNac.getMonth();

  if (edadMeses < 0) {
    edadAnios--;
    edadMeses += 12;
  }

  return `${edadAnios} años y ${edadMeses} meses`;
};

const Historial: React.FC = () => {
  const [historialData, setHistorialData] = useState<HistorialData | null>(null);
  const [dosificaciones, setDosificaciones] = useState<DosificacionData[]>([]);
  const [mensaje, setMensaje] = useState<string>("Cargando historial clínico...");
  const { carnetIdentidad } = useParams<{ carnetIdentidad: string }>(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistorialData = async () => {
      if (!carnetIdentidad) return;

      try {
        const pacientesRef = collection(firestore, "pacientes");
        const q = query(pacientesRef, where("carnetIdentidad", "==", carnetIdentidad));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data() as HistorialData;
          setHistorialData(data);
          setMensaje("");
        } else {
          setMensaje("No se encontró ningún historial clínico con ese número de carnet de identidad.");
        }
      } catch (error) {
        console.error("Error al recuperar el historial:", error);
        setMensaje("Hubo un error al buscar el historial.");
      }
    };

    const fetchDosificaciones = async () => {
      try {
        const dosificacionesRef = collection(firestore, "historialDosificaciones");
        const q = query(dosificacionesRef, where("detallesPaciente.carnetIdentidad", "==", carnetIdentidad));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DosificacionData));
          setDosificaciones(data);
        } else {
          setMensaje("No se encontraron dosificaciones en el historial clínico.");
        }
      } catch (error) {
        console.error("Error al recuperar el historial de dosificaciones:", error);
        setMensaje("Hubo un error al buscar el historial de dosificaciones.");
      }
    };

    fetchHistorialData();
    fetchDosificaciones();
  }, [carnetIdentidad]);

  const eliminarDosificacion = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, "historialDosificaciones", id));
      setDosificaciones(prev => prev.filter(dosificacion => dosificacion.id !== id));
      alert("Historial de dosificación eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el historial de dosificación:", error);
      alert("Hubo un error al eliminar el historial de dosificación. Inténtelo de nuevo.");
    }
  };

  if (mensaje) {
    return <p>{mensaje}</p>;
  }

  return (
    <Container>
      <h2>Historial del Paciente</h2>
      
      <div className="subtitulo">Datos Personales</div>
      <div className="datos-personales">
        <div>
          <p><strong>Nombre:</strong> {historialData?.nombreCompleto}</p>
          <p><strong>Carnet de identidad:</strong> {historialData?.carnetIdentidad}</p>
          <p><strong>Fecha de Nacimiento:</strong> {historialData?.fechaNacimiento}</p>
          <p><strong>Edad:</strong> {historialData?.fechaNacimiento ? calcularEdad(historialData.fechaNacimiento) : "No disponible"}</p>
          <p><strong>Tipo de Insuficiencia Renal:</strong> {historialData?.tipoInsuficiencia}</p>
        </div>
        <div>
          <p><strong>Depuración de Creatinina:</strong> {historialData?.depuracionCreatinina}</p>
          <p><strong>Nombre de Emergencia:</strong> {historialData?.nombreEmergencia}</p>
          <p><strong>Contacto de Emergencia:</strong> {historialData?.numeroEmergencia}</p>
          <p><strong>Peso:</strong> {historialData?.peso} kg</p>
          <p><strong>Hemodiálisis:</strong> {historialData?.hemodialisis ? "Sí" : "No"}</p>
        </div>
      </div>

      <div className="subtitulo">Historial Clínico</div>
      <div className="historial-clinico">
        {dosificaciones.length > 0 ? (
          dosificaciones.map((dosificacion, index) => (
            <div key={index} className="dosificacion-item">
              <p><strong>Fecha:</strong> {new Date(dosificacion.fecha).toLocaleDateString()}</p>
              <p><strong>Dosis Calculada:</strong> {dosificacion.dosisCalculada} mg</p>
              <p><strong>Frecuencia:</strong> cada {dosificacion.frecuencia}</p>
              <p><strong>Días de tratamiento:</strong> {dosificacion.diasTratamiento}</p>
              <p><strong>Antibiótico:</strong> {dosificacion.detallesAntibiotico?.nombreComercial || "No disponible"}</p>
              <p><strong>Compuesto Principal:</strong> {dosificacion.detallesAntibiotico?.compuestoPrincipal || "No disponible"}</p>
              <p><strong>Presentación:</strong> {dosificacion.detallesAntibiotico?.presentacion || "No disponible"}</p>
              <Button variant="danger" onClick={() => eliminarDosificacion(dosificacion.id)}>
                Eliminar
              </Button>
            </div>
          ))
        ) : (
          <p>No hay dosificaciones registradas en el historial clínico.</p>
        )}
      </div>

      <Button variant="secondary" className="volver-btn" onClick={() => navigate("/")}>
        Volver al Inicio
      </Button>
    </Container>
  );
};

export default Historial;
