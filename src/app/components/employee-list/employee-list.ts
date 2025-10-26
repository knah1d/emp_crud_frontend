import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

// Angular Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatPaginatorModule} from '@angular/material/paginator';

@Component({
  selector: 'app-employee-list',
  imports: [
    FormsModule, 
    CommonModule, 
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatChipsModule,
    MatTooltipModule,
    MatPaginatorModule
  ],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchTerm: string = '';
  displayedColumns: string[] = ['id', 'name', 'email', 'jobTitle', 'department', 'education', 'actions'];
  private employeeService = inject(EmployeeService);
  private router = inject(Router);

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
        console.log("Employees fetched:", this.employees);
      },
      error: (error) => {
        alert("Error: " + error.message);
      }
    });
  }

  onSearchEmployee(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = this.employees;
      return;
    }
    
    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredEmployees = this.employees.filter(emp => 
      emp.name?.toLowerCase().includes(searchLower) ||
      emp.email?.toLowerCase().includes(searchLower) ||
      emp.jobTitle?.toLowerCase().includes(searchLower) ||
      emp.department?.toLowerCase().includes(searchLower)
    );
  }

  navigateToEdit(id: number | undefined): void {
    if (id === undefined) {
      alert("Invalid employee. Cannot edit employee.");
      return;
    }
    this.router.navigate(['/edit', id]);
  }
  
  onUpdateEmployee(id: number | undefined, employee: Employee): void {
    if (id === undefined) {
      alert("Invalid employee ID");
      return;
    }
    this.employeeService.updateEmployee(id, employee).subscribe({
      next: (response) => {
        console.log(response);
        const index = this.employees.findIndex(emp => emp.empId === id);
        if (index !== -1) {
          this.employees[index] = employee;
        }
      },
      error: (error) => {
        alert("Error: " + error.message);
      }
    });
  }
  

  onDeleteEmployee(id: number | undefined): void {
    if (id === undefined) {
      alert("Invalid employee ID");
      return;
    }
    if (confirm("Are you sure you want to delete this employee?")) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (response) => {
          console.log(response);
          this.employees = this.employees.filter(emp => emp.empId !== id);
          this.filteredEmployees = this.filteredEmployees.filter(emp => emp.empId !== id);
        },
        error: (error) => {
          alert("Error: " + error.message);
        }
      });
    }
  }
}
