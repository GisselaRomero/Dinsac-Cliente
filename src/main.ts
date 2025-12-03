import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    // Configuración básica de Angular
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router con las rutas
    provideRouter(routes),
    
    // Cliente HTTP
    provideHttpClient(),
    
    // Google Maps (para tu componente de ubicación)
    importProvidersFrom(GoogleMapsModule),
    
    // Hidratación para SSR (opcional)
    provideClientHydration(withEventReplay())
  ]
}).catch((err) => console.error('Error iniciando la aplicación:', err));