export interface Servicio {
  id_servicio?: number;
  id_categoria?: number;
  nombre: string;
  descripcion?: string;
  duracion_min: number;
  precio: number;
  estado?: 'activo' | 'inactivo';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}
