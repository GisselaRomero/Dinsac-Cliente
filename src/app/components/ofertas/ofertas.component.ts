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

  constructor(
    private productService: ProductService,
    private router: Router,
        private bannerService: BannerService   

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
irAOfertas() {
  this.router.navigate(['/ofertas']); // o la ruta que uses
}


  cargarProductos(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProducts().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.filteredProductos = productos;
        this.loading = false;
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

  // 🔹 Armar item para carrito
  const itemCarrito = {
    id: id,
    name: producto.name,
    description: producto.description,
    cantidad: 1,
    category: producto.category,
    image: producto.image
  };

  // 🔹 Guardar en carrito
  const carritoActual = JSON.parse(localStorage.getItem("carrito") || "[]");

  // Si ya existe, solo aumentar cantidad
  const existe = carritoActual.find((p: any) => p.id === id);
  if (existe) {
    existe.cantidad += 1;
  } else {
    carritoActual.push(itemCarrito);
  }

  localStorage.setItem("carrito", JSON.stringify(carritoActual));

  // 🔹 Enviar a cotizar
  localStorage.setItem("productos_cotizacion", JSON.stringify([{
    categoria: producto.category,
    equipo: producto.name,
    cantidad: 1
  }]));

  this.router.navigate(['/cotizar']);
}
}
