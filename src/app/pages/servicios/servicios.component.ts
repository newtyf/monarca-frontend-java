import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../services/servicio.service';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  servicioForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService
  ) {
    this.servicioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      duracionMin: ['', [Validators.required, Validators.min(1)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      estado: ['activo']
    });
  }

  ngOnInit() {
    this.loadServicios();
  }

  loadServicios() {
    this.servicioService.getAll().subscribe({
      next: (data) => this.servicios = data,
      error: (error) => console.error('Error al cargar servicios:', error)
    });
  }

  onSubmit() {
    if (this.servicioForm.valid) {
      const servicio: Servicio = this.servicioForm.value;
      
      if (this.isEditing && this.editingId) {
        this.servicioService.update(this.editingId, servicio).subscribe({
          next: () => {
            this.loadServicios();
            this.resetForm();
          },
          error: (error) => console.error('Error al actualizar:', error)
        });
      } else {
        this.servicioService.create(servicio).subscribe({
          next: () => {
            this.loadServicios();
            this.resetForm();
          },
          error: (error) => console.error('Error al crear:', error)
        });
      }
    }
  }

  editServicio(servicio: Servicio) {
    this.isEditing = true;
    this.editingId = servicio.idServicio!;
    this.servicioForm.patchValue(servicio);
  }

  deleteServicio(id: number) {
    if (confirm('¿Está seguro de eliminar este servicio?')) {
      this.servicioService.delete(id).subscribe({
        next: () => this.loadServicios(),
        error: (error) => console.error('Error al eliminar:', error)
      });
    }
  }

  resetForm() {
    this.servicioForm.reset({ estado: 'activo' });
    this.isEditing = false;
    this.editingId = null;
  }
}
