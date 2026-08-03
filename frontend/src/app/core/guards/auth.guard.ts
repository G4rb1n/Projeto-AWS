import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const authGuard: CanActivateFn = async (route, state) => {
  const keycloak = inject(KeycloakService);
  const isLoggedIn = keycloak.isLoggedIn();

  if (isLoggedIn) {
    return true;
  }

  await keycloak.login({ redirectUri: window.location.origin + state.url });
  return false;
};