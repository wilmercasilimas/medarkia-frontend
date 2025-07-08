import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { rutaDashboardPorRol } from "@/router/rolRedirect";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(4, "Contraseña mínima de 4 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data
      );

      login(res.data); // token + usuario

      setTimeout(() => {
        setLoading(false);
        navigate(rutaDashboardPorRol(res.data.usuario.rol));
      }, 2000);
    } catch {
      setError("Credenciales inválidas o error de conexión.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-green-50 dark:from-zinc-900 dark:to-zinc-800 transition-colors px-4">
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16 2xl:p-20">
        <h1 className="text-3xl font-bold text-center text-green-700 dark:text-green-400 mb-6">
          Medarkia
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo electrónico
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
              loading
                ? "bg-green-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  ></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
