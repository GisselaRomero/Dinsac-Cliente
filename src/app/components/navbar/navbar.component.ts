import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { ProductService, Product } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterModule, FormsModule, CommonModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  cantidadProductos: number = 0;
  private carritoSubscription: Subscription = new Subscription();
  terminoBusqueda: string = '';
  productos: Product[] = [];
  sugerencias: Product[] = []; // 🔥 Sugerencias en tiempo real
  mostrarSugerencias: boolean = false; // 🔥 Mostrar/ocultar dropdown
  indiceSeleccionado: number = -1; // 🔥 Para navegar con flechas

  constructor(
    private carritoService: CarritoService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cantidadProductos = this.carritoService.obtenerTotalItems();
    this.carritoSubscription = this.carritoService.getCarritoObservable().subscribe(() => {
      this.cantidadProductos = this.carritoService.obtenerTotalItems();
    });

    // ✅ Cargar TODOS los productos al iniciar
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('✅ Productos cargados:', this.productos.length);
      },
      error: (err) => console.error('❌ Error cargando productos:', err)
    });
  }

  ngOnDestroy(): void {
    this.carritoSubscription.unsubscribe();
  }

  // 🔥 SE EJECUTA CADA VEZ QUE ESCRIBES EN EL INPUT
  onInputChange(): void {
    const query = this.terminoBusqueda.trim().toLowerCase();

    if (query.length === 0) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;
      this.indiceSeleccionado = -1;
      return;
    }

    // 🔍 Filtrar productos en tiempo real
    this.sugerencias = this.productos.filter(p => {
      const nombre = (p.name || '').toLowerCase();
      const descripcion = (p.description || '').toLowerCase();
      const categoria = (p.category || '').toLowerCase();
      const tags = (p.tagsText || '').toLowerCase();
      const features = (p.featuresText || '').toLowerCase();
      const estado = (p.estado || '').toLowerCase();

      return nombre.includes(query) ||
             descripcion.includes(query) ||
             categoria.includes(query) ||
             tags.includes(query) ||
             features.includes(query) ||
             estado.includes(query);
    }).slice(0, 8); // 🔥 Máximo 8 sugerencias

    this.mostrarSugerencias = this.sugerencias.length > 0;
    this.indiceSeleccionado = -1;

    console.log('🔍 Sugerencias:', this.sugerencias.length);
  }

  // 🔥 AL HACER CLIC EN UNA SUGERENCIA
  seleccionarSugerencia(producto: Product): void {
    const id = producto.id ?? producto._id;
    if (id) {
      console.log('➡️ Navegando a:', producto.name);
      this.router.navigate(['/producto-detalle', id]);
      this.terminoBusqueda = '';
      this.sugerencias = [];
      this.mostrarSugerencias = false;
    }
  }

  // 🔥 AL PRESIONAR ENTER EN EL INPUT
  buscarProducto(): void {
    if (this.sugerencias.length > 0) {
      // Si hay sugerencias, seleccionar la primera o la seleccionada con flechas
      const productoSeleccionado = this.indiceSeleccionado >= 0 
        ? this.sugerencias[this.indiceSeleccionado] 
        : this.sugerencias[0];
      
      this.seleccionarSugerencia(productoSeleccionado);
    } else if (this.terminoBusqueda.trim()) {
      alert(`❌ No se encontraron productos con "${this.terminoBusqueda}"`);
    }
  }

  // 🔥 NAVEGAR CON FLECHAS ↑↓ Y ENTER
  onKeyDown(event: KeyboardEvent): void {
    if (!this.mostrarSugerencias || this.sugerencias.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.indiceSeleccionado = Math.min(
          this.indiceSeleccionado + 1, 
          this.sugerencias.length - 1
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.indiceSeleccionado = Math.max(this.indiceSeleccionado - 1, -1);
        break;

      case 'Escape':
        this.mostrarSugerencias = false;
        this.indiceSeleccionado = -1;
        break;
    }
  }

  // 🔥 CERRAR SUGERENCIAS AL HACER CLIC FUERA
  @HostListener('document:click', ['$event'])
  cerrarSugerencias(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.mostrarSugerencias = false;
      this.indiceSeleccionado = -1;
    }
  }
  cerrarMenu() {
  const navbar = document.getElementById('navbarMain');
  if (navbar?.classList.contains('show')) {
    navbar.classList.remove('show');
  }
}

}