export interface Producto {
  id_producto?: number;
  nombre: string;
  descripcion?: string;
  marca?: string;
  categoria?: string;
  stock: number;
  stock_minimo?: number;
  precio: number;
  proveedor?: string;
  estado?: 'disponible' | 'agotado' | 'descontinuado';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}
