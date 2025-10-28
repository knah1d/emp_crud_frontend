import { Routes } from '@angular/router';
import { EmployeeForm } from './components/employee-form/employee-form';
import { EmployeeList } from './components/employee-list/employee-list';
import { NotFound } from './components/not-found/not-found';
import { EmployeeUpdate } from './components/employee-update/employee-update';
import { ProjectForm } from './components/project-form/project-form';
import { AssignProjectsToEmployees } from './components/assign-projects-to-employees/assign-projects-to-employees';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    { path: 'employees', component: EmployeeForm },
    { path: 'list', component: EmployeeList },
    { path: 'edit/:id', component: EmployeeUpdate },
    { path: 'projects', component: ProjectForm },
    { path: 'assign-projects', component: AssignProjectsToEmployees },
    { path: '**', component: NotFound }
];
