// import { HttpClient, HttpParams } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { Member } from '../models/member.model';
// import { Observable } from 'rxjs';
// import { environment } from '../../environments/environment.development';
// import { PaginationParams } from '../models/helpers/paginationParams.model';
// import { PaginatedResult } from '../models/helpers/paginatedResult';
// import { PaginationHandler } from '../extensions/paginationHandler';
// import { MemberParams } from '../models/member-params';

// @Injectable({
//   providedIn: 'root'
// })
// export class MemberService {
//   http = inject(HttpClient);

//   private readonly _baseApiUrl: string = environment.apiUrl + 'api/member/';
//   private _paginationHandler = new PaginationHandler();

//   //     let params = new HttpParams();

//   //     params = params.append('pageSize', paginationParams.pageSize);
//   //     params = params.append('pageNumber', paginationParams.pageNumber);

//   //     return this._paginationHandler.getPaginatedResult<Member[]>(this._baseApiUrl + 'get-all', params);
//   //   }

//   getAllMembers(memberParams: MemberParams): Observable<PaginatedResult<Member[]>> {
//     let params = new HttpParams();

//     params = params.append('search', memberParams.search);
//     params = params.append('pageSize', memberParams.pageSize);
//     params = params.append('pageNumber', memberParams.pageNumber);
//     params = params.append('orderBy', memberParams.orderBy);
//     params = params.append('minAge', memberParams.minAge);
//     params = params.append('maxAge', memberParams.maxAge);


//     return this._paginationHandler.getPaginatedResult<Member[]>(this._baseApiUrl + 'get-all', params);
//   }

//   getByUserName(userNameInput: string): Observable<Member | undefined> {
//     return this.http.get<Member>(this._baseApiUrl + 'get-by-username/' + userNameInput);
//   }

//   private getHttpParams(memberParams: MemberParams): HttpParams {
//     let params = new HttpParams();

//     if (memberParams) {
//       params = params.append('search', memberParams.search);
//       params = params.append('pageSize', memberParams.pageSize);
//       params = params.append('pageNumber', memberParams.pageNumber);
//       params = params.append('orderBy', memberParams.orderBy);
//       params = params.append('minAge', memberParams.minAge);
//       params = params.append('maxAge', memberParams.maxAge);
//     }

//     return params;
//   }
// }

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Member } from '../models/member.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PaginationParams } from '../models/helpers/paginationParams.model';
import { PaginatedResult } from '../models/helpers/paginatedResult';
import { PaginationHandler } from '../extensions/paginationHandler';
import { MemberParams } from '../models/helpers/member-params';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  http = inject(HttpClient);

  private readonly _baseApiUrl: string = environment.apiUrl + 'api/member/';
  private _paginationHandler = new PaginationHandler();

  getAllMembers(memberParams: MemberParams): Observable<PaginatedResult<Member[]>> {
    const params = this.getHttpParams(memberParams)
    
    return this._paginationHandler.getPaginatedResult<Member[]>(this._baseApiUrl + 'get-all', params);
  }

  getByUserName(userNameInput: string): Observable<Member | undefined> {
    return this.http.get<Member>(this._baseApiUrl + 'get-by-username/' + userNameInput);
  }

  private getHttpParams(memberParams: MemberParams): HttpParams {
    let params = new HttpParams();

    if (memberParams) {
      params = params.append('search', memberParams.search);
      params = params.append('pageSize', memberParams.pageSize);
      params = params.append('pageNumber', memberParams.pageNumber);
      params = params.append('orderBy', memberParams.orderBy);
      params = params.append('minAge', memberParams.minAge);
      params = params.append('maxAge', memberParams.maxAge);
    }

    return params;
  }
}