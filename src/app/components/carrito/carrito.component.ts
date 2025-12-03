import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService, ProductoCarrito } from '../../services/carrito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {

  productosCarrito: ProductoCarrito[] = [];
  usuarioLogueado: boolean = false;

  constructor(private carritoService: CarritoService, private router: Router) {}

  ngOnInit(): void {
    this.usuarioLogueado = localStorage.getItem('usuario_logueado') === 'true';

    if (!this.usuarioLogueado) {
      alert('🔒 Debes iniciar sesión para acceder al carrito y cotizar.');
      this.router.navigate(['/login']);
      return;
    }

    // Suscribirse al observable para que la vista se actualice automáticamente
    this.carritoService.getCarritoObservable().subscribe(carrito => {
      this.productosCarrito = carrito;
    });

    // Vaciar carrito si es un usuario nuevo
    const emailActual = localStorage.getItem('usuario_email') || 'anonimo';
    const emailPrevio = localStorage.getItem('carrito_usuario') || null;

    if (emailPrevio !== emailActual) {
      this.carritoService.vaciarCarrito();
      localStorage.setItem('carrito_usuario', emailActual);
    }
  }

  eliminarDelCarrito(id: string) {
    this.carritoService.eliminarDelCarrito(id);
  }

  actualizarCantidad(id: string, cantidad: number) {
    if (cantidad < 1) cantidad = 1;
    this.carritoService.actualizarCantidad(id, cantidad);
  }

  onCantidadInput(id: string, event: Event) {
    const input = event.target as HTMLInputElement;
    let nuevaCantidad = parseInt(input.value, 10);
    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
      nuevaCantidad = 1;
      input.value = '1';
    }
    this.actualizarCantidad(id, nuevaCantidad);
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario_logueado');
    localStorage.removeItem('usuario_email');
    localStorage.removeItem('carrito_usuario');
    this.carritoService.vaciarCarrito();
    this.usuarioLogueado = false;
    alert('👋 Sesión cerrada');
  }

  cotizarCarrito() {
    if (!this.usuarioLogueado) {
      alert("🔒 Debes iniciar sesión para solicitar una cotización.");
      this.router.navigate(['/login']);
      return;
    }

    if (this.productosCarrito.length === 0) {
      alert("⚠️ No hay productos en el carrito para cotizar.");
      return;
    }

    const productos = this.productosCarrito.map(item => ({
      categoria: item.category,
      equipo: item.name,
      cantidad: item.cantidad,
      descripcion: item.description
    }));

    localStorage.setItem('productos_cotizacion', JSON.stringify(productos));
    this.router.navigate(['/cotizar']);
  }
}
