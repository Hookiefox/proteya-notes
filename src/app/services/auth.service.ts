import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpPaths } from './http-paths';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private httpPaths = inject(HttpPaths);
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor() {
        const user = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(user ? JSON.parse(user) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string): Observable<any> {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        return this.http.post<any>(this.httpPaths.login, formData)
            .pipe(
                tap(response => {
                    if (response && response.access_token) {
                        localStorage.setItem('access_token', response.access_token);
                        
                        this.http.get<User>(this.httpPaths.users + '/me').subscribe(user => {
                            localStorage.setItem('currentUser', JSON.stringify(user));
                            this.currentUserSubject.next(user);
                        });
                    }
                })
            );
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('access_token');
    }

    registerAdmin(username: string, password: string, email: string): Observable<any> {
        return this.http.post(this.httpPaths.baseApiUrl + 'auth/register-admin', { username, password, email });
    }

    checkAdminExists(): Observable<{ admin_exists: boolean }> {
        return this.http.get<{ admin_exists: boolean }>(this.httpPaths.baseApiUrl + 'auth/admin-exists');
    }
}
