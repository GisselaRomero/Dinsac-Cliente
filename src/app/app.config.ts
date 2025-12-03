import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

// Componentes principales
import { HomeComponent } from './components/home/home.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { CotizarComponent } from './components/cotizar/cotizar.component';
import { CategoriaProductosComponent } from './components/categorias/categoria-productos/categoria-productos.component';
import { ProductoDetalleComponent } from './components/categorias/categoria-productos/producto-detalle/producto-detalle.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { LoginComponent } from './components/login/login.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { ChatbotPruebaComponent } from './components/chatbot-prueba/chatbot-prueba.component';
import { HistorialComponent } from './components/historial/historial.component';
import { ChatClienteComponent } from './components/chat-cliente/chat-cliente.component';

export const routes = [
  { path: '', component: HomeComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'contactenos', component: ContactenosComponent },
  { path: 'ubicacion', component: UbicacionComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'cotizar', component: CotizarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'chatbot-prueba', component: ChatbotPruebaComponent },
  { path: 'producto-detalle/:id', component: ProductoDetalleComponent },
  { path: 'categoria-productos/:nombre', component: CategoriaProductosComponent },
  { path: 'historial', component: HistorialComponent },
  { path: 'chat-cliente', component: ChatClienteComponent },


  // Ruta lazy load para videos
  {
    path: 'videos',
    loadComponent: () =>
      import('./components/videos-page/videos-page.component').then(m => m.VideosPageComponent),
  },
  
  // Redirección por defecto
  { path: '**', redirectTo: '' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient()
  ]
};

// Configuración de PayPal
export const PAYPAL_CONFIG = {
  // Usar 'sandbox' para desarrollo, 'production' para producción
  environment: 'sandbox',
  // Tu Client ID de PayPal
  clientId: 'AekIRKTcbtQpQbePs5TiZDOpxDbQ6vt9uoIshP5YJOgErxenuoWroQhYKvIn6Tv7EbIx0UCeroNUA8SH',
  // Moneda que vas a usar
  currency: 'USD',
  // Configuraciones adicionales
  locale: 'es-PE'
};