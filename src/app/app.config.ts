import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch, HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './Components/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideHttpClient(
    withInterceptors([
      (req, next) => {
        console.log('Interceptor:', req);
        return next(req);
      },authInterceptor
    ]),withFetch(),
  ), provideClientHydration(withEventReplay())]
};
