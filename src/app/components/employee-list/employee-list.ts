import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css'
})
export class EmployeeList implements OnInit {
  employees: Employee[] = [];
  private employeeService = inject(EmployeeService);

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        console.log("Employees fetched:", this.employees);
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
        },
        error: (error) => {
          alert("Error: " + error.message);
        }
      });
    }
  }
}
