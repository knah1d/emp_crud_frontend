import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignProjectsToEmployees } from './assign-projects-to-employees';

describe('AssignProjectsToEmployees', () => {
  let component: AssignProjectsToEmployees;
  let fixture: ComponentFixture<AssignProjectsToEmployees>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignProjectsToEmployees]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignProjectsToEmployees);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
