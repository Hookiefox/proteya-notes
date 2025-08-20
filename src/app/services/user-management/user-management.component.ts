import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { ModalService } from '../modal';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  createUserForm: FormGroup;
  users: any[] = [];
  message: string = '';
  private modalService = inject(ModalService);

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe(users => {
      console.log('Users received from backend:', users);
      this.users = users;
    });
  }

  onCreateUser(): void {
    if (this.createUserForm.valid) {
      const { email, password } = this.createUserForm.value;
      this.authService.createUser(email, password).subscribe({
        next: (response) => {
          this.message = response.message;
          this.loadUsers(); 
          this.createUserForm.reset();
        },
        error: (err) => {
          this.message = err.error.detail || 'Failed to create user';
        }
      });
    }
  }

  onEditUser(user: any): void {
    const modalRef = this.modalService.open(EditUserComponent, user);
    modalRef.closed.subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  onDeleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(userId).subscribe({
        next: (response) => {
          this.message = response.message;
          this.loadUsers(); 
        },
        error: (err) => {
          this.message = err.error.detail || 'Failed to delete user';
        }
      });
    }
  }
}