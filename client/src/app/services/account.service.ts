import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { LoggedIn } from '../models/logged-in.model';
import { RegisterUser } from '../models/register-user.model';
import { map, Observable } from 'rxjs';
import { Login } from '../models/login.model';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  http = inject(HttpClient);
  private readonly _baseApiUrl: string = environment.apiUrl + 'api/';
  platformId = inject(PLATFORM_ID);
  router = inject(Router);
  loggedInUserSig = signal<LoggedIn | null>(null);

  // responseSignal = signal<LoggedIn | null>(null);

  register(userInput: RegisterUser): Observable<LoggedIn | null> {
    return this.http.post<LoggedIn>(this._baseApiUrl + 'account/register', userInput).pipe(
      map(res => {
        if (res) {
          this.setCurrentUser(res);

          this.router.navigateByUrl('terms');

          return res;
        }

        return null;
      })
    );

    // let userResponse$: Observable<LoggedIn> =
    //   this.http.post<LoggedIn>(this._baseApiUrl + 'account/register', user);

    // userResponse$.pipe(
    //   map(res => {
    //     this.setCurrentUser(res);

    //     return res;
    //   })
    // );

    // return userResponse$;
  }

  login(userInput: Login): Observable<LoggedIn | null> {
    return this.http.post<LoggedIn>(this._baseApiUrl + 'account/login', userInput).pipe(
      map(res => {
        if (res) {
          this.setCurrentUser(res);

          if (res.roles.includes('admin')) {
            this.router.navigateByUrl('admin');
          }
          else {
            this.router.navigateByUrl('');
          }

          return res;
        }
        return null;
      })
    );

    // let userResponse$: Observable<LoggedIn> =
    //   this.http.post<LoggedIn>(this._baseApiUrl + 'account/login', userInput);

    // userResponse$.pipe(
    //   map(res => {
    //     this.setCurrentUser(res);

    //     return res;
    //   })
    // );

    // return userResponse$;
  }

  authorizeLoggedInUser(): void {
    console.log('ok');

    this.http.get<LoggedIn>(this._baseApiUrl + 'account').subscribe({
      next: (res) => {
        if (res)
          console.log(res);
        this.setCurrentUser(res);
      },
      error: (err) => {
        console.log(err.error);
        this.logout();
      }
    });
  }

  setCurrentUser(loggedIn: LoggedIn): void {
    this.setLoggedInUserRoles(loggedIn);

    this.loggedInUserSig.set(loggedIn);
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('loggedInUser', JSON.stringify(loggedIn));
    }
  }


  setLoggedInUserRoles(loggedInUser: LoggedIn): void {
    loggedInUser.roles = [];

    const roles: string | string[] = JSON.parse(atob(loggedInUser.token.split('.')[1])).role;

    Array.isArray(roles) ? loggedInUser.roles = roles : loggedInUser.roles.push(roles);
  }

  logout(): void {
    this.loggedInUserSig.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }

    this.router.navigateByUrl('account/login');
  }

}