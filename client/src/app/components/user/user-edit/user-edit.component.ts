import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { environment } from '../../../../environments/environment.development';
import { Member } from '../../../models/member.model';
import { LoggedIn } from '../../../models/logged-in.model';
import { MemberService } from '../../../services/member.service';
import { take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserUpdate } from '../../../models/user-update.model';
import { ApiResponse } from '../../../models/helpers/apiResponse.model';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatCardModule, MatTabsModule, CommonModule, PhotoEditorComponent, MatButtonModule,
    MatFormFieldModule, MatInputModule,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.scss'
})
export class UserEditComponent implements OnInit {
  private _platformId = inject(PLATFORM_ID);
  private _memberService = inject(MemberService);
  private _userService = inject(UserService);
  private _fB = inject(FormBuilder);
  private _snackbar = inject(MatSnackBar);

  readonly maxTextAreaChars: number = 1000;
  readonly minInputChars: number = 2;
  readonly maxInputChars: number = 30;

  apiUrl = environment.apiUrl;
  member: Member | undefined;

  userEditFg = this._fB.group({
    introductionCtrl: ['', [Validators.maxLength(this.maxTextAreaChars)]],
    lookingForCtrl: ['', [Validators.maxLength(this.maxTextAreaChars)]],
    interestsCtrl: ['', [Validators.maxLength(this.maxTextAreaChars)]],
    cityCtrl: ['', [Validators.minLength(this.minInputChars), Validators.maxLength(this.maxInputChars)]],
    countryCtrl: ['', [Validators.minLength(this.minInputChars), Validators.maxLength(this.maxInputChars)]]
  });

  ngOnInit(): void {
    this.getMember();
  }

  getMember(): void {
    if (isPlatformBrowser(this._platformId)) {
      const loggedInUserStr: string | null = localStorage.getItem('loggedInUser');

      if (loggedInUserStr) {
        const loggedInUser: LoggedIn = JSON.parse(loggedInUserStr);

        this._memberService.getByUserName(loggedInUser.userName).pipe(take(1)).subscribe({
          next: (res) => {
            this.member = res;

            this.initialControllerValues(res!);
          }
        })
      }
    }
  }

  get IntroductionCtrl(): FormControl {
    return this.userEditFg.get('introductionCtrl') as FormControl;
  }
  get LookingForCtrl(): FormControl {
    return this.userEditFg.get('lookingForCtrl') as FormControl;
  }
  get InterestsCtrl(): FormControl {
    return this.userEditFg.get('interestsCtrl') as FormControl;
  }
  get CityCtrl(): FormControl {
    return this.userEditFg.get('cityCtrl') as FormControl;
  }
  get CountryCtrl(): FormControl {
    return this.userEditFg.get('countryCtrl') as FormControl;
  }

  initialControllerValues(member: Member) {
    this.IntroductionCtrl.setValue(member.introduction);
    this.LookingForCtrl.setValue(member.lookingFor);
    this.InterestsCtrl.setValue(member.interests);
    this.CityCtrl.setValue(member.city?.toUpperCase());
    this.CountryCtrl.setValue(member.country.toUpperCase());
  }

  updateUser(): void {
    if (this.member) {
      let updateUser: UserUpdate = {
        introduction: this.IntroductionCtrl.value,
        lookingFor: this.LookingForCtrl.value,
        interests: this.InterestsCtrl.value,
        city: this.CityCtrl.value,
        country: this.CountryCtrl.value
      }

      this._userService.updateUser(updateUser).pipe(take(1))
      .subscribe({
        next: (res: ApiResponse) => {
          if (res.message) {
            this._snackbar.open(res.message, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 7000
            })
          }

          this.userEditFg.markAsPristine();
        }
      })
    }
  }
}
