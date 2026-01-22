import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Masters',
                icon: 'pi pi-fw pi-database',
                items: [

                    {
                        label: 'Unit',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/app/masters/unit']
                    },
                    {
                        label: 'Bank',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['/app/masters/bank']
                    },
                    {
                        label: 'Warehouse',
                        icon: 'pi pi-fw pi-inbox',
                        routerLink: ['/app/masters/warehouse']
                    },
                    {
                        label: 'Brand',
                        icon: 'pi pi-fw pi-tag',
                        routerLink: ['/app/masters/brand']
                    },
                    {
                        label: 'City',
                        icon: 'pi pi-fw pi-map-marker',
                        routerLink: ['/app/masters/city']
                    },
                    {
                        label: 'Stock Group',
                        icon: 'pi pi-fw pi-th-large',
                        routerLink: ['/app/masters/stockgroup']
                    },
                    {
                        label: 'Stock',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/app/masters/stock']
                    },
                     {
                        label: 'Supplier',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/app/masters/supplier']
                    },
                    {
                        label: 'Customer',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/app/masters/customer']
                    },
                    {
                        label: 'Salesman',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/app/masters/salesman']
                    },
                ]
            },
        ];
    }
}
