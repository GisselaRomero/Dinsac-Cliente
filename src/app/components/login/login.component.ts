import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogiclienteService } from '../../services/logicliente.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  registroData = {
    nombre: '',
    email: '',
    password: '',
    telefono: '',
    direccion: ''
  };

  loginData = {
    email: '',
    password: ''
  };

  constructor(private logiclienteService: LogiclienteService) {}

  ngAfterViewInit(): void {
    const signUpButton = document.getElementById('signUp')!;
    const signInButton = document.getElementById('signIn')!;
    const container = document.getElementById('container')!;

    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });
  }

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

login() {
  this.logiclienteService.login(this.loginData).subscribe({
    next: (res: any) => {
      if (res.success && res.cliente && res.cliente._id) {
        localStorage.setItem('usuario_logueado', 'true');
        localStorage.setItem('usuario_id', res.cliente._id);  // 👈 Guardar el ID real
        localStorage.setItem('usuario_email', res.cliente.email);
localStorage.setItem('usuario_nombre', res.cliente.nombre);

        alert('✅ Login exitoso');
        console.log('Cliente logueado:', res.cliente);
      } else {
        alert('❌ Error: respuesta inválida del servidor');
      }
    },
    error: (err) => {
      alert('❌ Error al iniciar sesión: ' + err.error.message);
      console.error(err);
    }
  });
}





}
