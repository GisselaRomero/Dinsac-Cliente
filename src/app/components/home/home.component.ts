import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideosHomeComponent } from '../videos-home/videos-home.component';
import { CotizarComponent } from '../cotizar/cotizar.component';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    VideosHomeComponent,
    FormsModule,
    CotizarComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('mainVideo', { static: false }) mainVideo!: ElementRef<HTMLVideoElement>;
  
  // Productos destacados
  ofertasDestacadas: Product[] = [];

  // Marcas partners
  marcas = [
    { logo: 'assets/img/marcas/honda.png', name: 'Honda', url: 'https://www.honda.com' },
    { logo: 'assets/img/marcas/briggs.png', name: 'Briggs & Stratton', url: 'https://www.briggsandstratton.com' },
    { logo: 'assets/img/marcas/jiangdong.png', name: 'Jiang Dong', url: 'https://www.jiangdongengine.com' },
    { logo: 'assets/img/marcas/Stihl.png', name: 'Stihl', url: 'https://www.stihl.com' },
    { logo: 'assets/img/marcas/echo.png', name: 'Echo', url: 'https://www.echo-usa.com' },
    { logo: 'assets/img/marcas/Shindaiwa.png', name: 'Shindaiwa', url: 'https://www.shindaiwa.com' },
    { logo: 'assets/img/marcas/deutz.png', name: 'Deutz', url: 'https://www.deutz.com' },
    { logo: 'assets/img/marcas/perkins.png', name: 'Perkins', url: 'https://www.perkins.com' },
    { logo: 'assets/img/marcas/Caterpillar.png', name: 'Caterpillar', url: 'https://www.cat.com' },
    { logo: 'assets/img/marcas/Kubota.png', name: 'Kubota', url: 'https://www.kubota.com' },
    { logo: 'assets/img/marcas/yamaha.png', name: 'Yamaha', url: 'https://www.yamaha-motor.com' },
    { logo: 'assets/img/marcas/bonelly.png', name: 'Bonelly', url: 'https://www.bonelly.com' },
    { logo: 'assets/img/marcas/campbell7.png', name: 'Campbell', url: 'https://www.campbell.com' }
  ];

  constructor(
    private router: Router, 
    private productService: ProductService,
      private http: HttpClient  // <-- aquí

  ) {}
bannersPrincipal: any[] = [];

  bannerOfertasUrl: string = ''; // <-- declarada aquí

ngOnInit() {
  this.cargarOfertasDestacadas();
  this.cargarBannerOfertas();
  this.cargarBannersCarrusel();  // ← Cambié el nombre

  window.addEventListener('bannerActualizado', () => {
    this.cargarBannerOfertas();
    this.cargarBannersCarrusel();  // ← Cambié el nombre
  });
}



// Banner de la sección "Ofertas Destacadas" en Home
cargarBannerOfertas() {
  const timestamp = new Date().getTime();
  this.http.get<{ image: string }>(`https://backend-dinsac-hlf0.onrender.com/banner?tipo=ofertasHome&_=${timestamp}`)
    .subscribe({
      next: (res) => {
        console.log('🏷️ Banner ofertas home recibido:', res);
        this.bannerOfertasUrl = res.image;
      },
      error: (err) => console.error('Error cargando banner ofertas home', err)
    });
}


cargarBannersCarrusel() {
  const timestamp = new Date().getTime();
  this.http.get<any[]>(`https://backend-dinsac-hlf0.onrender.com/banner?tipo=carrusel&_=${timestamp}`)
    .subscribe({
      next: (res) => {
        console.log('🎠 Banners carrusel recibidos:', res);
        this.bannersPrincipal = res;
      },
      error: (err) => console.error("Error cargando banners del carrusel", err)
    });
}

  ngAfterViewInit() {
    // Observador para el video principal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = this.mainVideo.nativeElement;
          if (entry.isIntersecting) {
            video.play().catch((err) => {
              console.error('Error reproduciendo el video:', err);
            });
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: 0.5,
      }
    );
    observer.observe(this.mainVideo.nativeElement);
  }

  /**
   * Cargar productos destacados desde el servicio
   */
  cargarOfertasDestacadas() {
    this.productService.getProductsByEstado('Oferta').subscribe({
      next: (productos) => {
        // Solo tomamos los primeros 6 productos
        this.ofertasDestacadas = productos.slice(0, 6);
      },
      error: (err) => {
        console.error('Error cargando productos en oferta', err);
      }
    });
  }

  /**
   * Ver detalles de un producto
   */
  verDetalles(producto: Product): void {
    const id = producto.id ?? producto._id;
    if (id) {
      this.router.navigate(['/producto-detalle', id]);
    } else {
      console.error('El producto no tiene un id válido');
    }
  }

  /**
   * Navegar a la página de cotización
   */
  irACotizar() {
    console.log('Navegando a cotizar...');
    this.router.navigate(['/cotizar']);
  }

  /**
   * Scroll suave a la sección de cotización
   */
  scrollToCotizacion() {
    const cotizacionSection = document.querySelector('.cotizacion-hero');
    if (cotizacionSection) {
      cotizacionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  irAOfertas() {
  this.router.navigate(['/ofertas']);
}

}