import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'https://backend-dinsac-hlf0.onrender.com/favorites'; // 👈 tu ruta base

  constructor(private http: HttpClient) {}

  // ➕ Agregar producto a favoritos
  addFavorite(userId: string, productId: string): Observable<any> {
    return this.http.post(this.apiUrl, { userId, productId });
  }

  // 📋 Obtener favoritos
  getFavorites(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`);
  }

  // ❌ Eliminar producto de favoritos
  removeFavorite(userId: string, productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${productId}`);
  }
}
