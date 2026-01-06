import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,

  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VideosHomeComponent } from '../videos-home/videos-home.component';
import { CotizarComponent } from '../cotizar/cotizar.component';
import { RouterModule, Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../footer/footer.component';

declare var bootstrap: any;
let homeYaCargado = false;

/* ===================== INTERFACES ===================== */
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
      FooterComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('mainVideo', { static: false })
  mainVideo!: ElementRef<HTMLVideoElement>;

  /* ===================== ESTADO ===================== */
  loadingHome = true;
  isContactMenuOpen = false;

  /* ===================== DATA ===================== */
  bannersPrincipal: BannerCarrusel[] = [];
  bannerOfertasUrl: string = '';
  ofertasDestacadas: Product[] = [];

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

  /* ===================== INIT ===================== */
ngOnInit(): void {
  this.loadingHome = !homeYaCargado;

  this.cargarOfertasDestacadas();
  this.cargarBannerOfertas();
  this.cargarBannersCarrusel();

  this.bannerListener = () => {
    this.cargarBannerOfertas();
    this.cargarBannersCarrusel();
  };

  window.addEventListener('bannerActualizado', this.bannerListener);
}


  ngOnDestroy(): void {
    if (this.bannerListener) {
      window.removeEventListener('bannerActualizado', this.bannerListener);
    }

    if (this.carouselInstance) {
      this.carouselInstance.dispose();
    }
  }

  ngAfterViewInit(): void {
    if (!this.mainVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const video = this.mainVideo.nativeElement;
          entry.isIntersecting ? video.play() : video.pause();
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(this.mainVideo.nativeElement);
  }

  /* ===================== BANNERS ===================== */
  cargarBannersCarrusel() {
    const timestamp = new Date().getTime();

    this.http.get<BannerResponse>(
      `https://backend-dinsac-hlf0.onrender.com/banner?tipo=carrusel&_=${timestamp}`
    ).subscribe({
      next: (res) => {
        if (res.success && res.imagenes?.length) {
          this.bannersPrincipal = res.imagenes.sort(
            (a, b) => a.orden - b.orden
          );
          this.inicializarCarrusel();
        } else {
          this.bannersPrincipal = [];
        }
         this.loadingHome = false;     // ✅ AQUÍ
  homeYaCargado = true;         // ✅ Y AQUÍ
},
      
     error: () => {
  this.bannersPrincipal = [];
  this.loadingHome = false;
}

    });
  }

  private inicializarCarrusel() {
    setTimeout(() => {
      const el = document.getElementById('carouselMain');
      if (!el || !this.bannersPrincipal.length) return;

      this.carouselInstance?.dispose();
      this.carouselInstance = new bootstrap.Carousel(el, {
        interval: 3000,
        ride: 'carousel',
        wrap: true
      });
    }, 100);
  }

  cargarBannerOfertas() {
    const timestamp = new Date().getTime();

    this.http.get<BannerIndividualResponse>(
      `https://backend-dinsac-hlf0.onrender.com/banner?tipo=ofertasHome&_=${timestamp}`
    ).subscribe({
      next: (res) => {
        this.bannerOfertasUrl = res.success ? res.image : '';
      },
      error: () => this.bannerOfertasUrl = ''
    });
  }

  cargarOfertasDestacadas() {
    this.productService.getProductsByEstado('Oferta').subscribe({
      next: (productos) => {
        this.ofertasDestacadas = productos.slice(0, 8);
      }
    });
  }

  /* ===================== UI ===================== */
  toggleContactMenu() {
    this.isContactMenuOpen = !this.isContactMenuOpen;
  }

  closeContactMenu() {
    this.isContactMenuOpen = false;
  }

  verDetalles(producto: Product): void {
    const id = producto.id ?? producto._id;
    if (id) {
      this.router.navigate(['/producto-detalle', id]);
    }
  }

  irACotizar() {
    this.router.navigate(['/cotizar']);
  }

  irAOfertas() {
    this.router.navigate(['/ofertas']);
  }

  scrollToCotizacion() {
    document.querySelector('.cotizacion-hero')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  trackByBanner(index: number, banner: BannerCarrusel): string {
    return banner.id;
  }
}
