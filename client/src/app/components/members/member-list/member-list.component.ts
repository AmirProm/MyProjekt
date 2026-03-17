import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {Member} from '../../../models/member.model';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MemberService} from '../../../services/member.service';
import {Observable} from 'rxjs';
import {MemberCardComponent} from '../member-card/member-card.component';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {PaginationParams} from '../../../models/helpers/paginationParams.model';
import {PaginatedResult} from '../../../models/helpers/paginatedResult';
import {Pagination} from '../../../models/helpers/pagination';
import {MemberParams} from '../../../models/helpers/member-params';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule, MatIconModule, MemberCardComponent,
    MatPaginatorModule, MatFormFieldModule, MatSelectModule, MatSliderModule, ReactiveFormsModule, FormsModule, MatInputModule, MatButtonModule,
  ],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.scss'
})
export class MemberListComponent {
  private _fB = inject(FormBuilder);
  memberService = inject(MemberService);
  members: Member[] | undefined;
  memberParams: MemberParams | undefined;
  pageSizeOptions = [5, 10, 25];
  pageEvent: PageEvent | undefined;
  pagination: Pagination | undefined;
  orderOptions: string[] = ['lastActive', 'created', 'age'];
  orderOptionsView: string[] = ['Last Active', 'Created', 'Age'];
  readonly minAge: number = 18;
  readonly maxAge: number = 99;

  filterFg = this._fB.group({
    searchCtrl: ['', []],
    orderByCtrl: ['lastActive'],
    minAgeCtrl: [this.minAge, []], // magic numbers
    maxAgeCtrl: [this.maxAge, []],
  });

  get SearchCtrl(): FormControl {
    return this.filterFg.get('searchCtrl') as FormControl;
  }

  get OrderByCtrl(): FormControl {
    return this.filterFg.get('orderByCtrl') as FormControl;
  }

  get MinAgeCtrl(): FormControl {
    return this.filterFg.get('minAgeCtrl') as FormControl;
  }

  get MaxAgeCtrl(): FormControl {
    return this.filterFg.get('maxAgeCtrl') as FormControl;
  }

  ngOnInit(): void {
    this.memberParams = new MemberParams();

    this.getAll();
  }

  getAll(): void {
    if (this.memberParams) {
      console.log(this.memberParams)
      this.memberService.getAllMembers(this.memberParams).subscribe({
        next: (response: PaginatedResult<Member[]>) => {
          if (response.body && response.pagination) {
            this.members = response.body;
            this.pagination = response.pagination;
          }
        }
      })
    }
  }

  handlePageEvent(e: PageEvent): void {
    if (this.memberParams) {
      if (e.pageSize !== this.memberParams.pageSize)
        e.pageIndex = 0;

      this.pageEvent = e;
      this.memberParams.pageSize = e.pageSize;
      this.memberParams.pageNumber = e.pageIndex + 1;

      this.getAll();
    }
  }

  updateMemberParams(): void {
    if (this.memberParams) {
      this.memberParams.orderBy = this.OrderByCtrl.value;
      this.memberParams.search = this.SearchCtrl.value;
      this.memberParams.minAge = this.MinAgeCtrl.value;
      this.memberParams.maxAge = this.MaxAgeCtrl.value;
    }
  }

  reset(): void {
    this.OrderByCtrl.setValue('lastActive');
    this.SearchCtrl.reset();
    this.MinAgeCtrl.setValue(this.minAge);
    this.MaxAgeCtrl.setValue(this.maxAge);
  }

  onCustomPageChange(newPageNumber: number) {
  if (this.memberParams) {
    this.memberParams.pageNumber = newPageNumber;
    // در اینجا متدی که اطلاعات را از API می‌گیرد صدا بزنید
    this.getAll(); 
  }
}

// متدی برای زمانی که کاربر تعداد آیتم در هر صفحه را تغییر می‌دهد
onCustomPageSizeChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const newSize = Number(selectElement.value);
  
  if (this.memberParams) {
    this.memberParams.pageSize = newSize;
    // وقتی تعداد آیتم در صفحه تغییر می‌کند، منطقی است که به صفحه اول برگردیم
    this.memberParams.pageNumber = 1; 
    this.getAll();
  }
}


}
