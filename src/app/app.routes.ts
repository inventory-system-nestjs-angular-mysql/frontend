
import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Documentation } from './pages/documentation/documentation';
import { Notfound } from './pages/notfound/notfound';
import { StockGroupComponent } from './masters/stockgroup/stockgroup.component';
import { StockComponent } from './masters/stock/stock.component';
import { UnitComponent } from './masters/unit/unit.component';
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
            { path: 'uikit', loadChildren: () => import('./pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
