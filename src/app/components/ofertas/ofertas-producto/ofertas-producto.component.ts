import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-ofertas-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ofertas-producto.component.html',
  styleUrls: ['./ofertas-producto.component.scss']
})
export class OfertasProductoComponent implements OnInit {
  productos: Product[] = [];
  filteredProductos: Product[] = [];
  loading = false;
  error: string | null = null;
  searchQuery = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductsByEstado('Ofertas').subscribe({
      next: (productos) => {
        this.productos = productos;
        this.filteredProductos = productos;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener productos en oferta', err);
        this.error = 'Error al obtener la maquinaria disponible.';
        this.loading = false;
      }
    });
  }

  filtrarProductos(): void {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredProductos = this.productos.filter(
      (producto) =>
        producto.name.toLowerCase().includes(query) ||
        producto.description.toLowerCase().includes(query) ||
        producto.category.toLowerCase().includes(query)
    );
  }

  verDetalles(producto: Product): void {
    const id = producto._id ?? producto.id;
    if (id) this.router.navigate(['/producto-detalle', id]);
    else console.error('El producto no tiene un ID válido');
  }
}
