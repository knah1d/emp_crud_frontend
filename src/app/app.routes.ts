import { Routes } from '@angular/router';
import { EmployeeForm } from './components/employee-form/employee-form';
import { EmployeeList } from './components/employee-list/employee-list';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    { path: 'form', component: EmployeeForm },
    { path: 'list', component: EmployeeList },
    { path: '**', component: NotFound }
];
