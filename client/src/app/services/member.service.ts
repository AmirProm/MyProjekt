import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Member } from '../models/member.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PaginationParams } from '../models/helpers/paginationParams.model';
import { PaginatedResult } from '../models/helpers/paginatedResult';
import { PaginationHandler } from '../extensions/paginationHandler';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  http = inject(HttpClient);

  private readonly _baseApiUrl: string = environment.apiUrl + 'api/member/';
  private _paginationHandler = new PaginationHandler();

  getAllMembers(paginationParams: PaginationParams): Observable<PaginatedResult<Member[]>> {
    let params = new HttpParams();

    params = params.append('pageSize', paginationParams.pageSize);
    params = params.append('pageNumber', paginationParams.pageNumber);

    return this._paginationHandler.getPaginatedResult<Member[]>(this._baseApiUrl + 'get-all', params);
  }

  getByUserName(userNameInput: string): Observable<Member | undefined> {
    return this.http.get<Member>(this._baseApiUrl + 'get-by-username/' + userNameInput);
  }
}