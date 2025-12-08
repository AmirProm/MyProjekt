
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type LanguageCode = 'en' | 'fa';

interface UserSettings {
  userName: string;
  email: string;
  displayName: string;
  statusNote: string;
  bio: string;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  darkMode: boolean;
  language: LanguageCode;
}

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'setting.component.html',
  styleUrl: 'setting.component.scss',
})
export class UserSettingsComponent {
  readonly languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'fa', label: 'فارسی' },
  ];

  settings: UserSettings = {
    userName: 'amir',
    email: 'amir@example.com',
    displayName: 'Amir',
    statusNote: 'Focus mode 🔕',
    bio: 'Building Synq and staying calm.',
    allowDirectMessages: true,
    showOnlineStatus: true,
    darkMode: false,
    language: 'en',
  };

  isSaving = false;
  saveMessage: string | null = null;

  get avatarInitial(): string {
    return (this.settings.displayName?.charAt(0) || this.settings.userName.charAt(0) || '?').toUpperCase();
  }

  saveSettings(): void {
    if (this.isSaving) return;

    this.isSaving = true;
    this.saveMessage = null;

    // شبیه‌سازی ذخیره‌سازی؛ بعداً این‌جا API صدا می‌زنی
    setTimeout(() => {
      this.isSaving = false;
      this.saveMessage = 'Settings saved (mock). Wire this to your backend API later.';
      console.log('Synq user settings (mock save):', this.settings);
    }, 500);
  }
}
