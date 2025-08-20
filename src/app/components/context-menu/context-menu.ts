import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.html',
  styleUrls: ['./context-menu.css']
})
export class ContextMenuComponent {
  @Input() x = 0;
  @Input() y = 0;
  @Input() items: { label: string, action: string }[] = [];
  @Output() itemClick = new EventEmitter<string>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.itemClick.emit('close');
    }
  }
}
