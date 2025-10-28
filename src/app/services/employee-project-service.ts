import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProjectService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getAllEmployeeProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee-projects`)
      .pipe(
        map((response: any) => {
          console.log("Employee-Projects fetched successfully");
          return response;
        }),
        catchError(error => {
          console.error('Error fetching employee-projects:', error);
          return throwError(() => new Error('Failed to fetch employee-projects. Please try again.'));
        })
      );
  }

  getEmployeeProjectById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee-projects/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching employee-project:', error);
          return throwError(() => new Error('Failed to fetch employee-project. Please try again.'));
        })
      );
  }

  getEmployeeProjectsByEmployeeId(empId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee-projects/employee/${empId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching projects for employee:', error);
          return throwError(() => new Error('Failed to fetch projects for employee. Please try again.'));
        })
      );
  }

  getEmployeeProjectsByProjectId(projectId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee-projects/project/${projectId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching employees for project:', error);
          return throwError(() => new Error('Failed to fetch employees for project. Please try again.'));
        })
      );
  }

  assignEmployeeToProject(assignment: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employee-projects`, assignment).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) return throwError(() => new Error('Employee is already assigned to this project'));
        return throwError(() => new Error('Something went wrong. Please try again.'));
      })
    );
  }

  updateEmployeeProject(id: number, assignment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/employee-projects/${id}`, assignment, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error updating assignment:', error);
          return throwError(() => new Error('Failed to update assignment. Please try again.'));
        })
      );
  }

  deleteEmployeeProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employee-projects/${id}`, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error deleting assignment:', error);
          return throwError(() => new Error('Failed to delete assignment. Please try again.'));
        })
      );
  }
}
