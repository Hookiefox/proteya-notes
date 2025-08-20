import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpPaths {
  private _baseApiUrl: string;

  constructor() {
    
    this._baseApiUrl = localStorage.getItem('baseApiUrl') || 'http://localhost:8080/';
  }

  
  get baseApiUrl(): string {
    return this._baseApiUrl;
  }

  
  set baseApiUrl(url: string) {
    this._baseApiUrl = url;
    localStorage.setItem('baseApiUrl', url);
  }

  
  get users(): string {
    return `${this.baseApiUrl}users`;
  }

  get notes(): string {
    return `${this.baseApiUrl}notes/`;
  }

  get tags(): string {
    return `${this.baseApiUrl}tags/`;
  }

  get login(): string {
    return `${this.baseApiUrl}auth/login`;
  }

  get logout(): string {
    return `${this.baseApiUrl}auth/logout`;
  }

  get voice(): string {
    return `${this.baseApiUrl}voice/`;
  }

  get voiceWs(): string {
    return this.baseApiUrl.replace(/^http/, 'ws') + 'voice/ws';
  }

  
  getUserById(userId: number): string {
    return `${this.users}/${userId}`;
  }

  getNoteById(noteId: number): string {
    return `${this.notes}/${noteId}`;
  }

  

}