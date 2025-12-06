import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
// import { ChatComponent } from '../chat/chat.component';
import { NgForOf } from '@angular/common';

type HomeTab = 'chat' | 'explore';

interface ChatMessage {
  text: string;
  time: string;
  out?: boolean;
}

interface ExploreItem {
  tag: string;
  time: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule, MatCardModule, FormsModule,
    NgForOf ,
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  activeTab: HomeTab = 'chat';

  draftMessage = '';

  chatMessages: ChatMessage[] = [
    { text: 'Welcome to Synq 👋', time: '09:18', out: false },
    { text: 'UI looks amazing!', time: '09:19', out: true },
    { text: 'Ready to launch your app?', time: '09:20', out: false },
  ];

  exploreItems: ExploreItem[] = [
    {
      tag: 'Design',
      time: '3 min ago',
      title: 'Minimal chat layout for deep focus',
      subtitle: 'See how Synq keeps your conversations clean and calm.',
    },
    {
      tag: 'Launch',
      time: '12 min ago',
      title: 'Ship your social app faster',
      subtitle: 'Reusable UI blocks for chat, explore, and onboarding.',
    },
    {
      tag: 'Product',
      time: 'Yesterday',
      title: 'Quiet social, not noisy feeds',
      subtitle: 'Build timelines that feel more like a journal than a casino.',
    },
  ];

  selectTab(tab: HomeTab) {
    this.activeTab = tab;
  }

  sendQuickMessage() {
    const text = this.draftMessage.trim();
    if (!text) return;

    const now = new Date();
    const time =
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0');

    this.chatMessages.push({ text, time, out: true });
    this.draftMessage = '';
  }
}