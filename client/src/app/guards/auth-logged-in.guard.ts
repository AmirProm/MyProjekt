import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';

export const authLoggedInGuard: CanActivateFn = (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const snackbar = inject(MatSnackBar);

  if (isPlatformBrowser(platformId)) {
    const loggedInUserStr: string | null = localStorage.getItem('loggedInUser');

    if (loggedInUserStr) {
      snackbar.open('You are already logged in.', 'Close', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 7000
      });

      router.navigateByUrl('members/member-list')

      return false; // Block the component
    }
  }

  return true; // Open the component
};
