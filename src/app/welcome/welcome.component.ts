import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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

  constructor(
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

  // logout(): void {
  //   this.authService.signOut();
  //   if (this.isBrowser) {
  //     localStorage.removeItem('user');
  //   }
  //   this.router.navigate(['/login']);
  // }

  logout(): void {
    // Primero limpiamos el localStorage
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('jwt');
    }
    
    // Luego hacemos el signOut, pero sin redirección inmediata
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
  }
}