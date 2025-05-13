import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  isProcessingLogin: boolean = false;
  
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
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        this.router.navigate(['/welcome']);
        return;
      }

      this.authService.authState.subscribe((user) => {
        if (user && !this.isProcessingLogin) {
          this.isProcessingLogin = true;
          // Almacenar solo la información necesaria, no todo el objeto usuario
          localStorage.setItem('userToken', user.idToken);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userEmail', user.email);

          localStorage.setItem('user', JSON.stringify({
            name: user.name,
            email: user.email,
            photoUrl: user.photoUrl
          }));
          
          this.verifyGoogleUserServerSide(user.idToken);
        }
      });
    }
  }

  verifyGoogleUserServerSide(token: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }),
      withCredentials: false // Intenta sin credenciales
    };

    this.http.post<any>('https://88.25.64.124/api/Account/GoogleLogin', { token }, httpOptions)
    // this.http.post<any>('https://localhost:7035/api/Account/GoogleLogin', { token })
      .subscribe({
        next: (response) => {
          console.log('Inicio de Sesión con Google Exitoso:', response);
          // Guarda el token JWT recibido
          localStorage.setItem('jwt', response.Token);
          // Redirige al usuario a la página de bienvenida
          this.router.navigate(['/welcome']);
          this.isProcessingLogin = false;
        },
        error: (error) => {
          console.error('Error al Iniciar Sesión:', error);
          this.loginError = 'Error al verificar credenciales. Por favor, intente nuevamente.';
          this.isProcessingLogin = false;
          // Limpiar datos almacenados en caso de error
          localStorage.removeItem('userToken');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('user');
        }
      });
  }
}
