import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import Swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
  const keycloak = inject(KeycloakService);
  const router = inject(Router);
  const expectedRole = route.data['expectedRole'];

  if (keycloak.isLoggedIn() && keycloak.isUserInRole(expectedRole)) {
    return true;
  }

  Swal.fire({
    title: 'Acesso negado',
    text: 'Você não tem permissão para acessar esta área.',
    icon: 'error',
    confirmButtonText: 'OK'
  }).then(() => {
    router.navigate(['/produtos']);
  });

  return false;
};