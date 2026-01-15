import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  sender: 'user' | 'bot';
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

  // 👉 TU BACKEND EN RENDER (Groq)
  private API_URL = 'https://backend-dinsac-hlf0.onrender.com/chat';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.messages.push({
      sender: 'bot',
      text: '👋 Hola, soy el asistente de DINSAC. ¿En qué puedo ayudarte hoy?'
    });
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;

    const userMessage = this.newMessage;

    // Mostrar mensaje del usuario
    this.messages.push({
      sender: 'user',
      text: userMessage
    });

    this.newMessage = '';
    this.isLoading = true;

    // 👉 LLAMADA AL BACKEND (Groq)
    this.http.post<any>(this.API_URL, {
      message: userMessage
    }).subscribe({
      next: (res) => {
        this.messages.push({
          sender: 'bot',
          text: res.reply || 'Puedo ayudarte con información y cotizaciones.'
        });
        this.isLoading = false;
      },
      error: () => {
        this.messages.push({
          sender: 'bot',
          text: '⚠️ En este momento no puedo responder. Intenta nuevamente.'
        });
        this.isLoading = false;
      }
    });
  }
}
