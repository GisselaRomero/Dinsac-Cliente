import { Component, ViewChild, ElementRef, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideosHomeComponent } from '../videos-home/videos-home.component';
import { CotizarComponent } from '../cotizar/cotizar.component';
import { RouterModule, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

interface BannerCarrusel {
  id: string;
  orden: number;
  image: string;
  contentType: string;
}

interface BannerResponse {
  success: boolean;
  imagenes: BannerCarrusel[];
}

interface BannerIndividualResponse {
  success: boolean;
  image: string;
  contentType: string;
}

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
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mainVideo', { static: false }) mainVideo!: ElementRef<HTMLVideoElement>;
  
  // Banners
  bannersPrincipal: BannerCarrusel[] = [];
  bannerOfertasUrl: string = '';
  
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

  private carouselInstance: any = null;
  private bannerListener: any;

  constructor(
    private router: Router, 
    private productService: ProductService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.cargarOfertasDestacadas();
    this.cargarBannerOfertas();
    this.cargarBannersCarrusel();

    // Escuchar evento de actualización de banners
    this.bannerListener = () => {
      console.log('🔄 Evento bannerActualizado recibido');
      this.cargarBannerOfertas();
      this.cargarBannersCarrusel();
    };
    window.addEventListener('bannerActualizado', this.bannerListener);
  }

  ngOnDestroy() {
    // Limpiar listener
    if (this.bannerListener) {
      window.removeEventListener('bannerActualizado', this.bannerListener);
    }
    
    // Destruir instancia del carrusel
    if (this.carouselInstance) {
      this.carouselInstance.dispose();
    }
  }

  ngAfterViewInit() {
    // Observador para el video principal
    if (this.mainVideo) {
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
        { threshold: 0.5 }
      );
      observer.observe(this.mainVideo.nativeElement);
    }
  }

  /**
   * ✅ Cargar banners del carrusel
   */
  cargarBannersCarrusel() {
    const timestamp = new Date().getTime();
    this.http.get<BannerResponse>(
      `https://backend-dinsac-hlf0.onrender.com/banner?tipo=carrusel&_=${timestamp}`
    ).subscribe({
      next: (res) => {
        console.log('🎠 Response completa del carrusel:', res);
        
        // ✅ CLAVE: Acceder a res.imagenes (no directamente a res)
        if (res.success && res.imagenes && res.imagenes.length > 0) {
          // Ordenar por orden
          this.bannersPrincipal = res.imagenes.sort((a, b) => a.orden - b.orden);
          console.log('✅ Banners cargados:', this.bannersPrincipal);
          
          // Reinicializar carrusel de Bootstrap después de actualizar datos
          this.inicializarCarrusel();
        } else {
          console.warn('⚠️ No hay banners en el carrusel');
          this.bannersPrincipal = [];
        }
      },
      error: (err) => {
        console.error('❌ Error cargando banners del carrusel:', err);
        this.bannersPrincipal = [];
      }
    });
  }

  /**
   * ✅ Inicializar carrusel de Bootstrap
   */
  private inicializarCarrusel() {
    setTimeout(() => {
      const carouselEl = document.getElementById('carouselMain');
      if (carouselEl && this.bannersPrincipal.length > 0) {
        // Destruir instancia previa si existe
        if (this.carouselInstance) {
          this.carouselInstance.dispose();
        }
        
        // Crear nueva instancia
        this.carouselInstance = new bootstrap.Carousel(carouselEl, { 
          interval: 3000, 
          ride: 'carousel',
          wrap: true
        });
        
        console.log('✅ Carrusel inicializado');
      }
    }, 100);
  }

  /**
   * ✅ Cargar banner de ofertas
   */
  cargarBannerOfertas() {
    const timestamp = new Date().getTime();
    this.http.get<BannerIndividualResponse>(
      `https://backend-dinsac-hlf0.onrender.com/banner?tipo=ofertasHome&_=${timestamp}`
    ).subscribe({
      next: (res) => {
        console.log('🏷️ Response del banner ofertas:', res);
        
        if (res.success && res.image) {
          this.bannerOfertasUrl = res.image;
          console.log('✅ Banner ofertas cargado');
        } else {
          console.warn('⚠️ No hay banner de ofertas');
          this.bannerOfertasUrl = '';
        }
      },
      error: (err) => {
        console.error('❌ Error cargando banner ofertas home:', err);
        this.bannerOfertasUrl = '';
      }
    });
  }

  /**
   * Cargar productos destacados desde el servicio
   */
  cargarOfertasDestacadas() {
    this.productService.getProductsByEstado('Oferta').subscribe({
      next: (productos) => {
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

  /**
   * Ir a página de ofertas
   */
  irAOfertas() {
    this.router.navigate(['/ofertas']);
  }
  /**
 * TrackBy para optimizar renderizado
 */
trackByBanner(index: number, banner: BannerCarrusel): string {
  return banner.id;
}
}