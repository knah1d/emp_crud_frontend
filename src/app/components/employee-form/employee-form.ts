import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../model/employee';
import { EmployeeService } from '../../services/employee-service';
import { RouterLink } from '@angular/router';
import { Education } from '../../model/education';


@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css'
})
export class EmployeeForm implements OnChanges {
  @Input() employee: Employee | null = null;
  @Input() isEditMode: boolean = false;
  @Output() saveEmployee = new EventEmitter<Employee>();
  @Output() cancelEdit = new EventEmitter<void>();

  employeeForm: FormGroup;
  employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.loadEmployeeData(this.employee);
    }
  }

  loadEmployeeData(employee: Employee): void {
    this.employeeForm.patchValue({
      empId: employee.empId || 0,
      name: employee.name || '',
      email: employee.email || '',
      jobTitle: employee.jobTitle || '',
      department: employee.department || ''
    });

    this.educations.clear();
    if (employee.educations && employee.educations.length > 0) {
      employee.educations.forEach((edu: Education) => {
        this.educations.push(this.createEducationFormGroup(edu));
      });
    }
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
      empId: 0,
      name: '',
      email: '',
      jobTitle: '',
      department: ''
    });
    this.educations.clear();
  }

  onCancel() {
    this.cancelEdit.emit();
  }

  onSaveEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      alert('Please fill in all required fields correctly');
      return;
    }

    const formValue = this.employeeForm.value;
    
    if (this.isEditMode) {
      // Emit the updated employee for parent to handle
      this.saveEmployee.emit(formValue);
    } else {
      // Handle create mode directly
      const newEmployee: Employee = {
        name: formValue.name,
        email: formValue.email,
        jobTitle: formValue.jobTitle,
        department: formValue.department,
        educations: formValue.educations
      };

      this.employeeService.createEmployee(newEmployee).subscribe({
        next: (response) => {
          const msg = response?.message || 'Employee created successfully';
          alert(msg);
          this.resetForm();
        },
        error: (err: Error) => {
          alert('Error creating employee: ' + err.message);
        }
      });
    }
  }
}