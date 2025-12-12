import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-productos-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos-todos.component.html',
  styleUrls: ['./productos-todos.component.scss']
})
export class ProductosTodosComponent implements OnInit {

  // --- Productos ---
  productos: Product[] = [];
  filteredProductos: Product[] = [];
  productosPaginados: Product[] = [];

  // --- Favoritos ---
  favoritos: string[] = [];
  userId: string = '';

  // --- Buscador ---
  searchQuery: string = '';

  // --- Loading & errores ---
  loading: boolean = false;
  error: string | null = null;

  // --- Paginación: 5 columnas × 6 filas = 30 productos ---
  paginaActual: number = 1;
  productosPorPagina: number = 30;
  totalPaginas: number = 0;
  paginas: number[] = [];

  constructor(
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('usuario_id') || '';
    this.cargarProductos();
    this.cargarFavoritos();
  }

  // ============================================================
  // 🔵 Cargar productos
  // ============================================================
  cargarProductos(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: products => {
        this.productos = products;
        this.filteredProductos = products;
        this.calcularPaginacion();
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos.';
        this.loading = false;
      }
    });
  }

  // ============================================================
  // 🔍 Filtrar por buscador
  // ============================================================
  filtrarProductos(): void {
    const q = this.searchQuery.toLowerCase().trim();

    this.filteredProductos = this.productos.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );

    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  // ============================================================
  // ❤️ Favoritos
  // ============================================================
  cargarFavoritos(): void {
    if (!this.userId) return;

    this.favoriteService.getFavorites(this.userId).subscribe({
      next: data => {
        this.favoritos = data.map((f: any) => f.productId);
      },
      error: err => console.error('Error al cargar favoritos:', err)
    });
  }

  toggleFavorito(event: Event, producto: Product): void {
    event.stopPropagation();
    
    const id = producto.id ?? producto._id;
    if (!this.userId || !id) return;

    if (this.esFavorito(id)) {
      this.removerFavorito(id);
    } else {
      this.agregarFavorito(id);
    }
  }

  agregarFavorito(productId: string): void {
    this.favoriteService.addFavorite(this.userId, productId).subscribe({
      next: () => {
        this.favoritos.push(productId);
      },
      error: err => console.error('Error al agregar favorito:', err)
    });
  }

  removerFavorito(productId: string): void {
    this.favoriteService.removeFavorite(this.userId, productId).subscribe({
      next: () => {
        this.favoritos = this.favoritos.filter(f => f !== productId);
      },
      error: err => console.error('Error al remover favorito:', err)
    });
  }

  esFavorito(id: string): boolean {
    return this.favoritos.includes(id);
  }

  // ============================================================
  // 🟦 Paginación (30 productos por página: 5×6)
  // ============================================================
  calcularPaginacion(): void {
    this.totalPaginas = Math.ceil(this.filteredProductos.length / this.productosPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    this.mostrarPagina(this.paginaActual);
  }

  mostrarPagina(num: number): void {
    this.paginaActual = num;

    const inicio = (num - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;

    this.productosPaginados = this.filteredProductos.slice(inicio, fin);
  }

  cambiarPagina(num: number): void {
    if (num >= 1 && num <= this.totalPaginas) {
      this.mostrarPagina(num);
      this.scrollToTop();
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ============================================================
  // 🔗 Navegación
  // ============================================================
  verDetalle(producto: Product): void {
    const id = producto.id ?? producto._id;
    if (id) {
      this.router.navigate(['/producto-detalle', id]);
    }
  }

  cotizarProducto(event: Event, producto: Product): void {
    event.stopPropagation();
    
    const id = producto.id ?? producto._id;
    if (!id) return;

    const itemCarrito = {
      id: id,
      name: producto.name,
      description: producto.description,
      cantidad: 1,
      category: producto.category,
      image: producto.image
    };

    const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");
    const existe = carritoActual.find((p: any) => p.id === id);
    
    if (existe) {
      existe.cantidad += 1;
    } else {
      carritoActual.push(itemCarrito);
    }

    localStorage.setItem("carrito", JSON.stringify(carritoActual));

    localStorage.setItem("productos_cotizacion", JSON.stringify([{
      categoria: producto.category,
      equipo: producto.name,
      cantidad: 1
    }]));

    this.router.navigate(['/cotizar']);
  }
}