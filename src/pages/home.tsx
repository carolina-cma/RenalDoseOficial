import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../helpers/firebase";
import { User } from "firebase/auth";
import '../css/home.css';
 
export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | undefined>();
 
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(undefined);
        navigate("/login", { replace: true }); 
      })
      .catch((error) => {
        console.error("Error", error.message, error);
      });
  };
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login", { replace: true }); 
      }
    });
 
    return () => unsubscribe(); 
  }, [navigate]);
 
  return (
<div className="home-container">
      
<div className="sidebar">
<h2>INICIO</h2>
<button onClick={() => navigate("/listaantibiotico")}>
          CÁLCULO DE DOSIFICACIÓN
</button>
<button onClick={() => navigate("/buscadorhistorial")}>
          HISTORIAL DEL PACIENTE
</button>
<button onClick={() => navigate("/registerpaciente")}>
          REGISTRO DE PACIENTE NUEVO
</button>
<button onClick={() => navigate("/registerdoctor")}>
          REGISTRO DE DOCTORES
</button>
</div>
 
      
<div className="main-content">
<h2>BIENVENIDO</h2>
<p>DR. {user?.displayName || user?.email}</p>
<button onClick={handleLogout}>Cerrar sesión</button>
</div>
</div>
  );
}