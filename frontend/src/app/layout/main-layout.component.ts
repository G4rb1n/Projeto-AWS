import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
    <div class="d-flex flex-column vh-100">
      <app-header *ngIf="isBrowser && isAuthenticated()"></app-header>
      <main [class.mt-4]="isBrowser && isAuthenticated()" class="flex-fill container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class MainLayoutComponent {
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private keycloak: KeycloakService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  isAuthenticated(): boolean {
    return this.isBrowser ? this.keycloak.isLoggedIn() : false;
  }
}