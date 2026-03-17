import { inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ChatMessage } from '../models/chat-massage.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { error } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class ChatSerivce {
  private hubConection!: HubConnection;
  private messagesSignal = signal<ChatMessage[]>([]);
  private apiUrl = 'http://localhost:5000/api/chat/message';
  messages = this.messagesSignal.asReadonly();

  private _http = inject(HttpClient);

  startConnection(): void {
    if (this.hubConection) {
      return;
    }

    this.hubConection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chatHub')
      .withAutomaticReconnect()
      .build();

    this.hubConection
      .start()
      .catch(err => console.error('Error while starting connection: ', err));

    // new payam as hub
    this.hubConection.on(
      'ReceiveMessage',
      (user: string, message: string, sentAt?: string) => {
        const newMessage: ChatMessage = {
          user,
          message,
          TimeStamp: sentAt ?? new Date().toISOString(),
          id: undefined
        };

        this.messagesSignal.update(msgs => [...msgs, newMessage]);
      }
    );
  }

  // این متد همون امضای قبل رو ن]گه می‌داره
  sendMessage(user: string, message: string): void {
    this.hubConection
      .invoke('SendMessage', user, message)
      .catch(console.error);
  }

  loadMessage() {
    return this._http.get<ChatMessage[]>(this.apiUrl).pipe(
      tap(messages => {
        // اگر از بک‌اند زمان میاد، همینجا تو مدل می‌شینه
        this.messagesSignal.set(messages);
      })
    );
  }

  deleteMessage(messageId: string) {
    return this._http.delete(this.apiUrl + '/' + messageId)
  }

}
