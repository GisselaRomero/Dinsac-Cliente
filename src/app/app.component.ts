import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importa RouterOutlet para la navegación
import { NavbarComponent } from './components/navbar/navbar.component'; // Componente Navbar
import { FooterComponent } from './components/footer/footer.component'; // Componente Footer

@Component({
  selector: 'app-root',
  standalone: true, // Componente autónomo
  styleUrls: ['./app.component.scss'], 
  imports: [RouterOutlet, NavbarComponent, FooterComponent], // Componentes a importar
  templateUrl: './app.component.html', // Archivo de plantilla
})
export class AppComponent {}
