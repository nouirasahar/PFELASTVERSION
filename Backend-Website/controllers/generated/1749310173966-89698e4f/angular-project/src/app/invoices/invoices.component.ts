import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-invoices',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './invoices.component.html',
    styleUrls: ['./invoices.component.scss']
})
export class invoicesComponent implements OnInit {
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

    viewinvoices(invoices: any): void {
        console.log('View invoices:', invoices);
        alert(`Viewing invoices: ${JSON.stringify(invoices, null, 2)}`);
    }

    updateinvoices(invoices: any): void {
        this.router.navigate(['/update', 'invoices', invoices._id]);
    }

    deleteinvoices(invoicesId: string): void {
        console.log('Delete invoices ID:', invoicesId);
        this.service.deleteItem('invoices', invoicesId).subscribe(
            response => {
                console.log('invoices deleted successfully', response);
                this.dataMap['invoices'] = this.dataMap['invoices'].filter((invoices: any) => invoices._id !== invoicesId);
                alert('invoices Deleted!');
            },
            error => {
                console.error('Error deleting invoices:', error);
                alert('Failed to delete invoices!');
            }
        );
    }
}
