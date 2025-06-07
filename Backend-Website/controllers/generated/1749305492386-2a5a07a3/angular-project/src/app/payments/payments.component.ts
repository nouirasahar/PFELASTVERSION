import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-payments',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.scss']
})
export class paymentsComponent implements OnInit {
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

    viewpayments(payments: any): void {
        console.log('View payments:', payments);
        alert(`Viewing payments: ${JSON.stringify(payments, null, 2)}`);
    }

    updatepayments(payments: any): void {
        this.router.navigate(['/update', 'payments', payments._id]);
    }

    deletepayments(paymentsId: string): void {
        console.log('Delete payments ID:', paymentsId);
        this.service.deleteItem('payments', paymentsId).subscribe(
            response => {
                console.log('payments deleted successfully', response);
                this.dataMap['payments'] = this.dataMap['payments'].filter((payments: any) => payments._id !== paymentsId);
                alert('payments Deleted!');
            },
            error => {
                console.error('Error deleting payments:', error);
                alert('Failed to delete payments!');
            }
        );
    }
}
