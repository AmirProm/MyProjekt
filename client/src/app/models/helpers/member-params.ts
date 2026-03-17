import {PaginationParams} from './paginationParams.model';

export class MemberParams extends PaginationParams {
  orderBy: string =  'lastActive';
  search: string = '';
  minAge: number = 18;
  maxAge: number = 99;
}
