import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  citas: Cita[] = [];
  citaForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private citaService: CitaService
  ) {
    this.citaForm = this.fb.group({
      id_cliente: ['', Validators.required],
      id_servicio: ['', Validators.required],
      id_user: ['', Validators.required],
      fecha_hora: ['', Validators.required],
      duracion_estimada: [''],
      estado: ['pendiente'],
      notas: ['']
    });
  }

  ngOnInit() {
    this.loadCitas();
  }

  loadCitas() {
    this.citaService.getAll().subscribe({
      next: (data) => this.citas = data,
      error: (error) => console.error('Error al cargar citas:', error)
    });
  }

  onSubmit() {
    if (this.citaForm.valid) {
      const cita: Cita = this.citaForm.value;
      
      if (this.isEditing && this.editingId) {
        this.citaService.update(this.editingId, cita).subscribe({
          next: () => {
            this.loadCitas();
            this.resetForm();
          },
          error: (error) => console.error('Error al actualizar:', error)
        });
      } else {
        this.citaService.create(cita).subscribe({
          next: () => {
            this.loadCitas();
            this.resetForm();
          },
          error: (error) => console.error('Error al crear:', error)
        });
      }
    }
  }

  editCita(cita: Cita) {
    this.isEditing = true;
    this.editingId = cita.id_cita!;
    this.citaForm.patchValue(cita);
  }

  deleteCita(id: number) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.citaService.delete(id).subscribe({
        next: () => this.loadCitas(),
        error: (error) => console.error('Error al eliminar:', error)
      });
    }
  }

  resetForm() {
    this.citaForm.reset({ estado: 'pendiente' });
    this.isEditing = false;
    this.editingId = null;
  }
}
