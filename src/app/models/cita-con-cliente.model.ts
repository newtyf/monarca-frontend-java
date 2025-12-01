import { Cliente } from './cliente.model';

export interface CitaConCliente {
  idCita?: number;
  idCliente?: number;
  idServicio: number;
  idUser: number;
  fechaHora: string;
  duracionEstimada?: number;
  estado?: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada' | 'no_asistio';
  notas?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  cliente?: Cliente;
}
