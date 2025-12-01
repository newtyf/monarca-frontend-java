import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';
import { CitaConCliente } from '../../models/cita-con-cliente.model';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css'],
})
export class CitasComponent implements OnInit {
  citas: CitaConCliente[] = [];
  citaForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;
  selectedCliente: Cliente | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private citaService: CitaService) {
    this.citaForm = this.fb.group({
      idCliente: ['', Validators.required],
      idServicio: ['', Validators.required],
      fechaHora: ['', Validators.required],
      duracionEstimada: [''],
      estado: ['pendiente'],
      notas: [''],
    });
  }

  ngOnInit() {
    this.loadCitas();
  }

  loadCitas() {
    this.citaService.getCitasConClientes().subscribe({
      next: (data) => (this.citas = data),
      error: (error) => console.error('Error al cargar citas:', error),
    });
  }

  showClienteModal(cliente: Cliente) {
    this.selectedCliente = cliente;
  }

  closeModal() {
    this.selectedCliente = null;
  }

  onSubmit() {
    if (this.citaForm.valid) {
      this.errorMessage = null; // Limpiar errores previos
      const cita: Cita = this.citaForm.value;

      if (this.isEditing && this.editingId) {
        this.citaService.update(this.editingId, cita).subscribe({
          next: () => {
            this.loadCitas();
            this.resetForm();
          },
          error: (error) => this.handleError(error),
        });
      } else {
        this.citaService.create(cita).subscribe({
          next: () => {
            this.loadCitas();
            this.resetForm();
          },
          error: (error) => this.handleError(error),
        });
      }
    }
  }

  handleError(error: any) {
    if (error.error && error.error.error) {
      this.errorMessage = error.error.error;
    } else if (error.message) {
      this.errorMessage = error.message;
    } else {
      this.errorMessage = 'Error al procesar la solicitud';
    }
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  closeAlert() {
    this.errorMessage = null;
  }

  editCita(cita: CitaConCliente) {
    this.isEditing = true;
    this.editingId = cita.idCita!;

    // Extraer idCliente del objeto cliente anidado
    const idCliente = cita.cliente?.idCliente || cita.idCliente;

    // Formatear fechaHora para el input datetime-local (YYYY-MM-DDTHH:mm)
    let fechaHoraFormatted = cita.fechaHora;
    if (fechaHoraFormatted && fechaHoraFormatted.length > 16) {
      fechaHoraFormatted = fechaHoraFormatted.substring(0, 16);
    }

    this.citaForm.patchValue({
      idCliente: idCliente,
      idServicio: cita.idServicio,
      fechaHora: fechaHoraFormatted,
      duracionEstimada: cita.duracionEstimada,
      estado: cita.estado,
      notas: cita.notas,
    });
  }

  deleteCita(id: number) {
    if (confirm('¿Está seguro de eliminar esta cita?')) {
      this.citaService.delete(id).subscribe({
        next: () => this.loadCitas(),
        error: (error) => console.error('Error al eliminar:', error),
      });
    }
  }

  resetForm() {
    this.citaForm.reset({ estado: 'pendiente' });
    this.isEditing = false;
    this.editingId = null;
  }
}
