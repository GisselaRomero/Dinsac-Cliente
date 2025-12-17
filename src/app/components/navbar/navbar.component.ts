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
clienteLogueado: any = null;

isScrolled = false;
categoriasAbiertas = false;

// reutilizamos tus categorías
categorias = [
  { name: 'Agroindustria' },
  { name: 'Bombeo de Fluidos' },
  { name: 'Carpintería' },
  { name: 'Compresoras' },
  { name: 'Construcción' },
  { name: 'Electrobombas' },
  { name: 'Generadores' },
  { name: 'Grupos Electrógenos' },
  { name: 'Herramientas Eléctricas' },
  { name: 'Jardinería' },
  { name: 'Limpieza Industrial' },
  { name: 'Metalmecánica' },
  { name: 'Minería' },
  { name: 'Motores' },
  { name: 'Ofertas y Liquidaciones' },
  { name: 'Proceso de Alimentos' },
  { name: 'Soldadura y Corte' },
  { name: 'Taller Automotriz' }
];


toggleCategorias(event: Event) {
  event.preventDefault(); // ❌ no navega
  this.categoriasAbiertas = !this.categoriasAbiertas;
}

cerrarCategorias() {
  this.categoriasAbiertas = false;
  this.cerrarMenu(); // cierra menú mobile si está abierto
}


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 120;


    
  }
  constructor(
    private carritoService: CarritoService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cantidadProductos = this.carritoService.obtenerTotalItems();
    this.carritoSubscription = this.carritoService.getCarritoObservable().subscribe(() => {
      this.cantidadProductos = this.carritoService.obtenerTotalItems();

       const cliente = localStorage.getItem('cliente');
  if (cliente) {
    this.clienteLogueado = JSON.parse(cliente);
  }

   this.productService.getProducts().subscribe({
    next: (data) => {
      this.productos = data;
      console.log('✅ Productos cargados:', this.productos.length);
    },
    error: (err) => console.error('❌ Error cargando productos:', err)
  });
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
  
logout() {
  localStorage.removeItem('cliente');
  this.clienteLogueado = null;
  this.router.navigate(['/login']);
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
    const codigo = (p.codigo || '').toString().toLowerCase(); // 🔥 NUEVO


      return nombre.includes(query) ||
             descripcion.includes(query) ||
             categoria.includes(query) ||
             tags.includes(query) ||
             features.includes(query) ||
             estado.includes(query)||
       codigo.includes(query); // ✔️ Ahora sí

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



cerrarMenuBusqueda() {
  const navbar = document.getElementById('navbarMain');
  if (navbar?.classList.contains('show')) {
    navbar.classList.remove('show');
  }
}

@HostListener('document:click', ['$event'])
cerrarCategoriasClickFuera(event: Event) {
  const target = event.target as HTMLElement;

  if (!target.closest('.categorias-item')) {
    this.categoriasAbiertas = false;
  }
}


}