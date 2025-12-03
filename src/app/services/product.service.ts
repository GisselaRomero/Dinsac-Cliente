import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Modelo del producto
export interface Product {
  id: any;
  _id?: string;
  name: string;
  description: string;
  image: string;
  image1: string;
  image2: string;
  image3: string;
  price: number;
  stock: number;
  category: string;
  estado:string;
  images?: string[]; // Ya agregado antes
  hover?: boolean; // 👈 añadida
    isFavorite?: boolean; // ✅ campo opcional para marcar favoritos

  videoURL?: string;
  destacado?: boolean;
  featuresText?: string;
  tagsText?: string;

}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';
  
  constructor(private http: HttpClient) {}
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  




  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
  
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // product.service.ts
  getProductsByEstado(estado: string): Observable<Product[]> {
  return this.http.get<Product[]>(this.apiUrl).pipe(
map(products => products.filter(product =>
  product.estado?.toLowerCase() === estado.toLowerCase()
))
  );
}
getProductById(id: string): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/${id}`);
}

getProductosEnOferta(): Observable<Product[]> {
  return this.http.get<Product[]>(`${this.apiUrl}/ofertas`);
}


getOfertas(): Observable<Product[]> {
  return this.http.get<Product[]>('http://localhost:3000/ofertas'); // Cambia la URL según tu API
}
// En tu product.service.ts

getProductsByCategory(category: string): Observable<Product[]> {
  return this.getProducts().pipe(
    map(products => products.filter(product => product.category === category))
  );
}}