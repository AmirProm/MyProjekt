import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rules',
  imports: [],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class termsComponent implements OnInit {
  accepted = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const alreadyAccepted = localStorage.getItem('termsAccepted');
    if (alreadyAccepted === 'true') {
      this.router.navigateByUrl('/');
    }
  }

  onAcceptChange(event: Event): void {
    this.accepted = (event.target as HTMLInputElement).checked;
  }

  acceptTerms(): void {
    if (!this.accepted) return;

    localStorage.setItem('termsAccepted', 'true');
    this.router.navigateByUrl('/');
  }
}
