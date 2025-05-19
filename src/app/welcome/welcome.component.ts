import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class WelcomeComponent implements OnInit {
  user: any;
  isBrowser: boolean;
  private readonly apiUrl = 'https://88.24.26.59/api/Account/Logout';

  constructor(
    private http: HttpClient,
    private authService: SocialAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  logout(): void {
    // Primero llamamos a la API para cerrar sesión en el servidor
    this.http.post(this.apiUrl, {})
      .subscribe({
        next: (response) => {
          console.log('Sesión cerrada correctamente en el servidor');
          
          // Después de cerrar sesión en el servidor, limpiamos el localStorage
          if (this.isBrowser) {
            localStorage.removeItem('user');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('jwt');
          }
          
          // Finalmente hacemos el signOut en el cliente
          this.authService.signOut().then(() => {
            // Esperamos un momento antes de redirigir para evitar conflictos
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 100);
          }).catch(error => {
            console.error('Error durante el cierre de sesión:', error);
            // En caso de error, intentamos navegar de todos modos
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          console.error('Error al cerrar sesión en el servidor:', error);
          
          // Aún así, intentamos cerrar sesión en el cliente
          if (this.isBrowser) {
            localStorage.removeItem('user');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('jwt');
          }
          
          this.authService.signOut().then(() => {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 100);
          }).catch(error => {
            console.error('Error durante el cierre de sesión:', error);
            this.router.navigate(['/login']);
          });
        }
      });
  }
}