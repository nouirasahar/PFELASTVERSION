import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { clientsComponent } from './clients/clients.component';
import { deliveriesComponent } from './deliveries/deliveries.component';
import { employeesComponent } from './employees/employees.component';
import { ordersComponent } from './orders/orders.component';
import { paymentsComponent } from './payments/payments.component';
import { ticketsComponent } from './tickets/tickets.component';
import { transactionsComponent } from './transactions/transactions.component';
import { invoicesComponent } from './invoices/invoices.component';
import { productsComponent } from './products/products.component';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        clientsComponent,
        deliveriesComponent,
        employeesComponent,
        ordersComponent,
        paymentsComponent,
        ticketsComponent,
        transactionsComponent,
        invoicesComponent,
        productsComponent,
        AdminComponent,
        SidebarComponent,
        RouterOutlet
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'user-test';
}
