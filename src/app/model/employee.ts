import {Education} from "./education";


export class Employee {
  empId?: number;
  name?: string;;
  email?: string;
  jobTitle?: string;
  educations?: Education[];
  department?: string;

  constructor() {
    this.empId = 0;
    this.name = '';
    this.email = '';
    this.jobTitle = '';
    this.educations = [];
    this.department = '';
  }
}

