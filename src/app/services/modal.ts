import { Injectable, inject, Injector, InjectionToken } from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType, ComponentPortal } from '@angular/cdk/portal';
import { ModalPanel } from '../components/modal-panel/modal-panel';


export interface ModalData {
  title?: string;
  [key: string]: any; 
}


export const MODAL_DATA = new InjectionToken<ModalData>('MODAL_DATA');

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private dialog = inject(Dialog);
  private injector = inject(Injector);

  open(component: ComponentType<any>, data?: ModalData): DialogRef<any, any> {
    const dialogRef = this.dialog.open(ModalPanel, {
      width: 'auto',
      minWidth: '500px',
      panelClass: 'modal-panel-backdrop',
      data: data 
    });

    const portal = new ComponentPortal(component, null, this.createInjector(data, dialogRef));

    if (dialogRef.componentInstance) {
      (dialogRef.componentInstance as ModalPanel).portal = portal;
      if (data?.title) {
        (dialogRef.componentInstance as ModalPanel).title = data.title;
      }
    }

    return dialogRef;
  }

  private createInjector(data: ModalData | undefined, dialogRef: DialogRef<any, any>): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: MODAL_DATA, useValue: data },
        { provide: DialogRef, useValue: dialogRef }
      ]
    });
  }
}