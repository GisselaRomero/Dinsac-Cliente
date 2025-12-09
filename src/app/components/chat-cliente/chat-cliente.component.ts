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
    this.socket = io('https://backend-dinsac-hlf0.onrender.com/', {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado al chat:', this.clienteId);

      this.socket.emit('registrar', {
        clienteId: this.clienteId,
        nombre: this.nombre
      });

      this.cargarHistorial();
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
    });

    // 📩 Recibir mensajes del admin
    this.socket.on('mensaje', (msg: Mensaje) => {
      console.log('📩 Mensaje recibido del socket:', msg);
      
      if (msg.clienteId === this.clienteId && msg.remitente === 'admin') {
        // ✅ Evitar duplicados comparando solo mensaje y remitente
        const existe = this.mensajes.some(
          m => m.mensaje === msg.mensaje && 
               m.remitente === msg.remitente &&
               Math.abs(new Date(m.fecha || '').getTime() - new Date(msg.fecha || '').getTime()) < 2000
        );

        if (!existe) {
          this.mensajes.push(msg);
          console.log('✅ Mensaje del admin agregado al chat');
          setTimeout(() => this.scrollToBottom(), 100);
        } else {
          console.log('⚠️ Mensaje duplicado, no se agrega');
        }
      }
    });
  }

  // 📜 Cargar historial
  cargarHistorial(): void {
    this.http.get<Mensaje[]>(`https://backend-dinsac-hlf0.onrender.com/chats/${this.clienteId}`)
      .subscribe({
        next: (res) => {
          console.log('✅ Historial cargado:', res.length, 'mensajes');
          this.mensajes = res;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err) => console.error('❌ Error cargando historial:', err)
      });
  }

  // 📤 Enviar mensaje normal
// 📤 Enviar archivo con nombre de usuario
// 📤 Enviar archivo con nombre de usuario
enviarArchivo(event: any): void {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('clienteId', this.clienteId);

  this.http.post('https://backend-dinsac-hlf0.onrender.com/upload-chat', formData)
    .subscribe((res: any) => {

      const nuevoMsg: Mensaje = {
        remitente: 'cliente',
        clienteId: this.clienteId,
        mensaje: res.url,
        nombre: this.nombre,  // ✅ Enviar el nombre real del usuario
        fecha: new Date().toISOString()
      };

      this.mensajes.push(nuevoMsg);
      this.socket.emit('mensaje', nuevoMsg);
      setTimeout(() => this.scrollToBottom(), 100);
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

  // 📄 Detectar si es un archivo
  esArchivo(mensaje: string): boolean {
    return mensaje.includes('https://backend-dinsac-hlf0.onrender.com/uploads/');
  }

  // 📝 Obtener nombre del archivo
  obtenerNombreArchivo(url: string): string {
    const partes = url.split('/');
    const nombreCompleto = partes[partes.length - 1];
    
    // Remover timestamp y decodificar
    const nombreSinTimestamp = nombreCompleto.substring(nombreCompleto.indexOf('-') + 1);
    return decodeURIComponent(nombreSinTimestamp);
  }

  // 📎 Obtener extensión del archivo
  obtenerExtension(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    return extension;
  }

  // 🖼️ Verificar si es imagen
  esImagen(url: string): boolean {
    const ext = this.obtenerExtension(url);
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  }

  // 📄 Verificar si es PDF
  esPDF(url: string): boolean {
    return this.obtenerExtension(url) === 'pdf';
  }

  // ⬇️ Scroll automático
  scrollToBottom(): void {
    const contenedor = document.querySelector('.mensajes');
    if (contenedor) contenedor.scrollTop = contenedor.scrollHeight;
  }

  ngOnDestroy(): void {
    if (this.socket) this.socket.disconnect();
  }
// 📎 Abrir selector de archivos
abrirSelector(): void {
  const input: any = document.getElementById('fileInput');
  if (input) {
    input.click();
  }
}

// 💬 Enviar mensaje de texto normal
enviarMensaje(): void {
  if (!this.mensajeEscrito.trim()) return;

  const nuevoMsg: Mensaje = {
    remitente: 'cliente',
    clienteId: this.clienteId,
    mensaje: this.mensajeEscrito,
    nombre: this.nombre,  // ✅ Enviar el nombre real del usuario
    fecha: new Date().toISOString()
  };

  this.mensajes.push(nuevoMsg);
  this.socket.emit('mensaje', nuevoMsg);

  this.mensajeEscrito = '';
  setTimeout(() => this.scrollToBottom(), 100);
}

}