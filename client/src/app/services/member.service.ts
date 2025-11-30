import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Member } from '../models/member.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  http = inject(HttpClient);

  private readonly _baseApiUrl: string = environment.apiUrl + 'api/member/';
  
  getByUserName(userNameInput: string): Observable<Member | undefined> {
    return this.http.get<Member>(this._baseApiUrl + 'get-by-username/' + userNameInput);
  }
}