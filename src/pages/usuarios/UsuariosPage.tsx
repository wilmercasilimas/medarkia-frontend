import { useEffect, useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { primaryButton } from "@/styles/buttons";
import { getAvatarUrl } from "@/utils/getAvatarUrl";
import { UserCircle, Pencil, Trash } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { CrearUsuarioModal } from "@/components/usuarios/CrearUsuarioModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormularioUsuarioModal } from "@/components/usuarios/FormularioUsuarioModal";
import { UsuarioCard } from "@/components/usuarios/UsuarioCard"; // ✅ nuevo
import { asegurarId } from "@/utils/asegurarId";
import type { Usuario } from "@/types/Usuario";
import { FiltroUsuarios } from "@/components/usuarios/FiltroUsuarios";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(
    null
  );
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(
    null
  );
  const [errorEliminar, setErrorEliminar] = useState("");
  const { user, token } = useAuthStore();
  const [filtros, setFiltros] = useState<{
    rol?: string;
    cedula?: string;
    texto?: string;
  }>({});

  const obtenerUsuarios = useCallback(() => {
    if (!token) return;
    axios
      .get(`${import.meta.env.VITE_API_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
        params: filtros,
      })

      .then((res) => {
        const usuariosConId = res.data.map(asegurarId);
        setUsuarios(usuariosConId);
      })
      .catch((err) => console.error("Error al obtener usuarios", err));
  }, [token, filtros]);

  const eliminarUsuario = async () => {
    if (!usuarioAEliminar || !usuarioAEliminar.id || !token) {
      console.error("No se puede eliminar: ID inválido o token faltante.");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/usuarios/${usuarioAEliminar.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      obtenerUsuarios();
    } catch (error) {
      const axiosErr = error as AxiosError<{ message?: string }>;
      setErrorEliminar(
        axiosErr.response?.data?.message || "Error al eliminar usuario."
      );
    } finally {
      setUsuarioAEliminar(null);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, [obtenerUsuarios, filtros]);

  if (!user) {
    return (
      <div className="text-center text-gray-500 mt-10">Cargando usuario...</div>
    );
  }

  if (user.rol !== "admin") {
    return (
      <div className="text-center text-red-500 mt-10 font-semibold">
        No tienes permiso para acceder a esta sección.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
          Gestión de Usuarios
        </h2>
        <button
          className={`${primaryButton} flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2`}
          onClick={() => {
            setMostrarModal(true);
            setErrorEliminar("");
          }}
        >
          <span className="sm:hidden">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </span>
          <span className="hidden sm:inline">+ Crear usuario</span>
        </button>
      </div>

      <FiltroUsuarios onFiltrar={setFiltros} />

      {errorEliminar && (
        <p className="text-red-500 text-sm font-medium -mt-4 mb-2">
          {errorEliminar}
        </p>
      )}

      {/* Tabla para escritorio */}
      <div className="hidden sm:block overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white dark:bg-zinc-900 text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-zinc-700">
              <th className="p-3">Avatar</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-5 text-center text-gray-500 dark:text-gray-400"
                >
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr
                  key={`${usuario.id}-${usuario.email}`}
                  className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                >
                  <td className="p-3">
                    {usuario.avatar?.public_id ? (
                      <img
                        src={getAvatarUrl(usuario.avatar.public_id)}
                        alt={`Avatar de ${usuario.nombre}`}
                        className="w-8 h-8 rounded-full object-cover border border-green-500"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 text-zinc-400" />
                    )}
                  </td>
                  <td className="p-3 text-wrap">
                    {usuario.apellido} {usuario.nombre}
                  </td>
                  <td className="p-3">{usuario.email}</td>
                  <td className="p-3 capitalize">{usuario.rol}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setUsuarioEnEdicion(usuario);
                        setErrorEliminar("");
                      }}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (!usuario.id) {
                          console.error(
                            "Este usuario no tiene un id válido:",
                            usuario
                          );
                          return;
                        }
                        setUsuarioAEliminar(usuario);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas para móviles */}
      <div className="sm:hidden space-y-4">
        {usuarios.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No hay usuarios registrados.
          </p>
        ) : (
          usuarios.map((usuario) => (
            <UsuarioCard
              key={usuario.id}
              usuario={usuario}
              onEditar={setUsuarioEnEdicion}
              onEliminar={setUsuarioAEliminar}
            />
          ))
        )}
      </div>

      <CrearUsuarioModal
        abierto={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onUsuarioCreado={obtenerUsuarios}
      />

      {usuarioEnEdicion && (
        <FormularioUsuarioModal
          abierto={!!usuarioEnEdicion}
          onClose={() => setUsuarioEnEdicion(null)}
          onSuccess={() => {
            setUsuarioEnEdicion(null);
            setTimeout(() => {
              obtenerUsuarios();
            }, 300);
          }}
          usuario={usuarioEnEdicion}
        />
      )}

      <ConfirmDialog
        abierto={!!usuarioAEliminar}
        onClose={() => {
          setUsuarioAEliminar(null);
          setErrorEliminar("");
        }}
        onConfirm={eliminarUsuario}
        titulo="Eliminar usuario"
        mensaje={`¿Deseas eliminar a ${usuarioAEliminar?.nombre} ${usuarioAEliminar?.apellido}? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
      />
    </div>
  );
}
