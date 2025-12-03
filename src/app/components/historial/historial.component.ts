import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

interface Producto {
  nombre: string;
  cantidad: number;
  precio: number;
  imagen?: string;       // ✅ Nueva propiedad opcional
  categoria?: string;    // ✅ (opcional, si también la usas)
}

interface Cotizacion {
  _id: string;
  fecha: Date;
    cantidad: number;
  productos: Producto[];
  estado: string;
  userId: string;
  imagen?: string;     // ✅ nuevo
  categoria?: string;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {

  cotizaciones: Cotizacion[] = [];
  userId: string | null = null;
  loading = false;
  error: string | null = null;

  mostrarModal = false;
  cotizacionSeleccionada: Cotizacion | null = null;

  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarComponente();

    setInterval(() => {
    this.cargarHistorial();
  }, 10000);
  }

  private inicializarComponente(): void {
    const userId = localStorage.getItem('usuario_id');

    if (userId) {
      this.userId = userId;
      this.cargarHistorial();
    } else {
      this.error = 'Debes iniciar sesión para ver tu historial de cotizaciones.';
    }
  }

cargarHistorial(): void {
  if (!this.userId) return;

  this.loading = true;
  this.error = null;

  this.http.get<Cotizacion[]>(`${this.API_URL}/cotizaciones/usuario/${this.userId}`)
    .pipe(
      catchError(err => {
        console.error('Error al cargar historial:', err);
        this.error = 'No se pudo cargar el historial. Por favor, intenta nuevamente.';
        return of([]);
      }),
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe((response: any) => {
      this.cotizaciones = response?.data || [];

      // 🔵 Recalcular paginación
      this.totalPaginas = Math.ceil(this.cotizaciones.length / this.itemsPorPagina);
      this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);

      // Evitar que la página actual supere el máximo
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = this.totalPaginas;
      }
    });
}


  abrirModal(cotizacion: Cotizacion): void {
    this.cotizacionSeleccionada = cotizacion;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  navegarACotizar(): void {
    this.router.navigate(['/cotizar']);
  }

  formatearId(id: number): string {
    return id.toString().padStart(4, '0');
  }

  formatearEstado(estado: string): string {
    if (!estado) return 'Pendiente';

    const estadosMap: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en proceso': 'En Proceso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };

    return estadosMap[estado.toLowerCase()] || estado;
  }

  getEstadoClass(estado: string): string {
    if (!estado) return 'estado-pendiente';
    const estadoLower = estado.toLowerCase().replace(/\s+/g, '-');
    return `estado-${estadoLower}`;
  }

  getCotizacionesPorEstado(estado: string): number {
    return this.cotizaciones.filter(c => 
      c.estado?.trim().toLowerCase() === estado.toLowerCase()
    ).length;
  }

  reintentar(): void {
    this.cargarHistorial();
  }
  // Tamaño de página
itemsPorPagina = 10;

// Paginación
paginaActual = 1;
totalPaginas = 1;
paginas: number[] = [];

// Datos paginados
get cotizacionesPaginadas() {
  const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
  return this.cotizaciones.slice(inicio, inicio + this.itemsPorPagina);
}

cambiarPagina(p: number) {
  this.paginaActual = p;
}

eliminar(id: string) {
  if (!id) return;

  if (!confirm("¿Seguro que deseas eliminar esta cotización?")) return;

  this.http.delete(`${this.API_URL}/cotizaciones/${id}`)
    .subscribe({
      next: () => {
        alert("Eliminado correctamente");
        this.cargarHistorial();
      },
      error: () => alert("No se pudo eliminar")
    });
}


}
