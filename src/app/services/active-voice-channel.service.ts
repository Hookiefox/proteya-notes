import { Injectable, inject } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject } from 'rxjs';
import { HttpPaths } from './http-paths';

@Injectable({
  providedIn: 'root'
})
export class ActiveVoiceChannelService {
  private socket$: WebSocketSubject<any> | null = null;
  private httpPaths = inject(HttpPaths);

  private usersInChannelSubject = new BehaviorSubject<string[]>([]);
  usersInChannel$ = this.usersInChannelSubject.asObservable();

  connect(userId: string) {
    const url = `${this.httpPaths.voiceWs}/test-channel?user_id=${userId}`;
    this.socket$ = webSocket(url);

    this.socket$.subscribe(
      (message) => {
        if (message.users) {
          this.usersInChannelSubject.next(message.users);
        }
      },
      (err) => console.error(err),
      () => console.log('complete')
    );
  }

  disconnect() {
    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }
  }

  sendMessage(message: any) {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }
}