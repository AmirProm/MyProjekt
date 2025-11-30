import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { Member } from '../../../models/member.model';
import { LoggedIn } from '../../../models/logged-in.model';
import { environment } from '../../../../environments/environment.development';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../../services/account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Photo } from '../../../models/photo.model';
import { UserService } from '../../../services/user.service';
import { ApiResponse } from '../../../models/helpers/apiResponse.model';
import { take } from 'rxjs';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule, MatInputModule, MatCardModule, MatIconModule, FileUploadModule, MatButtonModule
  ],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit {
  @Input('memberInput') member: Member | undefined; // from user-edit
  loggedInUser: LoggedIn | null | undefined;
  // errorGlob: string | undefined;
  apiUrl: string = environment.apiUrl;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  private _accountService = inject(AccountService);
  private _snackBar = inject(MatSnackBar);
  private _userService = inject(UserService);
  numbers: number[] = [1, 2, 3, 4, 5, 6];
  // private snackBar = inject(MatSnackBar);

  ngOnInit(): void {    
    this.loggedInUser = this._accountService.loggedInUserSig();

    this.initializeUploader();
  }

  fileOverBase(event: boolean): void {
    this.hasBaseDropZoneOver = event;
  }

  initializeUploader(): void {
    if (this.loggedInUser) {
      this.uploader = new FileUploader({
        url: this.apiUrl + 'api/user/add-photo',
        authToken: 'Bearer ' + this.loggedInUser.token,
        isHTML5: true,
        allowedFileType: ['image'],
        removeAfterUpload: true,
        autoUpload: false,
        maxFileSize: 4_000_000 // bytes / 4MB
      });

      this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
      }

      this.uploader.onSuccessItem = (item, response) => {
        if (response) {
          const photo: Photo = JSON.parse(response);
          this.member?.photos.push(photo);

          if (this.member?.photos.length === 1)
            this.setNavbarProfilePhoto(photo.url_165);
        }
      }
    }
  }

  setNavbarProfilePhoto(url_165: string): void {
    if (this.loggedInUser) {
      this.loggedInUser.profilePhotoUrl = url_165;

      this._accountService.loggedInUserSig.set(this.loggedInUser);
    }
  }

  setMainPhotoComp(url_165In: string): void {
    this._userService.setMainPhoto(url_165In)
      .pipe(take(1))
      .subscribe({
        next: (response: ApiResponse) => {
          if (response && this.member) {

            for (const photo of this.member.photos) {
            //   //   // unset previous main
              if (photo.isMain === true)
                photo.isMain = false;

            //   //   // set new selected main
              if (photo.url_165 === url_165In) {
                photo.isMain = true;

                // update navbar/profile photo
                this.loggedInUser!.profilePhotoUrl = url_165In;
                this._accountService.setCurrentUser(this.loggedInUser!);
              }
            }

            // another way of for loop
            // this.member.photos.forEach(photo => {

            // })

            this._snackBar.open(response.message, 'close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 7000
            });

            console.log(this.member.photos);
          }
        }
      });
  }

  spliceList(): void {
    this.numbers.splice(1, 1);

    console.log(this.numbers);
  }

  deletePhotoComp(url_165: string, index: number): void {
    console.log(index);

    this._userService.deletePhoto(url_165)
      .pipe(take(1))
      .subscribe({
        next: (response: ApiResponse) => {
          if (response && this.member) {
            this.member.photos.splice(index, 1);

            this._snackBar.open(response.message, 'Close', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 7000
            })
          }
        }
      })
  }
}
