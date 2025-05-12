import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { SocialAuthServiceConfig, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1071917637623-020l5qbcihpj4u7tdv411cov4cfh530c.apps.googleusercontent.com',
              {
                oneTapEnabled: false, // Deshabilitar One Tap para evitar problemas
                scopes: 'email profile'
              }
            )
          }
        ],
        onError: (err) => {
          console.error('Error en autenticación social:', err);
        }
      } as SocialAuthServiceConfig
    }
  ]
};