
import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Notfound } from './pages/notfound/notfound';
import { StockGroupComponent } from './masters/stockgroup/stockgroup.component';
import { StockComponent } from './masters/stock/stock.component';
import { UnitComponent } from './masters/unit/unit.component';
import { BankComponent } from './masters/bank/bank.component';
import { WarehouseComponent } from './masters/warehouse/warehouse.component';
import { BrandComponent } from './masters/brand/brand.component';
import { CityComponent } from './masters/city/city.component';
import { SupplierComponent } from './masters/supplier/supplier.component';
import { CustomerComponent } from './masters/customer/customer.component';
import { SalesmanComponent } from './masters/salesman/salesman.component';
import { Login } from './pages/auth/login';

export const routes: Routes = [
    { path: '', component: Login },
    {
        path: 'app',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'masters/stockgroup', component: StockGroupComponent },
            { path: 'masters/stock', component: StockComponent },
            { path: 'masters/unit', component: UnitComponent },
            { path: 'masters/bank', component: BankComponent },
            { path: 'masters/warehouse', component: WarehouseComponent },
            { path: 'masters/brand', component: BrandComponent },
            { path: 'masters/city', component: CityComponent },
            { path: 'masters/supplier', component: SupplierComponent },
            { path: 'masters/customer', component: CustomerComponent },
            { path: 'masters/salesman', component: SalesmanComponent },
            { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
