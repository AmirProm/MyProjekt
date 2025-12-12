import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { MemberService } from '../../services/member.service';
import { LoggedIn } from '../../models/logged-in.model';
import { Member } from '../../models/member.model';
import { Photo } from '../../models/photo.model';
import { MatIcon } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { PaginatedResult } from '../../models/helpers/paginatedResult';
import { PaginationHandler } from '../../extensions/paginationHandler';
import { PaginationParams } from '../../models/helpers/paginationParams.model';
import { Pagination } from '../../models/helpers/pagination';




type LoadState = 'idle' | 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-dashboard',
  imports: [MatIcon, TitleCasePipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private accountService = inject(AccountService);
  private memberService = inject(MemberService);
  private router = inject(Router);

  apiUrl = environment.apiUrl;

  // auth user
  userSig = this.accountService.loggedInUserSig;

  // profile
  stateSig = signal<LoadState>('idle');
  memberSig = signal<Member | null>(null);

  // members list (REAL)
  membersSig = signal<Member[]>([]);
  paginationInfoSig = signal<Pagination | null>(null);
  paginationParamsSig = signal<PaginationParams>(new PaginationParams());

  // server-search
  querySig = signal<string>('');
  isSearchModeSig = signal(false);
  searchStateSig = signal<'idle' | 'typing' | 'loading' | 'done' | 'notfound' | 'error'>('idle');
  private searchTimer: any = null;

  // derived
  displayNameSig = computed(() => this.userSig()?.userName ?? 'User');
  emailSig = computed(() => this.userSig()?.email ?? '');

  // KPI (فعلاً 0)
  kpiSig = computed(() => ({ posts: 0, followers: 0, following: 0, chats: 0 }));

  avatarUrlSig = computed(() => {
    const u = this.userSig();
    const m = this.memberSig();
    if (!u) return null;

    if (u.profilePhotoUrl) return this.normalizeUrl(u.profilePhotoUrl);

    const main = m?.photos?.find(p => p.isMain) ?? m?.photos?.[0];
    return main?.url_165 ? this.normalizeUrl(main.url_165) : null;
  });

  profileScoreSig = computed(() => {
    const m = this.memberSig();
    if (!m) return 0;

    const checks = [
      !!m.introduction?.trim(),
      !!m.lookingFor?.trim(),
      !!m.interests?.trim(),
      !!m.city?.trim(),
      !!m.country?.trim(),
      (m.photos?.length ?? 0) > 0,
      !!m.gender?.trim(),
    ];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return Math.max(5, score);
  });

  nextStepsSig = computed(() => {
    const m = this.memberSig();
    return [
      { label: 'Add a profile photo', done: (m?.photos?.length ?? 0) > 0, action: 'photos' as const },
      { label: 'Write an introduction', done: !!m?.introduction?.trim(), action: 'edit' as const },
      { label: 'Add interests', done: !!m?.interests?.trim(), action: 'edit' as const },
      { label: 'Set your location', done: !!m?.city?.trim() && !!m?.country?.trim(), action: 'edit' as const },
    ];
  });

  totalPagesSig = computed(() => {
    const info = this.paginationInfoSig();
    const params = this.paginationParamsSig();
    if (!info) return 1;
    return Math.max(1, Math.ceil(info.totalItems / params.pageSize));
  });

  constructor() {
    // Profile load
    effect(() => {
      const u = this.userSig();
      if (!u?.userName) {
        this.memberSig.set(null);
        this.stateSig.set('idle');
        return;
      }

      this.stateSig.set('loading');
      this.memberService.getByUserName(u.userName).subscribe({
        next: (m) => {
          this.memberSig.set(m ?? null);
          this.stateSig.set('ready');
        },
        error: () => {
          this.memberSig.set(null);
          this.stateSig.set('error');
        }
      });
    });

    // Members load (paged) - only when NOT searching
    effect(() => {
      const params = this.paginationParamsSig();
      const isSearch = this.isSearchModeSig();
      if (isSearch) return;

      const fixed = { ...params, pageSize: 6 };
      this.memberService.getAllMembers(fixed).subscribe({
        next: (res: PaginatedResult<Member[]>) => {
          this.membersSig.set(res.body ?? []);
          this.paginationInfoSig.set(res.pagination ?? null);
        },
        error: () => {
          this.membersSig.set([]);
          this.paginationInfoSig.set(null);
        }
      });
    });
  }

  // ---- URL NORMALIZER (حل مشکل عکس‌ها) ----
  private normalizeUrl(url: string): string {
    if (!url) return url;
    if (url.startsWith('http')) return url;

    // اگر url با / شروع میشه
    if (url.startsWith('/')) return this.apiUrl + url.substring(1);

    // اگر بدون / شروع شده
    return this.apiUrl + url;
  }

  memberAvatar(m: Member): string | null {
    const main = m.photos?.find(p => p.isMain) ?? m.photos?.[0];
    return main?.url_165 ? this.normalizeUrl(main.url_165) : null;
  }

  onImgError(e: Event) {
    const img = e.target as HTMLImageElement;
    img.style.display = 'none';
  }

  // ---- Actions ----
  logout() { this.accountService.logout(); }
  goEditProfile() { this.router.navigateByUrl('user/user-edit'); }
  goPhotos() { this.router.navigateByUrl('user/user-edit'); }
  goChat() { this.router.navigateByUrl('/chat'); }
  goExplore() { this.router.navigateByUrl('/explor'); }

  openMember(m: Member) {
    // اگر صفحه پروفایل داری:
    // this.router.navigate(['/members', m.userName]);
    this.router.navigateByUrl('members/member-list');
  }

  // ---- Pagination ----
  prevPage() {
    const p = this.paginationParamsSig();
    if (p.pageNumber <= 1) return;
    this.paginationParamsSig.set({ ...p, pageNumber: p.pageNumber - 1 });
  }

  nextPage() {
    const p = this.paginationParamsSig();
    const max = this.totalPagesSig();
    if (p.pageNumber >= max) return;
    this.paginationParamsSig.set({ ...p, pageNumber: p.pageNumber + 1 });
  }

  // ---- SERVER SEARCH (getByUserName) ----
  onQuery(v: string) {
    this.querySig.set(v);
    const q = v.trim();

    if (!q) {
      this.clearSearch();
      return;
    }

    this.searchStateSig.set('typing');
    if (this.searchTimer) clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      this.searchByUsername(q);
    }, 350);
  }

  searchNow() {
    const q = this.querySig().trim();
    if (!q) return;
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchByUsername(q);
  }

  clearSearch() {
    this.isSearchModeSig.set(false);
    this.searchStateSig.set('idle');

    // trigger reload by nudging params
    const p = this.paginationParamsSig();
    this.paginationParamsSig.set({ ...p });
  }

  private searchByUsername(userName: string) {
    this.isSearchModeSig.set(true);
    this.searchStateSig.set('loading');

    this.memberService.getByUserName(userName).subscribe({
      next: (m) => {
        if (m) {
          this.membersSig.set([m]);
          this.searchStateSig.set('done');
        } else {
          this.membersSig.set([]);
          this.searchStateSig.set('notfound');
        }
      },
      error: () => {
        this.membersSig.set([]);
        this.searchStateSig.set('error');
      }
    });
  }

  followSoon() {
    // بعداً API follow
  }
}