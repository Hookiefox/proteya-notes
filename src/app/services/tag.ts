import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';
import { HttpPaths } from './http-paths';
import { WorkspaceService } from './workspace.service';

export interface Tag {
  id: string;
  name: string;
  parent_id: string | null;
  children: string[];
  icon?: string;
}

export interface TagsResponse {
  [key: string]: Tag;
}

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);
  private workspaceService = inject(WorkspaceService);
  private httpPaths = inject(HttpPaths);

  private readonly _tags$ = new BehaviorSubject<TagsResponse>({});
  public readonly tags$ = this._tags$.asObservable();

  constructor() {
    this.workspaceService.activeWorkspaceId$.pipe(
      tap(() => this.loadTags())
    ).subscribe();
  }

  loadTags(): void {
    const workspaceId = this.workspaceService.getActiveWorkspaceId();
    const params = new HttpParams().set('workspace_id', workspaceId);
    this.http.get<{ tags: TagsResponse }>(this.httpPaths.tags, { params }).pipe(
      tap(response => this._tags$.next(response.tags))
    ).subscribe();
  }

  createTag(name: string, parent_id: string | null = null, icon: string | null = null): Observable<{ message: string, tag: Tag }> {
    const formData = new FormData();
    formData.append('name', name);
    if (parent_id) {
      formData.append('parent_id', parent_id);
    }
    if (icon) {
      formData.append('icon', icon);
    }
    formData.append('workspace_id', this.workspaceService.getActiveWorkspaceId());
    
    return this.http.post<{ message: string, tag: Tag }>(this.httpPaths.tags, formData).pipe(
      tap(response => {
        const newTag = response.tag;
        const currentTags = this._tags$.getValue();
        const nextTags = { ...currentTags };
        nextTags[newTag.id] = newTag;
        
        if (newTag.parent_id && nextTags[newTag.parent_id]) {
          const parent = nextTags[newTag.parent_id];
          nextTags[newTag.parent_id] = {
            ...parent,
            children: [...parent.children, newTag.id]
          };
        }
        
        this._tags$.next(nextTags);
      })
    );
  }

  updateTag(id: string, name: string, icon: string | null = null): Observable<{ message: string, tag: Tag }> {
    const formData = new FormData();
    formData.append('name', name);
    if (icon) {
      formData.append('icon', icon);
    }
    const params = new HttpParams().set('workspace_id', this.workspaceService.getActiveWorkspaceId());
    return this.http.put<{ message: string, tag: Tag }>(`${this.httpPaths.tags}${id}`, formData, { params }).pipe(
      tap(response => {
        const updatedTag = response.tag;
        const currentTags = this._tags$.getValue();
        const nextTags = { ...currentTags };
        if (nextTags[updatedTag.id]) {
          nextTags[updatedTag.id] = { ...nextTags[updatedTag.id], ...updatedTag };
        }
        this._tags$.next(nextTags);
      })
    );
  }

  deleteTag(id: string): Observable<any> {
    const params = new HttpParams().set('workspace_id', this.workspaceService.getActiveWorkspaceId());
    return this.http.delete(`${this.httpPaths.tags}${id}`, { params }).pipe(
      tap(() => {
        const currentTags = this._tags$.getValue();
        const deletedTag = currentTags[id];
        if (!deletedTag) return;

        const deleteChildren = (tagId: string) => {
          const tag = currentTags[tagId];
          if (tag && tag.children) {
            tag.children.forEach(childId => {
              deleteChildren(childId);
              delete currentTags[childId];
            });
          }
        };
        deleteChildren(id);
        
        delete currentTags[id];

        if (deletedTag.parent_id) {
          const parent = currentTags[deletedTag.parent_id];
          if (parent) {
            parent.children = parent.children.filter(childId => childId !== id);
          }
        }

        this._tags$.next({ ...currentTags });
      })
    );
  }
}
