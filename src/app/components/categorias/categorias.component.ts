import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule  ],
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent implements OnInit {
  // Categorías estáticas mientras se cargan las dinámicas
categorias = [
  { name: 'Agroindustria', image: 'assets/img/categorias/agroindustria1.jpg' },
  { name: 'Artículos del Hogar', image: 'assets/img/categorias/hogar.jpg' },
  { name: 'Bombeo de Fluidos', image: 'assets/img/categorias/bombeo.jpg' },
  { name: 'Carpintería', image: 'assets/img/categorias/carpinteria.jpg' },
  { name: 'Compresoras', image: 'assets/img/categorias/compresoras.png' },
  { name: 'Construcción', image: 'assets/img/categorias/construccion.jpg' },
  { name: 'Electrobombas', image: 'assets/img/categorias/electrobombas.jpg' },
  { name: 'Generadores', image: 'assets/img/categorias/generadores.jpg' },
  { name: 'Grupos Electrógenos', image: 'assets/img/categorias/grupos.jpg' },
  { name: 'Herramientas Eléctricas', image: 'assets/img/categorias/herramientas.jpg' },
  { name: 'Jardinería', image: 'assets/img/categorias/jardineria.jpg' },
  { name: 'Limpieza Industrial', image: 'assets/img/categorias/limpieza.jpg' },
  { name: 'Maquinaria Pesada', image: 'assets/img/categorias/maquinariap.jpg' },
  { name: 'Metalmecánica', image: 'assets/img/categorias/metalmecanica.jpg' },
  { name: 'Minería', image: 'assets/img/categorias/mineria.jpg' },
  { name: 'Motores', image: 'assets/img/categorias/motores.jpg' },
  { name: 'Novedades', image: 'assets/img/categorias/novedades.jpg' },
  { name: 'Ofertas y Liquidaciones', image: 'assets/img/categorias/ofertas.jpg' },
  { name: 'Proceso de Alimentos', image: 'assets/img/categorias/proceso-alimentos.jpg' },
  { name: 'Soldadura y Corte', image: 'assets/img/categorias/soldadura.jpg' },
  { name: 'Taller Automotriz', image: 'assets/img/categorias/taller.jpg' }
];


  // Propiedades para el buscador
  searchQuery: string = '';
  filteredCategorias: Array<{ name: string; image: string }> = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Inicializar las categorías filtradas con todas las categorías
    this.filteredCategorias = [...this.categorias];

    // Si quieres cargar categorías dinámicamente desde los productos,
    // puedes descomentar este bloque de código
    /*
    this.productService.getProducts().subscribe({
      next: (products) => {
        // Extraer categorías únicas de los productos
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        
        // Actualizar la lista de categorías manteniendo las imágenes
        this.categorias = uniqueCategories.map(category => {
          // Buscar si ya existe una imagen para esta categoría
          const existingCategory = this.categorias.find(
            cat => cat.name.toLowerCase() === category.toLowerCase()
          );
          
          return {
            name: category,
            image: existingCategory ? existingCategory.image : 'assets/img/categorias/default.jpg'
          };
        });
        // Inicializar las categorías filtradas con todas las categorías
        this.filteredCategorias = [...this.categorias];
      },
      error: (err) => {
        console.error('Error al cargar categorías desde productos:', err);
      }
    });
    */
  }

  // Método para filtrar las categorías basadas en el término de búsqueda
  filterCategories(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredCategorias = [...this.categorias]; // Mostrar todas si no hay búsqueda
    } else {
      this.filteredCategorias = this.categorias.filter(categoria =>
        categoria.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
}
