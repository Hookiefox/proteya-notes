import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-enter-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="passwordForm" (ngSubmit)="submitPassword()">
      <div class="form-row">
        <label for="password">Пароль</label>
        <input type="password" id="password" formControlName="password" placeholder="Введите пароль">
      </div>
      <div class="form-actions">
        <button type="button" class="button" (click)="close()">Отмена</button>
        <button type="submit" class="button" [disabled]="passwordForm.invalid">Открыть</button>
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
export class EnterPasswordComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(DialogRef);

  passwordForm: FormGroup = this.fb.group({
    password: ['', Validators.required]
  });

  submitPassword(): void {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.value.password);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
