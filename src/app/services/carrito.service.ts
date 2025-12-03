import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from './product.service';

// Interfaz para los productos en el carrito
export interface ProductoCarrito extends Product {
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private keyPrefix = 'carrito_'; // Se añadirá el email del usuario

  // Observable para que otros componentes puedan suscribirse a cambios
  private carritoSubject = new BehaviorSubject<ProductoCarrito[]>(this.getStoredCarrito());

  constructor() { }

  // Obtener la clave única para el usuario actual
  private getKey(): string {
    const email = localStorage.getItem('usuario_email') || 'anonimo';
    return this.keyPrefix + email;
  }

  // Obtener carrito desde localStorage
  private getStoredCarrito(): ProductoCarrito[] {
    const carritoGuardado = localStorage.getItem(this.getKey());
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }

  // Guardar carrito en localStorage
  private saveCarrito(carrito: ProductoCarrito[]): void {
    localStorage.setItem(this.getKey(), JSON.stringify(carrito));
    this.carritoSubject.next(carrito);
  }

  // Observable para suscripción
  getCarritoObservable(): Observable<ProductoCarrito[]> {
    return this.carritoSubject.asObservable();
  }

  // Obtener carrito actual
  obtenerCarrito(): ProductoCarrito[] {
    return this.carritoSubject.value;
  }

  // Agregar producto
  agregarAlCarrito(producto: Product): void {
    const carrito = this.obtenerCarrito();
    const existe = carrito.find(item => item._id === producto._id);

    if (existe) {
      existe.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    this.saveCarrito(carrito);
  }

  // Eliminar producto
  eliminarDelCarrito(id: string): void {
    const carrito = this.obtenerCarrito().filter(item => item._id !== id);
    this.saveCarrito(carrito);
  }

  // Vaciar carrito
  vaciarCarrito(): void {
    this.saveCarrito([]);
  }

  // Actualizar cantidad
  actualizarCantidad(id: string, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarDelCarrito(id);
      return;
    }

    const carrito = this.obtenerCarrito();
    const producto = carrito.find(item => item._id === id);
    if (producto) {
      producto.cantidad = cantidad;
      this.saveCarrito(carrito);
    }
  }

  // Total items
  obtenerTotalItems(): number {
    return this.obtenerCarrito().reduce((total, item) => total + item.cantidad, 0);
  }

  // Total precio
  calcularTotal(): number {
    return this.obtenerCarrito().reduce((total, item) => total + (item.price * item.cantidad), 0);
  }
}
