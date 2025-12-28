
export enum OperationType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
  MULTIPLICATION = 'MULTIPLICATION',
  DIVISION = 'DIVISION'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Question {
  id: string;
  a: number;
  b: number;
  op: string;
  type: OperationType;
  answer: number;
  options: number[];
}

export interface GameStats {
  score: number;
  totalQuestions: number;
  streak: number;
  bestStreak: number;
}
