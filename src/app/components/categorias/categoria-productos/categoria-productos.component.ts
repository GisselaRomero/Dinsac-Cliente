import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../../services/product.service';
import { FavoriteService } from '../../../services/favorite.service';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';


@Component({
  selector: 'app-categoria-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria-productos.component.html',
  styleUrls: ['./categoria-productos.component.scss']
})
export class CategoriaProductosComponent implements OnInit {
  categoriaNombre: string = '';
  productos: Product[] = [];
  filteredProductos: Product[] = [];
  favoritos: string[] = []; // ✅ Guardamos ids de favoritos
  loading: boolean = false;
  error: string | null = null;
  searchQuery: string = '';

  userId: string = ''; // ✅ Se llena en ngOnInit desde localStorage

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private favoriteService: FavoriteService,
    private router: Router,
      private carritoService: CarritoService   // 👈 AGREGAR

  ) {}

  ngOnInit(): void {
    // ⚡️ Obtener el userId desde localStorage
    this.userId = localStorage.getItem('usuario_id') || '';

    if (!this.userId) {
      console.warn('⚠️ No hay usuario logueado, no se podrán guardar favoritos');
    }

    this.route.params.subscribe(params => {
      this.categoriaNombre = params['nombre'];
      this.cargarProductosPorCategoria(this.categoriaNombre);
      this.cargarFavoritos(); // ✅ Cargar favoritos del usuario
    });
  }

  cargarProductosPorCategoria(categoria: string): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductsByCategory(categoria).subscribe({
      next: (products) => {
        this.productos = products;
        this.filteredProductos = products;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  filtrarProductos(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProductos = this.productos;
    } else {
      this.filteredProductos = this.productos.filter(producto =>
        producto.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        producto.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  verDetalles(producto: Product): void {
    const id = producto.id ?? producto._id;
    if (id) {
      this.router.navigate(['/producto-detalle', id]);
    } else {
      console.error('El producto no tiene un id válido');
    }
  }

  agregarAFavoritos(producto: Product): void {
    const id = producto.id ?? producto._id;

    if (!this.userId) {
      alert('⚠️ Debes iniciar sesión para agregar a favoritos');
      return;
    }

    if (!id) {
      console.error('⚠️ El producto no tiene un id válido');
      return;
    }

    this.favoriteService.addFavorite(this.userId, id).subscribe({
      next: () => {
        console.log('✅ Producto agregado a favoritos');
        this.favoritos.push(id); // ✅ Guardamos en el array
      },
      error: (err) => {
        console.error('❌ Error al agregar a favoritos:', err);
      }
    });
  }

  // ✅ Verifica si el producto ya es favorito
  esFavorito(productId: string): boolean {
    return this.favoritos.includes(productId);
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


  // ✅ Cargar favoritos existentes del usuario
  cargarFavoritos(): void {
    if (!this.userId) return;

    this.favoriteService.getFavorites(this.userId).subscribe({
      next: (data: any) => {
        this.favoritos = data.map((fav: any) => fav.productId);
      },
      error: (err) => {
        console.error('❌ Error al cargar favoritos:', err);
      }
    });

    

  }
}
