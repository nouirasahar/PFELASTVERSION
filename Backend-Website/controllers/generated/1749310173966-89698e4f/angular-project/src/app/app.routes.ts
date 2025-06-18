import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UpdateComponent } from './update/update.component';
import { clientsComponent } from './clients/clients.component';
import { deliveriesComponent } from './deliveries/deliveries.component';
import { employeesComponent } from './employees/employees.component';
import { ordersComponent } from './orders/orders.component';
import { paymentsComponent } from './payments/payments.component';
import { ticketsComponent } from './tickets/tickets.component';
import { transactionsComponent } from './transactions/transactions.component';
import { invoicesComponent } from './invoices/invoices.component';
import { productsComponent } from './products/products.component';
export const routes: Routes = [
  { path: 'clients', component: clientsComponent },
  { path: 'deliveries', component: deliveriesComponent },
  { path: 'employees', component: employeesComponent },
  { path: 'orders', component: ordersComponent },
  { path: 'payments', component: paymentsComponent },
  { path: 'tickets', component: ticketsComponent },
  { path: 'transactions', component: transactionsComponent },
  { path: 'invoices', component: invoicesComponent },
  { path: 'products', component: productsComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'sidebar', component: SidebarComponent},
  { path: 'update/:table/:id', component: UpdateComponent },
  { path: '', redirectTo: '/admin', pathMatch: 'full' }
];
