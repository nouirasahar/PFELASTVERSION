import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tickets',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tickets.component.html',
    styleUrls: ['./tickets.component.scss']
})
export class ticketsComponent implements OnInit {
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

    viewtickets(tickets: any): void {
        console.log('View tickets:', tickets);
        alert(`Viewing tickets: ${JSON.stringify(tickets, null, 2)}`);
    }

    updatetickets(tickets: any): void {
        this.router.navigate(['/update', 'tickets', tickets._id]);
    }

    deletetickets(ticketsId: string): void {
        console.log('Delete tickets ID:', ticketsId);
        this.service.deleteItem('tickets', ticketsId).subscribe(
            response => {
                console.log('tickets deleted successfully', response);
                this.dataMap['tickets'] = this.dataMap['tickets'].filter((tickets: any) => tickets._id !== ticketsId);
                alert('tickets Deleted!');
            },
            error => {
                console.error('Error deleting tickets:', error);
                alert('Failed to delete tickets!');
            }
        );
    }
}
