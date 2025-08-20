import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkPortalOutlet, PortalModule, Portal } from '@angular/cdk/portal';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-modal-panel',
  standalone: true,
  imports: [CommonModule, CdkPortalOutlet, PortalModule],
  templateUrl: './modal-panel.html',
  styleUrl: './modal-panel.css'
})
export class ModalPanel {
  dialogRef = inject(DialogRef);

  @Input() portal!: Portal<any>;
  @Input() title: string = ''; 
}
