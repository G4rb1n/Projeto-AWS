import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh">
      <button (click)="login()">Entrar com Keycloak</button>
    </div>
  `
})
export class LoginComponent {
  constructor(private keycloak: KeycloakService, private router: Router) {
    if (this.keycloak.isLoggedIn()) {
      this.router.navigate(['/produtos']);
    } else {
      this.keycloak.login();
    }
  }

  login() {
    this.keycloak.login();
  }
}