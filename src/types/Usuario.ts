export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono: string;
  rol: "admin" | "doctor" | "asistente" | "paciente";
  avatar?: {
    url?: string;
    public_id?: string;
  };
}
