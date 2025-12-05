import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogiclienteService {

  private apiUrl = 'https://backend-dinsac-hlf0.onrender.com/clientes'; // Cambia si usas otro puerto

  constructor(private http: HttpClient) {}

  registrar(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, cliente);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
