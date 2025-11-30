import { Component, Input } from '@angular/core';
import { Member } from '../../../models/member.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule
  ],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.scss'
})
export class MemberCardComponent {
@Input('memberInput') memberIn: Member | undefined; // memberInput is a contract
apiUrl = environment.apiUrl;
}
