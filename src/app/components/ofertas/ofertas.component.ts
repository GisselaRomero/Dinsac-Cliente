import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BannerService } from '../../services/banner.service';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ofertas.component.html',
  styleUrls: ['./ofertas.component.scss']
})
export class OfertasComponent implements OnInit {
  productos: Product[] = [];
  filteredProductos: Product[] = [];
  loading: boolean = false;
  error: string | null = null;
  searchQuery: string = '';
  bannerUrl: string = '';

  // PAGINACIÓN - 5 columnas × 6 filas = 30 productos por página
  currentPage: number = 1;
  itemsPerPage: number = 30;
  totalPages: number = 0;
  paginatedProductos: Product[] = [];
  pages: number[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private bannerService: BannerService ,
      
  ) {}

  ngOnInit(): void {
    this.cargarBanner();
    this.cargarProductos();
  }

  cargarBanner(): void {
    this.bannerService.getBanner('principal').subscribe({
      next: (data) => {
        this.bannerUrl = data?.image || '';
      },
      error: (e) => console.error('Error cargando banner ofertas', e)
    });
  }

  irAOfertas(): void {
    this.router.navigate(['/ofertas']);
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.filteredProductos = productos;
        this.loading = false;
        this.actualizarPaginacion();
      },
      error: (err) => {
        console.error('Error al obtener productos', err);
        this.error = 'Error al obtener productos. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  filtrarProductos(): void {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredProductos = this.productos.filter(producto =>
      producto.name.toLowerCase().includes(query) ||
      producto.description.toLowerCase().includes(query)
    );

    this.currentPage = 1;
    this.actualizarPaginacion();
  }

  verDetalles(producto: Product): void {
    const id = producto._id ?? producto.id;
    if (id) this.router.navigate(['/producto-detalle', id]);
  }

  cotizarProducto(producto: Product): void {
    const id = producto.id ?? producto._id;

    if (!id) {
      console.error("Producto sin ID");
      return;
    }

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

  actualizarPaginacion(): void {
    this.totalPages = Math.ceil(this.filteredProductos.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.paginatedProductos = this.filteredProductos.slice(start, end);
    this.scrollToTop();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.actualizarPaginacion();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.actualizarPaginacion();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.actualizarPaginacion();
    }
  }

  scrollToTop(): void {
    const elemento = document.getElementById('productos');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}