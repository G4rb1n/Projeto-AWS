import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private keycloak: KeycloakService) {}

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout(window.location.origin);
  }

  getToken(): string | null {
    const token = this.keycloak.getKeycloakInstance().token;
    return token ?? null;
  }

  isLogado(): boolean {
    return this.keycloak.isLoggedIn();
  }

  getRoles(): string[] {
    return this.keycloak.getUserRoles();
  }

  hasRole(role: string): boolean {
    return this.keycloak.isUserInRole(role);
  }

  isGerente(): boolean {
    return this.hasRole('GERENTE');
  }

  isFuncionario(): boolean {
    return this.hasRole('FUNCIONARIO');
  }
}