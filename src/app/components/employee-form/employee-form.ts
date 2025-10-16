import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm {
  employeeForm: FormGroup;
  employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

  constructor() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: ['', [Validators.required]],
      department: ['', [Validators.required]],
      educations: this.fb.array([])
    });
  }

  get educations(): FormArray {
    return this.employeeForm.get('educations') as FormArray;
  }

  createEducationFormGroup(): FormGroup {
    return this.fb.group({
      degree: ['', [Validators.required]],
      board: ['', [Validators.required]],
      result: ['', [Validators.required]],
      passingYear: [new Date().getFullYear(), [Validators.required, Validators.min(1950), Validators.max(2030)]]
    });
  }

  addEducation() {
    this.educations.push(this.createEducationFormGroup());
  }

  removeEducation(index: number) {
    if (index >= 0 && index < this.educations.length) {
      this.educations.removeAt(index);
    }
  }

  resetForm() {
    this.employeeForm.reset({
      name: '',
      email: '',
      jobTitle: '',
      department: ''
    });
    this.educations.clear();
  }

  onSaveEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      alert('Please fill in all required fields correctly');
      return;
    }

    const formValue = this.employeeForm.value;
    const newEmployee: Employee = {
      name: formValue.name,
      email: formValue.email,
      jobTitle: formValue.jobTitle,
      department: formValue.department,
      educations: formValue.educations
    };

    this.employeeService.createEmployee(newEmployee).subscribe({
      next: (employee) => {
        alert('Employee created successfully');
        console.log(employee);
        this.resetForm();
      }, 
      error: (error) => {
        alert('Error creating employee: ' + error);
      }
    });
  }
}
