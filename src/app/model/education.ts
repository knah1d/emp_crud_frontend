export class Education {
  eduId?: number;
  degree: string;
  board: string;
  result: string;
  passingYear: number;

  constructor() {
    this.eduId = 0;
    this.degree = '';
    this.board = '';
    this.result = '';
    this.passingYear = new Date().getFullYear();
  }
}