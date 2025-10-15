import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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


  createEmployee(employee: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/employees`, employee, { responseType: 'text' })
  }


  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/employees/${id}`, { responseType: 'text' })
  }
}
