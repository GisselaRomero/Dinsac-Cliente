import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // IMPORTANTE

interface Message {
  sender: 'user' | 'gemini';
  text: string;
}

@Component({
  selector: 'app-chatbot-prueba',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // Asegúrate de importar HttpClientModule aquí
  templateUrl: './chatbot-prueba.component.html',
  styleUrl: './chatbot-prueba.component.scss',
})
export class ChatbotPruebaComponent implements OnInit {

  messages: Message[] = [];
  newMessage: string = '';
  isLoading: boolean = false;
  voiceEnabled: boolean = true;

  constructor(
    private geminiService: GeminiService,
    private http: HttpClient // INYECCIÓN DEL SERVICIO HTTP
  ) {}

  ngOnInit(): void {
    this.messages.push({ sender: 'gemini', text: '¡Hola! ¿En qué puedo ayudarte hoy?' });
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    const userMessage = this.newMessage;
    this.messages.push({ sender: 'user', text: userMessage });
    this.newMessage = '';
    this.isLoading = true;

    // 👉 REGISTRA LA INTERACCIÓN EN EL BACKEND
    this.http.post('https://backend-dinsac-hlf0.onrender.com/interacciones', {
      usuario: 'Usuario Anónimo',
      mensaje: userMessage,
      fecha: new Date().toISOString()
    }).subscribe({
      next: () => console.log('Interacción registrada'),
      error: (err: any) => console.error('Error al guardar interacción', err)
    });

    this.geminiService.sendMessage(userMessage).subscribe({
      next: (response) => {
        let geminiResponseText = response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                                 'Lo siento, no pude obtener una respuesta.';

        const lowerResponse = geminiResponseText.toLowerCase();
        const palabrasClave = ['máquina', 'industrial', 'equipo', 'producción', 'mantenimiento', 'fabricación'];
        const esRelevante = palabrasClave.some(palabra => lowerResponse.includes(palabra));

        if (!esRelevante) {
          geminiResponseText = 'Lo siento, solo puedo ayudarte con temas relacionados a nuestras máquinas industriales. ¿Qué necesitas saber?';
        }

        this.messages.push({ sender: 'gemini', text: geminiResponseText });
        this.textToSpeech(geminiResponseText);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al comunicarse con Gemini API:', error);
        const errorMsg = 'Ups, algo salió mal. Intenta de nuevo más tarde.';
        this.messages.push({ sender: 'gemini', text: errorMsg });
        this.textToSpeech(errorMsg);
        this.isLoading = false;
      }
    });
  }

  textToSpeech(text: string): void {
    if (!this.voiceEnabled) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-PE';
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.speak(utterance);
  }

  responderAlUsuario(): void {
    const respuesta = 'Hola, ¿en qué puedo ayudarte?';
    this.textToSpeech(respuesta);
  }
}
