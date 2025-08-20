import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptionService } from '../../services/encryption';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="passwordForm" (ngSubmit)="setPassword()">
      <div class="form-row">
        <label for="password">Новый пароль</label>
        <input type="password" id="password" formControlName="password">
      </div>
      <div class="form-row">
        <label for="confirm-password">Подтвердите пароль</label>
        <input type="password" id="confirm-password" formControlName="confirmPassword">
      </div>
      <div class="form-actions">
        <button type="button" class="button" (click)="close()">Отмена</button>
        <button type="submit" class="button" [disabled]="passwordForm.invalid">Сохранить</button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }

    .form-row {
      margin-bottom: 1rem;
    }

    .form-row label {
      display: block;
      margin-bottom: 0.5rem;
    }

    .form-row input {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background-color: var(--input-background-color);
      color: var(--text-color);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    `]
})
export class SetPasswordComponent {
  private fb = inject(FormBuilder);
  private encryptionService = inject(EncryptionService);
  private dialogRef = inject(DialogRef);

  passwordForm: FormGroup = this.fb.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordsMatch });

  passwordsMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  setPassword(): void {
    if (this.passwordForm.valid) {
      this.encryptionService.setPassword(this.passwordForm.value.password);
      this.dialogRef.close();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
