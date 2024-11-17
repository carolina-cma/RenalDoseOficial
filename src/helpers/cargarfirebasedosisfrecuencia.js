// Importar las funciones necesarias de Firebase
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCoBQ3Rt0iZjUAq8bL5IK23BbbCTc4lhoU",
  authDomain: "renaldose-e9001.firebaseapp.com",
  projectId: "renaldose-e9001",
  storageBucket: "renaldose-e9001.appspot.com",
  messagingSenderId: "328761658802",
  appId: "1:328761658802:web:3d36cecae003f780c828ab",
  measurementId: "G-QSK1RR9PGQ",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Todos los antibióticos a añadir
const nuevosAntibioticos = [
  {
    compuestoPrincipal: "Paracetamol",
    tableta: {
      necesitaPeso: false,
      mayor50: ["500mg", "1000mg"],
      frecuenciaMayor50: ["6horas", "8horas"],
      de30a50: ["500mg"],
      frecuencia30a50: ["6horas"],
      de10a30: ["500mg"],
      frecuencia10a30: ["6horas"],
      menor10: ["500mg"],
      frecuenciaMenor10: ["8horas"]
    }
  },
  {
    compuestoPrincipal: "Tramadol",
    tableta: {
      necesitaPeso: false,
      mayor50: ["50mg", "100mg"],
      frecuenciaMayor50: ["8horas"],
      de30a50: ["50mg", "100mg"],
      frecuencia30a50: ["12horas"],
      de10a30: ["50mg", "100mg"],
      frecuencia10a30: ["12horas"],
      menor10: ["evitar"],
      frecuenciaMenor10: ["evitar"]
    }
  }
];

// Función para cargar antibióticos
async function agregarNuevosAntibioticos() {
  try {
    for (const antibacteriano of nuevosAntibioticos) {
      const docRef = doc(collection(firestore, "dosisFrecuencia"));
      await setDoc(docRef, antibacteriano);
      console.log(`Datos de ${antibacteriano.compuestoPrincipal} agregados correctamente.`);
    }
  } catch (error) {
    console.error("Error al agregar nuevos datos a Firestore:", error);
  }
}

// Ejecutar la función
agregarNuevosAntibioticos();
