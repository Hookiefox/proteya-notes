import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from '../../services/encryption';
import { ModalService } from '../../services/modal';
import { SetPasswordComponent } from '../set-password/set-password';
import { HttpPaths } from '../../services/http-paths';
import { AuthService } from '../../services/auth.service';
import { WorkspaceService } from '../../services/workspace.service';
import { ThemeService } from '../../services/theme.service';
import { themeProperties } from '../../config/theme.config';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Аккаунт</h3>
    <button (click)="logout()" class="button logout-button">Выйти из аккаунта</button>
    <hr>
    <h3>Подключение</h3>
    <div class="setting-row">
      <label for="base-url">URL API</label>
      <div class="api-url-input">
        <input type="text" id="base-url" [value]="getBaseApiUrl()" (change)="setBaseApiUrl($event)" placeholder="http://localhost:8080/">
        <button class="button" (click)="testConnection()">Подключиться</button>
      </div>
      
    </div>
    <div class="setting-row" *ngIf="testConnectionMessage">
      {{ testConnectionMessage }}
    </div>
    <hr>
    <h3>Шифрование</h3>
    
    <div class="setting-row">
      <label for="encryption-toggle">Включить шифрование</label>
      <input type="checkbox" id="encryption-toggle" [checked]="isEncryptionEnabled()" (change)="toggleEncryption($event)">
    </div>
    <div class="setting-row">
      <label>Пароль шифрования</label>
      <button class="button" (click)="openSetPasswordModal()">Изменить</button>
    </div>
    <hr>
    <h3>Theme</h3>
    <div *ngFor="let prop of themeProperties">
      <div *ngIf="!prop.readonly" class="setting-row">
        <label [for]="prop.variable">{{ prop.name }}</label>
        <input [type]="prop.type" [id]="prop.variable" [value]="themeColors[prop.variable]" (input)="onColorChange(prop.variable, $event)">
      </div>
    </div>
    <button class="button" (click)="saveTheme()">Save Theme</button>
    <button class="button button-danger" (click)="resetTheme()">Reset Theme</button>
    <hr>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
 
    }

    .setting-row:last-child {
      border-bottom: none;
    }

    .api-url-input {
      display: flex;
      align-items: center;
    }

    .api-url-input input {
      margin-right: 10px;
    }

    input[type="text"] {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      width: 200px;
    }

    `]
})
export class SettingsComponent implements OnInit {
  private http = inject(HttpClient);
  private encryptionService = inject(EncryptionService);
  private modalService = inject(ModalService);
  private httpPaths = inject(HttpPaths);
  private themeService = inject(ThemeService);

  private workspaceService = inject(WorkspaceService);
  testConnectionMessage = '';
  themeProperties = themeProperties;
  themeColors: { [key: string]: string } = {};

  constructor(public authService: AuthService) { 
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.workspaceService.loadWorkspaces().subscribe();
    }
    this.themeProperties.forEach(prop => {
      this.themeColors[prop.variable] = getComputedStyle(document.documentElement).getPropertyValue(prop.variable).trim();
    });
  }


  getBaseApiUrl(): string {
    return this.httpPaths.baseApiUrl;
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  setBaseApiUrl(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.httpPaths.baseApiUrl = target.value;
    window.location.reload();
  }

  isEncryptionEnabled(): boolean {
    return this.encryptionService.isEncryptionEnabled();
  }

  toggleEncryption(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.encryptionService.setEncryptionEnabled(target.checked);
  }

  openSetPasswordModal(): void {
    this.modalService.open(SetPasswordComponent);
  }

  onColorChange(variable: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.themeColors[variable] = target.value;
  }

  saveTheme(): void {
    this.themeProperties.forEach(prop => {
      const value = this.themeColors[prop.variable];
      this.themeService.setThemeProperty(prop.variable, value);
    });
    this.themeService.updateDerivedColors();
  }

  resetTheme(): void {
    this.themeProperties.forEach(prop => {
      localStorage.removeItem(prop.variable);
    });
    this.themeService.loadTheme();
    
    this.themeProperties.forEach(prop => {
      this.themeColors[prop.variable] = getComputedStyle(document.documentElement).getPropertyValue(prop.variable).trim();
    });
  }

  testConnection(): void {
    this.http.get(`${this.httpPaths.baseApiUrl}health`).subscribe({
      next: () => {
        this.testConnectionMessage = 'Connection successful!';
      },
      error: () => {
        this.testConnectionMessage = 'Connection failed.';
      }
    });
  }
}