import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Workspace } from '../models/workspace.model';
import { HttpPaths } from './http-paths';

const DEFAULT_WORKSPACE_ID = 'ws_default';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private http = inject(HttpClient);
  private httpPaths = inject(HttpPaths);

  private workspacesSub = new BehaviorSubject<Workspace[]>([]);
  public workspaces$ = this.workspacesSub.asObservable();

  private activeWorkspaceIdSub = new BehaviorSubject<string>(localStorage.getItem('activeWorkspaceId') || DEFAULT_WORKSPACE_ID);
  public activeWorkspaceId$ = this.activeWorkspaceIdSub.asObservable();

  constructor() {
    
  }

  loadWorkspaces(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${this.httpPaths.baseApiUrl}workspaces/`).pipe(
      tap(workspaces => this.workspacesSub.next(workspaces))
    );
  }

  getWorkspaces(): Observable<Workspace[]> {
    return this.workspaces$;
  }

  createWorkspace(name: string, avatar?: File): Observable<Workspace> {
    const formData = new FormData();
    formData.append('name', name);
    if (avatar) {
      formData.append('avatar', avatar, avatar.name);
    }
    return this.http.post<Workspace>(`${this.httpPaths.baseApiUrl}workspaces/`, formData).pipe(
      tap(() => this.loadWorkspaces().subscribe())
    );
  }

  setActiveWorkspace(workspaceId: string) {
    this.activeWorkspaceIdSub.next(workspaceId);
    localStorage.setItem('activeWorkspaceId', workspaceId);
  }

  deleteWorkspace(workspaceId: string): Observable<any> {
    return this.http.delete(`${this.httpPaths.baseApiUrl}workspaces/${workspaceId}`).pipe(
      tap(() => {
        if (this.getActiveWorkspaceId() === workspaceId) {
          this.setActiveWorkspace(DEFAULT_WORKSPACE_ID);
        }
        this.loadWorkspaces().subscribe();
      })
    );
  }

  updateWorkspace(workspaceId: string, name: string): Observable<any> {
    const formData = new FormData();
    formData.append('name', name);
    return this.http.put(`${this.httpPaths.baseApiUrl}workspaces/${workspaceId}`, formData).pipe(
      tap(() => this.loadWorkspaces().subscribe())
    );
  }

  inviteUser(workspaceId: string, userId: string): Observable<any> {
    return this.http.post(`${this.httpPaths.baseApiUrl}workspaces/${workspaceId}/members`, { user_id: userId });
  }

  uploadAvatar(workspaceId: string, avatar: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', avatar, avatar.name);
    return this.http.post(`${this.httpPaths.baseApiUrl}workspaces/${workspaceId}/avatar`, formData).pipe(
      tap(() => this.loadWorkspaces().subscribe())
    );
  }

  saveWorkspaceOrder(workspaceIds: string[]): Observable<any> {
    console.log('Saving workspace order:', workspaceIds);
    return this.http.put(`${this.httpPaths.baseApiUrl}workspaces/order`, { workspace_ids: workspaceIds }).pipe(
      tap(() => this.loadWorkspaces().subscribe())
    );
  }

  getActiveWorkspaceId(): string {
    return this.activeWorkspaceIdSub.getValue();
  }
}