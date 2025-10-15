import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { Education } from '../../model/education';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm {
  employeeObject: Employee = new Employee();
  employeeService = inject(EmployeeService);
  

  addEducation() {
    // ensure array exists, then push
    if (!this.employeeObject.educations) {
      this.employeeObject.educations = [];
    }
    this.employeeObject.educations.push(new Education());
  }

  removeEducation(index: number) {
    const ed = this.employeeObject.educations;
    if (!ed || index < 0 || index >= ed.length) return;
    ed.splice(index, 1);
  }

  onSaveEmployee() {
    const newEmployee: Employee = { ...this.employeeObject };
    delete newEmployee.empId;
    this.employeeService.createEmployee(newEmployee).subscribe({
      next: (employee) => {
        alert('Employee created successfully: ');
        console.log(employee);
        this.employeeObject = new Employee(); // Reset the form
      }, error: (error) => {
        alert('Error creating employee: ' + error);
      }
    });
  }

}
