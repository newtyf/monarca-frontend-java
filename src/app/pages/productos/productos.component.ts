import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: Producto[] = [];
  productoForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      marca: ['', Validators.maxLength(50)],
      categoria: ['', Validators.maxLength(50)],
      stock: ['', [Validators.required, Validators.min(0)]],
      stock_minimo: [10, Validators.min(0)],
      precio: ['', [Validators.required, Validators.min(0)]],
      proveedor: ['', Validators.maxLength(100)],
      estado: ['disponible']
    });
  }

  ngOnInit() {
    this.loadProductos();
  }

  loadProductos() {
    this.productoService.getAll().subscribe({
      next: (data) => this.productos = data,
      error: (error) => console.error('Error al cargar productos:', error)
    });
  }

  onSubmit() {
    if (this.productoForm.valid) {
      const producto: Producto = this.productoForm.value;
      
      if (this.isEditing && this.editingId) {
        this.productoService.update(this.editingId, producto).subscribe({
          next: () => {
            this.loadProductos();
            this.resetForm();
          },
          error: (error) => console.error('Error al actualizar:', error)
        });
      } else {
        this.productoService.create(producto).subscribe({
          next: () => {
            this.loadProductos();
            this.resetForm();
          },
          error: (error) => console.error('Error al crear:', error)
        });
      }
    }
  }

  editProducto(producto: Producto) {
    this.isEditing = true;
    this.editingId = producto.id_producto!;
    this.productoForm.patchValue(producto);
  }

  deleteProducto(id: number) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productoService.delete(id).subscribe({
        next: () => this.loadProductos(),
        error: (error) => console.error('Error al eliminar:', error)
      });
    }
  }

  resetForm() {
    this.productoForm.reset({ estado: 'disponible', stock_minimo: 10 });
    this.isEditing = false;
    this.editingId = null;
  }
}
