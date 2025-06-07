import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-deliveries',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './deliveries.component.html',
    styleUrls: ['./deliveries.component.scss']
})
export class deliveriesComponent implements OnInit {
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

    viewdeliveries(deliveries: any): void {
        console.log('View deliveries:', deliveries);
        alert(`Viewing deliveries: ${JSON.stringify(deliveries, null, 2)}`);
    }

    updatedeliveries(deliveries: any): void {
        this.router.navigate(['/update', 'deliveries', deliveries._id]);
    }

    deletedeliveries(deliveriesId: string): void {
        console.log('Delete deliveries ID:', deliveriesId);
        this.service.deleteItem('deliveries', deliveriesId).subscribe(
            response => {
                console.log('deliveries deleted successfully', response);
                this.dataMap['deliveries'] = this.dataMap['deliveries'].filter((deliveries: any) => deliveries._id !== deliveriesId);
                alert('deliveries Deleted!');
            },
            error => {
                console.error('Error deleting deliveries:', error);
                alert('Failed to delete deliveries!');
            }
        );
    }
}
