// ubicacion.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent {
  // Coordenadas exactas de Av. César Vallejo N° 1005 - Barrio Aranjuez - Trujillo
  center: google.maps.LatLngLiteral = { lat: -8.1116, lng: -79.0297 }; // Trujillo, Perú
  zoom = 16;
  label = 'DINSAC - Estamos aquí';
  email = 'DINSAC2021@GMAIL.COM';
  
  // Dirección completa para generar el enlace de Google Maps
  direccion = 'Av. César Vallejo N° 1005, Barrio Aranjuez, Trujillo, Peru';
  
  // Método para abrir Google Maps con la ubicación exacta
  abrirEnGoogleMaps(): void {
    const coordenadas = `${this.center.lat},${this.center.lng}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${coordenadas}&query_place_id=ChIJX8_WDzANqpERiYn7wVxaYvg`;
    window.open(url, '_blank');
  }
  
  // Método alternativo usando la dirección
  abrirEnGoogleMapsPorDireccion(): void {
    const direccionCodificada = encodeURIComponent(this.direccion);
    const url = `https://www.google.com/maps/search/?api=1&query=${direccionCodificada}`;
    window.open(url, '_blank');
  }
}