import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../../../services/product.service';
import { CarritoService } from '../../../../services/carrito.service';
import { CotizarComponent } from '../../../cotizar/cotizar.component';
import { SafeUrlPipe } from '../../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, CotizarComponent, SafeUrlPipe],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.scss']
})
export class ProductoDetalleComponent implements OnInit {
  producto: Product | null = null;
  imagenSeleccionada: string = '';
  loading: boolean = false;
  error: string | null = null;

  // Datos de ubicación
  email = 'DINSAC2021@GMAIL.COM';
  direccion = 'Av. César Vallejo N° 1005, Barrio Aranjuez, Trujillo, Perú';
  center = { lat: -8.1116, lng: -79.0297 };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];  
      if (id) this.cargarProducto(id);
    });
  }

  cargarProducto(id: string): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.producto = product;
        this.imagenSeleccionada = product.image;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
        this.error = 'Error al cargar el producto.';
        this.loading = false;
      }
    });
  }

  seleccionarImagen(imagen: string): void {
    if (imagen) this.imagenSeleccionada = imagen;
  }

  agregarAlCarrito(producto: Product): void {
    this.carritoService.agregarAlCarrito(producto);
  }

  abrirEnGoogleMapsPorDireccion(): void {
    const direccionCodificada = encodeURIComponent(this.direccion);
    const url = `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`;
    window.open(url, '_blank');
  }
}
