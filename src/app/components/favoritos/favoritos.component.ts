import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { Product } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.scss']
})
export class FavoritosComponent implements OnInit {
  favorites: Product[] = [];   // productos favoritos cargados del backend
  loading: boolean = false;
  error: string | null = null;
  userId: string = '';         // ⚡️ viene del login

  constructor(
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.userId = localStorage.getItem('usuario_id') || '';
  const usuarioLogueado = localStorage.getItem('usuario_logueado') === 'true';

  if (!usuarioLogueado || !this.userId) {
    alert('🔒 Debes iniciar sesión para ver tus favoritos.');
    this.router.navigate(['/login']);
    return;
  }

  this.cargarFavoritos();
}


cargarFavoritos(): void {
  this.loading = true;
  this.favoriteService.getFavorites(this.userId).subscribe({
    next: (res: any) => {
      // 👇 Ajusta según cómo responde tu backend
      this.favorites = Array.isArray(res) ? res : res.favorites || [];
      this.loading = false;
    },
    error: (err: any) => {
      console.error('❌ Error al cargar favoritos:', err);
      this.error = 'No se pudieron cargar los favoritos';
      this.loading = false;
    }
  });
}


  // ✅ Verificar si un producto está en favoritos
  esFavorito(productId: string): boolean {
    return this.favorites.some(
      fav => fav._id === productId || fav.id === productId
    );
  }

  // ✅ Alternar entre agregar o quitar de favoritos
toggleFavorito(producto: any): void {
  const id = producto._id || producto.id;

  if (this.esFavorito(id)) {
    this.favoriteService.removeFavorite(this.userId, id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(
          fav => fav._id !== id && fav.id !== id
        );
        alert('❌ Producto quitado de favoritos');
      },
      error: (err) => console.error('❌ Error al quitar favorito:', err)
    });
  } else {
    this.favoriteService.addFavorite(this.userId, id).subscribe({
      next: () => {
        this.favorites.push(producto);
        alert('✅ Producto agregado a favoritos');
      },
      error: (err) => console.error('❌ Error al agregar favorito:', err)
    });
  }
}

  verDetalles(producto: Product): void {
    const id = producto.id ?? producto._id;
    if (id) {
      this.router.navigate(['/producto-detalle', id]);
    }
  }
}
