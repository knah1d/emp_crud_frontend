import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../model/project';
import { ProjectService } from '../../services/project-service';
import { RouterLink } from '@angular/router';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
  templateUrl: './project-form.html',
  styleUrl: './project-form.css'
})
export class ProjectForm implements OnChanges, OnInit, AfterViewInit {
  @Input() project: Project | null = null;
  @Input() isEditMode: boolean = false;
  @Output() saveProject = new EventEmitter<Project>();
  @Output() cancelEdit = new EventEmitter<void>();

  projectForm: FormGroup;
  projectService = inject(ProjectService);
  private fb = inject(FormBuilder);

  // Table properties
  projects: Project[] = [];
  dataSource = new MatTableDataSource<Project>([]);
  displayedColumns: string[] = ['id', 'name', 'description', 'startDate', 'endDate', 'actions'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    this.projectForm = this.fb.group({
      projectId: [0],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['project'] && this.project) {
      this.loadProjectData(this.project);
    }
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.dataSource.data = this.projects;
        console.log("Projects fetched:", this.projects);
      },
      error: (error) => {
        alert("Error: " + error.message);
      }
    });
  }

  loadProjectData(project: Project): void {
    this.projectForm.patchValue({
      projectId: project.projectId || 0,
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || ''
    });
  }

  resetForm() {
    this.projectForm.reset({
      projectId: 0,
      name: '',
      description: '',
      startDate: '',
      endDate: ''
    });
  }

  onCancel() {
    this.cancelEdit.emit();
  }

  onSaveProject() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      alert('Please fill in all required fields correctly');
      return;
    }

    const formValue = this.projectForm.value;
    
    if (this.isEditMode) {
      // Emit the updated project for parent to handle
      this.saveProject.emit(formValue);
    } else {
      // Handle create mode directly
      const newProject: Project = {
        name: formValue.name,
        description: formValue.description,
        startDate: formValue.startDate,
        endDate: formValue.endDate
      };

      this.projectService.createProject(newProject).subscribe({
        next: (response) => {
          const msg = response?.message || 'Project created successfully';
          alert(msg);
          this.resetForm();
          this.loadProjects(); // Reload the list after creation
        },
        error: (err: Error) => {
          alert('Error creating project: ' + err.message);
        }
      });
    }
  }

  onEditProject(project: Project): void {
    this.loadProjectData(project);
    this.isEditMode = true;
    // Scroll to top to show form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onUpdateProject(id: number | undefined, project: Project): void {
    if (id === undefined) {
      alert("Invalid project ID");
      return;
    }
    this.projectService.updateProject(id, project).subscribe({
      next: (response) => {
        alert("Project updated successfully");
        this.resetForm();
        this.isEditMode = false;
        this.loadProjects();
      },
      error: (error) => {
        alert("Error: " + error.message);
      }
    });
  }

  onDeleteProject(id: number | undefined): void {
    if (id === undefined) {
      alert("Invalid project ID");
      return;
    }
    if (confirm("Are you sure you want to delete this project?")) {
      this.projectService.deleteProject(id).subscribe({
        next: (response) => {
          alert("Project deleted successfully");
          this.loadProjects();
        },
        error: (error) => {
          alert("Error: " + error.message);
        }
      });
    }
  }

  formatDate(date: string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
