// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import App from "@/pages/App";

// Módulos (páginas principales por rol o sección)
import UsuariosPage from "@/pages/usuarios/UsuariosPage";
import DoctoresPage from "@/pages/doctores/DoctoresPage";
import PacientesPage from "@/pages/pacientes/PacientesPage";
import CitasPage from "@/pages/citas/CitasPage";
import HistorialPage from "@/pages/historiales/HistorialesPage";
import RecetasPage from "@/pages/recetas/RecetasPage";
import ArchivosPage from "@/pages/archivos/ArchivosPage";
import BloqueosPage from "@/pages/bloqueos/BloqueosPage";
import AuditoriaPage from "@/pages/auditoria/AuditoriaPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "usuarios", element: <UsuariosPage /> },
      { path: "doctores", element: <DoctoresPage /> },
      { path: "pacientes", element: <PacientesPage /> },
      { path: "citas", element: <CitasPage /> },
      { path: "historial", element: <HistorialPage /> },
      { path: "recetas", element: <RecetasPage /> },
      { path: "archivos", element: <ArchivosPage /> },
      { path: "bloqueos", element: <BloqueosPage /> },
      { path: "auditoria", element: <AuditoriaPage /> },
    ],
  },
]);
