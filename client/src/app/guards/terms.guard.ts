import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class termsGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const accepted = localStorage.getItem('termsAccepted') === 'true';

    if (!accepted) {
      this.router.navigateByUrl('/terms');
      return false;
    }

    return true;
  }
}