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
  imagen?: string;
  categoria?: string;
}

interface Cotizacion {
  _id: string;
  fecha: Date;
  cantidad: number;
  productos: Producto[];
  estado: string;
  userId: string;
  imagen?: string;
  categoria?: string;
  pdfBase64?: string;  // ✅ NUEVO: Para almacenar el PDF
  numeroCotizacion?: string; // ✅ NUEVO: Número de cotización
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
  cliente: any = null;

  private readonly API_URL = 'https://backend-dinsac-hlf0.onrender.com';

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

    const clienteStorage = localStorage.getItem('cliente');

    if (!clienteStorage) {
      this.router.navigate(['/login']);
      return;
    }

    this.cliente = JSON.parse(clienteStorage);
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
      'vendida': 'Vendida',
      'cancelada': 'Cancelada',
      'atendida': 'Atendida',
      'completada': 'Completada'
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

  cerrarSesion(): void {
    localStorage.removeItem('usuario_logueado');
    localStorage.removeItem('usuario_email');
    localStorage.removeItem('usuario_id');
    localStorage.removeItem('cliente');

    alert('👋 Sesión cerrada');
    this.router.navigate(['/login']);
  }

  // ✅✅✅ NUEVAS FUNCIONES PARA MANEJAR PDFs ✅✅✅

  /**
   * Verifica si la cotización tiene PDF disponible
   */
  tienePDF(cotizacion: Cotizacion): boolean {
    return !!(cotizacion.pdfBase64 && cotizacion.pdfBase64.length > 0);
  }

  /**
   * Abre el PDF en una nueva ventana del navegador
   */
  verPDF(cotizacion: Cotizacion): void {
    console.log('📄 Intentando abrir PDF de cotización:', cotizacion._id);

    if (!this.tienePDF(cotizacion)) {
      alert('⚠️ Esta cotización no tiene PDF disponible');
      console.error('❌ No hay pdfBase64 en la cotización');
      return;
    }

    try {
      const pdfWindow = window.open('', '_blank');
      
      if (pdfWindow) {
        pdfWindow.document.write(
          `<iframe width='100%' height='100%' src='data:application/pdf;base64,${cotizacion.pdfBase64}'></iframe>`
        );
        console.log('✅ PDF abierto en nueva ventana');
      } else {
        alert('⚠️ No se pudo abrir la ventana. Verifica que no esté bloqueada por el navegador.');
        console.error('❌ window.open() fue bloqueado');
      }
    } catch (error) {
      console.error('❌ Error al abrir PDF:', error);
      alert('❌ Error al mostrar el PDF. Intenta descargarlo.');
    }
  }

  /**
   * Descarga el PDF como archivo
   */
  descargarPDF(cotizacion: Cotizacion): void {
    console.log('⬇️ Iniciando descarga de PDF:', cotizacion._id);

    if (!this.tienePDF(cotizacion)) {
      alert('⚠️ Esta cotización no tiene PDF disponible');
      console.error('❌ No hay pdfBase64 en la cotización');
      return;
    }

    try {
      // Convertir base64 a blob
      const byteCharacters = atob(cotizacion.pdfBase64!);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // Nombre del archivo
      const nombreArchivo = cotizacion.numeroCotizacion 
        ? `${cotizacion.numeroCotizacion}.pdf`
        : `Cotizacion_${cotizacion._id}.pdf`;
      
      link.download = nombreArchivo;
      
      // Ejecutar descarga
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('✅ PDF descargado:', nombreArchivo);
      
      // Liberar memoria
      URL.revokeObjectURL(link.href);
      
    } catch (error) {
      console.error('❌ Error al descargar PDF:', error);
      alert('❌ Error al descargar el PDF. Por favor, intenta nuevamente.');
    }
  }

  /**
   * Obtiene el ícono apropiado según si hay PDF o no
   */
  getIconoPDF(cotizacion: Cotizacion): string {
    return this.tienePDF(cotizacion) ? '📄' : '❌';
  }

  /**
   * Obtiene el tooltip apropiado para el botón de PDF
   */
  getTooltipPDF(cotizacion: Cotizacion): string {
    return this.tienePDF(cotizacion) 
      ? 'Ver PDF de la cotización' 
      : 'PDF no disponible';
  }
}