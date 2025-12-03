import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';

interface Message {
  remitente: 'cliente' | 'admin';
  mensaje: string;
  clienteId: string;
  nombre?: string;
  fecha?: string;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  socket!: Socket;
  clienteId: string = '';
  clienteNombre: string = 'Cliente';

  constructor() {}

  ngOnInit(): void {
    this.clienteId = this.generarClienteId();

    this.socket = io('http://localhost:3000');

 this.socket.on('connect', () => {
this.socket.emit('registrar', { 
  clienteId: this.clienteId,
  nombre: this.clienteNombre   // ← ESTE era el que no enviabas
});

});


    this.socket.on('mensaje', (msg: Message) => {
      if (msg.clienteId === this.clienteId && msg.remitente === 'admin') {
        const existe = this.messages.some(
          m => m.mensaje === msg.mensaje && m.fecha === msg.fecha
        );

        if (!existe) {
          this.messages.push(msg);
          setTimeout(() => this.scrollToBottom(), 100);
        }
      }
    });

    this.messages.push({
      remitente: 'admin',
      mensaje: '¡Hola! ¿En qué puedo ayudarte hoy?',
      clienteId: this.clienteId
    });
  }

generarClienteId(): string {
  const clienteData = localStorage.getItem('clienteData');

  if (clienteData) {
    const cliente = JSON.parse(clienteData);
    this.clienteNombre = cliente.nombre || 'Cliente';

    // ✔ SOLUCIÓN: usar siempre el _id real del cliente
    return cliente._id;
  }

  // ❌ Si no ha iniciado sesión, NO inventar IDs
  // Mejor obligarlo a iniciar sesión
  alert('Por favor, inicia sesión para usar el chat');
  return 'SIN_LOGIN';
}


  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    const nuevoMensaje: Message = {
      remitente: 'cliente',
      mensaje: this.newMessage.trim(),
      clienteId: this.clienteId,
      nombre: this.clienteNombre,
      fecha: new Date().toISOString()
    };

    this.messages.push(nuevoMensaje);
    this.socket.emit('mensaje', nuevoMensaje);

    this.newMessage = '';
  }

  scrollToBottom(): void {
    const container = document.querySelector('.messages-display');
    if (container) container.scrollTop = container.scrollHeight;
  }

  formatTime(fecha?: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  ngOnDestroy(): void {
    if (this.socket) this.socket.disconnect();
  }

  /* 🔥 BOTÓN 📎: ABRIR SELECTOR */
  abrirSelector() {
    document.getElementById('fileInputCliente')?.click();
  }

  /* 🔥 ENVIAR ARCHIVO */
  sendFile(event: any) {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);

    fetch('http://localhost:3000/upload-chat', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const fileUrl = data.url;

        const nuevoMensaje: Message = {
          remitente: 'cliente',
          mensaje: fileUrl,
          clienteId: this.clienteId,
          nombre: this.clienteNombre,
          fecha: new Date().toISOString()
        };

        this.messages.push(nuevoMensaje);
        this.socket.emit('mensaje', nuevoMensaje);

        event.target.value = '';
      });
  }
}
