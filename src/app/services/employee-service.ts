import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class EmployeeService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees`)
      .pipe(
        map((response: any) => {
          console.log("Request completed successfully");
          return response;
        }),
        catchError(error => {
          console.error('Error fetching employees:', error);
          return throwError(() => new Error('Failed to fetch employees. Please try again.'));
        })
      );
  }

  getEmployeeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching employee:', error);
          return throwError(() => new Error('Failed to fetch employee. Please try again.'));
        })
      );
  }

  createEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees`, employee).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) return throwError(() => new Error('Email already exists'));
        return throwError(() => new Error('Something went wrong. Please try again.'));
      })
    );
  }

  updateEmployee(id: number, employee: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/employees/${id}`, employee, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error updating employee:', error);
          return throwError(() => new Error('Failed to update employee. Please try again.'));
        })
      );
  }

  searchEmployeeByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/employees/${name}`)
      .pipe(
        catchError(error => {
          console.error('Error searching employee:', error);
          return throwError(() => new Error('Failed to search employee. Please try again.'));
        })
      );
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/${id}`, { responseType: 'text' })
  }
}
