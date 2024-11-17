import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import { analytics } from "./helpers/firebase";
import { logEvent } from "firebase/analytics";
import RegisterCuenta from "./pages/registerCuenta";
import RegisterClinico from "./pages/registerClinico";
import RegisterPaciente from "./pages/registerPaciente";
import Historial from "./pages/historialpaciente";
import BuscadorHistorial from "./pages/buscadorHistorial";
import RegistroDoctor from "./pages/registerdoctor";
import RegistroCuentaDoctor from "./pages/registercuentadoctor";
import ListaAntibiotico from "./pages/listaantibioticos";
import RegistrarAntibiotico from "./pages/registrarantibiotico";
import AntibioticoDetalle from "./pages/antibioticodetalle";
import SeleccionarPaciente from "./pages/seleccionarpaciente";
import CalculoDosis from "./pages/calculodosis";
import MensajeDosis from "./pages/mensajefinaldosis";

function App() {
  logEvent(analytics, "App Started...");

  return (
    <Routes>
      <Route index element={<Home />}></Route>
      <Route path="/login" element={<Login />}></Route>
      <Route path="/registerpaciente" element={<RegisterPaciente />}></Route>
      <Route path="/registercuenta" element={<RegisterCuenta />}></Route>
      <Route path="/registerclinico" element={<RegisterClinico />}></Route>
      <Route path="/historial/:carnetIdentidad" element={<Historial />}></Route>
      <Route path="/buscadorhistorial" element={<BuscadorHistorial />}></Route>
      <Route path="/registerdoctor" element={<RegistroDoctor />}></Route>
      <Route path="/registercuentadoctor" element={<RegistroCuentaDoctor />}></Route>
      <Route path="/listaantibiotico" element={<ListaAntibiotico />}></Route>
      <Route path="/registrarantibiotico" element={<RegistrarAntibiotico />}></Route>
      <Route path="/antibiotico/:id" element={<AntibioticoDetalle />}></Route>
      <Route path="/registrarantibiotico" element={<RegistrarAntibiotico />}></Route>
      <Route path="/seleccionarpaciente" element={<SeleccionarPaciente />} />
      <Route path="/calculoDosis" element={<CalculoDosis />} />
      <Route path="/mensajedosis" element={<MensajeDosis />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
