import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  constructor(private http: HttpClient) {}

  getBanner(tipo: string): Observable<{ image: string }> {
    return this.http.get<{ image: string }>(`https://backend-dinsac-hlf0.onrender.com/banner?tipo=${tipo}`);
  }
}
