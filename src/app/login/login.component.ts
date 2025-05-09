import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule]
})
export class LoginComponent implements OnInit {
  isBrowser: boolean;
  constructor(
    private authService: SocialAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
    
    ngOnInit(): void {
      this.authService.authState.subscribe((user) => {
        if (user) {
          if (this.isBrowser) {
            localStorage.setItem('user', JSON.stringify(user));
          }
          this.router.navigate(['/welcome']);
        }
      });
    }
  }