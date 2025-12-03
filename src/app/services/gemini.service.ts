import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  // **CAMBIO IMPORTANTE AQUÍ:**
  // La URL base NO debe contener '?key=GEMINI_API_KEY' ni ningún otro parámetro.
  // Solo la dirección del endpoint del modelo.
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  // Tu clave API real (¡sin comillas extras!)
  private apiKey = 'AIzaSyD44UeoOVzzZ8JRZv8VoNCBvHo2Ss99-70';

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      contents: [
        {
          parts: [
            {
              text: message
            }
          ]
        }
      ]
    };

    // **CAMBIO IMPORTANTE AQUÍ:**
    // Construye la URL final concatenando el 'apiUrl' limpio y luego '?key=' + 'apiKey'
    const finalUrl = `${this.apiUrl}?key=${this.apiKey}`;

    return this.http.post(finalUrl, body, { headers });
  }
}