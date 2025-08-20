import { Injectable, ApplicationRef, ComponentFactoryResolver, Injector } from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { ContextMenuComponent } from '../components/context-menu/context-menu';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {
  private portalOutlet: DomPortalOutlet | null = null;
  private close$ = new Subject<void>();

  constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  open(x: number, y: number, items: { label: string, action: string }[]): Subject<string> {
    this.close(); 

    const action$ = new Subject<string>();

    this.portalOutlet = new DomPortalOutlet(
      document.body,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );

    const portal = new ComponentPortal(ContextMenuComponent);
    const componentRef = this.portalOutlet.attach(portal);

    componentRef.instance.x = x;
    componentRef.instance.y = y;
    componentRef.instance.items = items;

    const subscription = componentRef.instance.itemClick.subscribe(action => {
      action$.next(action);
      this.close();
    });

    this.close$.subscribe(() => {
      subscription.unsubscribe();
      this.close();
    });

    return action$;
  }

  close() {
    if (this.portalOutlet && this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
      this.portalOutlet = null;
    }
  }
}