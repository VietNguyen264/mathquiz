
import { OperationType, Question } from '../types';

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export const generateQuestion = (type: OperationType): Question => {
  let a = 0, b = 0, answer = 0, op = '';

  switch (type) {
    case OperationType.ADDITION:
      a = getRandomInt(1, 12);
      b = getRandomInt(1, 10);
      answer = a + b;
      op = '+';
      break;
    case OperationType.SUBTRACTION:
      a = getRandomInt(5, 20);
      b = getRandomInt(1, a); // Ensure no negative results
      answer = a - b;
      op = '-';
      break;
    case OperationType.MULTIPLICATION:
      // Very simple 1st grade grouping/skip-counting
      a = getRandomInt(1, 5);
      b = getRandomInt(1, 5);
      answer = a * b;
      op = '×';
      break;
    case OperationType.DIVISION:
      // Very simple sharing
      b = getRandomInt(1, 5);
      answer = getRandomInt(1, 4);
      a = b * answer; // Ensure integer result
      op = '÷';
      break;
  }

  // Generate wrong options
  const optionsSet = new Set<number>([answer]);
  while (optionsSet.size < 3) {
    const offset = getRandomInt(-4, 4);
    const wrongOpt = answer + offset;
    if (wrongOpt >= 0 && wrongOpt !== answer) {
      optionsSet.add(wrongOpt);
    }
  }

  return {
    id: Math.random().toString(36).substr(2, 9),
    a,
    b,
    op,
    type,
    answer,
    options: shuffleArray(Array.from(optionsSet)),
  };
};
