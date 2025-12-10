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

  // --- Paginación ---
  paginaActual: number = 1;
  productosPorPagina: number = 20; 
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

    this.productService.getProducts().subscribe({
      next: products => {
        this.productos = products;
        this.filteredProductos = products;

        this.calcularPaginacion();
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Error al cargar los productos.';
        this.loading = false;
      }
    });
  }

  // ============================================================
  // 🔍 Filtrar por buscador
  // ============================================================
  filtrarProductos() {
    const q = this.searchQuery.toLowerCase();

    this.filteredProductos = this.productos.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );

    // Resetear paginación cuando se busca
    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  // ============================================================
  // ❤️ Favoritos
  // ============================================================
  cargarFavoritos() {
    if (!this.userId) return;

    this.favoriteService.getFavorites(this.userId).subscribe({
      next: data => this.favoritos = data.map((f: any) => f.productId),
      error: err => console.error(err)
    });
  }

  agregarAFavoritos(producto: Product): void {
    const id = producto.id ?? producto._id;
    if (!this.userId || !id) return;

    this.favoriteService.addFavorite(this.userId, id).subscribe(() => {
      this.favoritos.push(id);
    });
  }

  esFavorito(id: string): boolean {
    return this.favoritos.includes(id);
  }

  // ============================================================
  // 🟦 Paginación (20 productos por página)
  // ============================================================
  calcularPaginacion() {
    this.totalPaginas = Math.ceil(this.filteredProductos.length / this.productosPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    this.mostrarPagina(this.paginaActual);
  }

  mostrarPagina(num: number) {
    this.paginaActual = num;

    const inicio = (num - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;

    this.productosPaginados = this.filteredProductos.slice(inicio, fin);
  }

  cambiarPagina(num: number) {
    if (num >= 1 && num <= this.totalPaginas) {
      this.mostrarPagina(num);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ============================================================
  // 🔗 Ir al detalle
  // ============================================================
  verDetalle(producto: Product) {
    const id = producto.id ?? producto._id;
    this.router.navigate(['/producto-detalle', id]);
  }
}
