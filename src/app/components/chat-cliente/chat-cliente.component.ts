import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { io, Socket } from 'socket.io-client';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Mensaje {
  remitente: 'cliente' | 'admin';
  mensaje: string;
  clienteId: string;
  nombre?: string;
  fecha?: string;
}

@Component({
  selector: 'app-chat-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat-cliente.component.html',
  styleUrls: ['./chat-cliente.component.scss']
})
export class ChatClienteComponent implements OnInit, OnDestroy {

  mensajes: Mensaje[] = [];
  mensajeEscrito: string = '';
  socket!: Socket;
  clienteId: string = '';
  nombre: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.inicializarCliente();
    this.conectarSocket();
  }

  // 🚀 Inicializar datos del cliente
  inicializarCliente(): void {
    const usuarioId = localStorage.getItem('usuario_id');
    const usuarioNombre = localStorage.getItem('usuario_nombre');

    if (usuarioId && usuarioNombre) {
      // Cliente real
      this.clienteId = usuarioId;
      this.nombre = usuarioNombre;
      console.log('✅ Cliente autenticado:', this.nombre);

    } else {
      // Cliente anónimo
      let anonId = localStorage.getItem('anonClienteId');

      if (!anonId) {
        anonId = 'anon-' + Math.random().toString(36).substring(2, 8);
        localStorage.setItem('anonClienteId', anonId);
      }

      this.clienteId = anonId;
      this.nombre = `Cliente ${anonId.substring(5, 9)}`;
      console.log('⚠️ Cliente anónimo:', this.nombre);
    }
  }

  // 🔌 Conectar a Socket.IO
  conectarSocket(): void {
    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('✅ Conectado al chat:', this.clienteId);

      this.socket.emit('registrar', {
        clienteId: this.clienteId,
        nombre: this.nombre
      });

      this.cargarHistorial();
    });

    // 📩 Recibir mensajes del admin
    this.socket.on('mensaje', (msg: Mensaje) => {
      if (msg.clienteId === this.clienteId && msg.remitente === 'admin') {

        // Evitar duplicados
        const existe = this.mensajes.some(
          m =>
            m.mensaje === msg.mensaje &&
            m.fecha === msg.fecha &&
            m.remitente === msg.remitente
        );

        if (!existe) {
          this.mensajes.push(msg);
          setTimeout(() => this.scrollToBottom(), 100);
        }
      }
    });
  }

  // 📜 Cargar historial
  cargarHistorial(): void {
    this.http.get<Mensaje[]>(`http://localhost:3000/chats/${this.clienteId}`)
      .subscribe({
        next: (res) => {
          this.mensajes = res;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err) => console.error('❌ Error cargando historial:', err)
      });
  }

  // 📤 Enviar mensaje normal
  enviarMensaje(): void {
    if (!this.mensajeEscrito.trim()) return;

    const nuevoMensaje: Mensaje = {
      remitente: 'cliente',
      mensaje: this.mensajeEscrito.trim(),
      clienteId: this.clienteId,
      nombre: this.nombre,
      fecha: new Date().toISOString()
    };

    this.mensajes.push(nuevoMensaje);
    this.socket.emit('mensaje', nuevoMensaje);

    this.mensajeEscrito = '';
    setTimeout(() => this.scrollToBottom(), 50);
  }

  // 📎 Abrir selector de archivos
  abrirSelector(): void {
    document.getElementById('fileInput')?.click();
  }

  // 📤 Enviar archivo (PDF o imagen)
  enviarArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('clienteId', this.clienteId);

    this.http.post<{ url: string }>('http://localhost:3000/upload-chat', formData)
      .subscribe({
        next: (res) => {
          const nuevoMensaje: Mensaje = {
            remitente: 'cliente',
            mensaje: res.url, // 📁 URL del archivo
            clienteId: this.clienteId,
            nombre: this.nombre,
            fecha: new Date().toISOString()
          };

          this.mensajes.push(nuevoMensaje);
          this.socket.emit('mensaje', nuevoMensaje);

          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err) => console.error('❌ Error al subir archivo:', err)
      });

    event.target.value = '';
  }

  // 🕒 Formatear hora
  obtenerHora(fecha?: string): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ⬇️ Scroll automático
  scrollToBottom(): void {
    const contenedor = document.querySelector('.mensajes');
    if (contenedor) contenedor.scrollTop = contenedor.scrollHeight;
  }

  ngOnDestroy(): void {
    if (this.socket) this.socket.disconnect();
  }

}
