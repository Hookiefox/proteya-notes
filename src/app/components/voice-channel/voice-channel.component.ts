import { Component, OnInit, inject } from '@angular/core';
import { ActiveVoiceChannelService } from '../../services/active-voice-channel.service';

@Component({
  selector: 'app-voice-channel',
  templateUrl: './voice-channel.component.html',
  styleUrls: ['./voice-channel.component.css']
})
export class VoiceChannelComponent implements OnInit {
  activeVoiceChannelService = inject(ActiveVoiceChannelService);
  users: string[] = [];

  ngOnInit() {
    this.activeVoiceChannelService.usersInChannel$.subscribe(users => {
      this.users = users;
    });
  }

  connect() {
    this.activeVoiceChannelService.connect('test-user'); 
  }

  disconnect() {
    this.activeVoiceChannelService.disconnect();
  }
}