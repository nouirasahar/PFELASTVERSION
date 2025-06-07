import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class transactionsComponent implements OnInit {
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

    viewtransactions(transactions: any): void {
        console.log('View transactions:', transactions);
        alert(`Viewing transactions: ${JSON.stringify(transactions, null, 2)}`);
    }

    updatetransactions(transactions: any): void {
        this.router.navigate(['/update', 'transactions', transactions._id]);
    }

    deletetransactions(transactionsId: string): void {
        console.log('Delete transactions ID:', transactionsId);
        this.service.deleteItem('transactions', transactionsId).subscribe(
            response => {
                console.log('transactions deleted successfully', response);
                this.dataMap['transactions'] = this.dataMap['transactions'].filter((transactions: any) => transactions._id !== transactionsId);
                alert('transactions Deleted!');
            },
            error => {
                console.error('Error deleting transactions:', error);
                alert('Failed to delete transactions!');
            }
        );
    }
}
