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

  // 🔵 NUEVO: referencia al contenedor
  private container!: HTMLElement;

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

 togglePanel() {
    const container = document.getElementById('container');
    container?.classList.toggle('right-panel-active');
  }

  constructor(private logiclienteService: LogiclienteService) {}

  ngAfterViewInit(): void {
    const signUpButton = document.getElementById('signUp')!;
    const signInButton = document.getElementById('signIn')!;
    this.container = document.getElementById('container')!;

    signUpButton.addEventListener('click', () => {
      this.container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      this.container.classList.remove('right-panel-active');
    });
  }

  registrar() {
    this.logiclienteService.registrar(this.registroData).subscribe({
      next: (res) => {
        alert('✅ Registro exitoso, ahora inicia sesión');
        console.log(res);

        // 🔵 LIMPIAR FORMULARIO
        this.registroData = {
          nombre: '',
          email: '',
          password: '',
          telefono: '',
          direccion: ''
        };

        // 🔵 VOLVER AUTOMÁTICAMENTE AL LOGIN
        this.container.classList.remove('right-panel-active');
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
          localStorage.setItem('cliente', JSON.stringify(res.cliente));
          localStorage.setItem('usuario_id', res.cliente._id);
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
