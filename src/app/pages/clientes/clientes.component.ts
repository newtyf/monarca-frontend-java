import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  isEditing = false;
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      fechaNacimiento: [''],
      genero: [''],
      direccion: ['', Validators.maxLength(255)],
      notas: ['']
    });
  }

  ngOnInit() {
    this.loadClientes();
  }

  loadClientes() {
    this.clienteService.getAll().subscribe({
      next: (data) => this.clientes = data,
      error: (error) => console.error('Error al cargar clientes:', error)
    });
  }

  onSubmit() {
    if (this.clienteForm.valid) {
      const cliente: Cliente = this.clienteForm.value;
      
      if (this.isEditing && this.editingId) {
        this.clienteService.update(this.editingId, cliente).subscribe({
          next: () => {
            this.loadClientes();
            this.resetForm();
          },
          error: (error) => console.error('Error al actualizar:', error)
        });
      } else {
        this.clienteService.create(cliente).subscribe({
          next: () => {
            this.loadClientes();
            this.resetForm();
          },
          error: (error) => console.error('Error al crear:', error)
        });
      }
    }
  }

  editCliente(cliente: Cliente) {
    this.isEditing = true;
    this.editingId = cliente.idCliente!;
    this.clienteForm.patchValue(cliente);
  }

  deleteCliente(id: number) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.clienteService.delete(id).subscribe({
        next: () => this.loadClientes(),
        error: (error) => console.error('Error al eliminar:', error)
      });
    }
  }

  resetForm() {
    this.clienteForm.reset();
    this.isEditing = false;
    this.editingId = null;
  }
}
