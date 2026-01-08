import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  sender: 'user' | 'gemini';
  text: string;
}

@Component({
  selector: 'app-chatbot-prueba',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot-prueba.component.html',
  styleUrl: './chatbot-prueba.component.scss',
})
export class ChatbotPruebaComponent implements OnInit {

  messages: Message[] = [];
  newMessage = '';
  isLoading = false;

  private API_URL = 'https://backend-dinsac-hlf0.onrender.com/api/gemini';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.messages.push({
      sender: 'gemini',
      text: '👋 Hola, soy el asistente de DINSAC. ¿En qué puedo ayudarte hoy?'
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const userMessage = this.newMessage;

    // Mostrar mensaje del usuario
    this.messages.push({ sender: 'user', text: userMessage });
    this.newMessage = '';
    this.isLoading = true;

    // Guardar interacción (opcional)
    this.http.post(
      'https://backend-dinsac-hlf0.onrender.com/interacciones',
      {
        usuario: 'Usuario Anónimo',
        mensaje: userMessage,
        fecha: new Date().toISOString()
      }
    ).subscribe({
      error: () => {}
    });

    // 👉 HABLAR CON TU BACKEND (NO con Gemini directo)
    this.http.post<any>(this.API_URL, {
      message: userMessage
    }).subscribe({
      next: (res) => {
        const text =
          res?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'Puedo ayudarte con información y cotizaciones de nuestras máquinas.';

        this.messages.push({ sender: 'gemini', text });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          sender: 'gemini',
          text: 'En este momento no puedo responder, pero puedo ayudarte a solicitar una cotización.'
        });
        this.isLoading = false;
      }
    });
  }
}
