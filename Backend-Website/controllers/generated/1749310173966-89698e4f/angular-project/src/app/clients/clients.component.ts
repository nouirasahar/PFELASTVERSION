import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './clients.component.html',
    styleUrls: ['./clients.component.scss']
})
export class clientsComponent implements OnInit {
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

    viewclients(clients: any): void {
        console.log('View clients:', clients);
        alert(`Viewing clients: ${JSON.stringify(clients, null, 2)}`);
    }

    updateclients(clients: any): void {
        this.router.navigate(['/update', 'clients', clients._id]);
    }

    deleteclients(clientsId: string): void {
        console.log('Delete clients ID:', clientsId);
        this.service.deleteItem('clients', clientsId).subscribe(
            response => {
                console.log('clients deleted successfully', response);
                this.dataMap['clients'] = this.dataMap['clients'].filter((clients: any) => clients._id !== clientsId);
                alert('clients Deleted!');
            },
            error => {
                console.error('Error deleting clients:', error);
                alert('Failed to delete clients!');
            }
        );
    }
}
