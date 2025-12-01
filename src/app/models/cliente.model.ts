export interface Cliente {
  id_cliente?: number;
  nombre: string;
  email?: string;
  telefono: string;
  fecha_nacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  direccion?: string;
  notas?: string;
  fecha_registro?: string;
  fecha_actualizacion?: string;
}
