export interface Producto {
  idProducto?: number;
  nombre: string;
  descripcion?: string;
  marca?: string;
  categoria?: string;
  stock: number;
  stockMinimo?: number;
  precio: number;
  proveedor?: string;
  estado?: 'disponible' | 'agotado' | 'descontinuado';
  fechaCreacion?: string;
  fechaActualizacion?: string;
}
