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
  sugerencias: Product[] = [];
  mostrarSugerencias: boolean = false;
  indiceSeleccionado: number = -1;
  clienteLogueado: any = null;

  isScrolled = false;
  categoriasAbiertas = false;
  mobilePanelOpen = false;
  mobileTab: 'menu' | 'categorias' = 'menu';

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
    { name: 'Maquinaria Pesada' },
    { name: 'Metalmecánica' },
    { name: 'Minería' },
    { name: 'Motores' },
    { name: 'Novedades' },
    { name: 'Ofertas y Liquidaciones' },
    { name: 'Proceso de Alimentos' },
    { name: 'Soldadura y Corte' },
    { name: 'Taller Automotriz' }
  ];

  // 🔥 Toggle del panel móvil
  toggleMobilePanel(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.mobilePanelOpen = !this.mobilePanelOpen;
    console.log('🔥 Mobile panel:', this.mobilePanelOpen);
  }

  setMobileTab(tab: 'menu' | 'categorias') {
    this.mobileTab = tab;
  }

  toggleCategorias(event: Event) {
    event.preventDefault();
    this.categoriasAbiertas = !this.categoriasAbiertas;
  }

  cerrarCategorias() {
    this.categoriasAbiertas = false;
    this.cerrarMenu();
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

  onInputChange(): void {
    const query = this.terminoBusqueda.trim().toLowerCase();

    if (query.length === 0) {
      this.sugerencias = [];
      this.mostrarSugerencias = false;
      this.indiceSeleccionado = -1;
      return;
    }

    this.sugerencias = this.productos.filter(p => {
      const nombre = (p.name || '').toLowerCase();
      const descripcion = (p.description || '').toLowerCase();
      const categoria = (p.category || '').toLowerCase();
      const tags = (p.tagsText || '').toLowerCase();
      const features = (p.featuresText || '').toLowerCase();
      const estado = (p.estado || '').toLowerCase();
      const codigo = (p.codigo || '').toString().toLowerCase();

      return nombre.includes(query) ||
             descripcion.includes(query) ||
             categoria.includes(query) ||
             tags.includes(query) ||
             features.includes(query) ||
             estado.includes(query) ||
             codigo.includes(query);
    }).slice(0, 8);

    this.mostrarSugerencias = this.sugerencias.length > 0;
    this.indiceSeleccionado = -1;

    console.log('🔍 Sugerencias:', this.sugerencias.length);
  }

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

  buscarProducto(): void {
    if (this.sugerencias.length > 0) {
      const productoSeleccionado = this.indiceSeleccionado >= 0 
        ? this.sugerencias[this.indiceSeleccionado] 
        : this.sugerencias[0];
      
      this.seleccionarSugerencia(productoSeleccionado);
    } else if (this.terminoBusqueda.trim()) {
      alert(`❌ No se encontraron productos con "${this.terminoBusqueda}"`);
    }
  }

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

  @HostListener('window:resize', [])
  onResize() {
    if (window.innerWidth > 991) {
      this.mobilePanelOpen = false;
    }
  }

  // 🔥 MANEJO DE CLICKS - SEPARADO POR FUNCIONALIDAD
  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // 1️⃣ Cerrar sugerencias de búsqueda
    if (!target.closest('.search-container-top') && !target.closest('.mobile-search')) {
      this.mostrarSugerencias = false;
      this.indiceSeleccionado = -1;
    }

    // 2️⃣ Cerrar categorías desktop
    if (!target.closest('.categorias-item')) {
      this.categoriasAbiertas = false;
    }

    // 3️⃣ Cerrar mobile panel (SOLO si está abierto y click fuera)
    if (this.mobilePanelOpen) {
      const clickEnPanel = target.closest('.mobile-panel');
      const clickEnToggler = target.closest('.mobile-toggler');
      
      if (!clickEnPanel && !clickEnToggler) {
        this.mobilePanelOpen = false;
        console.log('🔥 Panel cerrado por click fuera');
      }
    }
  }
}