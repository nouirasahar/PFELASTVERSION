import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-employees',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './employees.component.html',
    styleUrls: ['./employees.component.scss']
})
export class employeesComponent implements OnInit {
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

    viewemployees(employees: any): void {
        console.log('View employees:', employees);
        alert(`Viewing employees: ${JSON.stringify(employees, null, 2)}`);
    }

    updateemployees(employees: any): void {
        this.router.navigate(['/update', 'employees', employees._id]);
    }

    deleteemployees(employeesId: string): void {
        console.log('Delete employees ID:', employeesId);
        this.service.deleteItem('employees', employeesId).subscribe(
            response => {
                console.log('employees deleted successfully', response);
                this.dataMap['employees'] = this.dataMap['employees'].filter((employees: any) => employees._id !== employeesId);
                alert('employees Deleted!');
            },
            error => {
                console.error('Error deleting employees:', error);
                alert('Failed to delete employees!');
            }
        );
    }
}
