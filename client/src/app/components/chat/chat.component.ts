import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { AccountService } from '../../services/account.service';
import { ChatSerivce } from '../../services/chat.service';
import { LoggedIn } from '../../models/logged-in.model';
import { ChatMessage } from '../../models/chat-massage.model';
import { DatePipe } from '@angular/common';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { take } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf, PickerModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class Chat implements OnInit {
  private chatService = inject(ChatSerivce);
  private accountService = inject(AccountService);

  messageText = '';
  messages = this.chatService.messages;

  currentUser: LoggedIn | null = null; 

  // ✅ برای admin
  isadmin = false;

  ngOnInit(): void {
    this.currentUser = this.getCurrentUser();

    // ✅ تشخیص admin
    if (this.currentUser?.roles) {
      this.isadmin = this.currentUser.roles.includes('admin');
    }

    this.chatService.startConnection();
    this.chatService.loadMessage().pipe(take(1)).subscribe();
  }

  getCurrentUser(): LoggedIn | null {
    const currentUser: string | null = localStorage.getItem('loggedInUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }

  isMine(message: ChatMessage): boolean {
    if (!this.currentUser) return false;
    return message.user === this.currentUser.userName;
  }

  sendMessage(): void {
    if (!this.currentUser) return;
    if (!this.messageText.trim()) return;

    this.chatService.sendMessage(this.currentUser.userName, this.messageText);
    this.messageText = '';
  }

  // ✅ حذف پیام (فقط admin)
  deleteMessage(message: ChatMessage) {
    if (!this.isadmin) return;
    if (!message.id) return;

    if (!confirm('Delete this message?')) return;

    this.chatService.deleteMessage(message.id).subscribe();
  }

  showEmojis = false;

  addEmoji(event: any) {
    this.messageText += event.emoji.native;
    this.showEmojis = false;
  }
}