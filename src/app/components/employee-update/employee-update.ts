import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeForm } from '../employee-form/employee-form';


@Component({
  selector: 'app-employee-update',
  standalone: true,
  imports: [CommonModule, EmployeeForm],
  templateUrl: './employee-update.html',
  styleUrl: './employee-update.css'
})
export class EmployeeUpdate implements OnInit {
  employeeService = inject(EmployeeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  employeeId: number | null = null;
  employee: Employee | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['id'];
      if (this.employeeId) {
        this.loadEmployeeData(this.employeeId);
      }
    });
  }

  loadEmployeeData(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        console.log("Employee data loaded:", data);
      },
      error: (error) => {
        alert("Error loading employee: " + error.message);
        this.router.navigate(['/list']);
      }
    });
  }

  onUpdateEmployee(updatedEmployee: Employee): void {
    const id = updatedEmployee.empId;
    if (id === undefined || id === null) {
      alert("Invalid employee ID");
      return;
    }

    this.employeeService.updateEmployee(id, updatedEmployee).subscribe({
      next: (response) => {
        console.log("Employee updated successfully:", response);
        alert("Employee updated successfully!");
        this.router.navigate(['/list']);
      },
      error: (error) => {
        alert("Error: " + error.message);
      }
    });
  }

  onCancelEdit(): void {
    this.router.navigate(['/list']);
  }
}
