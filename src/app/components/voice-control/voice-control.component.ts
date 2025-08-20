import { Component, inject } from '@angular/core';
import { VoiceService } from '../../services/voice.service';

@Component({
  selector: 'app-voice-control',
  templateUrl: './voice-control.component.html',
  styleUrls: ['./voice-control.component.css']
})
export class VoiceControlComponent {
  voiceService = inject(VoiceService);

  startRecording() {
    this.voiceService.startRecording();
  }

  stopRecording() {
    this.voiceService.stopRecording();
  }

  toggleMicrophone() {
    this.voiceService.toggleMicrophone();
  }

  get isMuted() {
    return this.voiceService.isMuted;
  }

  get isRecording() {
    return this.voiceService.isRecording;
  }
}
