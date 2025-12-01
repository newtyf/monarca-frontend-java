export interface Servicio {
  idServicio?: number;
  idCategoria?: number;
  nombre: string;
  descripcion?: string;
  duracionMin: number;
  precio: number;
  estado?: 'activo' | 'inactivo';
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
