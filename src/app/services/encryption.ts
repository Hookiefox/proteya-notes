import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private password?: string;

  isEncryptionEnabled(): boolean {
    return localStorage.getItem('encryptionEnabled') === 'true';
  }

  setEncryptionEnabled(enabled: boolean): void {
    localStorage.setItem('encryptionEnabled', String(enabled));
  }

  hasPassword(): boolean {
    return !!this.password;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  encrypt(text: string): string {
    if (!this.password) {
      throw new Error('Password not set');
    }
    return CryptoJS.AES.encrypt(text, this.password).toString();
  }

  decrypt(ciphertext: string): string {
    if (!this.password) {
      throw new Error('Password not set');
    }
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.password);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}