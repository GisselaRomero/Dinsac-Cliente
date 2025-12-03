import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contactenos',
  standalone: true,
    imports: [FormsModule, CommonModule],
  templateUrl: './contactenos.component.html',
  styleUrls: ['./contactenos.component.scss']
})
export class ContactenosComponent {
  nombre: string = '';
  correo: string = '';
  celular: string = '';
  mensaje: string = '';

  enviarFormulario() {
    if (this.nombre && this.correo && this.celular && this.mensaje) {
      // Crear el mensaje para WhatsApp
      const mensajeWhatsApp = `Hola, mi nombre es ${this.nombre}.
      
*Datos de contacto:*
 Correo: ${this.correo}
 Celular: ${this.celular}

*Mensaje:*
${this.mensaje}`;

      // Codificar el mensaje para URL
      const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
      
      // Número de WhatsApp (934307489)
      const numeroWhatsApp = '51934307489'; // Agregué el código de país de Perú (+51)
      
      // Crear URL de WhatsApp
      const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;
      
      // Abrir WhatsApp en una nueva ventana
      window.open(urlWhatsApp, '_blank');
      
      // Limpiar el formulario
      this.nombre = '';
      this.correo = '';
      this.celular = '';
      this.mensaje = '';
      
      alert('Serás redirigido a WhatsApp para enviar tu mensaje.');
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}