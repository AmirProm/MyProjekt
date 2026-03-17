import { Component, inject, OnInit } from '@angular/core';
import { Member } from '../../../models/member.model';
import { MemberService } from '../../../services/member.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { IntlModule } from "angular-ecmascript-intl";

@Component({
  selector: 'app-member-details',
  standalone: true,
  imports: [
    MatIconModule, MatTabsModule, IntlModule
  ],
  templateUrl: './member-details.component.html',
  styleUrl: './member-details.component.scss'
})
export class MemberDetailsComponent implements OnInit {
  private _memberService = inject(MemberService);
  private _snack = inject(MatSnackBar);
  private _route = inject(ActivatedRoute);

  member: Member | undefined;
  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.getMember();
  }

  getMember(): void {
    const userName: string | null = this._route.snapshot.paramMap.get('userName');

    if (userName) {
      this._memberService.getByUserName(userName).pipe(take(1)).subscribe({
        next: (res) => {
          if (res) {
            this.member = res;
          }
        }
      })
    }
  }

  // متغیری برای ذخیره نام تب فعال (به صورت پیش‌فرض روی photos تنظیم شده)
  activeTab: string = 'photos';

  // متدی که هنگام کلیک روی هر دکمه در HTML صدا زده می‌شود
  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }
  
}
