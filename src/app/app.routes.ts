import { provideRouter } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { ContactenosComponent } from './components/contactenos/contactenos.component';
import { FavoritosComponent } from './components/favoritos/favoritos.component';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { FormsModule } from '@angular/forms';
import { CategoriaProductosComponent } from './components/categorias/categoria-productos/categoria-productos.component';
import { OfertasComponent } from './components/ofertas/ofertas.component';
import { CotizarComponent } from './components/cotizar/cotizar.component';
import { ProductoDetalleComponent } from './components/categorias/categoria-productos/producto-detalle/producto-detalle.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { LoginComponent } from './components/login/login.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { HistorialComponent } from './components/historial/historial.component';
import { ChatClienteComponent } from './components/chat-cliente/chat-cliente.component';


export const routes = [
  { path: '', component: HomeComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'categorias', component: CategoriasComponent },
  { path: 'contactenos', component: ContactenosComponent },
  { path: 'ubicacion', component: UbicacionComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'ofertas', component: OfertasComponent },
  { path: 'favoritos', component: FavoritosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cotizar', component: CotizarComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'producto-detalle/:id', component: ProductoDetalleComponent },
  { path: 'chat-cliente', component: ChatClienteComponent },


  {
    path: 'videos',
    loadComponent: () =>
      import('./components/videos-page/videos-page.component').then(m => m.VideosPageComponent),
  },
  {path: 'categorias', component: CategoriasComponent },
  {path: 'categoria-productos/:nombre',component: CategoriaProductosComponent
  },
];

export const appConfig = {
  imports: [FormsModule],
  providers: [
    provideRouter(routes) // ✅ Aquí estás usando todas tus rutas correctamente
  ]
};
