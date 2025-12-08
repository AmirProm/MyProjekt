import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, NgForOf],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  links = [
    { label: 'Home', url: '/' },
    { label: 'Chat', url: '/chat' },
    { label: 'Explore', url: '/explore' },
  ];
}