import { Component } from '@angular/core';
import { CommonModule, NgForOf, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
type ExploreTag = 'design' | 'product' | 'update' | 'all';

interface ExploreItem {
  id: number;
  tag: ExploreTag;
  title: string;
  subtitle: string;
  author: string;
  time: string;
  likes: number;
}

@Component({
  selector: 'app-explor',
  standalone: true,
  imports: [CommonModule, RouterLink, NgForOf, NgClass],
  templateUrl: './explor.component.html',
  styleUrl: './explor.component.scss'
})

export class ExploreComponent {
  activeTag: ExploreTag = 'all';

  items: ExploreItem[] = [
    {
      id: 1,
      tag: 'design',
      title: 'Soft chat layout for deep focus',
      subtitle: 'Exploring muted colors and breathing space in messaging UIs.',
      author: 'Lena · UI',
      time: '3 min ago',
      likes: 27,
    },
    {
      id: 2,
      tag: 'product',
      title: 'Quiet social, not noisy feeds',
      subtitle: 'Why Synq keeps timelines feeling more like a journal than a casino.',
      author: 'Arman · Product',
      time: '18 min ago',
      likes: 54,
    },
    {
      id: 3,
      tag: 'update',
      title: 'New: synced explore & chat handoff',
      subtitle: 'Jump into a chat from any explore card without losing context.',
      author: 'Team Synq',
      time: '1 h ago',
      likes: 39,
    },
    {
      id: 4,
      tag: 'design',
      title: 'Micro-animations that don’t scream',
      subtitle: 'Subtle motion that supports focus instead of stealing it.',
      author: 'Mina · Motion',
      time: 'Yesterday',
      likes: 61,
    },
    {
      id: 5,
      tag: 'product',
      title: 'Building for small, real groups',
      subtitle: 'Synq is tuned for circles, not infinite follow counts.',
      author: 'Kian · Product',
      time: '2 days ago',
      likes: 72,
    },
    {
      id: 6,
      tag: 'update',
      title: 'Dark mode with gentle contrast',
      subtitle: 'New palette that stays calm at 3 AM.',
      author: 'Team Synq',
      time: 'This week',
      likes: 46,
    },
  ];

  setTag(tag: ExploreTag) {
    this.activeTag = tag;
  }

  get filteredItems(): ExploreItem[] {
    if (this.activeTag === 'all') return this.items;
    return this.items.filter(i => i.tag === this.activeTag);
  }
}
