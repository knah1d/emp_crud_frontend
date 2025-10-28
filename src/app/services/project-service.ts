import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getProjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects`)
      .pipe(
        map((response: any) => {
          console.log("Request completed successfully");
          return response;
        }),
        catchError(error => {
          console.error('Error fetching projects:', error);
          return throwError(() => new Error('Failed to fetch projects. Please try again.'));
        })
      );
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching project:', error);
          return throwError(() => new Error('Failed to fetch project. Please try again.'));
        })
      );
  }

  createProject(project: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects`, project).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) return throwError(() => new Error('Project already exists'));
        return throwError(() => new Error('Something went wrong. Please try again.'));
      })
    );
  }

  updateProject(id: number, project: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/projects/${id}`, project, { responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error('Error updating project:', error);
          return throwError(() => new Error('Failed to update project. Please try again.'));
        })
      );
  }

  searchProjectByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/projects/${name}`)
      .pipe(
        catchError(error => {
          console.error('Error searching project:', error);
          return throwError(() => new Error('Failed to search project. Please try again.'));
        })
      );
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/projects/${id}`, { responseType: 'text' })
  }
}
