export interface Cliente {
  idCliente?: number;
  nombre: string;
  email?: string;
  telefono: string;
  fechaNacimiento?: string;
  genero?: 'masculino' | 'femenino' | 'otro';
  direccion?: string;
  notas?: string;
  fechaRegistro?: string;
  fechaActualizacion?: string;
}
