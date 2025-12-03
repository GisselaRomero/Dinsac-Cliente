import { Component } from '@angular/core';
import { LogiclienteService } from '../../services/logicliente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [FormsModule, CommonModule],
  standalone: true,
})
export class FooterComponent {
   year = new Date().getFullYear();
  registroData = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  };

  constructor(private logiclienteService: LogiclienteService) {}

  registrar() {
    this.logiclienteService.registrar(this.registroData).subscribe({
      next: (res) => {
        alert('✅ Registro exitoso');
        console.log(res);
      },
      error: (err) => {
        alert('❌ Error al registrar: ' + err.error.message);
        console.error(err);
      }
      
    });
  }
}
