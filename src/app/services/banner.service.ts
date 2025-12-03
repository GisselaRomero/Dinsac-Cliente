import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  constructor(private http: HttpClient) {}

  getBanner(tipo: string): Observable<{ image: string }> {
    return this.http.get<{ image: string }>(`http://localhost:3000/banner?tipo=${tipo}`);
  }
}
