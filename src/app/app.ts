import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Sidebar } from './components/sidebar/sidebar';
import { Content } from './components/content/content';
import { NoteForm } from './components/note-form/note-form';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ThemeService } from './services/theme.service';
import { DeviceService } from './services/device.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Sidebar, Content],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isSidebarCollapsed = false;
  isMobile = false;
  isLoginPage = false;

  authService = inject(AuthService);
  router = inject(Router);
  themeService = inject(ThemeService);
  deviceService = inject(DeviceService);

  constructor() {
    this.checkIfMobile();
    this.themeService.loadTheme();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isLoginPage = event.urlAfterRedirects === '/login' || event.urlAfterRedirects === '/register-admin';
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = this.deviceService.isMobile();
    if (this.isMobile) {
      this.isSidebarCollapsed = true;
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}
