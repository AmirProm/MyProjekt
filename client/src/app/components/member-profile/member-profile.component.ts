import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { MemberService } from '../../services/member.service';
import { AccountService } from '../../services/account.service';
import { Member } from '../../models/member.model';

type LoadState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-member-profile',
  imports: [TitleCasePipe, DatePipe],
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.scss'],
})
export class MemberProfileComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private memberService = inject(MemberService);
  private accountService = inject(AccountService);

  apiUrl = environment.apiUrl;

  stateSig = signal<LoadState>('loading');
  memberSig = signal<Member | null>(null);

  // viewer (logged-in)
  viewerSig = this.accountService.loggedInUserSig;

  // gallery modal
  selectedUrlSig = signal<string | null>(null);
  isModalOpenSig = computed(() => !!this.selectedUrlSig());

  // follow (UI-only for now)
  isFollowingSig = signal(false);

  usernameSig = signal<string>('');

  isSelfProfileSig = computed(() => {
    const v = this.viewerSig();
    const m = this.memberSig();
    if (!v || !m) return false;
    return (v.userName ?? '').toLowerCase() === (m.userName ?? '').toLowerCase();
  });

  avatarUrlSig = computed(() => {
    const m = this.memberSig();
    if (!m) return null;

    const main = m.photos?.find(p => p.isMain) ?? m.photos?.[0];
    const thumb = (main as any)?.image_165 ?? (main as any)?.url_165; // fallback
    return thumb ? this.normalizeUrl(thumb) : null;
  });

  coverUrlSig = computed(() => {
    const m = this.memberSig();
    if (!m) return null;

    const main = m.photos?.find(p => p.isMain) ?? m.photos?.[0];
    const big = (main as any)?.image_enlarged ?? (main as any)?.url_enlarged
      ?? (main as any)?.image_256 ?? (main as any)?.url_256
      ?? (main as any)?.image_165 ?? (main as any)?.url_165;

    return big ? this.normalizeUrl(big) : null;
  });

  constructor() {
    effect(() => {
      const username = this.route.snapshot.paramMap.get('username') ?? '';
      this.usernameSig.set(username);

      if (!username) {
        this.stateSig.set('error');
        this.memberSig.set(null);
        return;
      }

      this.fetch(username);
    });
  }

  fetch(username: string) {
    this.stateSig.set('loading');

    this.memberService.getByUserName(username).subscribe({
      next: (m) => {
        if (!m) {
          this.memberSig.set(null);
          this.stateSig.set('error');
          return;
        }
        this.memberSig.set(m);
        this.stateSig.set('ready');
      },
      error: () => {
        this.memberSig.set(null);
        this.stateSig.set('error');
      }
    });
  }

  retry() {
    const u = this.usernameSig();
    if (u) this.fetch(u);
  }

  back() {
    this.router.navigateByUrl('dashboard');
  }

  message() {
    this.router.navigateByUrl('/chat');
  }

  toggleFollow() {
    this.isFollowingSig.set(!this.isFollowingSig());
  }

  openPhoto(rawUrl: string) {
    this.selectedUrlSig.set(this.normalizeUrl(rawUrl));
  }

  closeModal() {
    this.selectedUrlSig.set(null);
  }

  onImgError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.style.display = 'none';
  }

  private normalizeUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith('http')) return url;

    if (url.startsWith('/')) return this.apiUrl + url.substring(1);
    return this.apiUrl + url;
  }

  // helper برای گالری
  photoThumb(p: any): string | null {
    const u = p?.image_256 ?? p?.url_256 ?? p?.image_165 ?? p?.url_165;
    return u ? this.normalizeUrl(u) : null;
  }

  photoBig(p: any): string | null {
    const u = p?.image_enlarged ?? p?.url_enlarged ?? p?.image_256 ?? p?.url_256 ?? p?.image_165 ?? p?.url_165;
    return u ? this.normalizeUrl(u) : null;
  }
}