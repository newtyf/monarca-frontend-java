export interface Cita {
  id_cita?: number;
  id_cliente: number;
  id_servicio: number;
  id_user: number;
  fecha_hora: string;
  duracion_estimada?: number;
  estado?: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada' | 'no_asistio';
  notas?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}
