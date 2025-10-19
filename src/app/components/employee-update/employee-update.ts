import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { Education } from '../../model/education';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-employee-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-update.html',
  styleUrl: './employee-update.css'
})
export class EmployeeUpdate implements OnInit {
  employeeForm: FormGroup;
  employeeService = inject(EmployeeService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  employeeId: number | null = null;

  constructor() {
    this.employeeForm = this.fb.group({
      empId: [0],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      jobTitle: ['', [Validators.required]],
      department: ['', [Validators.required]],
      educations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = +params['id'];
      if (this.employeeId) {
        this.loadEmployeeData(this.employeeId);
      }
    });
  }

  get educations(): FormArray {
    return this.employeeForm.get('educations') as FormArray;
  }

  createEducationFormGroup(education?: Education): FormGroup {
    return this.fb.group({
      eduId: [education?.eduId || 0],
      degree: [education?.degree || '', [Validators.required]],
      board: [education?.board || '', [Validators.required]],
      result: [education?.result || '', [Validators.required]],
      passingYear: [education?.passingYear || new Date().getFullYear(), [Validators.required, Validators.min(1950), Validators.max(2030)]]
    });
  }

  loadEmployeeData(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employeeForm.patchValue({
          empId: data.empId,
          name: data.name,
          email: data.email,
          jobTitle: data.jobTitle,
          department: data.department
        });

        this.educations.clear();
        if (data.educations && data.educations.length > 0) {
          data.educations.forEach((edu: Education) => {
            this.educations.push(this.createEducationFormGroup(edu));
          });
        }
        console.log("Employee data loaded:", data);
      },
      error: (error) => {
        alert("Error loading employee: " + error.message);
        this.router.navigate(['/list']);
      }
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

  onUpdateEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      alert('Please fill in all required fields correctly');
      return;
    }

    const id = this.employeeForm.value.empId;
    if (id === undefined || id === null) {
      alert("Invalid employee ID");
      return;
    }

    const updatedEmployee: Employee = this.employeeForm.value;

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

}
