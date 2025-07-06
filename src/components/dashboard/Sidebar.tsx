import { Home, User, Calendar, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-lg p-4 hidden md:block">
      <h2 className="text-2xl font-bold text-primary mb-6">Medarkia</h2>
      <nav className="space-y-3">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary">
          <Home size={20} /> Inicio
        </Link>
        <Link to="/usuarios" className="flex items-center gap-2 text-gray-700 hover:text-primary">
          <User size={20} /> Usuarios
        </Link>
        <Link to="/citas" className="flex items-center gap-2 text-gray-700 hover:text-primary">
          <Calendar size={20} /> Citas
        </Link>
        <Link to="/historial" className="flex items-center gap-2 text-gray-700 hover:text-primary">
          <ClipboardList size={20} /> Historial
        </Link>
      </nav>
    </aside>
  );
}
