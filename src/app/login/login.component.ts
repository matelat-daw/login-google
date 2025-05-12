import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule]
})
export class LoginComponent implements OnInit {
  isBrowser: boolean;
  loginError: string = '';
  
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
    
  ngOnInit(): void {
    // Solo inicializar la autenticación de Google en el navegador
    if (this.isBrowser) {
      this.authService.authState.subscribe((user) => {
        if (user) {
          // Almacenar solo la información necesaria, no todo el objeto usuario
          localStorage.setItem('userToken', user.idToken);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userEmail', user.email);
          
          this.verifyGoogleUserServerSide(user.idToken);
        }
      });
    }
  }

  verifyGoogleUserServerSide(token: string): void {
    // Usar headers para enviar el token de forma segura
    // const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Enviar el token en el cuerpo de la petición en lugar de en la URL
    // this.http.get<any>('https://88.25.64.124/api/Account/GoogleLogin/' + token)
    this.http.get<any>('https://localhost:7035/api/Account/GoogleLogin/' + token)
    .subscribe({
      next: (response) => {
        console.log('Inicio de Sesión con Google Exitoso:', response);
        this.router.navigate(['/welcome']);
      },
      error: (error) => {
        console.error('Error al Iniciar Sesión:', error);
        this.loginError = 'Error al verificar credenciales. Por favor, intente nuevamente.';
      }
    });
  }
}
