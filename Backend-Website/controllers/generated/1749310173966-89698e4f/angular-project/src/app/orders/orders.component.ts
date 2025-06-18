import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class ordersComponent implements OnInit {
    tables: string[] = [];
    dataMap: any = {};

    constructor(private service: SharedService, private router: Router) {}

    ngOnInit(): void {
        this.service.getUsers().subscribe(data => {
            console.log("Données reçues:", data);
            if (data && typeof data === "object") {
                this.tables = Object.keys(data);
                this.dataMap = data;
            } else {
                this.tables = [];
                this.dataMap = {};
            }
        });
    }

    getColumns(table: string): string[] {
        return this.dataMap[table] && this.dataMap[table].length > 0
            ? Object.keys(this.dataMap[table][0]) : [];
    }

    getValues(row: any): any[] {
        return Object.values(row);
    }

    vieworders(orders: any): void {
        console.log('View orders:', orders);
        alert(`Viewing orders: ${JSON.stringify(orders, null, 2)}`);
    }

    updateorders(orders: any): void {
        this.router.navigate(['/update', 'orders', orders._id]);
    }

    deleteorders(ordersId: string): void {
        console.log('Delete orders ID:', ordersId);
        this.service.deleteItem('orders', ordersId).subscribe(
            response => {
                console.log('orders deleted successfully', response);
                this.dataMap['orders'] = this.dataMap['orders'].filter((orders: any) => orders._id !== ordersId);
                alert('orders Deleted!');
            },
            error => {
                console.error('Error deleting orders:', error);
                alert('Failed to delete orders!');
            }
        );
    }
}
