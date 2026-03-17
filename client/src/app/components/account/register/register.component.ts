import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterUser } from '../../../models/register-user.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatRadioModule } from '@angular/material/radio';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule, ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatRadioModule, MatInputModule, MatDatepickerModule, MatStepperModule, RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, OnDestroy {
  accountService = inject(AccountService);

  fB = inject(FormBuilder);
  subscribedRegisterUser: Subscription | undefined;
  errors: string[] | undefined;

  minDate = new Date();
  maxDate = new Date();

  passwordsNotMatch: boolean | undefined;

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 99, 0, 1);
    this.maxDate = new Date(currentYear - 18, 0, 1);
  }

  ngOnDestroy(): void {
    this.subscribedRegisterUser?.unsubscribe();
  }

  //#region registerFg 
  registerFg = this.fB.group({
    genderCtrl: ['female', [Validators.required]],
    emailCtrl: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^([\w\.\-]+)@([\w\-]+)((\.(\w){2,5})+)$/)]],
    userNameCtrl: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    passwordCtrl: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    confirmPasswordCtrl: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    dateOfBirthCtrl: ['', [Validators.required]],
  });

  get EmailCtrl(): FormControl {
    return this.registerFg.get('emailCtrl') as FormControl;
  }

  get UserNameCtrl(): FormControl {
    return this.registerFg.get('userNameCtrl') as FormControl;
  }

  get GenderCtrl(): FormControl {
    return this.registerFg.get('genderCtrl') as FormControl;
  }


  get PasswordCtrl(): FormControl {
    return this.registerFg.get('passwordCtrl') as FormControl;
  }

  get ConfirmPasswordCtrl(): FormControl {
    return this.registerFg.get('confirmPasswordCtrl') as FormControl;
  }

  get DateOfBirthCtrl(): FormControl {
    return this.registerFg.get('dateOfBirthCtrl') as FormControl;
  }
  //#endregion

  register(): void {
    const dob: string | undefined = this.getDateOnly(this.DateOfBirthCtrl.value);

    if (this.PasswordCtrl.value === this.ConfirmPasswordCtrl.value) {
      let user: RegisterUser = {
        email: this.EmailCtrl.value,
        userName: this.UserNameCtrl.value,
        password: this.PasswordCtrl.value,
        gender: this.GenderCtrl.value,
        confirmPassword: this.ConfirmPasswordCtrl.value,
        dateOfBirth: dob,
      }

      this.subscribedRegisterUser = this.accountService.register(user).subscribe({
        next: (res) => console.log(res),
        error: (err: HttpErrorResponse) => {
          if (err.error.errors) {
            this.errors = err.error.errors
          }
        }
      })
    }
    else {
      this.passwordsNotMatch = true;
    }
  }

  getDateOnly(dob: string | null): string | undefined {
    if (!dob) return undefined;

    let theDob: Date = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes() - theDob.getTimezoneOffset())).toISOString().slice(0, 10);
    // gets the first 10 chars from this date YYYY-MM-DDTHH:mm:ss.sssZ the output is YYYY-MM-DD
  }

  // sliceString(): void {
  //   let fullName: string = "Amirm safa"

  //   let name: string = fullName.slice(0, 5);

  //   console.log(name);
  // }

  // getYear(): void {
  //   let dobString = this.DateOfBirthCtrl.value;

  //   let dateObj = new Date(dobString);

  //   let dateObjUtc = dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());

  //   let isoString = dateObj.toISOString();

  //   let dateOnly = isoString.slice(0, 10);

  //   console.log('1', dobString);
  //   console.log('2', dateObj);
  //   console.log('3', dateObjUtc);
  //   console.log('4', isoString);
  //   console.log('5', dateOnly);
  // }
}