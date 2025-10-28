import { Component, OnInit, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Services
import { EmployeeService } from '../../services/employee-service';
import { ProjectService } from '../../services/project-service';
import { EmployeeProjectService } from '../../services/employee-project-service';

// Models
import { Employee } from '../../model/employee';
import { Project } from '../../model/project';
import { EmployeeProject } from '../../model/employee-project';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-assign-projects-to-employees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './assign-projects-to-employees.html',
  styleUrl: './assign-projects-to-employees.css'
})
export class AssignProjectsToEmployees implements OnInit, AfterViewInit {
  assignmentForm: FormGroup;
  
  private employeeService = inject(EmployeeService);
  private projectService = inject(ProjectService);
  private employeeProjectService = inject(EmployeeProjectService);
  private fb = inject(FormBuilder);

  // Dropdown data
  employees: Employee[] = [];
  projects: Project[] = [];

  // Table data
  assignments: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['id', 'employee', 'project', 'role', 'hoursAllocated', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Edit mode
  isEditMode: boolean = false;
  editingAssignmentId: number | null = null;

  constructor() {
    this.assignmentForm = this.fb.group({
      employeeId: ['', [Validators.required]],
      projectId: ['', [Validators.required]],
      role: ['', [Validators.required]],
      hoursAllocated: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadProjects();
    this.loadAssignments();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  loadAssignments(): void {
    this.employeeProjectService.getAllEmployeeProjects().subscribe({
      next: (data) => {
        this.assignments = data;
        this.dataSource.data = this.assignments;
        console.log("Assignments fetched:", this.assignments);
      },
      error: (error) => {
        alert("Error: " + error.message);
      }
    });
  }

  onAssignProject(): void {
    if (this.assignmentForm.invalid) {
      this.assignmentForm.markAllAsTouched();
      alert('Please fill in all required fields correctly');
      return;
    }

    const formValue = this.assignmentForm.value;

    if (this.isEditMode && this.editingAssignmentId) {
      // Update existing assignment
      const updateData = {
        employee: { empId: formValue.employeeId },
        project: { projectId: formValue.projectId },
        role: formValue.role,
        hoursAllocated: formValue.hoursAllocated
      };

      this.employeeProjectService.updateEmployeeProject(this.editingAssignmentId, updateData).subscribe({
        next: () => {
          alert('Assignment updated successfully');
          this.resetForm();
          this.loadAssignments();
        },
        error: (err: Error) => {
          alert('Error updating assignment: ' + err.message);
        }
      });
    } else {
      // Create new assignment
      const assignment = {
        employee: { empId: formValue.employeeId },
        project: { projectId: formValue.projectId },
        role: formValue.role,
        hoursAllocated: formValue.hoursAllocated
      };

      this.employeeProjectService.assignEmployeeToProject(assignment).subscribe({
        next: (response) => {
          const msg = response?.message || 'Employee assigned to project successfully';
          alert(msg);
          this.resetForm();
          this.loadAssignments();
        },
        error: (err: Error) => {
          alert('Error assigning employee: ' + err.message);
        }
      });
    }
  }

  onEditAssignment(assignment: any): void {
    this.isEditMode = true;
    this.editingAssignmentId = assignment.employeeProjectId;
    
    this.assignmentForm.patchValue({
      employeeId: assignment.employee?.empId || '',
      projectId: assignment.project?.projectId || '',
      role: assignment.role || '',
      hoursAllocated: assignment.hoursAllocated || ''
    });

    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDeleteAssignment(id: number): void {
    if (confirm("Are you sure you want to remove this assignment?")) {
      this.employeeProjectService.deleteEmployeeProject(id).subscribe({
        next: () => {
          alert("Assignment removed successfully");
          this.loadAssignments();
        },
        error: (error) => {
          alert("Error: " + error.message);
        }
      });
    }
  }

  resetForm(): void {
    this.assignmentForm.reset({
      employeeId: '',
      projectId: '',
      role: '',
      hoursAllocated: ''
    });
    this.isEditMode = false;
    this.editingAssignmentId = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  getEmployeeName(empId: number): string {
    const employee = this.employees.find(e => e.empId === empId);
    return employee?.name || 'Unknown';
  }

  getProjectName(projectId: number): string {
    const project = this.projects.find(p => p.projectId === projectId);
    return project?.name || 'Unknown';
  }
}

